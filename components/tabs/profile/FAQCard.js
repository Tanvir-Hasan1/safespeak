import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);

const FAQCard = () => (
  <StyledView className="bg-white rounded-[40px] p-6 shadow-sm border border-[#F1F5F9] mb-6 flex-row items-center justify-between">
    <StyledView className="flex-1">
      <StyledView className="w-10 h-10 bg-[#E0F2FE] rounded-lg items-center justify-center mb-3">
        <Ionicons name="copy-outline" size={20} color="#0EA5E9" />
      </StyledView>
      <StyledText className="text-[#1F2937] text-2xl font-bold mb-2">
        FAQs
      </StyledText>
      <StyledText className="text-[#94A3B8] text-sm leading-5">
        Find quick answers to common questions
      </StyledText>
    </StyledView>
    <StyledView className="w-20 h-20 items-center justify-center">
      <StyledText className="text-[#E2E8F0] text-7xl font-bold">?</StyledText>
    </StyledView>
  </StyledView>
);

export default FAQCard;
