import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../../../components/CustomHeader";
import { useRouter } from "expo-router";
import { useLanguage } from "../../../../context/LanguageContext";
import { useScamShieldStore } from "../../../../store/useScamShieldStore";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const MOCK_RED_FLAGS = (t) => [
  {
    id: 1,
    title: t("urgentLanguage"),
    description: t("urgentLanguageDesc"),
    icon: "warning-outline",
    color: "#FEF3C7",
    iconColor: "#F59E0B",
  },
  {
    id: 2,
    title: t("suspiciousSender"),
    description: t("suspiciousSenderDesc"),
    icon: "at-outline",
    color: "#FEF7E6",
    iconColor: "#F59E0B",
  },
];

const MOCK_ENTITIES = {
  "urls": [],
  "emailAddresses": ["nnadeems@hotmail.com"],
  "phoneNumbers": [],
  "amounts": [],
  "paymentMethods": [],
  "organizations": [],
  "accountTerms": [],
  "cryptoReferences": [],
  "bankReferences": [],
  "transactionIds": [],
  "urlSignals": [],
  "possibleSender": "nnadeems@hotmail.com",
};

const RISK_COLOR = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#22C55E",
  unknown: "#94A3B8",
};

export default function ScamRiskResults() {
  const router = useRouter();
  const { t } = useLanguage();
  const { currentAnalysis } = useScamShieldStore();
  const [headerVisible, setHeaderVisible] = React.useState(true);

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y <= 10) setHeaderVisible(true);
    else if (y > 50) setHeaderVisible(false);
  };

  // ── Derived values (live or mock) ──
  const riskScore = currentAnalysis?.riskScore ?? 85;
  const riskLevel = currentAnalysis?.riskLevel ?? "high";
  const riskColor = RISK_COLOR[riskLevel] ?? RISK_COLOR.unknown;
  const summary = currentAnalysis?.summary ?? t("highRiskDesc");
  const liveRedFlags = currentAnalysis?.redFlags ?? [];
  const mockFlags = MOCK_RED_FLAGS(t);
  const entities = currentAnalysis?.extractedEntities ?? MOCK_ENTITIES;
  const flagCount = liveRedFlags.length > 0 ? liveRedFlags.length : mockFlags.length;

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText={t("scamRiskResults")}
        rightText="Cancel"
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Risk Score Card */}
        <StyledView className="bg-white rounded-[32px] p-7 mt-6 items-center shadow-sm border border-[#F1F5F9]">
          {/* Score */}
          <StyledText
            style={{ color: riskColor }}
            className="text-[72px] font-black leading-[76px]"
          >
            {Math.round(riskScore)}%
          </StyledText>

          {/* Risk Level | Confidence */}
          <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2.5px] mt-1 text-center">
            {riskLevel.toUpperCase()} RISK
            {currentAnalysis?.confidence
              ? ` | ${currentAnalysis.confidence.toUpperCase()} CONFIDENCE`
              : ""}
          </StyledText>

          {/* Bold red AI headline — the summary */}
          {summary ? (
            <StyledText
              style={{ color: riskColor }}
              className="text-[15px] font-extrabold text-center leading-6 mt-5 px-1"
            >
              {summary}
            </StyledText>
          ) : null}

          {/* Lighter gray description (first indicator or summary repeated) */}
          <StyledText className="text-[#64748B] text-xs font-normal text-center leading-[18px] mt-3 px-2">
            {currentAnalysis?.indicators?.[0] ?? summary}
          </StyledText>

          {/* OCR metadata line */}
          {currentAnalysis?.metadata?.extractedTextLength ? (
            <StyledView className="mt-4 flex-row items-center">
              <Ionicons name="scan-outline" size={12} color="#94A3B8" />
              <StyledText className="text-[#94A3B8] text-[11px] font-medium ml-1">
                {`OCR text extracted: ${currentAnalysis.metadata.extractedTextLength} characters`}
              </StyledText>
            </StyledView>
          ) : null}
        </StyledView>

        {/* Extracted Entities Card */}
        <StyledView className="bg-white rounded-[24px] p-5 shadow-sm border border-[#E2E8F0] mt-6">
          <StyledText className="text-[#1F2937] text-base font-bold mb-3">
            Extracted entities
          </StyledText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: "#F8FAFC", borderRadius: 12, borderWidth: 1, borderColor: "#E2E8F0", padding: 16 }}
          >
            <StyledText style={{ fontFamily: "monospace" }} className="text-[#334155] text-[11.5px] leading-5">
              {JSON.stringify(entities, null, 2)}
            </StyledText>
          </ScrollView>
        </StyledView>

        {/* Detected Red Flags Section */}
        <StyledView className="mt-8 mb-4 flex-row justify-between items-center">
          <StyledText className="text-[#1F2937] text-lg font-black">
            {t("detectedRedFlags")}
          </StyledText>
          <StyledView className="bg-[#FEE2E2] px-3 py-1 rounded-full">
            <StyledText className="text-[#EF4444] text-[10px] font-bold uppercase tracking-wider">
              {`Found ${flagCount}`}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Red Flags List — live from API or mock fallback */}
        {liveRedFlags.length > 0
          ? liveRedFlags.map((flag, idx) => (
              <StyledView
                key={idx}
                className="bg-white rounded-[24px] p-5 mb-4 shadow-sm"
              >
                <StyledView className="flex-row items-start">
                  <StyledView className="w-12 h-12 rounded-xl items-center justify-center bg-[#FEF3C7]">
                    <Ionicons name="warning-outline" size={24} color="#F59E0B" />
                  </StyledView>
                  <StyledView className="flex-1 ml-4">
                    <StyledText className="text-[#1F2937] text-base font-bold">
                      {`Red Flag ${idx + 1}`}
                    </StyledText>
                    <StyledText className="text-[#64748B] text-xs font-medium leading-4 mt-1">
                      {flag}
                    </StyledText>
                    <StyledTouchableOpacity
                      onPress={() => router.push("/home/scam-shield/recommended-steps")}
                      className="flex-row items-center mt-3 justify-end"
                    >
                      <StyledText className="text-[#005B96] text-xs font-bold">
                        {t("howToStaySafe")}
                      </StyledText>
                      <Ionicons name="chevron-forward" size={14} color="#005B96" />
                    </StyledTouchableOpacity>
                  </StyledView>
                </StyledView>
              </StyledView>
            ))
          : mockFlags.map((flag) => (
              <StyledView
                key={flag.id}
                className="bg-white rounded-[24px] p-5 mb-4 shadow-sm"
              >
                <StyledView className="flex-row items-start">
                  <StyledView
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: flag.color }}
                  >
                    <Ionicons name={flag.icon} size={24} color={flag.iconColor} />
                  </StyledView>
                  <StyledView className="flex-1 ml-4">
                    <StyledText className="text-[#1F2937] text-base font-bold">
                      {flag.title}
                    </StyledText>
                    <StyledText className="text-[#64748B] text-xs font-medium leading-4 mt-1">
                      {flag.description}
                    </StyledText>
                    <StyledTouchableOpacity
                      onPress={() => router.push("/home/scam-shield/recommended-steps")}
                      className="flex-row items-center mt-3 justify-end"
                    >
                      <StyledText className="text-[#005B96] text-xs font-bold">
                        {t("howToStaySafe")}
                      </StyledText>
                      <Ionicons name="chevron-forward" size={14} color="#005B96" />
                    </StyledTouchableOpacity>
                  </StyledView>
                </StyledView>
              </StyledView>
            ))}

        {/* Report Incident Button */}
        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/home/scam-shield/next-steps")}
          className="bg-[#D32F2F] rounded-full py-4 items-center justify-center flex-row mt-4 shadow-lg"
        >
          <Ionicons name="alert-circle-outline" size={20} color="white" />
          <StyledText className="text-white text-base font-bold ml-3">
            {t("reportThisIncident")}
          </StyledText>
        </StyledTouchableOpacity>

        {/* Stay Protected Card */}
        <StyledView className="mt-8 bg-[#FAFAFA] rounded-[24px] p-5 border border-[#E2E8F0]">
          <StyledView className="flex-row items-center mb-2">
            <Ionicons name="shield-checkmark" size={18} color="#3B82F6" />
            <StyledText className="ml-2 text-[#005B96] font-bold text-sm">
              {t("stayProtected")}
            </StyledText>
          </StyledView>
          <StyledText className="text-[#475569] text-xs font-medium leading-4">
            {t("stayProtectedDesc")}
          </StyledText>

          <StyledView className="mt-5 bg-[#FEFCE8] p-3 rounded-xl border border-[#FEF08A]">
            <StyledText className="text-[#A16207] text-[9px] font-bold text-center leading-4">
              {t("legalInformationDisclaimer")}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
