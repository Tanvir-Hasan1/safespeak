import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";

import { useLanguage } from "../../../../context/LanguageContext";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function TriageExplanation() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title={t("triageExplanation")} showCancel={true} />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <StyledView className="mt-4 mb-6">
          <StyledText className="text-[#005B96] text-2xl font-bold">
            {t("triageExplanation")}
          </StyledText>
        </StyledView>

        {/* Main Card */}
        <StyledView className="bg-white rounded-[40px] p-8 items-center shadow-sm mb-8">
          <StyledText className="text-[#005B96] text-3xl font-light mb-4 text-center">
            {t("safe")}
            {t("speak")}
          </StyledText>
          <StyledView className="w-full h-[1px] bg-[#E2E8F0] mb-4" />
          <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mb-1">
            {t("incidentClassification")}
          </StyledText>
          <StyledText className="text-[#005B96] text-2xl font-bold text-center mb-6">
            {t("mentalHealthSupport")}
          </StyledText>
          <StyledText className="text-[#64748B] text-sm text-center leading-5 mb-2">
            {t("triageDesc")}
          </StyledText>
          <StyledText className="text-[#94A3B8] text-xs italic text-center">
            {t("aiAssessmentDisclaimer")}
          </StyledText>
        </StyledView>

        <StyledText className="text-[#94A3B8] text-xs text-center mb-8 px-4">
          {t("legalAdviceDisclaimer")}
        </StyledText>

        {/* Recommended Steps */}
        <StyledView className="flex-row items-center justify-between mb-4">
          <StyledText className="text-[#1F2937] text-lg font-bold">
            {t("recommendedSteps")}
          </StyledText>
          <StyledTouchableOpacity>
            <StyledText className="text-[#94A3B8] text-xs">
              {t("saveToHistory")}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/home/report-submission/recommendations")}
          className="bg-white rounded-[24px] p-4 flex-row items-center justify-between shadow-sm mb-6"
        >
          <StyledView className="flex-row items-center">
            <StyledView
              className="w-12 h-12 rounded-2xl items-center justify-center"
              style={{ backgroundColor: "#FFEDD5" }}
            >
              <Ionicons name="body-outline" size={24} color="#FB923C" />
            </StyledView>
            <StyledView className="ml-4">
              <StyledText className="text-[#1F2937] text-base font-bold">
                {t("feelingStressed")}
              </StyledText>
              <StyledText className="text-[#94A3B8] text-xs">
                {t("mindfulnessGrounding")}
              </StyledText>
            </StyledView>
          </StyledView>
          <Ionicons name="arrow-forward" size={20} color="#94A3B8" />
        </StyledTouchableOpacity>

        {/* Action Grid 1 */}
        <StyledView className="flex-row space-x-4 mb-6">
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push("/home/report-submission/recommendations")
            }
            className="flex-1 bg-[#005B96] rounded-[32px] p-6 justify-between h-40"
          >
            <StyledView className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
              <Ionicons name="people-outline" size={20} color="white" />
            </StyledView>
            <StyledView>
              <StyledText className="text-white text-lg font-bold">
                {t("worriedForOthers")}
              </StyledText>
              <StyledText className="text-white/70 text-xs">
                {t("howToAskHelp")}
              </StyledText>
            </StyledView>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              router.push("/home/report-submission/recommendations")
            }
            className="flex-1 bg-[#005B96] rounded-[32px] p-6 justify-between h-40"
          >
            <StyledView className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
              <Ionicons name="book-outline" size={20} color="white" />
            </StyledView>
            <StyledView>
              <StyledText className="text-white text-lg font-bold">
                {t("selfHelpLibrary")}
              </StyledText>
              <StyledText className="text-white/70 text-xs">
                {t("toolsGuides")}
              </StyledText>
            </StyledView>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Your Safety */}
        <StyledText className="text-[#1F2937] text-lg font-bold mb-4">
          {t("yourSafety")}
        </StyledText>

        <StyledView className="flex-row space-x-4">
          <StyledView className="flex-1 bg-[#FFF1F1] rounded-[40px] p-5 border border-[#FEE2E2]">
            <StyledView className="w-10 h-10 bg-[#FF5A5A] rounded-full items-center justify-center mb-3">
              <Ionicons name="shield-outline" size={20} color="white" />
            </StyledView>
            <StyledText className="text-[#1F2937] text-lg font-bold mb-1">
              {t("dontFeelSafe")}
            </StyledText>
            <StyledText className="text-[#64748B] text-[11px] leading-4 mb-3">
              {t("immediateDanger")}
            </StyledText>
            <StyledTouchableOpacity
              onPress={() => Linking.openURL("tel:000")}
              className="bg-[#FF5A5A] rounded-2xl py-3 flex-row items-center justify-center"
            >
              <Ionicons name="call" size={16} color="white" />
              <StyledText className="text-white font-bold ml-2">
                {t("call000")}
              </StyledText>
            </StyledTouchableOpacity>
            <StyledText className="text-[#94A3B8] text-[10px] text-center mt-2">
              {t("stayOnScreen")}
            </StyledText>
          </StyledView>

          <StyledView className="flex-1">
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home/report-submission/attachments")}
              className="bg-[#005B96] rounded-[32px] p-5 justify-between flex-1 mb-4"
            >
              <Ionicons name="lock-closed-outline" size={20} color="white" />
              <StyledView>
                <StyledText className="text-white text-base font-bold">
                  {t("eSafety")}
                </StyledText>
                <StyledText className="text-white/70 text-[10px]">
                  {t("onlineAbuseRemoval")}
                </StyledText>
              </StyledView>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home/report-submission/attachments")}
              className="bg-[#005B96] rounded-[32px] p-5 justify-between flex-1"
            >
              <Ionicons name="headset-outline" size={20} color="white" />
              <StyledView>
                <StyledText className="text-white text-base font-bold">
                  {t("counseling")}
                </StyledText>
                <StyledText className="text-white/70 text-[10px]">
                  {t("crisisSupport247")}
                </StyledText>
              </StyledView>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        <StyledText className="text-[#94A3B8] text-[10px] text-center mt-10 leading-4">
          {t("toolSupportDisclaimer")}
        </StyledText>
      </StyledScrollView>
    </StyledView>
  );
}
