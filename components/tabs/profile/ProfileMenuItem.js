import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ProfileMenuItem = ({ title, onPress }) => (
  <StyledTouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    className="w-full bg-white rounded-3xl py-5 px-6 mb-3 shadow-sm flex-row items-center justify-between"
  >
    <StyledText className="text-[#1F2937] text-base font-bold">
      {title}
    </StyledText>
    <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
  </StyledTouchableOpacity>
);

export default ProfileMenuItem;
