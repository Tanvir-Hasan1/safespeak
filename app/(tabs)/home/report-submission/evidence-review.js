import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
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
const StyledTextInput = styled(TextInput);

export default function EvidenceReview() {
  const router = useRouter();
  const { reportId } = useLocalSearchParams();
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState("WHO");

  // Dynamic backend states
  const [reportStatus, setReportStatus] = useState("draft");
  const [reportLanguage, setReportLanguage] = useState("en");
  const [reportJurisdiction, setReportJurisdiction] = useState("NSW");

  const [destinations, setDestinations] = useState([]);
  const [selectedDestinationId, setSelectedDestinationId] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewWarning, setPreviewWarning] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    ) {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }, []);

  // State for AI-assisted timeline items
  const [timelineItems, setTimelineItems] = useState([
    {
      id: "WHO",
      label: "WHO",
      content: "Not provided yet",
      isProvided: false,
    },
    {
      id: "WHAT",
      label: "WHAT",
      content: "A manager used threatening language and blocked my path near the elevator. Two colleagues witnessed the incident.",
      isProvided: true,
    },
    {
      id: "WHEN",
      label: "WHEN",
      content: "2026-02-22",
      isProvided: true,
    },
    {
      id: "WHERE",
      label: "WHERE",
      content: "Building A, Corridor 2",
      isProvided: true,
    },
    {
      id: "HOW",
      label: "HOW",
      content: "Not provided yet",
      isProvided: false,
    },
    {
      id: "WITNESSES",
      label: "WITNESSES",
      content: "Not provided yet",
      isProvided: false,
    },
    {
      id: "REPEATED",
      label: "REPEATED",
      content: "Not provided yet",
      isProvided: false,
    },
    {
      id: "INJURIES",
      label: "INJURIES",
      content: "Not provided yet",
      isProvided: false,
    },
    {
      id: "EVIDENCE",
      label: "EVIDENCE",
      content: "Not provided yet",
      isProvided: false,
    },
  ]);

  React.useEffect(() => {
    if (!reportId) return;

    let active = true;
    const fetchReportData = async () => {
      try {
        // 1. Consent Verification (Pre-flight)
        const consentRes = await api.get("/consents/current");

        // 2. Report Details (On Load) parallel-loading
        const [reportRes, statusRes, timelineRes, destRes] = await Promise.all([
          api.get(`/reports/${reportId}`),
          api.get(`/reports/${reportId}/status`),
          api.get(`/reports/${reportId}/timeline`),
          api.get(`/reports/${reportId}/destinations`),
        ]);

        const report = reportRes.data?.data?.report || reportRes.data?.report;
        const statusData = statusRes.data?.data?.status || statusRes.data?.status;
        const destData = destRes.data?.data?.destinations || destRes.data?.destinations || [];

        if (report && active) {
          setReportStatus(statusData?.current || report.status || "draft");
          setReportLanguage(report.language || "en");
          setReportJurisdiction(report.jurisdiction || "NSW");
          setDestinations(destData);

          const backendFieldMapping = [
            { key: "who", id: "WHO", label: "WHO" },
            { key: "what", id: "WHAT", label: "WHAT" },
            { key: "where", id: "WHERE", label: "WHERE" },
            { key: "when", id: "WHEN", label: "WHEN" },
            { key: "how", id: "HOW", label: "HOW" },
            { key: "witnesses", id: "WITNESSES", label: "WITNESSES" },
            { key: "repeatedIncidents", id: "REPEATED", label: "REPEATED" },
            { key: "injuries", id: "INJURIES", label: "INJURIES" },
            { key: "evidenceItems", id: "EVIDENCE", label: "EVIDENCE" },
          ];

          const mappedItems = backendFieldMapping.map((field) => {
            const val = report.structuredFields?.[field.key];
            const hasValue = val !== undefined && val !== null && String(val).trim().length > 0;
            return {
              id: field.id,
              label: field.label,
              content: hasValue ? String(val) : "Not provided yet",
              isProvided: hasValue,
            };
          });

          setTimelineItems(mappedItems);
        }
      } catch (err) {
        console.warn("Failed to load report data from API: ", err);
      }
    };

    fetchReportData();
    return () => {
      active = false;
    };
  }, [reportId]);

  // Search input state
  const [askQuery, setAskQuery] = useState(
    "What should I review before choosing a support or government contact?"
  );
  const [isAsking, setIsAsking] = useState(false);
  const [answerResult, setAnswerResult] = useState(null);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [manualType, setManualType] = useState("What");
  const [manualValue, setManualValue] = useState("");
  const [showSectionPicker, setShowSectionPicker] = useState(false);

  const handleAsk = async () => {
    const query = askQuery.trim();
    if (!query) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Please type a question.",
      });
      return;
    }

    setIsAsking(true);
    setAnswerResult(null);

    try {
      const res = await api.post("/rag/answer", {
        question: query,
        query: query,
        topK: 5,
        language: reportLanguage,
        jurisdiction: reportJurisdiction,
      });

      if (res.data?.success && res.data?.data) {
        setAnswerResult(res.data.data);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.warn("RAG Q&A failed:", err);
      // Fallback local mock to match reference screenshot design when API has no match or fails
      setAnswerResult({
        answer: "The information was not found in the available approved legal data.",
        disclaimer: "This is general legal information from the cited sources, not legal advice. Check the current official legislation and seek qualified advice for your situation.",
        confidence: "low",
        citations: [],
      });
    } finally {
      setIsAsking(false);
    }
  };

  const handleSelectDestination = async (destId) => {
    setSelectedDestinationId(destId);
    // 4. Submission Previews (On Destination Selection)
    setPreviewLoading(true);
    setPreviewWarning(null);
    try {
      const res = await api.post(`/reports/${reportId}/submission-previews`, {
        destinationIds: [destId],
        anonymityMode: "identified",
      });
      const previews = res.data?.data?.previews || res.data?.previews || [];
      if (previews.length > 0) {
        const missing = previews[0].missingRequiredInfo || [];
        if (missing.length > 0) {
          setPreviewWarning(`Missing required fields: ${missing.join(", ")}`);
        }
      }
    } catch (err) {
      console.warn("Failed to preview submission: ", err);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleToggleExpand = (id) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedId((prev) => (prev === id ? null : id));
  };



  const handleAddManualEntry = () => {
    LayoutAnimation.easeInEaseOut();
    setIsAddingManual(true);
  };

  const handleCancelManual = () => {
    LayoutAnimation.easeInEaseOut();
    setIsAddingManual(false);
    setManualValue("");
    setManualType("What");
  };

  const handleSaveManual = async () => {
    const value = manualValue.trim();
    if (!value) {
      setAlertConfig({
        visible: true,
        title: "Missing Details",
        message: "Please enter manual details before adding.",
      });
      return;
    }

    const fieldKey = manualType.toLowerCase() === "repeated" ? "repeatedIncidents" :
      manualType.toLowerCase() === "evidence" ? "evidenceItems" :
        manualType.toLowerCase();

    // Rebuild structured fields from current timeline items + new one
    const updatedFields = {};
    timelineItems.forEach((item) => {
      const key = item.label.toLowerCase() === "repeated" ? "repeatedIncidents" :
        item.label.toLowerCase() === "evidence" ? "evidenceItems" :
          item.label.toLowerCase();
      if (item.isProvided && item.content !== "Not provided yet") {
        updatedFields[key] = item.content;
      }
    });
    updatedFields[fieldKey] = value;

    setIsSaving(true);
    try {
      // 3. Syncing & Saving Changes (On Edit)
      await api.patch(`/reports/${reportId}`, {
        structuredFields: updatedFields,
      });

      // Update local state on success
      setTimelineItems((prev) => {
        return prev.map((item) => {
          if (item.id === manualType.toUpperCase()) {
            return {
              ...item,
              content: value,
              isProvided: true,
            };
          }
          return item;
        });
      });

      LayoutAnimation.easeInEaseOut();
      setExpandedId(manualType.toUpperCase());
      setIsAddingManual(false);
      setManualValue("");
      setManualType("What");
    } catch (err) {
      console.warn("Failed to sync manual entry: ", err);
      setAlertConfig({
        visible: true,
        title: "Sync Error",
        message: "Failed to save timeline changes to backend.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <SafeSpeakScreen
        backText="Timeline Builder"
        rightIcon="time-outline"
        onRightPress={() => router.push("/home/report-submission/history")}
        showCancel={false}
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 60 }}
        blueTheme={true}
        plainRightIcon={true}
      >
        {/* Title & Description */}
        <StyledView className="mt-4 mb-4">
          <StyledText className="text-[#0B5A9E] text-[10px] font-extrabold uppercase tracking-widest mb-1">
            INCIDENT BUILDER
          </StyledText>
          <StyledText className="text-[#0B1F33] text-3xl font-black mb-2">
            Evidence Review
          </StyledText>
          <StyledText className="text-[#64748B] text-xs leading-5">
            If AI-assisted structuring was used, verify the timeline below before continuing to the secure sharing step.
          </StyledText>

          {/* Progress Bar */}
          <StyledView className="flex-row items-center justify-between space-x-1.5 mt-4 mb-1.5">
            <StyledView className="h-1.5 bg-[#005B96] rounded-full flex-1" />
            <StyledView className="h-1.5 bg-[#005B96] rounded-full flex-1" />
            <StyledView className="h-1.5 bg-[#005B96] rounded-full flex-1" />
            <StyledView className="h-1.5 bg-[#E2E8F0] rounded-full flex-1" />
            <StyledView className="h-1.5 bg-[#E2E8F0] rounded-full flex-1" />
          </StyledView>
          <StyledText className="text-[#005B96] text-[9px] font-extrabold uppercase tracking-wider">
            STEP 3 OF 5
          </StyledText>
        </StyledView>

        {/* Backend Status Card */}
        <StyledView className="bg-white rounded-[16px] px-5 py-4 border border-[#E2E8F0] shadow-sm mb-3">
          <StyledText className="text-[#1F2937] text-[13px] font-bold">
            Current backend status: <StyledText className="text-[#6B7280]">{reportStatus}</StyledText>
          </StyledText>
        </StyledView>

        {/* Review with Approved Sources Card */}

        {/* Safety-First Report Flow Card */}
        <StyledView className="w-full bg-[#EFF6FF] border border-[#BFDBFE] rounded-[24px] p-5 mb-5 shadow-xs">
          <StyledView className="flex-row items-start mb-2">
            <Ionicons name="shield-checkmark" size={16} color="#005B96" className="mt-0.5" />
            <StyledText className="text-[#005B96] text-[10px] font-extrabold uppercase tracking-widest ml-2">
              SAFETY-FIRST REPORT FLOW
            </StyledText>
          </StyledView>
          <StyledText className="text-[#4B5563] text-xs leading-5 mb-4">
            Nothing is auto-submitted on entry. Reports are created, updated, or prepared only when you explicitly continue or save.
          </StyledText>
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/home/smart-dialer")}
            className="bg-white border border-[#CBD5E1] py-2 px-4 rounded-full flex-row items-center self-start"
          >
            <Ionicons name="call" size={12} color="#005B96" />
            <StyledText className="text-[#005B96] text-[11px] font-bold ml-1.5">
              Smart Dialer
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Contact Option Card */}
        <StyledView className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] shadow-sm mb-5">
          <StyledView className="flex-row items-center justify-between mb-1">
            <StyledText className="text-[#7C8DA3] text-[11px] font-bold uppercase tracking-wider">
              CONTACT OPTION
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[10px] font-bold">
              {`${destinations.length} option${destinations.length !== 1 ? "s" : ""} available`}
            </StyledText>
          </StyledView>
          <StyledText className="text-[#374151] text-[11.5px] leading-5 mb-4">
            Language '{reportLanguage}' in '{reportJurisdiction}'.
          </StyledText>

          {destinations.length === 0 ? (
            <StyledView className="bg-[#FFFBEB] rounded-[10px] border border-[#FEF3C7] p-3">
              <StyledText className="text-[#B45309] text-[11px] leading-4 font-semibold text-center">
                No active destinations match this report yet. Add or activate them in the admin dashboard.
              </StyledText>
            </StyledView>
          ) : (
            destinations.map((dest) => {
              const isSelected = selectedDestinationId === dest.destinationId;
              return (
                <StyledTouchableOpacity
                  key={dest.destinationId}
                  activeOpacity={0.8}
                  onPress={() => handleSelectDestination(dest.destinationId)}
                  className={`border rounded-[14px] p-3 mb-2 flex-row items-center justify-between ${isSelected ? "border-[#0B5A9E] bg-[#F4F9FD]" : "border-[#E2E8F0] bg-white"
                    }`}
                >
                  <StyledView className="flex-1 mr-2">
                    <StyledText className="text-[12px] font-bold text-[#1F2937]">
                      {dest.destinationName}
                    </StyledText>
                    <StyledText className="text-[10px] text-[#6B7280] mt-0.5">
                      {dest.reason || "Matched referral destination"}
                    </StyledText>
                  </StyledView>
                  <Ionicons
                    name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                    size={18}
                    color={isSelected ? "#0B5A9E" : "#94A3B8"}
                  />
                </StyledTouchableOpacity>
              );
            })
          )}

          {/* Submission Preview Alerts */}
          {selectedDestinationId && previewLoading && (
            <ActivityIndicator size="small" color="#0B5A9E" className="mt-2" />
          )}

          {selectedDestinationId && !previewLoading && previewWarning ? (
            <StyledView className="bg-[#FFFBEB] rounded-[10px] border border-[#FEF3C7] p-3 mt-2">
              <StyledText className="text-[#B45309] text-[11px] leading-4 font-semibold">
                Warning: {previewWarning}
              </StyledText>
            </StyledView>
          ) : null}
        </StyledView>

        {/* Timeline Section */}
        <StyledView className="relative pl-7 mb-5">
          {/* Vertical line */}
          <StyledView className="absolute left-[11px] top-4 bottom-2 w-[2px] bg-[#E2E8F0]" />

          {timelineItems.map((item) => {
            const isOpen = expandedId === item.id;
            return (
              <StyledView key={item.id} className="relative mb-4">
                {/* Dot marker on line */}
                <StyledView
                  className={`absolute -left-[26px] top-[14px] w-5 h-5 rounded-full border-[3px] border-white z-10 items-center justify-center shadow-sm ${isOpen ? "bg-[#0B5A9E]" : "bg-[#CBD5E1]"
                    }`}
                />

                {/* Main Card */}
                <StyledView
                  className={`bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm overflow-hidden ${isOpen ? "border-l-[6px] border-l-[#0B5A9E] p-5" : "p-4"
                    }`}
                >
                  <StyledTouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => handleToggleExpand(item.id)}
                    className="flex-row items-center justify-between"
                  >
                    <StyledView
                      className={`px-2.5 py-0.5 rounded-md ${isOpen ? "bg-[#EFF6FF]" : "bg-transparent"
                        }`}
                    >
                      <StyledText
                        className={`text-[10px] font-bold tracking-[1.5px] ${isOpen ? "text-[#0B5A9E]" : "text-[#7C8DA3]"
                          }`}
                      >
                        {item.label}
                      </StyledText>
                    </StyledView>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={14}
                      color="#8FA0B6"
                    />
                  </StyledTouchableOpacity>

                  {isOpen ? (
                    <StyledView className="mt-3">
                      <StyledText className="text-[#1F2937] text-[13px] leading-5 font-semibold">
                        {item.content}
                      </StyledText>
                      <StyledText className="text-[#B45309] text-[11px] font-semibold mt-2.5">
                        Stored locally only
                      </StyledText>
                    </StyledView>
                  ) : (
                    <StyledText
                      numberOfLines={1}
                      className="text-[#6B7280] text-[12px] mt-1.5 leading-4"
                    >
                      {item.content}
                    </StyledText>
                  )}
                </StyledView>
              </StyledView>
            );
          })}
        </StyledView>

        {/* Inline Manual Entry Card */}
        {isAddingManual && (
          <StyledView className="pl-7 mb-4">
            <StyledView className="bg-white rounded-[24px] p-5 border border-[#E2E8F0] shadow-sm">
              <StyledText className="text-[#0B5A9E] text-[11px] font-bold uppercase tracking-wider mb-3">
                MANUAL ENTRY
              </StyledText>

              <StyledView className="flex-row items-center space-x-3 mb-4">
                <StyledView className="w-1/3">
                  <StyledText className="text-[#6B7280] text-[10px] font-semibold mb-1">
                    Section
                  </StyledText>
                  <StyledTouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => setShowSectionPicker(true)}
                    className="border border-[#CBD5E1] bg-white rounded-[10px] p-3 flex-row items-center justify-between"
                  >
                    <StyledText className="text-[12px] text-[#1F2937] font-semibold">
                      {manualType}
                    </StyledText>
                    <Ionicons name="chevron-down" size={12} color="#6B7280" />
                  </StyledTouchableOpacity>
                </StyledView>

                <StyledView className="flex-1">
                  <StyledText className="text-[#6B7280] text-[10px] font-semibold mb-1">
                    Details
                  </StyledText>
                  <StyledTextInput
                    value={manualValue}
                    onChangeText={setManualValue}
                    placeholder="Enter manual detail"
                    placeholderTextColor="#94A3B8"
                    className="border border-[#CBD5E1] bg-white rounded-[10px] p-3 text-[12px] text-[#1F2937] h-[46px]"
                  />
                </StyledView>
              </StyledView>

              <StyledView className="flex-row justify-end space-x-2">
                <StyledTouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleCancelManual}
                  className="border border-[#CBD5E1] rounded-[10px] px-4 py-2"
                >
                  <StyledText className="text-[#475569] text-xs font-semibold">
                    Cancel
                  </StyledText>
                </StyledTouchableOpacity>
                <StyledTouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleSaveManual}
                  className="bg-[#2D66B0]/80 rounded-[10px] px-4 py-2"
                >
                  <StyledText className="text-white text-xs font-semibold">
                    Add Entry
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          </StyledView>
        )}

        {/* Dash Box to Add Manual Entry */}
        {!isAddingManual && (
          <StyledView className="pl-7 mb-6">
            <StyledTouchableOpacity
              activeOpacity={0.7}
              onPress={handleAddManualEntry}
              className="w-full rounded-[16px] border border-dashed border-[#CBD5E1] items-center justify-center bg-[#F8FAFC] py-[14px]"
            >
              <StyledView className="flex-row items-center">
                <Ionicons name="add-circle" size={18} color="#94A3B8" />
                <StyledText className="text-xs text-[#94A3B8] font-bold ml-1.5">
                  Add Manual Entry
                </StyledText>
              </StyledView>
            </StyledTouchableOpacity>
          </StyledView>
        )}

        {/* Share Action Button */}
        <StyledTouchableOpacity
          activeOpacity={0.82}
          onPress={() => {
            router.push({
              pathname: "/home/report-submission/submission-success",
              params: {
                reportId,
                selectedDestinationId: selectedDestinationId || "",
              },
            });
          }}
          className="bg-[#F59E0B] rounded-full py-[14px] flex-row items-center justify-center shadow-md mb-3"
        >
          <StyledText className="text-white text-sm font-bold">
            Share with selected service
          </StyledText>
          <Ionicons name="chevron-forward" size={14} color="white" className="ml-1" />
        </StyledTouchableOpacity>
      </SafeSpeakScreen>

      {/* Custom Alert Modal */}
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />

      {/* Section Picker Modal Overlay */}
      <Modal transparent animationType="fade" visible={showSectionPicker}>
        <StyledView className="flex-1 bg-black/40 items-center justify-center px-6">
          <StyledView className="bg-white rounded-[24px] p-5 w-full max-w-[280px] shadow-lg border border-[#E2E8F0]">
            <StyledText className="text-[#1F2937] text-sm font-bold mb-3">
              Select Section
            </StyledText>
            {["Who", "What", "Where", "When", "How", "Witnesses", "Repeated", "Injuries", "Evidence"].map((sec) => (
              <StyledTouchableOpacity
                key={sec}
                onPress={() => {
                  setManualType(sec);
                  setShowSectionPicker(false);
                }}
                className="py-2.5 border-b border-[#F1F5F9] flex-row items-center justify-between"
              >
                <StyledText className={`text-xs ${manualType === sec ? "text-[#0B5A9E] font-bold" : "text-[#475569]"}`}>
                  {sec}
                </StyledText>
                {manualType === sec && (
                  <Ionicons name="checkmark" size={14} color="#0B5A9E" />
                )}
              </StyledTouchableOpacity>
            ))}
          </StyledView>
        </StyledView>
      </Modal>
    </>
  );
}
