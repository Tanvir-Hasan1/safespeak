import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../../../components/CustomHeader";
import { useRouter } from "expo-router";
import { useLanguage } from "../../../../context/LanguageContext";
import { useScamShieldStore } from "../../../../store/useScamShieldStore";
import api from "../../../../context/api";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

// ── External agency URLs ─────────────────────────────────────────────────────
const AGENCY_URLS = {
  bank: "https://www.afca.org.au/make-a-complaint",
  accc: "https://www.scamwatch.gov.au/report-a-scam",
  reportCyber: "https://www.cyber.gov.au/report-and-recover/report",
};

const AGENCIES = [
  {
    id: "bank",
    icon: "business-outline",
    iconBg: "#FFF3DF",
    iconColor: "#EF7D00",
    title: "Contact Your Bank",
    badge: null,
    body: "If you have lost money, shared your card details, or think someone can access your account, contact your bank immediately to freeze your accounts.",
    secondary:
      "This appears to be a live phishing/scareware-style payment/renewal scam claiming your protection expires today and urging you to update payment details. It uses urgency and fear to pressure action, but provides no legitimate organization details.",
    ctaLabel: "Call Fraud Department",
    ctaUrl: AGENCY_URLS.bank,
    destination: "bank",
  },
  {
    id: "accc",
    icon: "hammer-outline",
    iconBg: "#FFF3DF",
    iconColor: "#EF7D00",
    title: "Report to ACCC Scamwatch",
    badge: "COMMUNITY PREVENTION",
    body: "Choose this if you have not lost money, but want the government to be aware of a scam.",
    secondary:
      "Do not click any buttons/links or provide payment details in response to this message.",
    ctaLabel: "Launch Report Tool",
    ctaUrl: AGENCY_URLS.accc,
    destination: "scamwatch",
  },
  {
    id: "reportCyber",
    icon: "shield-outline",
    iconBg: "#FFF3DF",
    iconColor: "#EF7D00",
    title: "Report to ReportCyber",
    badge: null,
    body: "Report here if you clicked a link, shared personal details, lost money, or believe your identity or accounts are at risk.",
    secondary:
      "Verify independently by going to the provider's official website/app (typed manually) or checking your bank/credit card statement for legitimate charges.",
    ctaLabel: "Launch Report Tool",
    ctaUrl: AGENCY_URLS.reportCyber,
    destination: "reportCyber",
  },
];

export default function NextSteps() {
  const router = useRouter();
  const { t } = useLanguage();
  const { currentAnalysis } = useScamShieldStore();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [draftSummary, setDraftSummary] = useState("");
  const [generatingDraft, setGeneratingDraft] = useState(false);

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y <= 10) setHeaderVisible(true);
    else if (y > 50) setHeaderVisible(false);
  };

  // ── Auto-generate report draft when we have an analysis ──────────────────
  useEffect(() => {
    if (!currentAnalysis) return;

    let isActive = true;
    setGeneratingDraft(true);

    const body = currentAnalysis._id
      ? { autoRedactPII: true, redactionMode: "labels" }
      : { analysisSnapshot: currentAnalysis, autoRedactPII: true, redactionMode: "labels" };

    const url = currentAnalysis._id
      ? `/scamshield/${currentAnalysis._id}/generate-report-draft`
      : `/scamshield/generate-report-draft`;

    api
      .post(url, body)
      .then((res) => {
        if (!isActive) return;
        const draft = res?.data?.data?.analysis;
        const text =
          draft?.draftReport?.draft ??
          draft?.draftReport?.summary ??
          currentAnalysis?.summary ??
          "";
        setDraftSummary(text);
      })
      .catch(() => {
        if (isActive) setDraftSummary(currentAnalysis?.summary ?? "");
      })
      .finally(() => {
        if (isActive) setGeneratingDraft(false);
      });

    return () => {
      isActive = false;
    };
  }, [currentAnalysis]);

  // ── Navigate to agency report page ──────────────────────────────────────
  const handleGoToAgencyReport = (agency) => {
    router.push(`/home/scam-shield/agency-report?agency=${agency.id}`);
  };

  // ── Open URL without submitting ──────────────────────────────────────────
  const openUrl = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Cannot open link", url);
    }
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText="Next Steps"
        rightText="Cancel"
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Draft summary card */}
        {(generatingDraft || draftSummary) ? (
          <StyledView className="bg-white rounded-[20px] p-5 mt-6 border border-[#E2E8F0] shadow-sm">
            <StyledText className="text-[#7C8DA3] text-[10px] font-bold uppercase tracking-[1.5px] mb-2">
              Generated Draft
            </StyledText>
            {generatingDraft ? (
              <StyledView className="flex-row items-center py-2">
                <ActivityIndicator size="small" color="#005B96" />
                <StyledText className="text-[#64748B] text-xs ml-2">
                  Preparing report draft…
                </StyledText>
              </StyledView>
            ) : (
              <StyledText className="text-[#334155] text-[12px] leading-5">
                {draftSummary}
              </StyledText>
            )}
          </StyledView>
        ) : null}

        {/* Agency Cards */}
        <StyledView className="mt-5 gap-y-4">
          {AGENCIES.map((agency) => (
            <StyledView
              key={agency.id}
              className="bg-white rounded-[24px] p-5 border border-[#E2E8F0] shadow-sm"
            >
              {/* Header row */}
              <StyledView className="flex-row items-center mb-3">
                <StyledView
                  className="w-10 h-10 rounded-full items-center justify-center mr-3"
                  style={{ backgroundColor: agency.iconBg }}
                >
                  <Ionicons name={agency.icon} size={20} color={agency.iconColor} />
                </StyledView>
                <StyledView className="flex-1">
                  <StyledText className="text-[#1F2937] text-[15px] font-extrabold leading-5">
                    {agency.title}
                  </StyledText>
                  {agency.badge ? (
                    <StyledView className="mt-1 self-start bg-[#EFF6FF] px-2 py-0.5 rounded-full">
                      <StyledText className="text-[#2D66B0] text-[9px] font-bold uppercase tracking-wider">
                        {agency.badge}
                      </StyledText>
                    </StyledView>
                  ) : null}
                </StyledView>
              </StyledView>

              {/* Body text */}
              <StyledText className="text-[#6B7280] text-[12.5px] leading-5 mb-2">
                {agency.body}
              </StyledText>
              <StyledText className="text-[#1F2937] text-[12px] font-bold leading-5 mb-5">
                {agency.secondary}
              </StyledText>

              {/* CTA Button */}
              <StyledTouchableOpacity
                activeOpacity={0.82}
                onPress={() => handleGoToAgencyReport(agency)}
                className="bg-[#F59E0B] rounded-full py-[14px] flex-row items-center justify-center shadow-sm"
              >
                <Ionicons name="open-outline" size={16} color="white" />
                <StyledText className="text-white text-sm font-bold ml-2">
                  {agency.ctaLabel}
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          ))}
        </StyledView>

        {/* Stay Protected */}
        <StyledView className="mt-6 bg-[#EFF6FF] rounded-[20px] p-4 border border-[#DBEAFE]">
          <StyledView className="flex-row items-center mb-2">
            <Ionicons name="shield-checkmark" size={16} color="#2D66B0" />
            <StyledText className="ml-2 text-[#1D4F93] font-bold text-sm">
              Stay Protected
            </StyledText>
          </StyledView>
          <StyledText className="text-[#4B607D] text-[11px] leading-4">
            Use official government or bank channels only. Never pay to recover money and avoid sharing personal details with unverified parties.
          </StyledText>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
