import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CulturalFaithCard = ({ religion = "Muslim", onChange }) => (
  <StyledView className="bg-[#005A9E] rounded-[32px] p-6 mb-6 shadow-md">
    <StyledText className="text-white text-lg font-bold mb-4">
      Cultural & Faith Profile
    </StyledText>
    <StyledView className="flex-row items-center mb-6">
      <StyledView className="w-8 h-8 items-center justify-center mr-3">
        <Ionicons name="business" size={24} color="white" />
      </StyledView>
      <StyledText className="text-white text-base">{religion}</StyledText>
    </StyledView>
    <StyledTouchableOpacity
      onPress={onChange}
      className="bg-white rounded-2xl py-3 px-6 self-start flex-row items-center"
    >
      <StyledText className="text-[#005A9E] font-bold mr-2">Change</StyledText>
      <Ionicons name="chevron-forward" size={16} color="#005A9E" />
    </StyledTouchableOpacity>
  </StyledView>
);

export default CulturalFaithCard;
