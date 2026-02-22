import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../../components/CustomHeader";

import { useLanguage } from "../../../../../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const { width } = Dimensions.get("window");

export default function ReportOverview() {
  const router = useRouter();
  const { t } = useLanguage();
  const [language, setLanguage] = useState("Original");

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title={t("reportOverview")} />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header Info */}
        <StyledView className="flex-row justify-between items-center mt-6">
          <StyledText className="text-[#3B82F6] text-[10px] font-bold tracking-widest uppercase">
            {t("ref")} #SR-2024-8821
          </StyledText>
          <StyledView className="bg-[#FEE2E2] px-3 py-1 rounded-lg">
            <StyledText className="text-[#EF4444] text-[10px] font-bold uppercase">
              {t("highPriority")}
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledText className="text-[#002B49] text-2xl font-bold mt-2">
          {t("incidentNarrative")}
        </StyledText>

        {/* Language Tabs */}
        <StyledView className="flex-row bg-white/40 rounded-full p-1 mt-6 border border-white">
          <StyledTouchableOpacity
            onPress={() => setLanguage("Original")}
            className={`flex-1 py-3 rounded-full items-center ${
              language === "Original" ? "bg-white shadow-sm" : ""
            }`}
          >
            <StyledText
              className={`text-sm font-bold ${
                language === "Original" ? "text-[#3B82F6]" : "text-[#94A3B8]"
              }`}
            >
              {t("originalLanguage")}
            </StyledText>
          </StyledTouchableOpacity>
          <StyledTouchableOpacity
            onPress={() => setLanguage("English")}
            className={`flex-1 py-3 rounded-full items-center ${
              language === "English" ? "bg-white shadow-sm" : ""
            }`}
          >
            <StyledText
              className={`text-sm font-bold ${
                language === "English" ? "text-[#3B82F6]" : "text-[#94A3B8]"
              }`}
            >
              {t("englishTranslation")}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Narrative Card */}
        <StyledView className="bg-white rounded-[32px] p-6 mt-6 shadow-sm border border-[#E2E8F0]">
          <StyledText className="text-[#475569] text-base leading-7">
            "I was walking through the main terminal at 8:30 PM when I noticed
            two individuals following me closely. They were making derogatory
            comments in a low voice. I felt unsafe and decided to enter a nearby
            store to seek help. This happened near Gate B12. I noticed one was
            wearing a dark blue jacket."
          </StyledText>
        </StyledView>

        {/* Metadata Section */}
        <StyledView className="mt-10">
          <StyledView className="flex-row items-center mb-6">
            <Ionicons
              name="information-circle-outline"
              size={24}
              color="#3B82F6"
            />
            <StyledText className="text-[#002B49] text-xl font-bold ml-2">
              {t("reportMetadata")}
            </StyledText>
          </StyledView>

          <StyledView className="flex-row flex-wrap gap-y-6">
            <StyledView className="w-1/2">
              <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mb-1">
                {t("dateTime")}
              </StyledText>
              <StyledText className="text-[#002B49] text-sm font-bold">
                Oct 24, 2023 • 20:30
              </StyledText>
            </StyledView>

            <StyledView className="w-1/2">
              <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mb-1">
                {t("location")}
              </StyledText>
              <StyledText className="text-[#002B49] text-sm font-bold">
                Terminal 2, Gate B12
              </StyledText>
            </StyledView>

            <StyledView className="w-1/2">
              <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mb-1">
                {t("category")}
              </StyledText>
              <StyledText className="text-[#002B49] text-sm font-bold">
                Harassment
              </StyledText>
            </StyledView>

            <StyledView className="w-1/2">
              <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mb-1">
                {t("evidence")}
              </StyledText>
              <StyledText className="text-[#002B49] text-sm font-bold">
                2 Photos, 1 Audio
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Map Placeholder */}
        <StyledView className="mt-8 bg-[#A8D1C9] rounded-[32px] h-40 items-center justify-center overflow-hidden border border-[#A8D1C9]">
          <Ionicons name="location" size={32} color="#005294" />
        </StyledView>

        {/* Action Buttons */}
        <StyledTouchableOpacity
          activeOpacity={0.8}
          className="w-full mt-8 bg-[#005294] rounded-[32px] py-6 flex-row items-center justify-center shadow-lg"
        >
          <Ionicons
            name="create-outline"
            size={20}
            color="white"
            className="mr-2"
          />
          <StyledText className="text-white text-lg font-bold">
            {t("editReport")}
          </StyledText>
        </StyledTouchableOpacity>

        <StyledTouchableOpacity
          activeOpacity={0.8}
          className="w-full mt-4 bg-[#FB923C] rounded-[32px] py-6 flex-row items-center justify-center shadow-lg"
        >
          <Ionicons
            name="paper-plane-outline"
            size={20}
            color="white"
            className="mr-2"
          />
          <StyledText className="text-white text-lg font-bold">
            {t("proceedSubmission")}
          </StyledText>
        </StyledTouchableOpacity>
      </StyledScrollView>
    </StyledView>
  );
}
