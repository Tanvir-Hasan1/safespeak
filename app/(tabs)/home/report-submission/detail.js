import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
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

export default function ReportDetail() {
  const router = useRouter();
  const { t } = useLanguage();

  const isDraggingRef = React.useRef(false);
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
        backText={t("reportOverview")}
        rightText={t("cancel")}
        blueTheme={false}
        showDivider={true}
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 45, paddingTop: 16 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Card 1: Narrative & Base Details */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-sm mb-6">
          {/* Incident Narrative Header */}
          <StyledText className="text-[#005B96] text-[10px] font-extrabold tracking-wider uppercase mb-1.5">
            {t("incidentNarrative")}
          </StyledText>
          <StyledText className="text-[#0F172A] text-[22px] font-bold mb-3.5 leading-7">
            {t("harassmentTitle")}
          </StyledText>

          {/* Top Status Badge */}
          <StyledView className="bg-[#FEF3C7] px-3 py-1 rounded-full self-start mb-5 flex-row items-center">
            <StyledText className="text-[#D97706] text-[10px] font-extrabold uppercase">
              • {t("draftStatusLabel")}
            </StyledText>
          </StyledView>

          {/* Narrative Quote Block */}
          <StyledView className="bg-white border border-[#EBF3FC] rounded-[20px] p-5 mb-6">
            <StyledText className="text-[#475569] text-sm italic font-medium leading-5">
              {t("incidentNarrativeText")}
            </StyledText>
          </StyledView>

          {/* ID Box */}
          <StyledView className="bg-white rounded-[20px] p-4.5 mb-4 border border-[#EBF3FC]">
            <StyledText className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-wider mb-1">
              {t("reportId")}
            </StyledText>
            <StyledText className="text-[#0F172A] text-sm font-extrabold">
              SSR-20260704-OQHO2T3K
            </StyledText>
          </StyledView>

          {/* Created Box */}
          <StyledView className="bg-white rounded-[20px] p-4.5 mb-4 border border-[#EBF3FC]">
            <StyledText className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-wider mb-1">
              {t("createdLabel")}
            </StyledText>
            <StyledText className="text-[#0F172A] text-sm font-extrabold">
              05 July 2026, 1:28 am
            </StyledText>
          </StyledView>

          {/* Status Box */}
          <StyledView className="bg-white rounded-[20px] p-4.5 mb-6 border border-[#EBF3FC]">
            <StyledText className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-wider mb-2">
              {t("statusLabel")}
            </StyledText>
            <StyledView className="bg-[#FEF3C7] px-2.5 py-1 rounded-full self-start flex-row items-center">
              <StyledText className="text-[#D97706] text-[10px] font-extrabold uppercase">
                • {t("draftStatusLabel")}
              </StyledText>
            </StyledView>
          </StyledView>

          {/* Lifecycle Controls */}
          <StyledView className="bg-[#F8FAFC] rounded-[24px] p-5 border border-[#E2E8F0]/50">
            <StyledText className="text-[#005B96] text-xs font-bold uppercase tracking-wider mb-1.5">
              {t("lifecycleControls")}
            </StyledText>
            <StyledText className="text-[#64748B] text-xs leading-4 mb-4">
              {t("lifecycleDesc")}
            </StyledText>

            {/* Action Buttons (safely formatted) */}
            <StyledView className="flex-row flex-wrap">
              <StyledTouchableOpacity className="bg-white border border-[#E2E8F0] px-3.5 py-2 rounded-full flex-row items-center mr-2 mb-2">
                <Ionicons name="document-text-outline" size={14} color="#64748B" />
                <StyledText className="text-[#64748B] text-[11px] font-bold ml-1.5">
                  {t("withdraw")}
                </StyledText>
              </StyledTouchableOpacity>

              <StyledTouchableOpacity className="bg-white border border-[#E2E8F0] px-3.5 py-2 rounded-full flex-row items-center mr-2 mb-2">
                <Ionicons name="bookmark-outline" size={14} color="#64748B" />
                <StyledText className="text-[#64748B] text-[11px] font-bold ml-1.5">
                  {t("markInfoOnly")}
                </StyledText>
              </StyledTouchableOpacity>

              <StyledTouchableOpacity className="bg-[#FFF1F1] border border-[#FEE2E2] px-3.5 py-2 rounded-full flex-row items-center mr-2 mb-2">
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
                <StyledText className="text-[#EF4444] text-[11px] font-bold ml-1.5">
                  {t("requestDeletion")}
                </StyledText>
              </StyledTouchableOpacity>

              <StyledTouchableOpacity className="bg-[#FFF1F1] border border-[#FEE2E2] px-3.5 py-2 rounded-full flex-row items-center mb-2">
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
                <StyledText className="text-[#EF4444] text-[11px] font-bold ml-1.5">
                  {t("delete")}
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Card 2: Status Timeline */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-sm mb-6">
          {/* Status Timeline */}
          <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider mb-3">
            {t("statusTimeline")}
          </StyledText>
          <StyledView className="bg-white border border-[#E2E8F0] rounded-[20px] p-4.5">
            <StyledText className="text-[#0F172A] text-sm font-bold mb-1">
              {t("draftStatusLabel")}
            </StyledText>
            <StyledText className="text-[#64748B] text-xs">
              {t("draftCreatedTimeline")}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Card 3: Submission Records */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-sm mb-6">
          {/* Submission Records */}
          <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider mb-3">
            {t("submissionRecords")}
          </StyledText>
          <StyledText className="text-[#64748B] text-xs leading-4 font-semibold px-1">
            {t("noSubmissionRecords")}
          </StyledText>
        </StyledView>

        {/* Card 3: Metadata Details */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-sm mb-6">
          <StyledText className="text-[#005B96] text-xs font-bold uppercase tracking-wider mb-4">
            {t("reportMetadata")}
          </StyledText>

          {/* Last Update & Support Key Grid */}
          <StyledView className="flex-row mb-4">
            <StyledView className="bg-[#F8FAFC] rounded-[20px] p-4 border border-[#E2E8F0]/30 flex-1 mr-2">
              <StyledText className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-wider mb-1">
                {t("lastUpdate")}
              </StyledText>
              <StyledText className="text-[#0F172A] text-xs font-bold">
                05 July 2026, 1:28 am
              </StyledText>
            </StyledView>

            <StyledView className="bg-[#F8FAFC] rounded-[20px] p-4 border border-[#E2E8F0]/30 flex-1 ml-2">
              <StyledText className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-wider mb-1">
                {t("supportKey")}
              </StyledText>
              <StyledText className="text-[#0F172A] text-xs font-extrabold">
                cae28d
              </StyledText>
            </StyledView>
          </StyledView>

          {/* Location Box */}
          <StyledView className="bg-[#F8FAFC] rounded-[20px] p-4 border border-[#E2E8F0]/30 mb-5">
            <StyledText className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-wider mb-1">
              {t("locationLabel")}
            </StyledText>
            <StyledText className="text-[#0F172A] text-xs font-bold">
              {t("locationValue")}
            </StyledText>
          </StyledView>

          {/* Map Preview (Light green placeholder box) */}
          <StyledView className="bg-[#D1E7DD]/55 rounded-[24px] h-48 border border-[#A3CFBB] relative overflow-hidden items-start justify-end p-4">
            <StyledView className="bg-white px-3 py-1.5 rounded-full shadow-xs">
              <StyledText className="text-[#0F172A] text-[11px] font-bold">
                {t("locationValue")}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Bottom Actions */}
        <StyledTouchableOpacity
          activeOpacity={0.8}
          className="bg-[#005B96] rounded-full py-4 flex-row items-center justify-center w-full mb-3.5 shadow-sm"
        >
          <StyledText className="text-white font-bold text-sm">
            {t("editReport")}
          </StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          activeOpacity={0.8}
          className="bg-[#FF8A00] rounded-full py-4 flex-row items-center justify-center w-full mb-3.5 shadow-sm"
        >
          <StyledText className="text-white font-bold text-sm">
            {t("proceedSubmission")}
          </StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          activeOpacity={0.8}
          className="bg-white border border-[#E2E8F0] rounded-full py-4 flex-row items-center justify-center w-full shadow-xs"
        >
          <Ionicons name="time-outline" size={16} color="#475569" style={{ marginRight: 6 }} />
          <StyledText className="text-[#475569] font-bold text-sm">
            {t("submissionHistory")}
          </StyledText>
        </StyledTouchableOpacity>
      </StyledScrollView>
    </StyledView>
  );
}
