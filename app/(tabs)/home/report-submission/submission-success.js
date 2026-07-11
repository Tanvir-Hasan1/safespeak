import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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

export default function SubmissionSuccess() {
  const router = useRouter();
  const { reportId } = useLocalSearchParams();
  const { t } = useLanguage();

  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [reportStatus, setReportStatus] = useState("prepared");
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [submissionRecord, setSubmissionRecord] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

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
            setSelectedDestination(dests[0]);
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
        anonymityMode: "identified",
        notes: `Shared securely from SafeSpeak Mobile app: ${selectedDestination.destinationName}`,
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
        backText="Detailed Explanations"
      rightIcon="time-outline"
      onRightPress={() => {
        router.push("/home/report-submission/history");
      }}
      showCancel={false}
      className="flex-1 px-5"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
        <StyledText className="text-[#64748B] text-[13px] text-center leading-5 mt-4 mb-6 px-4">
          SafeSpeak prepared this report and matched it against admin-managed police, legal, eSafety, and support destinations. Review the recommended recipient before opening the secure sharing step.
        </StyledText>

        {isLoading ? (
          <StyledView className="py-12 items-center justify-center">
            <ActivityIndicator size="large" color="#0B5A9E" />
          </StyledView>
        ) : (
          <>
            {/* SAFESPEAK REFERENCE CARD */}
            <StyledView className="border border-[#E2E8F0] rounded-[16px] p-4 items-center bg-white mb-5 mx-1">
              <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider mb-1">
                SAFESPEAK REFERENCE
              </StyledText>
              <StyledText className="text-[#1F2937] text-lg font-bold">
                {reportId ? `Report: ${report?.refNo || "Draft only"}` : "Draft only"}
              </StyledText>
              <StyledText className="text-[#7C8DA3] text-[11px] mt-1">
                Current status: {reportStatus}
              </StyledText>
            </StyledView>

            {/* AI-ASSISTED ROUTING CARD */}
            <StyledView
              style={{
                backgroundColor: "white",
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                marginBottom: 20,
                marginHorizontal: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 15,
                elevation: 2,
              }}
            >
              {/* Title Row */}
              <StyledView style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <StyledView style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#EFF6FF", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  <Ionicons name="hardware-chip-outline" size={16} color="#0B5A9E" />
                </StyledView>
                <StyledView style={{ flex: 1 }}>
                  <StyledText style={{ color: "#7C8DA3", fontSize: 10, fontWeight: "bold", letterSpacing: 1.2 }}>
                    AI-ASSISTED ROUTING
                  </StyledText>
                  <StyledText style={{ color: "#1F2937", fontSize: 16, fontWeight: "bold" }}>
                    Recommended authority match
                  </StyledText>
                </StyledView>
              </StyledView>

              {/* Nested Authority Box */}
              <StyledView className="rounded-[16px] border border-[#EFF6FF] bg-[#F8FAFC] p-4 items-center justify-center mb-4">
                <StyledText className="text-[#0B5A9E] text-xs font-bold text-center mb-1">
                  No authority match is available yet.
                </StyledText>
                <StyledText className="text-[#7C8DA3] text-[10px] text-center leading-4">
                  Create a backend report or add active destinations in the admin dashboard so SafeSpeak can recommend where this report should go.
                </StyledText>
              </StyledView>

              {/* Other recipients row */}
              <StyledView className="flex-row items-center justify-between mb-2">
                <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-wider">
                  OTHER POSSIBLE RECIPIENTS
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

              {/* Nested Other Recipients Box */}
              <StyledView className="rounded-[16px] border border-[#F1F5F9] bg-[#F8FAFC] p-4">
                <StyledText className="text-[#7C8DA3] text-[10px] leading-4">
                  Additional admin-managed destinations will appear here when they match this incident type and jurisdiction.
                </StyledText>
              </StyledView>
            </StyledView>

            {/* REVIEW CHECKLIST CARD */}
            <StyledView
              style={{
                backgroundColor: "white",
                borderRadius: 24,
                padding: 20,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                marginBottom: 20,
                marginHorizontal: 4,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 15,
                elevation: 2,
              }}
            >
              <StyledView style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
                <StyledView style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: "#FFF7ED", alignItems: "center", justifyContent: "center", marginRight: 12 }}>
                  <Ionicons name="sparkles" size={16} color="#EA580C" />
                </StyledView>
                <StyledText style={{ color: "#1F2937", fontSize: 16, fontWeight: "bold" }}>
                  Review checklist
                </StyledText>
              </StyledView>

              {/* Checklist items */}
              {["Confirm recipient", "Review evidence", "Open secure share", "Record delivery outcome"].map((item, index) => (
                <StyledView key={index} className="flex-row items-center justify-between bg-[#F8FAFC] border border-[#F1F5F9] rounded-[12px] p-3 mb-2">
                  <StyledText className="text-[#475569] text-xs font-semibold">
                    {item}
                  </StyledText>
                  <StyledView className="w-5 h-5 rounded-full bg-[#DCFCE7] items-center justify-center">
                    <Ionicons name="checkmark" size={12} color="#16A34A" />
                  </StyledView>
                </StyledView>
              ))}

              {/* Checklist Note */}
              <StyledView className="mt-2 bg-[#F8FAFC] border border-[#F1F5F9] rounded-[12px] p-3">
                <StyledText className="text-[#64748B] text-[10px] leading-4">
                  Authority and department data is managed by admins. SafeSpeak does not send anything until the user confirms sharing on the next page.
                </StyledText>
              </StyledView>
            </StyledView>

            {/* CULTURAL SUPPORT BLUE CARD */}
            <StyledView className="bg-[#0B5A9E] rounded-[24px] p-5 mb-3.5 mx-1 shadow-sm">
              <StyledView className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mb-3">
                <Ionicons name="information-circle" size={16} color="white" />
              </StyledView>
              <StyledText className="text-white text-base font-bold mb-1">
                Cultural Support
              </StyledText>
              <StyledText className="text-white/80 text-xs leading-[18px]">
                Consider culturally safe support and interpreter needs before deciding what to share.
              </StyledText>
            </StyledView>

            {/* WHAT HAPPENS NEXT BLUE CARD */}
            <StyledView className="bg-[#0B5A9E] rounded-[24px] p-5 mb-5 mx-1 shadow-sm">
              <StyledView className="w-7 h-7 rounded-full bg-white/15 items-center justify-center mb-3">
                <Ionicons name="eye" size={16} color="white" />
              </StyledView>
              <StyledText className="text-white text-base font-bold mb-1">
                What Happens Next
              </StyledText>
              <StyledText className="text-white/80 text-xs leading-[18px]">
                {hasBeenShared
                  ? `Your report submission has been logged and sent to ${
                      selectedDestination?.destinationName || "selected agency"
                    }. Updates will show in report history.`
                  : "Your report remains in SafeSpeak until a supported backend action changes it."}
              </StyledText>
            </StyledView>

            {/* BOTTOM ACTIONS CONTAINER CARD */}
            <StyledView className="bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm overflow-hidden mb-4 mx-1">
              {/* Save to History row */}
              <StyledTouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  router.push({
                    pathname: "/home/report-submission/history",
                    params: reportId ? { reportId } : undefined,
                  });
                }}
                className="w-full py-4 items-center justify-center border-b border-[#F1F5F9] flex-row"
              >
                <Ionicons name="folder" size={14} color="#EA580C" />
                <StyledText className="text-[#EA580C] text-xs font-bold ml-2">
                  Save to History
                </StyledText>
              </StyledTouchableOpacity>

              {/* Lower Buttons Block */}
              <StyledView className="p-4 items-center">
                {/* Share Report Securely orange capsule */}
                <StyledTouchableOpacity
                  activeOpacity={0.8}
                  disabled={hasBeenShared}
                  onPress={() => {
                    router.push({
                      pathname: "/home/report-submission/share-report",
                      params: { reportId },
                    });
                  }}
                  className={`w-full rounded-full py-3.5 flex-row items-center justify-center shadow-md mb-3 ${
                    hasBeenShared ? "bg-[#EA580C]/60" : "bg-[#EA580C]"
                  }`}
                >
                  <>
                    <Ionicons name="share-social" size={14} color="white" style={{ marginRight: 6 }} />
                    <StyledText className="text-white text-xs font-bold">
                      {hasBeenShared ? "Shared Successfully" : "Share report securely"}
                    </StyledText>
                  </>
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
                  className="w-full border border-[#D1D5DB] rounded-full py-3.5 flex-row items-center justify-center mb-4"
                >
                  <StyledText className="text-[#374151] text-xs font-bold mr-1">
                    Review recipients
                  </StyledText>
                  <Ionicons name="arrow-forward" size={14} color="#374151" />
                </StyledTouchableOpacity>

                {/* Status Indicator */}
                <StyledView className="flex-row items-center">
                  <Ionicons
                    name={hasBeenShared ? "checkmark-circle" : "flash-sharp"}
                    size={13}
                    color={hasBeenShared ? "#16A34A" : "#D97706"}
                  />
                  <StyledText
                    className={`text-[11px] font-bold ml-1.5 ${
                      hasBeenShared ? "text-[#16A34A]" : "text-[#D97706]"
                    }`}
                  >
                    {hasBeenShared ? "Shared through SafeSpeak" : "Prepared - not yet shared"}
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>

            {/* Bottom Caption */}
            <StyledText className="text-center text-[10px] text-[#94A3B8] mb-8">
              {reportId
                ? "Report status is synced with SafeSpeak."
                : "This draft remains local until a backend report is created."}
            </StyledText>
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
