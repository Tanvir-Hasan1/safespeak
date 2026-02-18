import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const FeatureCard = ({
  icon,
  title,
  subtitle,
  action,
  color = "bg-white",
  iconBg = "bg-[#EFF6FF]",
  iconColor = "#3B82F6",
  onActionPress,
  children,
}) => (
  <StyledView
    className={`${color} rounded-[32px] px-3 py-4 shadow-sm border border-[#F1F5F9] mb-4`}
  >
    <StyledView className="flex-row items-start justify-between mb-4">
      <StyledView
        className={`w-10 h-10 ${iconBg} rounded-xl items-center justify-center`}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </StyledView>
    </StyledView>
    <StyledText className="text-[#1F2937] text-base font-bold mb-1">
      {title}
    </StyledText>
    <StyledText className="text-[#94A3B8] text-sm font-medium mb-3">
      {subtitle}
    </StyledText>
    {action && (
      <StyledTouchableOpacity onPress={onActionPress}>
        <StyledText className="text-[#3B82F6] text-xs font-bold uppercase tracking-widest">
          {action}
        </StyledText>
      </StyledTouchableOpacity>
    )}
    {children}
  </StyledView>
);

export default FeatureCard;
