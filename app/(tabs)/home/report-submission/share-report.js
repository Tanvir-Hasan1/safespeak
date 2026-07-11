import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import SafeSpeakScreen from "../../../../components/SafeSpeakScreen";
import { useLanguage } from "../../../../context/LanguageContext";
import api from "../../../../context/api";
import CustomAlert from "../../../../components/ui/CustomAlert";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

// ─── API helpers (mirrors reports-client.ts) ──────────────────────────────────

/** GET /api/v1/reports/:reportId */
async function getReport(reportId) {
  const res = await api.get(`/reports/${reportId}`);
  return res.data?.data?.report ?? res.data?.report ?? null;
}

/** GET /api/v1/reports/:reportId/status */
async function getReportStatus(reportId) {
  const res = await api.get(`/reports/${reportId}/status`);
  return res.data?.data?.status ?? res.data?.status ?? null;
}

/** GET /api/v1/reports/:reportId/submissions */
async function listReportSubmissions(reportId) {
  const res = await api.get(`/reports/${reportId}/submissions`);
  return res.data?.data?.submissions ?? res.data?.submissions ?? [];
}

/** GET /api/v1/reports/:reportId/destinations */
async function getReportDestinations(reportId) {
  const res = await api.get(`/reports/${reportId}/destinations`);
  return res.data?.data?.destinations ?? res.data?.destinations ?? [];
}

/** POST /api/v1/reports/:reportId/submissions */
async function submitReportToDestination(reportId, input) {
  const res = await api.post(`/reports/${reportId}/submissions`, {
    destinationId: input.destinationId,
    anonymityMode: input.anonymityMode ?? "identified",
    notes: input.notes,
    confirmConsent: input.confirmConsent ?? true,
  });
  return res.data?.data?.submission ?? res.data?.submission ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────

export default function ShareReport() {
  const router = useRouter();
  const { reportId } = useLocalSearchParams();
  const { t } = useLanguage();

  // ── State ──────────────────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(Boolean(reportId));
  const [isSharing, setIsSharing] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const [report, setReport] = useState(null);
  const [reportStatus, setReportStatus] = useState("prepared");
  const [destinations, setDestinations] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [latestSubmission, setLatestSubmission] = useState(null);
  // Tracks whether the user actually clicked "Confirm and send" in THIS session.
  // Pre-existing submissions from the API should NOT show "Shared Successfully".
  const [submittedThisSession, setSubmittedThisSession] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    onClose: null,
  });

  // ── Load all data in parallel (mirrors web Promise.all) ───────────────────
  const loadAll = useCallback(async () => {
    if (!reportId) {
      // Demo / no-report mode
      setReport({
        refNo: "Draft only",
        originalNarrative:
          "A manager used threatening language and blocked my path near the elevator. Two colleagues witnessed the incident.",
        status: "prepared",
      });
      setReportStatus("prepared");
      setIsLoading(false);
      return;
    }

    let active = true;
    setIsLoading(true);
    setLoadError(null);

    try {
      // Parallel fetch – same as web Promise.all
      const [reportData, statusData, submissionsData, destinationsData] =
        await Promise.all([
          getReport(reportId),
          getReportStatus(reportId),
          listReportSubmissions(reportId),
          getReportDestinations(reportId),
        ]);

      if (!active) return;

      // ── 1. Report details ────────────────────────────────────────────────
      if (reportData) {
        setReport(reportData);
      }

      // ── 2. Report status ─────────────────────────────────────────────────
      // Status API returns { current, status, ... } — prefer "current"
      const currentStatus =
        statusData?.current ?? statusData?.status ?? reportData?.status ?? "prepared";
      setReportStatus(currentStatus);

      // ── 3. Existing submissions ──────────────────────────────────────────
      setSubmissions(submissionsData);
      if (submissionsData.length > 0) {
        setLatestSubmission(submissionsData[0]);
      }

      // ── 4. Destinations ──────────────────────────────────────────────────
      setDestinations(destinationsData);

      // Auto-select: prefer a "ready" destination, otherwise first in list
      if (destinationsData.length > 0) {
        const ready =
          destinationsData.find((d) => d.deliveryReadiness?.status === "ready") ??
          destinationsData[0];
        setSelectedDestination(ready);
      }
    } catch (err) {
      console.warn("[ShareReport] Failed to load data:", err);
      if (active) {
        setLoadError(
          err?.response?.data?.message ??
            "Could not load sharing details. Please try again."
        );
      }
    } finally {
      if (active) setIsLoading(false);
    }

    return () => {
      active = false;
    };
  }, [reportId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ── Submit to destination ──────────────────────────────────────────────────
  const handleConfirmAndSend = async () => {
    if (!reportId) {
      setAlertConfig({
        visible: true,
        title: "No Report Found",
        message:
          "This draft needs a backend SafeSpeak report before it can be shared through the platform.",
      });
      return;
    }

    if (!selectedDestination) {
      setAlertConfig({
        visible: true,
        title: "No Recipient Selected",
        message:
          "Please select a recipient destination before sending.",
      });
      return;
    }

    if (selectedDestination.missingRequiredInfo?.length > 0) {
      setAlertConfig({
        visible: true,
        title: "Missing Information",
        message: `Review recipients first. This destination still needs: ${selectedDestination.missingRequiredInfo.join(", ")}.`,
      });
      return;
    }

    setIsSharing(true);

    try {
      // POST /api/v1/reports/:reportId/submissions
      const submission = await submitReportToDestination(reportId, {
        destinationId: selectedDestination.destinationId,
        anonymityMode: "identified",
        notes: `Shared securely from SafeSpeak Mobile: ${selectedDestination.destinationName}`,
        confirmConsent: true,
      });

      if (submission) {
        setLatestSubmission(submission);
        setReportStatus(submission.status ?? "submitted");
        // Mark as shared in this session so the button shows the success state
        setSubmittedThisSession(true);

        const notice = submission.actuallySent
          ? submission.externalReference
            ? `Report sent and recorded with external reference ${submission.externalReference}.`
            : "Report sent through the configured SafeSpeak delivery channel."
          : submission.status === "config_missing"
          ? "Sharing was recorded, but no external report was sent because delivery is not fully configured."
          : submission.status === "requires_manual_action"
          ? "Sharing was recorded for manual follow-up. No external report was sent."
          : "Sharing outcome has been recorded in SafeSpeak.";

        setAlertConfig({
          visible: true,
          title: "Shared Successfully",
          message: notice,
          onClose: () => {
            router.replace({
              pathname: "/home/report-submission/submission-success",
              params: { reportId },
            });
          },
        });
      }
    } catch (err) {
      console.warn("[ShareReport] Submission failed:", err);
      setAlertConfig({
        visible: true,
        title: "Sharing Failed",
        message:
          err?.response?.data?.message ??
          "Could not complete secure transmission. Please check your report and try again.",
      });
    } finally {
      setIsSharing(false);
    }
  };

  // ── Derived state ──────────────────────────────────────────────────────────
  // True only if the user clicked "Confirm and send" in this session.
  // Pre-existing submissions loaded from the API must NOT trigger this.
  const hasBeenShared = submittedThisSession;
  // Button should only be disabled if a previous successful delivery already exists.
  const alreadySubmittedPreviously =
    !submittedThisSession &&
    (reportStatus === "submitted" ||
      reportStatus === "acknowledged" ||
      (latestSubmission && (latestSubmission.status === "submitted" || latestSubmission.status === "acknowledged" || latestSubmission.actuallySent === true)));

  const evidenceCount =
    selectedDestination?.payloadPreview?.evidence?.length ?? 0;

  const deliveryReadiness = selectedDestination?.deliveryReadiness;
  const isDeliveryConfigMissing = deliveryReadiness?.status === "config_missing";

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeSpeakScreen
        backText="Prepared Report"
        rightIcon="time-outline"
        onRightPress={() => router.push("/home/report-submission/history")}
        showCancel={false}
      >
        <StyledView className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#0B5A9E" />
          <StyledText className="text-[#64748B] text-xs font-semibold mt-3">
            Loading sharing details...
          </StyledText>
        </StyledView>
      </SafeSpeakScreen>
    );
  }

  // ── Load error state ───────────────────────────────────────────────────────
  if (loadError) {
    return (
      <SafeSpeakScreen
        backText="Prepared Report"
        rightIcon="time-outline"
        onRightPress={() => router.push("/home/report-submission/history")}
        showCancel={false}
      >
        <StyledView className="flex-1 items-center justify-center px-8 py-20">
          <StyledView className="w-12 h-12 rounded-full bg-red-50 items-center justify-center mb-4">
            <Ionicons name="alert-circle" size={24} color="#EF4444" />
          </StyledView>
          <StyledText className="text-[#1F2937] text-base font-bold text-center mb-2">
            Could not load
          </StyledText>
          <StyledText className="text-[#64748B] text-xs text-center leading-5 mb-6">
            {loadError}
          </StyledText>
          <StyledTouchableOpacity
            onPress={loadAll}
            className="bg-[#0B5A9E] rounded-full px-6 py-3"
          >
            <StyledText className="text-white text-xs font-bold">Retry</StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </SafeSpeakScreen>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <>
      <SafeSpeakScreen
        backText="Prepared Report"
        rightIcon="time-outline"
        onRightPress={() => router.push("/home/report-submission/history")}
        showCancel={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
      >
        {/* ── Title Block ─────────────────────────────────────────────── */}
        <StyledView className="mt-4 mb-6 items-center px-2">
          <StyledText className="text-[#0B5A9E] text-[10px] font-bold uppercase tracking-widest mb-1">
            SECURE SHARING
          </StyledText>
          <StyledText className="text-[#1F2937] text-2xl font-black text-center mb-2">
            Share report securely
          </StyledText>
          <StyledText className="text-[#64748B] text-xs text-center leading-5">
            Confirm the recommended authority, consent, and report package before
            SafeSpeak sends anything to an external department.
          </StyledText>
        </StyledView>

        {/* ── Metadata Card ──────────────────────────────────────────────── */}
        <StyledView
          style={{
            backgroundColor: "white",
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 10,
            elevation: 1,
          }}
        >
          {/* Reference */}
          <StyledView className="mb-4 pb-4 border-b border-[#F1F5F9]">
            <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider mb-1">
              SAFESPEAK REFERENCE
            </StyledText>
            <StyledText className="text-[#1F2937] text-sm font-bold">
              {report?.refNo ?? "Draft only"}
            </StyledText>
          </StyledView>

          {/* Current Status — from /status endpoint */}
          <StyledView className="mb-4 pb-4 border-b border-[#F1F5F9]">
            <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider mb-1">
              CURRENT STATUS
            </StyledText>
            <StyledText className="text-[#1F2937] text-sm font-bold capitalize">
              {reportStatus}
            </StyledText>
          </StyledView>

          {/* Evidence — from payloadPreview in destinations response */}
          <StyledView>
            <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider mb-1">
              EVIDENCE
            </StyledText>
            <StyledText className="text-[#1F2937] text-sm font-bold">
              {evidenceCount} {evidenceCount === 1 ? "item" : "items"}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* ── Recommended Recipient Card ─────────────────────────────────── */}
        <StyledView
          style={{
            backgroundColor: "white",
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 10,
            elevation: 1,
          }}
        >
          <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider mb-2">
            RECOMMENDED RECIPIENT
          </StyledText>
          {selectedDestination ? (
            <>
              <StyledText className="text-[#0B5A9E] text-base font-bold mb-1">
                {selectedDestination.destinationName}
              </StyledText>
              <StyledText className="text-[#64748B] text-xs leading-4">
                {selectedDestination.reason ??
                  "Matched based on report narrative, jurisdiction and incident type."}
              </StyledText>
              {/* Channel / type badges */}
              <StyledView className="flex-row flex-wrap mt-2 gap-2">
                {selectedDestination.channel ? (
                  <StyledView className="bg-[#EFF6FF] rounded-full px-2 py-0.5">
                    <StyledText className="text-[#3B82F6] text-[9px] font-bold uppercase">
                      {selectedDestination.channel}
                    </StyledText>
                  </StyledView>
                ) : null}
                {selectedDestination.destinationType ? (
                  <StyledView className="bg-[#F0FDF4] rounded-full px-2 py-0.5">
                    <StyledText className="text-[#16A34A] text-[9px] font-bold uppercase">
                      {selectedDestination.destinationType}
                    </StyledText>
                  </StyledView>
                ) : null}
                {deliveryReadiness?.status ? (
                  <StyledView
                    className={`rounded-full px-2 py-0.5 ${
                      deliveryReadiness.status === "ready"
                        ? "bg-[#DCFCE7]"
                        : "bg-[#FFF7ED]"
                    }`}
                  >
                    <StyledText
                      className={`text-[9px] font-bold uppercase ${
                        deliveryReadiness.status === "ready"
                          ? "text-[#15803D]"
                          : "text-[#C2410C]"
                      }`}
                    >
                      {deliveryReadiness.status.replace("_", " ")}
                    </StyledText>
                  </StyledView>
                ) : null}
              </StyledView>
            </>
          ) : (
            <>
              <StyledText className="text-[#1F2937] text-base font-bold mb-1">
                No authority selected
              </StyledText>
              <StyledText className="text-[#64748B] text-xs leading-4">
                No active admin-managed destination is available for this report yet.
              </StyledText>
            </>
          )}
        </StyledView>

        {/* ── Other Available Matches ────────────────────────────────────── */}
        <StyledView
          style={{
            backgroundColor: "white",
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 10,
            elevation: 1,
          }}
        >
          <StyledView className="flex-row items-center justify-between mb-3">
            <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider">
              OTHER AVAILABLE MATCHES
            </StyledText>
            <StyledTouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/home/report-submission/evidence-review",
                  params: { reportId },
                })
              }
            >
              <StyledText className="text-[#0B5A9E] text-[11px] font-bold">
                Review recipients
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {destinations.length > 1 ? (
            destinations
              .filter((d) => d.destinationId !== selectedDestination?.destinationId)
              .slice(0, 3)
              .map((dest) => (
                <StyledTouchableOpacity
                  key={dest.destinationId}
                  onPress={() => setSelectedDestination(dest)}
                  className="flex-row items-center justify-between rounded-[16px] border border-[#EFF6FF] bg-[#F8FAFC] p-3 mb-2"
                >
                  <StyledView className="flex-1 mr-2">
                    <StyledText className="text-[#1F2937] text-xs font-bold mb-0.5">
                      {dest.destinationName}
                    </StyledText>
                    <StyledText className="text-[#64748B] text-[10px]" numberOfLines={1}>
                      {dest.reason ?? dest.destinationType ?? dest.channel}
                    </StyledText>
                  </StyledView>
                  <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                </StyledTouchableOpacity>
              ))
          ) : (
            <StyledView className="rounded-[16px] border border-[#EFF6FF] bg-[#F8FAFC] p-4">
              <StyledText className="text-[#64748B] text-[10px] leading-4">
                Admin-managed police, legal, eSafety, and support destinations will
                appear here when available.
              </StyledText>
            </StyledView>
          )}
        </StyledView>

        {/* ── Report Package Summary Card ─────────────────────────────────── */}
        <StyledView
          style={{
            backgroundColor: "white",
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: "#E2E8F0",
            marginBottom: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.04,
            shadowRadius: 10,
            elevation: 1,
          }}
        >
          <StyledView className="flex-row items-center mb-4">
            <StyledView className="w-6 h-6 rounded-full bg-[#E9F2FF] items-center justify-center mr-2">
              <Ionicons name="information-circle" size={14} color="#0B5A9E" />
            </StyledView>
            <StyledText className="text-[#1F2937] text-sm font-bold">
              Report package
            </StyledText>
          </StyledView>

          {/* Summary — from destinations payloadPreview.summary or report narrative */}
          <StyledView className="mb-4 pb-4 border-b border-[#F1F5F9]">
            <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider mb-1">
              SUMMARY
            </StyledText>
            <StyledText className="text-[#334155] text-[11px] leading-4">
              {selectedDestination?.payloadPreview?.summary?.trim() ||
                report?.originalNarrative?.trim() ||
                report?.translatedNarrative?.trim() ||
                "No narrative content provided."}
            </StyledText>
          </StyledView>

          {/* Anonymity */}
          <StyledView className="mb-4 pb-4 border-b border-[#F1F5F9]">
            <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider mb-1">
              ANONYMITY
            </StyledText>
            <StyledText className="text-[#334155] text-[11px] font-semibold capitalize">
              {latestSubmission?.anonymityMode ?? "Identified"}
            </StyledText>
          </StyledView>

          {/* Consent flags */}
          <StyledView>
            <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider mb-1">
              CONSENT FLAGS
            </StyledText>
            <StyledText className="text-[#334155] text-[11px] font-semibold">
              {selectedDestination?.requiredConsentFlags?.length
                ? selectedDestination.requiredConsentFlags.join(", ")
                : "Standard sharing consent"}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* ── Latest Submission Record (if already submitted) ────────────── */}
        {latestSubmission && (
          <StyledView
            style={{
              backgroundColor: "#F0FDF4",
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: "#DCFCE7",
              marginBottom: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.03,
              shadowRadius: 6,
              elevation: 1,
            }}
          >
            <StyledView className="flex-row items-center mb-3">
              <StyledView className="w-6 h-6 rounded-full bg-[#DCFCE7] items-center justify-center mr-2">
                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
              </StyledView>
              <StyledText className="text-[#15803D] text-sm font-bold">
                Submission recorded
              </StyledText>
            </StyledView>

            <StyledView className="mb-2">
              <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider mb-1">
                DESTINATION
              </StyledText>
              <StyledText className="text-[#1F2937] text-xs font-semibold">
                {latestSubmission.destinationName}
              </StyledText>
            </StyledView>

            {latestSubmission.externalReference ? (
              <StyledView className="mb-2">
                <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider mb-1">
                  EXTERNAL REFERENCE
                </StyledText>
                <StyledText className="text-[#1F2937] text-xs font-semibold font-mono">
                  {latestSubmission.externalReference}
                </StyledText>
              </StyledView>
            ) : null}

            {latestSubmission.deliveryMessage ? (
              <StyledView>
                <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider mb-1">
                  DELIVERY NOTE
                </StyledText>
                <StyledText className="text-[#334155] text-[10px] leading-4">
                  {latestSubmission.deliveryMessage}
                </StyledText>
              </StyledView>
            ) : null}
          </StyledView>
        )}

        {/* ── Final Confirmation Card ─────────────────────────────────────── */}
        <StyledView
          style={{
            borderRadius: 28,
            marginBottom: 20,
            overflow: "hidden",
            shadowColor: "#0B2E60",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.18,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          {/* Dark navy header band */}
          <StyledView
            style={{
              backgroundColor: "#0B2E60",
              paddingHorizontal: 22,
              paddingTop: 22,
              paddingBottom: 20,
            }}
          >
            <StyledView style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
              <StyledView
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: "rgba(255,255,255,0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Ionicons name="shield-checkmark" size={18} color="#93C5FD" />
              </StyledView>
              <StyledView>
                <StyledText style={{ color: "#93C5FD", fontSize: 9, fontWeight: "800", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 2 }}>
                  STEP 3 OF 3
                </StyledText>
                <StyledText style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "800" }}>
                  Final confirmation
                </StyledText>
              </StyledView>
            </StyledView>

            {!reportId && (
              <StyledView
                style={{
                  backgroundColor: "rgba(251,191,36,0.15)",
                  borderWidth: 1,
                  borderColor: "rgba(251,191,36,0.35)",
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="warning" size={14} color="#FCD34D" style={{ marginTop: 1, marginRight: 8 }} />
                <StyledText style={{ color: "#FDE68A", fontSize: 10, lineHeight: 16, flex: 1 }}>
                  This draft needs a backend SafeSpeak report before it can be shared through the platform.
                </StyledText>
              </StyledView>
            )}

            {isDeliveryConfigMissing && (
              <StyledView
                style={{
                  backgroundColor: "rgba(249,115,22,0.15)",
                  borderWidth: 1,
                  borderColor: "rgba(249,115,22,0.35)",
                  borderRadius: 12,
                  padding: 12,
                  flexDirection: "row",
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <Ionicons name="alert-circle" size={14} color="#FB923C" style={{ marginTop: 1, marginRight: 8 }} />
                <StyledText style={{ color: "#FED7AA", fontSize: 10, lineHeight: 16, flex: 1 }}>
                  Delivery not fully configured. SafeSpeak will record the attempt but no external report will be sent automatically.
                </StyledText>
              </StyledView>
            )}

            <StyledView style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
              <Ionicons name="lock-closed" size={11} color="#60A5FA" style={{ marginRight: 5 }} />
              <StyledText style={{ color: "#93C5FD", fontSize: 10, fontWeight: "600" }}>
                End-to-end encrypted · Consent-gated · Audited
              </StyledText>
            </StyledView>
          </StyledView>

          {/* White action area */}
          <StyledView
            style={{
              backgroundColor: "#FFFFFF",
              paddingHorizontal: 22,
              paddingTop: 20,
              paddingBottom: 22,
            }}
          >
            {hasBeenShared ? (
              /* Green success — only shown after user clicked Confirm this session */
              <StyledView
                style={{
                  backgroundColor: "#F0FDF4",
                  borderWidth: 1.5,
                  borderColor: "#86EFAC",
                  borderRadius: 100,
                  paddingVertical: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name="checkmark-circle" size={16} color="#16A34A" style={{ marginRight: 7 }} />
                <StyledText style={{ color: "#15803D", fontSize: 13, fontWeight: "800" }}>
                  Shared Successfully
                </StyledText>
              </StyledView>
            ) : alreadySubmittedPreviously ? (
              /* Grey disabled — report already has a prior submission from previous session */
              <StyledView
                style={{
                  backgroundColor: "#F1F5F9",
                  borderWidth: 1,
                  borderColor: "#CBD5E1",
                  borderRadius: 100,
                  paddingVertical: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name="checkmark-circle-outline" size={15} color="#64748B" style={{ marginRight: 7 }} />
                <StyledText style={{ color: "#64748B", fontSize: 13, fontWeight: "700" }}>
                  Already submitted
                </StyledText>
              </StyledView>
            ) : (
              /* Active orange — ready to send */
              <StyledTouchableOpacity
                activeOpacity={0.85}
                disabled={isSharing}
                onPress={handleConfirmAndSend}
                style={{
                  backgroundColor: "#EA580C",
                  borderRadius: 100,
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                  shadowColor: "#EA580C",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 10,
                  elevation: 5,
                }}
              >
                {isSharing ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", flexShrink: 1 }}>
                    <Ionicons name="share-social" size={15} color="white" style={{ marginRight: 6, flexShrink: 0 }} />
                    <StyledText 
                      style={{ 
                        color: "white", 
                        fontSize: 12, 
                        fontWeight: "800", 
                        textAlign: "center"
                      }}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                    >
                      {isDeliveryConfigMissing
                        ? "Record attempt \u2013 no external send"
                        : "Confirm and send through SafeSpeak"}
                    </StyledText>
                  </View>
                )}
              </StyledTouchableOpacity>
            )}

            <StyledTouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              style={{
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 100,
                paddingVertical: 13,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#F8FAFC",
              }}
            >
              <StyledText style={{ color: "#374151", fontSize: 12, fontWeight: "700", marginRight: 4 }}>
                Back to prepared summary
              </StyledText>
              <Ionicons name="arrow-forward" size={13} color="#374151" />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </SafeSpeakScreen>

      {/* Custom Alert Modal */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => {
          const cb = alertConfig.onClose;
          setAlertConfig((prev) => ({ ...prev, visible: false, onClose: null }));
          if (cb) cb();
        }}
      />
    </>
  );
}
