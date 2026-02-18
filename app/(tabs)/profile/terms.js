import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styled } from "nativewind";
import CustomHeader from "../../../components/CustomHeader";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

const InfoContent = () => {
  const items = [
    "Lorem ipsum dolor sit amet consectetur. Imperdiet iaculis convallis bibendum massa id elementum consectetur neque mauris.",
    "Lorem ipsum dolor sit amet consectetur. Imperdiet iaculis convallis bibendum massa id elementum consectetur neque mauris.",
    "Lorem ipsum dolor sit amet consectetur. Imperdiet iaculis convallis bibendum massa id elementum consectetur neque mauris.",
    "Lorem ipsum dolor sit amet consectetur. Imperdiet iaculis convallis bibendum massa id elementum consectetur neque mauris.",
    "Lorem ipsum dolor sit amet consectetur. Imperdiet iaculis convallis bibendum massa id elementum consectetur neque mauris.",
  ];

  return (
    <StyledView className="px-6 py-8">
      {items.map((item, index) => (
        <StyledView key={index} className="flex-row mb-6">
          <StyledText className="text-[#1F2937] text-base font-medium mr-2">
            {index + 1}.
          </StyledText>
          <StyledText className="flex-1 text-[#1F2937] text-base font-medium leading-6">
            {item}
          </StyledText>
        </StyledView>
      ))}
    </StyledView>
  );
};

export default function TermsScreen() {
  return (
    <StyledView className="flex-1 bg-[#F8FAFC]">
      <CustomHeader title="Terms and conditions" />
      <StyledScrollView showsVerticalScrollIndicator={false}>
        <InfoContent />
      </StyledScrollView>
    </StyledView>
  );
}
