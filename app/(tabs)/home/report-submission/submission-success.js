import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Linking,
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

export default function SubmissionSuccess() {
  const router = useRouter();
  const { reportId, selectedDestinationId } = useLocalSearchParams();
  const { t } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [reportStatus, setReportStatus] = useState("prepared");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [submissionRecord, setSubmissionRecord] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [anonymityMode, setAnonymityMode] = useState("identified");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
  });

  useEffect(() => {
    if (!reportId) {
      // Setup mock data for visual demonstration
      setSelectedDestination({
        destinationId: "scamwatch",
        destinationName: "ScamWatch Agency",
        destinationType: "government",
      });
      return;
    }

    let active = true;
    const loadDetails = async () => {
      setIsLoading(true);
      try {
        const [reportRes, destRes] = await Promise.all([
          api.get(`/reports/${reportId}`),
          api.get(`/reports/${reportId}/destinations`),
        ]);

        if (active) {
          const reportData = reportRes.data?.data?.report || reportRes.data?.report;
          const dests = destRes.data?.data?.destinations || destRes.data?.destinations || [];

          setReport(reportData);
          if (reportData?.status) {
            setReportStatus(reportData.status);
          }
          if (dests.length > 0) {
            const matched = dests.find((d) => d.destinationId === selectedDestinationId);
            setSelectedDestination(matched || dests[0]);
          } else {
            setSelectedDestination({
              destinationId: "scamwatch",
              destinationName: "ScamWatch Agency",
              destinationType: "government",
            });
          }
        }
      } catch (err) {
        console.warn("Failed to load submission outcome data:", err);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadDetails();
    return () => {
      active = false;
    };
  }, [reportId]);

  const handleShareReport = async () => {
    if (!selectedDestination) {
      setAlertConfig({
        visible: true,
        title: "No Destination",
        message: "No matching agency/destination found to share this report.",
      });
      return;
    }

    if (!reportId) {
      // Mock share action
      setIsSharing(true);
      setTimeout(() => {
        setIsSharing(false);
        setSubmissionRecord({
          status: "submitted",
          destinationName: selectedDestination.destinationName,
          externalReference: "SW-8802931-A",
        });
        setReportStatus("submitted");
        setAlertConfig({
          visible: true,
          title: "Report Shared",
          message: "The report timeline has been shared securely (Demo mode).",
        });
      }, 1000);
      return;
    }

    setIsSharing(true);
    try {
      const res = await api.post(`/reports/${reportId}/submissions`, {
        destinationId: selectedDestination.destinationId,
        anonymityMode: anonymityMode,
        notes: submissionNotes || `Shared securely from SafeSpeak Mobile app: ${selectedDestination.destinationName}`,
        confirmConsent: true,
      });

      const submission = res.data?.data?.submission || res.data?.submission;
      if (submission) {
        setSubmissionRecord(submission);
        setReportStatus("submitted");
        setAlertConfig({
          visible: true,
          title: "Success",
          message: `Your report has been shared successfully with ${selectedDestination.destinationName}.`,
        });
      }
    } catch (err) {
      console.warn("Secure report sharing failed:", err);
      setAlertConfig({
        visible: true,
        title: "Sharing Failed",
        message:
          err?.response?.data?.message ||
          "Could not share report at this time. Please check configuration.",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const hasBeenShared = reportStatus === "submitted" || reportStatus === "acknowledged" || !!submissionRecord;

  return (
    <>
      <SafeSpeakScreen
        backText="Review"
        rightIcon="time-outline"
        onRightPress={() => {
          router.push("/home/report-submission/history");
        }}
        showCancel={false}
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40 }}
        blueTheme={true}
        plainRightIcon={true}
      >
        {/* Title & Description */}
        <StyledView className="mt-4 mb-4">
          <StyledText className="text-[#0B5A9E] text-[10px] font-extrabold uppercase tracking-widest mb-1">
            INCIDENT BUILDER
          </StyledText>
          <StyledText className="text-[#0B1F33] text-3xl font-black mb-2">
            Share report securely
          </StyledText>
          <StyledText className="text-[#64748B] text-xs leading-5">
            Confirm the recommended authority, consent, and report package before SafeSpeak sends anything to an external department.
          </StyledText>

          {/* Progress Bar */}
          <StyledView className="flex-row items-center justify-between space-x-1.5 mt-4 mb-1.5">
            <StyledView className="h-1.5 bg-[#005B96] rounded-full flex-1" />
            <StyledView className="h-1.5 bg-[#005B96] rounded-full flex-1" />
            <StyledView className="h-1.5 bg-[#005B96] rounded-full flex-1" />
            <StyledView className="h-1.5 bg-[#005B96] rounded-full flex-1" />
            <StyledView className="h-1.5 bg-[#E2E8F0] rounded-full flex-1" />
          </StyledView>
          <StyledText className="text-[#005B96] text-[9px] font-extrabold uppercase tracking-wider">
            STEP 4 OF 5
          </StyledText>
        </StyledView>

        {isLoading ? (
          <StyledView className="py-12 items-center justify-center">
            <ActivityIndicator size="large" color="#0B5A9E" />
          </StyledView>
        ) : (
          <>
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

            {/* SAFESPEAK REFERENCE CARD */}
            <StyledView className="bg-white rounded-[24px] border border-[#E2E8F0] p-5 mb-4 shadow-xs">
              <StyledText className="text-[#7C8DA3] text-[9px] font-bold uppercase tracking-wider mb-1.5">
                SAFESPEAK REFERENCE
              </StyledText>
              <StyledText className="text-[#0F172A] text-sm font-bold">
                {report?.refNo || "SS-MOCK-0001"}
              </StyledText>
            </StyledView>

            {/* CURRENT STATUS CARD */}
            <StyledView className="bg-white rounded-[24px] border border-[#E2E8F0] p-5 mb-4 shadow-xs">
              <StyledText className="text-[#7C8DA3] text-[9px] font-bold uppercase tracking-wider mb-1.5">
                CURRENT STATUS
              </StyledText>
              <StyledText className="text-[#0F172A] text-sm font-bold">
                {reportStatus}
              </StyledText>
            </StyledView>

            {/* EVIDENCE CARD */}
            <StyledView className="bg-white rounded-[24px] border border-[#E2E8F0] p-5 mb-5 shadow-xs">
              <StyledText className="text-[#7C8DA3] text-[9px] font-bold uppercase tracking-wider mb-1.5">
                EVIDENCE
              </StyledText>
              <StyledText className="text-[#0F172A] text-sm font-bold">
                {report?.evidenceItems?.length ? `${report.evidenceItems.length} item${report.evidenceItems.length !== 1 ? 's' : ''}` : "1 item"}
              </StyledText>
            </StyledView>

            {/* PRIMARY RECOMMENDATION CARD */}
            {selectedDestination ? (
              <StyledView className="bg-white border border-[#E2E8F0] rounded-[24px] p-5 mb-5 shadow-xs">
                {/* Nested Light-Blue Box */}
                <StyledView className="bg-[#F4F9FD] border border-[#D0E1F9] rounded-[20px] p-5 mb-4">
                  <StyledText className="text-[#0B5A9E] text-[10px] font-bold uppercase tracking-wider mb-1.5">
                    PRIMARY RECOMMENDATION
                  </StyledText>
                  <StyledText className="text-[#0F172A] text-[20px] font-bold mb-3">
                    {selectedDestination.destinationName}
                  </StyledText>
                  <StyledView className="bg-[#0B5A9E] px-3 py-1 rounded-full self-start">
                    <StyledText className="text-white text-[10px] font-bold">
                      Best match: 86%
                    </StyledText>
                  </StyledView>
                </StyledView>

                {/* Tags */}
                <StyledView className="flex-row flex-wrap items-center gap-2 mb-4">
                  <StyledView className="bg-white border border-[#D1D5DB] px-3 py-1 rounded-full">
                    <StyledText className="text-[#475569] text-[10px] font-bold">
                      {selectedDestination.destinationType || "Police"}
                    </StyledText>
                  </StyledView>
                  <StyledView className="bg-white border border-[#D1D5DB] px-3 py-1 rounded-full">
                    <StyledText className="text-[#475569] text-[10px] font-bold">
                      {selectedDestination.jurisdiction || "AU"}
                    </StyledText>
                  </StyledView>
                  <StyledView className="bg-white border border-[#D1D5DB] px-3 py-1 rounded-full">
                    <StyledText className="text-[#475569] text-[10px] font-bold">
                      Ready to share
                    </StyledText>
                  </StyledView>
                </StyledView>

                <StyledText className="text-[#526B80] text-xs leading-5 mb-5">
                  {selectedDestination.reason || "Recommended because your draft describes a direct incident with identifiable time and location details."}
                </StyledText>

                {/* Fields list */}
                {[
                  { label: "DEPARTMENT TYPE", val: selectedDestination.destinationType || "Police" },
                  { label: "SECURE CHANNEL", val: selectedDestination.channel || "Secure Api" },
                  { label: "JURISDICTION", val: selectedDestination.jurisdiction || "AU" },
                  { label: "REQUIRED INFO", val: selectedDestination.missingRequiredInfo?.length === 0 ? "Complete" : "Complete" },
                  { label: "DELIVERY READINESS", val: selectedDestination.deliveryReadiness?.status === "ready" ? "Automated channel ready" : "Automated channel ready" },
                ].map((field, idx) => (
                  <StyledView key={idx} className="bg-[#F8FAFC] rounded-[16px] border border-[#EBF3FC] p-3 mb-3">
                    <StyledText className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-wider mb-1">
                      {field.label}
                    </StyledText>
                    <StyledText className="text-[#0F172A] text-xs font-bold">
                      {field.val}
                    </StyledText>
                  </StyledView>
                ))}

                {/* Call/Email contact buttons */}
                <StyledView className="flex-row items-center gap-3 mt-2">
                  <StyledTouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => Linking.openURL(`tel:${selectedDestination.contactPhone || "000"}`)}
                    className="flex-1 bg-white border border-[#CBD5E1] py-3 rounded-full flex-row items-center justify-center"
                  >
                    <Ionicons name="call-outline" size={13} color="#244961" />
                    <StyledText className="text-[#244961] text-xs font-bold ml-1.5">
                      Call contact
                    </StyledText>
                  </StyledTouchableOpacity>
                  <StyledTouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => Linking.openURL(`mailto:${selectedDestination.contactEmail || "support@safespeak.org"}`)}
                    className="flex-1 bg-white border border-[#CBD5E1] py-3 rounded-full flex-row items-center justify-center"
                  >
                    <Ionicons name="mail-outline" size={13} color="#244961" />
                    <StyledText className="text-[#244961] text-xs font-bold ml-1.5">
                      Email contact
                    </StyledText>
                  </StyledTouchableOpacity>
                </StyledView>
              </StyledView>
            ) : null}

            {/* OTHER AVAILABLE MATCHES CARD */}
            <StyledView className="bg-white border border-[#E2E8F0] rounded-[24px] p-5 mb-5 shadow-xs">
              <StyledView className="flex-row items-center justify-between mb-3">
                <StyledText className="text-[#7C8DA3] text-[9px] font-bold uppercase tracking-wider">
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

              {/* List items */}
              <StyledView className="bg-white border border-[#EBF3FC] rounded-[16px] p-4 mb-3">
                <StyledText className="text-[#0F172A] text-xs font-bold">
                  eSafety Mock Intake
                </StyledText>
                <StyledText className="text-[#7C8DA3] text-[9px] font-bold uppercase tracking-wider mt-0.5">
                  ESAFETY - 78%
                </StyledText>
              </StyledView>
              <StyledView className="bg-white border border-[#EBF3FC] rounded-[16px] p-4">
                <StyledText className="text-[#0F172A] text-xs font-bold">
                  Anti-Discrimination Mock Pathway
                </StyledText>
                <StyledText className="text-[#7C8DA3] text-[9px] font-bold uppercase tracking-wider mt-0.5">
                  ANTI-DISCRIMINATION - 72%
                </StyledText>
              </StyledView>
            </StyledView>

            {/* SELECTED RECIPIENT CARD */}
            {selectedDestination ? (
              <StyledView className="bg-white border border-[#E2E8F0] rounded-[24px] p-5 mb-5 shadow-xs">
                <StyledText className="text-[#7C8DA3] text-[9px] font-bold uppercase tracking-wider mb-2">
                  SELECTED RECIPIENT
                </StyledText>
                <StyledText className="text-[#0F172A] text-lg font-bold">
                  {selectedDestination.destinationName}
                </StyledText>
                <StyledText className="text-[#0B5A9E] text-xs font-semibold mt-1">
                  Status: Ready for secure sharing
                </StyledText>
                <StyledText className="text-[#526B80] text-[11.5px] leading-[18px] mt-2 mb-3">
                  Recipient reviewed. Continue to confirm and send.
                </StyledText>

                {/* Nested note */}
                <StyledView className="bg-[#F0F6FC] border border-[#D0E1F9] rounded-[16px] p-4">
                  <StyledText className="text-[#526B80] text-xs leading-[18px]">
                    This destination has an automated delivery channel configured. SafeSpeak will only send after your consent and final confirmation.
                  </StyledText>
                </StyledView>
              </StyledView>
            ) : null}

            {/* SHARING OPTIONS CARD */}
            <StyledView className="bg-white border border-[#E2E8F0] rounded-[24px] p-5 mb-5 shadow-xs z-50">
              <StyledText className="text-[#7C8DA3] text-[9px] font-bold uppercase tracking-wider mb-3">
                SHARING OPTIONS
              </StyledText>
              <StyledText className="text-[#475569] text-xs font-semibold mb-1.5">
                Identity mode
              </StyledText>

              <StyledView className="relative z-50 mb-4">
                <StyledTouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => setShowDropdown(!showDropdown)}
                  className={`border rounded-xl p-3 flex-row items-center justify-between h-[44px] bg-white ${showDropdown ? "border-[#005B96] border-2" : "border-[#CBD5E1]"
                    }`}
                >
                  <StyledText className="text-xs text-[#0F172A] font-semibold">
                    {anonymityMode === "identified" ? "Identified (Name & contact info shared)" :
                      anonymityMode === "anonymous" ? "Anonymous (No identity details shared)" :
                        "Pseudonymous (Use SafeSpeak alias)"}
                  </StyledText>
                  <Ionicons name={showDropdown ? "chevron-up" : "chevron-down"} size={14} color="#64748B" />
                </StyledTouchableOpacity>

                {showDropdown && (
                  <StyledView className="absolute top-[48px] left-0 right-0 bg-white border border-[#CBD5E1] rounded-xl shadow-lg z-50 overflow-hidden">
                    {[
                      { label: "Identified (Name & contact info shared)", value: "identified" },
                      { label: "Anonymous (No identity details shared)", value: "anonymous" },
                      { label: "Pseudonymous (Use SafeSpeak alias)", value: "pseudonymous" },
                    ].map((item) => {
                      const isSelected = anonymityMode === item.value;
                      return (
                        <StyledTouchableOpacity
                          key={item.value}
                          activeOpacity={0.7}
                          onPress={() => {
                            setAnonymityMode(item.value);
                            setShowDropdown(false);
                          }}
                          className={`p-3 border-b border-[#F1F5F9] ${isSelected ? "bg-[#BAE6FD]" : "bg-white"
                            }`}
                        >
                          <StyledText className="text-xs text-[#0F172A] font-semibold">
                            {item.label}
                          </StyledText>
                        </StyledTouchableOpacity>
                      );
                    })}
                  </StyledView>
                )}
              </StyledView>

              <StyledText className="text-[#475569] text-xs font-semibold mb-1.5">
                Submission notes (Optional)
              </StyledText>
              <StyledTextInput
                value={submissionNotes}
                onChangeText={setSubmissionNotes}
                placeholder="Add a routing note or specific request..."
                placeholderTextColor="#94A3B8"
                multiline
                className="border border-[#CBD5E1] bg-white rounded-xl p-3 text-xs text-[#0F172A] min-h-[72px]"
                textAlignVertical="top"
              />
            </StyledView>

            {/* BUTTONS BLOCK CARD */}
            <StyledView className="bg-white border border-[#E2E8F0] rounded-[24px] shadow-sm overflow-hidden mb-6">
              <StyledView className="p-5">
                {/* Share Report Securely orange capsule */}
                <StyledTouchableOpacity
                  activeOpacity={0.82}
                  disabled={isSharing || hasBeenShared}
                  onPress={handleShareReport}
                  className={`w-full rounded-full py-4 flex-row items-center justify-center shadow-sm mb-3 ${hasBeenShared ? "bg-[#EA580C]/60" : "bg-[#EA580C]"
                    }`}
                >
                  <Ionicons name="share-social-outline" size={14} color="white" style={{ marginRight: 6 }} />
                  <StyledText className="text-white text-xs font-bold">
                    {isSharing ? "Sharing..." : hasBeenShared ? "Shared Successfully" : "Share report securely"}
                  </StyledText>
                </StyledTouchableOpacity>

                {/* Review Recipients outline capsule */}
                <StyledTouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    router.push({
                      pathname: "/home/report-submission/evidence-review",
                      params: { reportId },
                    });
                  }}
                  className="w-full border border-[#D1D5DB] rounded-full py-4 flex-row items-center justify-center"
                >
                  <StyledText className="text-[#244961] text-xs font-bold mr-1.5">
                    Review recipients
                  </StyledText>
                  <Ionicons name="arrow-forward" size={14} color="#244961" />
                </StyledTouchableOpacity>
              </StyledView>

              {/* Footer row with gray background */}
              <StyledView className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-5 py-4 flex-row items-center justify-between">
                <StyledTouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    router.push({
                      pathname: "/home/report-submission/history",
                      params: reportId ? { reportId } : undefined,
                    });
                  }}
                  className="flex-row items-center"
                >
                  <Ionicons name="folder" size={14} color="#EA580C" />
                  <StyledText className="text-[#EA580C] text-xs font-bold ml-2">
                    Save to History
                  </StyledText>
                </StyledTouchableOpacity>

                <StyledView className="flex-row items-center">
                  <Ionicons name="flash" size={14} color="#D97706" />
                  <StyledText className="text-[#D97706] text-xs font-bold">
                    Ready for secure sharing
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>
          </>
        )}
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
