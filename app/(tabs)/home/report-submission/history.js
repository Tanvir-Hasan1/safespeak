import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SafeSpeakScreen from "../../../../components/SafeSpeakScreen";
import { useLanguage } from "../../../../context/LanguageContext";
import api from "../../../../context/api";
import CustomAlert from "../../../../components/ui/CustomAlert";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

// ─── API helpers (mirrors reports-client.ts) ──────────────────────────────────

/** GET /api/v1/reports */
async function listReports() {
  const res = await api.get("/reports");
  return res.data?.data?.reports ?? res.data?.reports ?? [];
}

/** GET /api/v1/reports/:reportId/status */
async function getReportStatus(reportId) {
  const res = await api.get(`/reports/${reportId}/status`);
  return res.data?.data?.status ?? res.data?.status ?? null;
}

/** POST /api/v1/reports/:reportId/withdraw */
async function withdrawReport(reportId) {
  const res = await api.post(`/reports/${reportId}/withdraw`);
  return res.data?.data?.report ?? res.data?.report ?? null;
}

/** POST /api/v1/reports/:reportId/mark-info-only */
async function markReportInfoOnly(reportId) {
  const res = await api.post(`/reports/${reportId}/mark-info-only`);
  return res.data?.data?.report ?? res.data?.report ?? null;
}

/** POST /api/v1/reports/:reportId/request-delete */
async function requestReportDelete(reportId) {
  const res = await api.post(`/reports/${reportId}/request-delete`);
  return res.data?.data?.report ?? res.data?.report ?? null;
}

/** DELETE /api/v1/reports/:reportId */
async function deleteReport(reportId) {
  await api.delete(`/reports/${reportId}`);
  return null;
}

// ─── Status helpers (mirrors web normalizeHistoryStatus) ─────────────────────

function normalizeStatus(raw) {
  if (!raw) return "DRAFT";
  if (raw === "submitted" || raw === "received") return "SUBMITTED";
  if (
    raw === "in_review" ||
    raw === "in-review" ||
    raw === "pending_submission" ||
    raw === "ready_for_review" ||
    raw === "triaged"
  )
    return "ACTION REQUIRED";
  if (
    raw === "closed" ||
    raw === "deleted" ||
    raw === "withdrawn" ||
    raw === "info_only"
  )
    return "CLOSED";
  return "DRAFT";
}

function getStatusMeta(normalizedStatus) {
  switch (normalizedStatus) {
    case "ACTION REQUIRED":
      return {
        label: "PENDING SUBMISSION",
        badgeBg: "#FFF1DE",
        badgeText: "#9A6A2E",
        iconName: "shield",
        iconBg: "#ECE7FF",
        iconColor: "#5D61F6",
        team: "SafeSpeak review queue",
      };
    case "SUBMITTED":
      return {
        label: "SUBMITTED",
        badgeBg: "#EBF0FF",
        badgeText: "#526CC6",
        iconName: "heart",
        iconBg: "#FFE9EA",
        iconColor: "#F26161",
        team: "Saved in SafeSpeak",
      };
    case "CLOSED":
      return {
        label: "CLOSED",
        badgeBg: "#FFF1F2",
        badgeText: "#BE123C",
        iconName: "document-text",
        iconBg: "#EEF1F5",
        iconColor: "#64748B",
        team: "Lifecycle action recorded",
      };
    default:
      return {
        label: "DRAFT",
        badgeBg: "#EEF1F5",
        badgeText: "#5F6F83",
        iconName: "lock-closed",
        iconBg: "#D4F4ED",
        iconColor: "#0A9D8D",
        team: "Draft saved safely",
      };
  }
}

function formatDate(value) {
  if (!value) return "DATE UNAVAILABLE";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value).toUpperCase();
  return d
    .toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })
    .toUpperCase();
}

/** Determine which lifecycle action pills to show based on raw status */
function getLifecycleActions(rawStatus) {
  const actions = [];
  const s = rawStatus ?? "";

  // Withdraw: available if not already withdrawn/closed/deleted
  if (!["withdrawn", "closed", "deleted", "info_only"].includes(s)) {
    actions.push({
      key: "withdraw",
      label: "Withdraw",
      iconName: "document-text-outline",
      destructive: false,
    });
  }

  // Mark info-only: available if not already info_only/withdrawn/deleted
  if (!["info_only", "withdrawn", "deleted", "closed"].includes(s)) {
    actions.push({
      key: "mark-info-only",
      label: "Mark info-only",
      iconName: "bookmark-outline",
      destructive: false,
    });
  }

  // Request deletion
  if (!["deletion_requested", "deleted"].includes(s)) {
    actions.push({
      key: "request-delete",
      label: "Request deletion",
      iconName: "trash-outline",
      destructive: true,
    });
  }

  // Hard delete (always available as last resort)
  actions.push({
    key: "delete",
    label: "Delete",
    iconName: "trash-outline",
    destructive: true,
  });

  return actions;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function IncidentHistory() {
  const router = useRouter();
  const { t } = useLanguage();

  // ── API state ────────────────────────────────────────────────────────────
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [activeActionKey, setActiveActionKey] = useState(null); // "reportId:action"
  const [statusMessage, setStatusMessage] = useState(null);

  // ── Search & filter state ────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // ── Alert modal ──────────────────────────────────────────────────────────
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

  // ── Load all reports + status in parallel (mirrors web Promise.all) ──────
  const loadReportHistory = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      // 1. GET /api/v1/reports
      const reportRecords = await listReports();

      // 2. GET /api/v1/reports/:id/status — one per report, all in parallel
      const enriched = await Promise.all(
        reportRecords.map(async (report) => {
          try {
            const status = await getReportStatus(report._id);
            const resolvedStatus = status?.current ?? status?.status ?? report.status;
            const normalized = normalizeStatus(resolvedStatus);
            const meta = getStatusMeta(normalized);
            return {
              ...report,
              _resolvedStatus: resolvedStatus,
              _normalized: normalized,
              _meta: meta,
              deletionRequestedAt:
                status?.deletionRequestedAt ?? report.deletionRequestedAt,
              withdrawnAt: status?.withdrawnAt ?? report.withdrawnAt,
            };
          } catch {
            const normalized = normalizeStatus(report.status);
            return {
              ...report,
              _resolvedStatus: report.status,
              _normalized: normalized,
              _meta: getStatusMeta(normalized),
            };
          }
        })
      );

      setReports(enriched);
    } catch (err) {
      console.warn("[IncidentHistory] Failed to load:", err);
      setLoadError(
        err?.response?.data?.message ?? "Report history could not be loaded."
      );
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReportHistory();
  }, [loadReportHistory]);

  // ── Lifecycle action handler ─────────────────────────────────────────────
  const handleLifecycleAction = useCallback(
    (report, action) => {
      const confirmMessages = {
        withdraw: "Are you sure you want to withdraw this report?",
        "mark-info-only": "Mark this report as information only?",
        "request-delete": "Request deletion of this report?",
        delete: "Permanently delete this report? This cannot be undone.",
      };

      Alert.alert(
        action.label,
        confirmMessages[action.key] ?? "Confirm this action?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            style: action.destructive ? "destructive" : "default",
            onPress: async () => {
              const actionKey = `${report._id}:${action.key}`;
              setActiveActionKey(actionKey);
              setLoadError(null);
              setStatusMessage(null);

              try {
                let updatedReport = null;

                switch (action.key) {
                  case "withdraw":
                    updatedReport = await withdrawReport(report._id);
                    break;
                  case "mark-info-only":
                    updatedReport = await markReportInfoOnly(report._id);
                    break;
                  case "request-delete":
                    updatedReport = await requestReportDelete(report._id);
                    break;
                  case "delete":
                    await deleteReport(report._id);
                    break;
                }

                if (updatedReport) {
                  // Update in place
                  const normalized = normalizeStatus(updatedReport.status);
                  const enriched = {
                    ...updatedReport,
                    _resolvedStatus: updatedReport.status,
                    _normalized: normalized,
                    _meta: getStatusMeta(normalized),
                  };
                  setReports((prev) =>
                    prev.map((r) => (r._id === enriched._id ? enriched : r))
                  );
                  setStatusMessage(
                    `${action.label} completed for ${updatedReport.refNo ?? updatedReport._id}.`
                  );
                } else {
                  // DELETE — remove from list
                  setReports((prev) => prev.filter((r) => r._id !== report._id));
                  setStatusMessage("Report deleted from active history.");
                }
              } catch (err) {
                console.warn(`[IncidentHistory] Action ${action.key} failed:`, err);
                setAlertConfig({
                  visible: true,
                  title: "Action Failed",
                  message:
                    err?.response?.data?.message ??
                    "This action could not be completed. Please try again.",
                });
              } finally {
                setActiveActionKey(null);
              }
            },
          },
        ]
      );
    },
    []
  );

  // ── Derived metrics (same as web) ────────────────────────────────────────
  const submittedCount = reports.filter((r) => r._normalized === "SUBMITTED").length;
  const actionRequiredCount = reports.filter(
    (r) => r._normalized === "ACTION REQUIRED"
  ).length;

  // ── Filtered list ────────────────────────────────────────────────────────
  const filteredReports = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return reports.filter((r) => {
      if (activeFilter === "draft" && r._normalized !== "DRAFT") return false;
      if (activeFilter === "action_required" && r._normalized !== "ACTION REQUIRED")
        return false;
      if (activeFilter === "closed" && r._normalized !== "CLOSED") return false;
      if (!q) return true;
      const title = (r.context || r.incidentType || "").toLowerCase();
      const id = (r._id || r.refNo || "").toLowerCase();
      return title.includes(q) || id.includes(q);
    });
  }, [reports, searchQuery, activeFilter]);

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <SafeSpeakScreen
        backText={t("yourReports") ?? "Your Reports"}
        rightText={t("cancel") ?? "Cancel"}
        onRightPress={() => router.back()}
        showCancel={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16, paddingHorizontal: 16 }}
      >
        {/* ── Main card wrapper ─────────────────────────────────────────── */}
        <StyledView
          style={{
            backgroundColor: "white",
            borderRadius: 32,
            padding: 24,
            borderWidth: 1,
            borderColor: "#EBF3FC",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 16,
            elevation: 2,
          }}
        >
          {/* ── Hero header ─────────────────────────────────────────────── */}
          <StyledView style={{ alignItems: "center", marginBottom: 24 }}>
            <StyledView
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: "#D9E7FF",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <StyledView
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: "#2F87FF",
                  shadowColor: "#2F87FF",
                  shadowOffset: { width: 0, height: 0 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 3,
                }}
              />
            </StyledView>
            <StyledText
              style={{
                fontSize: 26,
                fontWeight: "800",
                color: "#1F2A3A",
                textAlign: "center",
                lineHeight: 32,
              }}
            >
              Your Incident History
            </StyledText>
            <StyledText
              style={{
                fontSize: 11,
                color: "#7B8CA2",
                textAlign: "center",
                marginTop: 4,
              }}
            >
              Live SafeSpeak report records and lifecycle actions
            </StyledText>
          </StyledView>

          {/* ── Stat cards ─────────────────────────────────────────────── */}
          <StyledView style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
            <StyledView
              style={{
                flex: 1,
                backgroundColor: "#F7FAFE",
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor: "#E3EBF5",
                alignItems: "center",
              }}
            >
              <StyledText
                style={{ fontSize: 28, fontWeight: "800", color: "#0F5D9F" }}
              >
                {reports.length}
              </StyledText>
              <StyledText
                style={{
                  fontSize: 8,
                  fontWeight: "700",
                  color: "#7F8FA4",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginTop: 2,
                }}
              >
                Total Active
              </StyledText>
            </StyledView>
            <StyledView
              style={{
                flex: 1,
                backgroundColor: "#F7FAFE",
                borderRadius: 16,
                padding: 14,
                borderWidth: 1,
                borderColor: "#E3EBF5",
                alignItems: "center",
              }}
            >
              <StyledText
                style={{ fontSize: 28, fontWeight: "800", color: "#18B06C" }}
              >
                {submittedCount}
              </StyledText>
              <StyledText
                style={{
                  fontSize: 8,
                  fontWeight: "700",
                  color: "#7F8FA4",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  marginTop: 2,
                }}
              >
                Submitted
              </StyledText>
            </StyledView>
          </StyledView>

          {/* ── Action required notice ──────────────────────────────────── */}
          {actionRequiredCount > 0 && (
            <StyledView
              style={{
                backgroundColor: "#FFFBEB",
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 8,
                marginBottom: 16,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="alert-circle" size={13} color="#D97706" style={{ marginRight: 6 }} />
              <StyledText style={{ fontSize: 10, color: "#92400E", fontWeight: "600" }}>
                {actionRequiredCount} report{actionRequiredCount === 1 ? "" : "s"} currently need review or follow-up.
              </StyledText>
            </StyledView>
          )}

          {/* ── Search box ─────────────────────────────────────────────── */}
          <StyledView
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#F8FAFC",
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 100,
              paddingHorizontal: 14,
              paddingVertical: 10,
              marginBottom: 14,
            }}
          >
            <Ionicons name="search-outline" size={16} color="#94A3B8" />
            <StyledTextInput
              style={{ flex: 1, marginLeft: 8, fontSize: 12, color: "#0F172A", padding: 0 }}
              placeholder="Search reports..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </StyledView>

          {/* ── Filter pills ─────────────────────────────────────────────── */}
          <StyledView
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 }}
          >
            {[
              { id: "all", label: "All Reports" },
              { id: "draft", label: "Drafts" },
              { id: "action_required", label: "Needs Review" },
              { id: "closed", label: "Closed" },
            ].map((f) => (
              <TouchableOpacity
                key={f.id}
                onPress={() => setActiveFilter(f.id)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 100,
                  backgroundColor: activeFilter === f.id ? "#2F87FF" : "white",
                  borderWidth: 1,
                  borderColor: activeFilter === f.id ? "#2F87FF" : "#E2E8F0",
                }}
              >
                <StyledText
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: activeFilter === f.id ? "white" : "#60728A",
                  }}
                >
                  {f.label}
                </StyledText>
              </TouchableOpacity>
            ))}
          </StyledView>

          {/* ── Status / error messages ───────────────────────────────────── */}
          {statusMessage && (
            <StyledView
              style={{
                backgroundColor: "#EFF6FF",
                borderRadius: 10,
                padding: 10,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              <Ionicons name="checkmark-circle" size={13} color="#0F5D9F" style={{ marginRight: 6, marginTop: 1 }} />
              <StyledText style={{ fontSize: 11, color: "#0F5D9F", fontWeight: "600", flex: 1 }}>
                {statusMessage}
              </StyledText>
              <TouchableOpacity onPress={() => setStatusMessage(null)}>
                <Ionicons name="close" size={13} color="#0F5D9F" />
              </TouchableOpacity>
            </StyledView>
          )}

          {loadError && (
            <StyledView
              style={{
                backgroundColor: "#FFF7F6",
                borderWidth: 1,
                borderColor: "#F4C7C3",
                borderRadius: 10,
                padding: 10,
                marginBottom: 12,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Ionicons name="alert-circle" size={13} color="#B42318" style={{ marginRight: 6 }} />
              <StyledText style={{ fontSize: 11, color: "#B42318", fontWeight: "600", flex: 1 }}>
                {loadError}
              </StyledText>
              <TouchableOpacity onPress={loadReportHistory}>
                <StyledText style={{ fontSize: 10, color: "#B42318", fontWeight: "700", textDecorationLine: "underline" }}>
                  Retry
                </StyledText>
              </TouchableOpacity>
            </StyledView>
          )}

          {/* ── Loading state ─────────────────────────────────────────────── */}
          {isLoading && (
            <StyledView style={{ paddingVertical: 40, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#0F5D9F" />
              <StyledText style={{ fontSize: 11, color: "#607B90", marginTop: 8 }}>
                Loading reports...
              </StyledText>
            </StyledView>
          )}

          {/* ── Empty state ───────────────────────────────────────────────── */}
          {!isLoading && filteredReports.length === 0 && (
            <StyledView style={{ paddingVertical: 40, alignItems: "center" }}>
              <Ionicons name="folder-open-outline" size={32} color="#CBD5E1" />
              <StyledText
                style={{ fontSize: 13, color: "#607B90", marginTop: 8, textAlign: "center" }}
              >
                No reports matched this view.
              </StyledText>
            </StyledView>
          )}

          {/* ── Report cards ─────────────────────────────────────────────── */}
          {!isLoading &&
            filteredReports.map((report, index) => {
              const meta = report._meta;
              const actions = getLifecycleActions(report._resolvedStatus);
              const isFirst = index === 0;

              return (
                <StyledView
                  key={report._id}
                  style={{
                    backgroundColor: "white",
                    borderWidth: 1,
                    borderColor: "#E3EBF5",
                    borderRadius: 20,
                    padding: 16,
                    marginBottom: 12,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04,
                    shadowRadius: 8,
                    elevation: 1,
                  }}
                >
                  {/* Top row */}
                  <StyledView
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: 12,
                    }}
                  >
                    <StyledView style={{ flexDirection: "row", alignItems: "flex-start", flex: 1, marginRight: 10 }}>
                      {/* Icon bubble */}
                      <StyledView
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: meta.iconBg,
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 10,
                          flexShrink: 0,
                        }}
                      >
                        <Ionicons name={meta.iconName} size={14} color={meta.iconColor} />
                      </StyledView>

                      <StyledView style={{ flex: 1 }}>
                        {/* Status badge */}
                        <StyledView
                          style={{
                            alignSelf: "flex-start",
                            backgroundColor: meta.badgeBg,
                            borderRadius: 6,
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            marginBottom: 4,
                          }}
                        >
                          <StyledText
                            style={{
                              fontSize: 8,
                              fontWeight: "800",
                              color: meta.badgeText,
                              textTransform: "uppercase",
                              letterSpacing: 0.8,
                            }}
                          >
                            {meta.label}
                          </StyledText>
                        </StyledView>

                        {/* Title */}
                        <StyledText
                          style={{ fontSize: 14, fontWeight: "700", color: "#1F2A3A" }}
                          numberOfLines={2}
                        >
                          {report.context || report.incidentType || "SafeSpeak report"}
                        </StyledText>

                        {/* Team & date */}
                        <StyledText
                          style={{ fontSize: 9, color: "#7F8FA4", marginTop: 3 }}
                        >
                          • {meta.team}
                        </StyledText>
                        <StyledText
                          style={{
                            fontSize: 8,
                            fontWeight: "600",
                            color: "#97A6BA",
                            textTransform: "uppercase",
                            letterSpacing: 0.8,
                            marginTop: 1,
                          }}
                        >
                          {formatDate(report.updatedAt ?? report.createdAt)}
                        </StyledText>
                      </StyledView>
                    </StyledView>

                    {/* Chevron button */}
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/home/report-submission/submission-success",
                          params: { reportId: report._id },
                        })
                      }
                      style={{
                        width: isFirst ? 64 : 52,
                        height: isFirst ? 64 : 52,
                        borderRadius: 14,
                        backgroundColor: isFirst ? "#0F5D9F" : "#F9FBFF",
                        borderWidth: isFirst ? 0 : 1,
                        borderColor: "#E4EBF5",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        shadowColor: isFirst ? "#0F5D9F" : "transparent",
                        shadowOffset: { width: 0, height: 6 },
                        shadowOpacity: isFirst ? 0.3 : 0,
                        shadowRadius: 12,
                        elevation: isFirst ? 4 : 0,
                      }}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={isFirst ? "white" : "#7F91A8"}
                      />
                    </TouchableOpacity>
                  </StyledView>

                  {/* ── Lifecycle action pills ─────────────────────────── */}
                  <StyledView
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: "#EDF2F7",
                      paddingTop: 12,
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 8,
                    }}
                  >
                    {actions.map((action) => {
                      const actionKey = `${report._id}:${action.key}`;
                      const isRunning = activeActionKey === actionKey;
                      const isAnyRunning = Boolean(activeActionKey);

                      return (
                        <TouchableOpacity
                          key={action.key}
                          disabled={isAnyRunning}
                          onPress={() => handleLifecycleAction(report, action)}
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingHorizontal: 12,
                            paddingVertical: 7,
                            borderRadius: 100,
                            borderWidth: 1,
                            backgroundColor: action.destructive ? "#FFF7F6" : "white",
                            borderColor: action.destructive ? "#F4C7C3" : "#D8E4F2",
                            opacity: isAnyRunning ? 0.6 : 1,
                          }}
                        >
                          {isRunning ? (
                            <ActivityIndicator
                              size="small"
                              color={action.destructive ? "#B42318" : "#40566F"}
                              style={{ width: 11, height: 11, marginRight: 5 }}
                            />
                          ) : (
                            <Ionicons
                              name={action.iconName}
                              size={11}
                              color={action.destructive ? "#B42318" : "#40566F"}
                              style={{ marginRight: 5 }}
                            />
                          )}
                          <StyledText
                            style={{
                              fontSize: 10,
                              fontWeight: "700",
                              color: action.destructive ? "#B42318" : "#40566F",
                            }}
                          >
                            {action.label}
                          </StyledText>
                        </TouchableOpacity>
                      );
                    })}
                  </StyledView>
                </StyledView>
              );
            })}
        </StyledView>
      </SafeSpeakScreen>

      {/* Custom Alert Modal */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
}
