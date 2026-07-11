import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Linking,
  Alert,
  ActivityIndicator,
  Share,
  Platform,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../../../components/CustomHeader";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useLanguage } from "../../../../context/LanguageContext";
import { useScamShieldStore } from "../../../../store/useScamShieldStore";
import api from "../../../../context/api";
import * as FileSystem from "expo-file-system";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

// ── External agency URLs ──────────────────────────────────────────────────────
const AGENCY_EXTERNAL_URLS = {
  bank: "https://www.afca.org.au/make-a-complaint",
  accc: "https://www.scamwatch.gov.au/report-a-scam",
  reportCyber: "https://www.cyber.gov.au/report-and-recover/report",
};

const AGENCIES = [
  {
    id: "accc",
    icon: "hammer-outline",
    iconBg: "#EFF6FF",
    iconColor: "#2D66B0",
    title: "Report to ACCC Scamwatch",
    description:
      "This form is prefilled for scam reporting and can be submitted directly to Scamwatch.",
    detailText:
      "Choose this if you have not lost money, but want the government to be aware of a scam. Do not click any buttons/links or provide payment details in response to this message.",
    downloadLabel: "Download Scamwatch guide",
    guidanceLabel: "Open Scamwatch",
    guidanceUrl: AGENCY_EXTERNAL_URLS.accc,
    destination: "scamwatch",
  },
  {
    id: "reportCyber",
    icon: "shield-outline",
    iconBg: "#FFF3DF",
    iconColor: "#EF7D00",
    title: "ReportCyber (ACSC)",
    description:
      "This form is prefilled for cybercrime reporting and can be submitted directly to ReportCyber.",
    detailText:
      "Report here if you clicked a link, shared personal details, lost money, or believe your identity or accounts are at risk. Verify independently by going to the provider's official website/app (typed manually) or checking your bank/credit card statement for legitimate charges.",
    downloadLabel: "Download ReportCyber guide",
    guidanceLabel: "Open ACSC guidance",
    guidanceUrl: AGENCY_EXTERNAL_URLS.reportCyber,
    destination: "reportCyber",
  },
  {
    id: "bank",
    icon: "business-outline",
    iconBg: "#FFF3DF",
    iconColor: "#EF7D00",
    title: "Bank Security Dept",
    description:
      "Contact your bank or card issuer's fraud department to secure your accounts.",
    detailText:
      "If you have lost money, shared your card details, or think someone can access your account, contact your bank immediately to freeze your accounts. This appears to be a live phishing/scareware-style payment/renewal scam claiming your protection expires today.",
    downloadLabel: "Download bank dispute guide",
    guidanceLabel: "Open AFCA portal",
    guidanceUrl: AGENCY_EXTERNAL_URLS.bank,
    destination: "bank",
  },
];

export default function AgencyReport() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useLanguage();
  const { currentAnalysis } = useScamShieldStore();
  const [headerVisible, setHeaderVisible] = useState(true);

  // Initial expanded agency from params (e.g. ?agency=accc)
  const [expandedId, setExpandedId] = useState(params.agency ?? "accc");

  // Draft state
  const [draftText, setDraftText] = useState("");
  const [indicators, setIndicators] = useState([]);
  const [loadingDraft, setLoadingDraft] = useState(false);

  // Redaction
  const [autoRedact, setAutoRedact] = useState(true);
  const [redactionMode, setRedactionMode] = useState("labels"); // "labels" | "mask"

  // Consent + submit
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y <= 10) setHeaderVisible(true);
    else if (y > 50) setHeaderVisible(false);
  };

  // ── Generate report draft on mount ────────────────────────────────────────
  const generateDraft = useCallback(
    async (mode = redactionMode) => {
      if (!currentAnalysis) return;
      setLoadingDraft(true);

      try {
        const body = {
          autoRedactPII: autoRedact,
          redactionMode: mode,
          ...(currentAnalysis._id ? {} : { analysisSnapshot: currentAnalysis }),
        };
        const url = currentAnalysis._id
          ? `/scamshield/${currentAnalysis._id}/generate-report-draft`
          : `/scamshield/generate-report-draft`;

        const res = await api.post(url, body);
        const draft = res?.data?.data?.analysis;
        const text =
          draft?.draftReport?.draft ??
          draft?.draftReport?.summary ??
          currentAnalysis?.summary ??
          "";
        const ind =
          draft?.draftReport?.indicators ??
          currentAnalysis?.indicators ??
          currentAnalysis?.redFlags ??
          [];

        setDraftText(text);
        setIndicators(ind);
      } catch {
        setDraftText(currentAnalysis?.summary ?? "");
        setIndicators(currentAnalysis?.indicators ?? currentAnalysis?.redFlags ?? []);
      } finally {
        setLoadingDraft(false);
      }
    },
    [currentAnalysis, autoRedact, redactionMode]
  );

  useEffect(() => {
    generateDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Regenerate when redaction settings change
  const handleRedactionModeChange = (mode) => {
    setRedactionMode(mode);
    generateDraft(mode);
  };

  // ── Redact preview now ─────────────────────────────────────────────────────
  const handleRedactNow = async () => {
    if (!draftText) return;
    try {
      const res = await api.post("/scamshield/redact", {
        text: draftText,
        replacement: redactionMode,
      });
      const redacted = res?.data?.data?.result?.redactedText ?? draftText;
      setDraftText(redacted);
    } catch {
      Alert.alert("Redaction failed", "Could not redact the draft text.");
    }
  };

  // ── Download draft (write file directly) ───────────────────────────────────
  const handleDownload = async (label = "scamshield-report-draft") => {
    try {
      if (!draftText) {
        Alert.alert("Error", "No draft content to download.");
        return;
      }
      const filename = `${label.replace(/[^a-zA-Z0-9_-]/g, "_")}.txt`;

      if (Platform.OS === "android") {
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted) {
          const directoryUri = permissions.directoryUri;
          const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            directoryUri,
            filename,
            "text/plain"
          );
          await FileSystem.writeAsStringAsync(fileUri, draftText, {
            encoding: FileSystem.EncodingType.UTF8,
          });
          Alert.alert("File Downloaded", "The file was successfully saved to your selected folder.");
        } else {
          Alert.alert("Permission Denied", "Storage permission is required to save the file.");
        }
      } else {
        const fileUri = `${FileSystem.documentDirectory}${filename}`;
        await FileSystem.writeAsStringAsync(fileUri, draftText, {
          encoding: FileSystem.EncodingType.UTF8,
        });
        await Share.share({
          url: fileUri,
          title: label,
        });
      }
    } catch (err) {
      console.warn("Download failed:", err);
      try {
        await Share.share({
          title: label,
          message: draftText,
        });
      } catch {
        Alert.alert("Error", "Could not download or share the draft.");
      }
    }
  };

  // ── Submit all reports ─────────────────────────────────────────────────────
  const handleSubmitAll = async () => {
    if (!privacyConsent) {
      Alert.alert(
        "Consent Required",
        "Please enable Privacy Consent before submitting reports to agencies."
      );
      return;
    }

    if (!currentAnalysis) {
      Alert.alert("No Analysis", "Run a ScamShield analysis first.");
      return;
    }

    setSubmitting(true);
    try {
      const url = currentAnalysis._id
        ? `/scamshield/${currentAnalysis._id}/submit`
        : `/scamshield/submit`;

      const body = {
        destination: AGENCIES.find((a) => a.id === expandedId)?.destination ?? "scamwatch",
        consentToShare: true,
        ...(currentAnalysis._id ? {} : { analysisSnapshot: currentAnalysis }),
      };

      const response = await api.post(url, body);
      setSubmitted(true);

      const reportId =
        response.data?.data?.analysis?.metadata?.linkedReportId ||
        response.data?.data?.analysis?.reportId;

      if (reportId) {
        router.push({
          pathname: "/home/report-submission/evidence-review",
          params: { reportId },
        });
      } else {
        router.push("/home/report-submission/evidence-review");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data?.error ??
        "Report submission failed. Please try again.";
      Alert.alert("Submission Failed", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText="SafeSpeak Analyzer"
        rightText="Cancel"
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* ── Hero card ── */}
        <StyledView className="bg-white rounded-[20px] p-6 mt-5 border border-[#E2E8F0] shadow-sm items-center">
          <StyledText className="text-[#1F2937] text-[22px] font-extrabold text-center leading-7">
            Prefilled Agency Reports
          </StyledText>
          <StyledText className="text-[#6B7280] text-[13px] text-center leading-5 mt-2 px-2">
            Our AI has prefilled these forms based on your conversation analysis.
            Please review each section carefully before submitting to the relevant authorities.
          </StyledText>

          {/* Generated Draft */}
          <StyledView className="w-full mt-5 rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFF] p-4">
            <StyledText className="text-[#7C8DA3] text-[9px] font-bold uppercase tracking-[1.5px] mb-3">
              Generated Draft
            </StyledText>

            {/* Action buttons */}
            <StyledView className="flex-row flex-wrap gap-2 mb-3">
              <StyledTouchableOpacity
                onPress={() => handleDownload()}
                className="flex-row items-center border border-[#D6E2F0] bg-white rounded-full px-3 py-1.5"
              >
                <Ionicons name="download-outline" size={12} color="#37506D" />
                <StyledText className="text-[#37506D] text-[10px] font-semibold ml-1">
                  Download draft
                </StyledText>
              </StyledTouchableOpacity>

              <StyledTouchableOpacity
                onPress={handleRedactNow}
                className="flex-row items-center border border-[#D6E2F0] bg-white rounded-full px-3 py-1.5"
              >
                <Ionicons name="shield-checkmark-outline" size={12} color="#37506D" />
                <StyledText className="text-[#37506D] text-[10px] font-semibold ml-1">
                  Redact preview now
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>

            {/* Draft text */}
            {loadingDraft ? (
              <StyledView className="flex-row items-center py-3">
                <ActivityIndicator size="small" color="#005B96" />
                <StyledText className="text-[#64748B] text-xs ml-2">
                  Generating draft…
                </StyledText>
              </StyledView>
            ) : (
              <StyledText className="text-[#50627A] text-[11px] leading-[17px]">
                {draftText || "No draft generated yet."}
              </StyledText>
            )}

            {/* Backend indicators */}
            {indicators.length > 0 && (
              <StyledText className="text-[#60728A] text-[10px] font-semibold mt-2 leading-4">
                {`Backend indicators: ${indicators.join(", ")}`}
              </StyledText>
            )}
          </StyledView>
        </StyledView>

        {/* ── Agency accordion cards ── */}
        <StyledView className="mt-4 gap-y-3">
          {AGENCIES.map((agency) => {
            const isOpen = expandedId === agency.id;
            return (
              <StyledView
                key={agency.id}
                className="bg-white rounded-[16px] border border-[#E2EAF4] overflow-hidden"
              >
                {/* Accordion header */}
                <StyledTouchableOpacity
                  activeOpacity={0.75}
                  onPress={() => setExpandedId(isOpen ? null : agency.id)}
                  className="flex-row items-center justify-between px-4 py-3.5"
                >
                  <StyledView className="flex-row items-center flex-1">
                    <StyledView
                      className="w-8 h-8 rounded-full items-center justify-center mr-3"
                      style={{ backgroundColor: agency.iconBg }}
                    >
                      <Ionicons name={agency.icon} size={16} color={agency.iconColor} />
                    </StyledView>
                    <StyledText className="text-[#1F2A3A] text-[14px] font-bold flex-1">
                      {agency.title}
                    </StyledText>
                  </StyledView>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-forward"}
                    size={16}
                    color="#8FA0B6"
                  />
                </StyledTouchableOpacity>

                {/* Expanded content */}
                {isOpen && (
                  <StyledView className="border-t border-[#E8EFF8] px-4 pb-4 pt-3">
                    <StyledText className="text-[#50627A] text-[11px] leading-[17px] mb-3">
                      {agency.description}
                    </StyledText>

                    <StyledView className="bg-[#EFF6FF] rounded-[10px] border border-[#DBEAFE] p-3 mb-3">
                      <StyledText className="text-[#1D4F93] text-[11.5px] leading-5 font-medium">
                        {agency.detailText}
                      </StyledText>
                    </StyledView>

                    <StyledView className="flex-row flex-wrap gap-2">
                      <StyledTouchableOpacity
                        onPress={() => handleDownload(agency.downloadLabel)}
                        className="flex-row items-center border border-[#D6E2F0] bg-white rounded-full px-3 py-1.5"
                      >
                        <Ionicons name="download-outline" size={12} color="#37506D" />
                        <StyledText className="text-[#37506D] text-[10px] font-semibold ml-1">
                          {agency.downloadLabel}
                        </StyledText>
                      </StyledTouchableOpacity>

                      <StyledTouchableOpacity
                        onPress={async () => {
                          const supported = await Linking.canOpenURL(agency.guidanceUrl);
                          if (supported) await Linking.openURL(agency.guidanceUrl);
                        }}
                        className="flex-row items-center border border-[#D6E2F0] bg-white rounded-full px-3 py-1.5"
                      >
                        <Ionicons name="open-outline" size={12} color="#37506D" />
                        <StyledText className="text-[#37506D] text-[10px] font-semibold ml-1">
                          {agency.guidanceLabel}
                        </StyledText>
                      </StyledTouchableOpacity>
                    </StyledView>
                  </StyledView>
                )}
              </StyledView>
            );
          })}
        </StyledView>

        {/* ── Auto-redact toggle ── */}
        <StyledView className="bg-white rounded-[16px] border border-[#E2EAF4] p-4 mt-3">
          <StyledView className="flex-row items-center justify-between">
            <StyledView className="flex-1 pr-4">
              <StyledText className="text-[#1F2937] text-[13px] font-bold">
                Auto-redact personal details
              </StyledText>
              <StyledText className="text-[#6B7280] text-[10px] leading-4 mt-0.5">
                Remove emails, phone numbers, amounts, URLs, and transaction
                identifiers from generated report drafts before download or sharing.
              </StyledText>
            </StyledView>
            <Switch
              value={autoRedact}
              onValueChange={(val) => {
                setAutoRedact(val);
                if (val) generateDraft(redactionMode);
              }}
              trackColor={{ false: "#E2E8F0", true: "#F59E0B" }}
              thumbColor="white"
            />
          </StyledView>

          {autoRedact && (
            <StyledView className="flex-row mt-3 gap-x-2">
              <StyledTouchableOpacity
                onPress={() => handleRedactionModeChange("labels")}
                className={`rounded-full px-4 py-1.5 border ${
                  redactionMode === "labels"
                    ? "bg-[#005B96] border-[#005B96]"
                    : "bg-white border-[#D6E2F0]"
                }`}
              >
                <StyledText
                  className={`text-[11px] font-bold ${
                    redactionMode === "labels" ? "text-white" : "text-[#37506D]"
                  }`}
                >
                  Use labels
                </StyledText>
              </StyledTouchableOpacity>
              <StyledTouchableOpacity
                onPress={() => handleRedactionModeChange("mask")}
                className={`rounded-full px-4 py-1.5 border ${
                  redactionMode === "mask"
                    ? "bg-[#005B96] border-[#005B96]"
                    : "bg-white border-[#D6E2F0]"
                }`}
              >
                <StyledText
                  className={`text-[11px] font-bold ${
                    redactionMode === "mask" ? "text-white" : "text-[#37506D]"
                  }`}
                >
                  Mask values
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          )}
        </StyledView>

        {/* ── Privacy consent + Submit ── */}
        <StyledView className="bg-white rounded-[16px] border border-[#E2EAF4] p-4 mt-3">
          <StyledView className="flex-row items-center justify-between">
            <StyledView className="flex-1 pr-4">
              <StyledText className="text-[#1F2937] text-[13px] font-bold">
                Privacy Consent
              </StyledText>
              <StyledText className="text-[#6B7280] text-[10px] leading-4 mt-0.5">
                I authorize SafeSpeak to securely transmit this data to the selected
                agencies in accordance with the Privacy Policy.
              </StyledText>
            </StyledView>
            <Switch
              value={privacyConsent}
              onValueChange={setPrivacyConsent}
              trackColor={{ false: "#E2E8F0", true: "#F59E0B" }}
              thumbColor="white"
            />
          </StyledView>
        </StyledView>

        {/* Submit button */}
        <StyledTouchableOpacity
          activeOpacity={0.85}
          disabled={submitting || submitted}
          onPress={handleSubmitAll}
          className={`rounded-full py-4 flex-row items-center justify-center mt-4 shadow-md ${
            submitted ? "bg-[#22C55E]" : "bg-[#F59E0B]"
          }`}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons
              name={submitted ? "checkmark-circle" : "arrow-forward"}
              size={18}
              color="white"
            />
          )}
          <StyledText className="text-white text-[15px] font-bold ml-2">
            {submitting
              ? "Submitting…"
              : submitted
              ? "Reports Submitted"
              : "Submit All Reports"}
          </StyledText>
        </StyledTouchableOpacity>

        <StyledText className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-[1.5px] text-center mt-3">
          End-to-end encrypted submission
        </StyledText>
      </StyledScrollView>
    </StyledView>
  );
}
