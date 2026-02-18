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
import CustomHeader from "../../../components/CustomHeader";

import { useRouter } from "expo-router";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

const EDUCATION_ITEMS = [
  {
    id: 1,
    title: "Identifying Bullying",
    time: "3 min read",
    color: "#005B96",
    icon: "help-buoy-outline",
  },
  {
    id: 2,
    title: "Documenting Evidence",
    time: "5 min read",
    color: "#FBBF24",
    icon: "document-text-outline",
  },
  {
    id: 3,
    title: "Digital Footprints",
    time: "4 min read",
    color: "#005B96",
    icon: "footsteps-outline",
  },
  {
    id: 4,
    title: "Safe Reporting",
    time: "4 min read",
    color: "#FBBF24",
    icon: "flag-outline",
  },
  {
    id: 5,
    title: "Blocking & Muting",
    time: "2 min read",
    color: "#005B96",
    icon: "remove-circle-outline",
  },
  {
    id: 6,
    title: "Mental Health Support",
    time: "6 min read",
    color: "#FBBF24",
    icon: "heart-outline",
  },
];

export default function ScamShield() {
  const router = useRouter();

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title="Cyber Bullying" />
      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <StyledView className="mt-6 mb-8">
          <StyledText className="text-[#002B49] text-4xl font-extrabold">
            MicroEducation
          </StyledText>
          <StyledText className="text-[#FB923C] text-xs font-bold uppercase mt-1">
            Cyber Bullying
          </StyledText>
        </StyledView>

        {/* Search Bar */}
        <StyledView className="flex-row items-center bg-white rounded-3xl px-4 py-3 mb-8 border border-white shadow-sm">
          <Ionicons name="search" size={20} color="#94A3B8" />
          <StyledTextInput
            placeholder="Search cyber bullying lessons..."
            className="flex-1 ml-3 text-base text-[#1F2937]"
            placeholderTextColor="#94A3B8"
          />
        </StyledView>

        {/* Lesson List */}
        <StyledView className="space-y-4">
          {EDUCATION_ITEMS.map((item) => (
            <StyledTouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => router.push("/home/lesson-detail")}
              className={`flex-row items-center justify-between p-4 rounded-[24px] bg-[${item.color}] shadow-sm mb-4`}
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
