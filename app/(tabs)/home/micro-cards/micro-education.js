import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../../../components/CustomHeader";
import { useLanguage } from "../../../../context/LanguageContext";

import { useRouter, useLocalSearchParams } from "expo-router";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

const getEducationItems = (t) => [
  {
    id: 1,
    title: t("identifyingBullying"),
    time: `3 ${t("minRead")}`,
    color: "#005B96",
    icon: "help-buoy-outline",
  },
  {
    id: 2,
    title: t("documentingEvidence"),
    time: `5 ${t("minRead")}`,
    color: "#FBBF24",
    icon: "document-text-outline",
  },
  {
    id: 3,
    title: t("digitalFootprints"),
    time: `4 ${t("minRead")}`,
    color: "#005B96",
    icon: "footsteps-outline",
  },
  {
    id: 4,
    title: t("safeReporting"),
    time: `4 ${t("minRead")}`,
    color: "#FBBF24",
    icon: "flag-outline",
  },
  {
    id: 5,
    title: t("blockingMuting"),
    time: `2 ${t("minRead")}`,
    color: "#005B96",
    icon: "remove-circle-outline",
  },
  {
    id: 6,
    title: t("mentalHealthSupport"),
    time: `6 ${t("minRead")}`,
    color: "#FBBF24",
    icon: "heart-outline",
  },
];

export default function MicroEducation() {
  const { t } = useLanguage();
  const router = useRouter();
  const { name } = useLocalSearchParams();
  const screenTitle = name || t("microEducation");
  const educationItems = getEducationItems(t);

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title={screenTitle} />
      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <StyledView className="mt-6 mb-8">
          <StyledText className="text-[#002B49] text-4xl font-extrabold">
            {t("microEducation")}
          </StyledText>
          <StyledText className="text-[#FB923C] text-xs font-bold uppercase mt-1">
            {screenTitle}
          </StyledText>
        </StyledView>

        {/* Search Bar */}
        <StyledView className="flex-row items-center bg-white rounded-3xl px-4 py-3 mb-8 border border-white shadow-sm">
          <Ionicons name="search" size={20} color="#94A3B8" />
          <StyledTextInput
            placeholder={t("searchLessonsIntro")}
            className="flex-1 ml-3 text-base text-[#1F2937]"
            placeholderTextColor="#94A3B8"
          />
        </StyledView>

        {/* Lesson List */}
        <StyledView className="space-y-4">
          {educationItems.map((item) => (
            <StyledTouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => router.push("/home/micro-cards/lesson-detail")}
              className="flex-row items-center justify-between p-4 rounded-[24px] shadow-sm mb-4"
              style={{ backgroundColor: item.color }}
            >
              <StyledView className="flex-1 pr-4">
                <StyledText
                  className={`${item.color === "#FBBF24" ? "text-black" : "text-white"} text-[18px] font-bold`}
                >
                  {item.title}
                </StyledText>
                <StyledText
                  className={`${item.color === "#FBBF24" ? "text-black/60" : "text-white/60"} text-[12px] font-medium mt-1`}
                >
                  {item.time}
                </StyledText>
              </StyledView>
              <StyledView className="bg-white/20 p-3 rounded-2xl">
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={item.color === "#FBBF24" ? "black" : "white"}
                />
              </StyledView>
            </StyledTouchableOpacity>
          ))}
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
