import React, { useState } from "react";
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

  const [headerVisible, setHeaderVisible] = useState(true);

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    if (currentOffsetY <= 10) {
      if (!headerVisible) setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      if (headerVisible) setHeaderVisible(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        backText={t("triageExplanation")}
        rightText={t("cancel")}
        blueTheme={true}
        showDivider={true}
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <StyledView className="mt-4 mb-6">
          <StyledText className="text-[#002B49] text-2xl font-bold">
            {t("triageExplanation")}
          </StyledText>
          <StyledText className="text-[#64748B] text-sm mt-1">
            {t("triageSubtitle")}
          </StyledText>
        </StyledView>

        {/* Main Card */}
        <StyledView className="bg-white rounded-[40px] p-8 items-center shadow-sm mb-8 overflow-hidden relative pt-20">
          {/* Top Curved Semi-Circle */}
          <StyledView className="absolute -top-24 left-0 right-0 items-center">
            <StyledView className="w-48 h-48 bg-[#EFF6FF] rounded-full items-center justify-end pb-5">
              <Ionicons name="fitness-outline" size={24} color="#005B96" />
            </StyledView>
          </StyledView>

          <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mb-2">
            {t("incidentClassification")}
          </StyledText>
          <StyledText className="text-[#005B96] text-[28px] font-bold text-center mb-6 leading-9">
            {t("reviewYourOptions")}
          </StyledText>
          <StyledView className="w-16 h-1 bg-[#E2E8F0]/80 rounded-full mb-6" />
          <StyledText className="text-[#64748B] text-[15px] text-center leading-6 mb-5 px-2">
            {t("triageDesc")}
          </StyledText>
          <StyledText className="text-[#94A3B8] text-xs italic text-center mb-2">
            {t("aiAssessmentDisclaimer")}
          </StyledText>
        </StyledView>

        <StyledText className="text-[#94A3B8] text-xs text-center mb-8 px-4">
          {t("legalAdviceDisclaimer")}
        </StyledText>

        {/* Your Control Card */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-xs mb-6">
          <StyledText className="text-[#005B96] text-xs font-bold uppercase tracking-wider mb-3">
            {t("yourControl")}
          </StyledText>
          <StyledText className="text-[#64748B] text-[14px] leading-5 mb-3 font-semibold">
            {t("yourControlDesc")}
          </StyledText>
          <StyledText className="text-[#94A3B8] text-xs leading-4">
            {t("yourControlSub")}
          </StyledText>
        </StyledView>

        {/* Why This Path Card */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-xs mb-6">
          <StyledText className="text-[#005B96] text-xs font-bold uppercase tracking-wider mb-3">
            {t("whyThisPath")}
          </StyledText>
          <StyledText className="text-[#64748B] text-[14px] leading-5 font-semibold">
            {t("whyThisPathDesc")}
          </StyledText>
        </StyledView>

        {/* Possible Pathways Card */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-xs mb-8">
          <StyledText className="text-[#005B96] text-xs font-bold uppercase tracking-wider mb-3">
            {t("possiblePathways")}
          </StyledText>
          <StyledText className="text-[#64748B] text-[14px] leading-5 mb-5 font-semibold">
            {t("possiblePathwaysDesc")}
          </StyledText>
          
          {/* Inner grey box */}
          <StyledView className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0]/50">
            <StyledText className="text-[#0F172A] text-sm font-bold mb-1">
              {t("generalSupportOptions")}
            </StyledText>
            <StyledText className="text-[#64748B] text-xs leading-4">
              {t("generalSupportOptionsDesc")}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Prepare For This Pathway Card */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-xs mb-6">
          <StyledText className="text-[#005B96] text-xs font-bold uppercase tracking-wider mb-3">
            {t("preparePathway")}
          </StyledText>
          <StyledText className="text-[#64748B] text-[14px] leading-5 mb-5 font-semibold">
            {t("preparePathwayDesc")}
          </StyledText>
          
          <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider mb-2">
            {t("whatAskNext")}
          </StyledText>
          <StyledView className="flex-row mb-5">
            <StyledView className="bg-[#EFF6FF] px-4 py-2 rounded-full border border-[#D0E3FF]">
              <StyledText className="text-[#005B96] text-xs font-bold">
                {t("shortSummary")}
              </StyledText>
            </StyledView>
          </StyledView>

          <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider mb-2">
            {t("helpfulAvailable")}
          </StyledText>
          <StyledView className="flex-row">
            <StyledView className="bg-[#F1F5F9] px-4 py-2 rounded-full border border-[#E2E8F0]">
              <StyledText className="text-[#475569] text-xs font-bold">
                {t("datesTiming")}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Report Draft Status Card */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-xs mb-8">
          <StyledText className="text-[#005B96] text-xs font-bold uppercase tracking-wider mb-3">
            {t("reportDraftStatus")}
          </StyledText>
          <StyledText className="text-[#64748B] text-[14px] leading-5 mb-5 font-semibold">
            {t("reportDraftStatusDesc")}
          </StyledText>

          {/* Status Box */}
          <StyledView className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0]/50 mb-4">
            <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider mb-1.5">
              {t("statusLabel")}
            </StyledText>
            <StyledText className="text-[#0F172A] text-[18px] font-extrabold mb-1">
              {t("draftLabel")}
            </StyledText>
            <StyledText className="text-[#64748B] text-xs leading-4">
              {t("statusDesc")}
            </StyledText>
          </StyledView>

          {/* Still Missing Box */}
          <StyledView className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0]/50">
            <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider mb-1.5">
              {t("stillMissingLabel")}
            </StyledText>
            <StyledText className="text-[#64748B] text-xs leading-4">
              {t("missingItems")}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Recommended Steps */}
        <StyledView className="flex-row items-center justify-between mb-4 mt-2">
          <StyledText className="text-[#0F172A] text-xl font-bold">
            {t("recommendedSteps")}
          </StyledText>
          <StyledTouchableOpacity onPress={() => router.push("/home/report-submission/history")}>
            <StyledText className="text-[#94A3B8] text-xs font-semibold">
              {t("viewHistory")}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Card 1: Check or edit the key facts */}
        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/home/incident-builder/assistant")}
          className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-xs mb-6 flex-row items-center justify-between"
        >
          <StyledView className="flex-row items-center flex-1 mr-2">
            <StyledView className="w-12 h-12 rounded-full bg-[#FFF7ED] items-center justify-center mr-4">
              <Ionicons name="briefcase-outline" size={20} color="#EA580C" />
            </StyledView>
            <StyledView className="flex-1">
              <StyledText className="text-[#0F172A] text-[15px] font-bold mb-1">
                {t("checkKeyFacts")}
              </StyledText>
              <StyledText className="text-[#64748B] text-[12px] leading-4">
                {t("checkKeyFactsDesc")}
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledView className="w-8 h-8 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] items-center justify-center">
            <Ionicons name="arrow-forward" size={16} color="#64748B" />
          </StyledView>
        </StyledTouchableOpacity>

        {/* Card 2: Immediate danger */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-xs mb-6">
          <StyledView className="flex-row items-start mb-4">
            <StyledView className="w-12 h-12 rounded-full bg-[#FFF1F1] items-center justify-center mr-4">
              <Ionicons name="shield-outline" size={20} color="#EF4444" />
            </StyledView>
            <StyledView className="flex-1">
              <StyledText className="text-[#0F172A] text-[15px] font-bold mb-1">
                {t("immediateDangerTitle")}
              </StyledText>
              <StyledText className="text-[#64748B] text-[12px] leading-4 mb-2">
                {t("immediateDangerDesc")}
              </StyledText>
              <StyledText className="text-[#94A3B8] text-[11px] leading-4">
                {t("immediateDangerSub")}
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => Linking.openURL("tel:000")}
            className="bg-[#FF8A00] rounded-3xl py-3.5 flex-row items-center justify-center w-full shadow-xs"
          >
            <StyledText className="text-white font-bold text-sm mr-2">
              {t("call000Label")}
            </StyledText>
            <Ionicons name="call" size={16} color="white" />
          </StyledTouchableOpacity>
        </StyledView>

        {/* Card 3: Review broad support options */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-xs mb-6">
          <StyledView className="flex-row items-start mb-4">
            <StyledView className="w-12 h-12 rounded-full bg-[#EFF6FF] items-center justify-center mr-4">
              <Ionicons name="hammer-outline" size={20} color="#3B82F6" />
            </StyledView>
            <StyledView className="flex-1">
              <StyledText className="text-[#0F172A] text-[15px] font-bold mb-1">
                {t("reviewSupportTitle")}
              </StyledText>
              <StyledText className="text-[#64748B] text-[12px] leading-4 mb-2">
                {t("reviewSupportDesc")}
              </StyledText>
              <StyledText className="text-[#94A3B8] text-[11px] leading-4">
                {t("reviewSupportSub")}
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/home/report-submission/recommendations")}
            className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-3xl py-3.5 flex-row items-center justify-center w-full"
          >
            <StyledText className="text-[#475569] font-bold text-sm mr-2">
              {t("reviewOptionsLabel")}
            </StyledText>
            <Ionicons name="arrow-forward" size={16} color="#475569" />
          </StyledTouchableOpacity>
        </StyledView>

        {/* Card 4: Get support if this feels overwhelming */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-xs mb-8">
          <StyledView className="flex-row items-start mb-4">
            <StyledView className="w-12 h-12 rounded-full bg-[#E6F4EA] items-center justify-center mr-4">
              <Ionicons name="headset-outline" size={20} color="#137333" />
            </StyledView>
            <StyledView className="flex-1">
              <StyledText className="text-[#0F172A] text-[15px] font-bold mb-1">
                {t("getSupportOverwhelmingTitle")}
              </StyledText>
              <StyledText className="text-[#64748B] text-[12px] leading-4 mb-2">
                {t("getSupportOverwhelmingDesc")}
              </StyledText>
              <StyledText className="text-[#94A3B8] text-[11px] leading-4">
                {t("getSupportOverwhelmingSub")}
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/home/get-support")}
            className="bg-[#F1F5F9] border border-[#E2E8F0] rounded-3xl py-3.5 flex-row items-center justify-center w-full"
          >
            <StyledText className="text-[#475569] font-bold text-sm mr-2">
              {t("findSupportLabel")}
            </StyledText>
            <Ionicons name="arrow-forward" size={16} color="#475569" />
          </StyledTouchableOpacity>
        </StyledView>

        {/* Suggested Guides Section */}
        <StyledView className="mb-6">
          <StyledText className="text-[#0F172A] text-xl font-bold mb-1">
            {t("suggestedGuides")}
          </StyledText>
          <StyledText className="text-[#64748B] text-xs mb-4 font-semibold">
            {t("matchedTriageProfile")}
          </StyledText>
          <StyledView className="border border-dashed border-[#CBD5E1] bg-white rounded-[24px] p-6">
            <StyledText className="text-[#64748B] text-[13px] leading-5 text-left font-semibold">
              {t("noGuidesSuggested")}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Additional Safety Resources Section */}
        <StyledView className="mb-8">
          <StyledText className="text-[#0F172A] text-xl font-bold mb-4">
            {t("additionalSafetyResources")}
          </StyledText>
          <StyledView className="border border-dashed border-[#CBD5E1] bg-white rounded-[24px] p-6">
            <StyledText className="text-[#64748B] text-[13px] leading-5 text-left font-semibold">
              {t("noResourcesMatched")}
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledText className="text-[#94A3B8] text-[10px] text-center mt-10 leading-4">
          {t("safespeakDisclaimer")}
        </StyledText>
      </StyledScrollView>
    </StyledView>
  );
}
