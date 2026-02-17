import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const EmergencyBar = () => {
  return (
    <StyledTouchableOpacity className="w-full px-4 pt-2 pb-2">
      <LinearGradient
        colors={["#F43F5E", "#E11D48"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="rounded-full flex-row items-center justify-between px-4 py-2"
        style={{ borderRadius: 999 }}
      >
        <StyledView className="flex-row items-center space-x-2">
          <Ionicons name="sunny" size={16} color="white" />
          <StyledText className="text-white font-semibold text-xs">
            In case of emergency call (000)
          </StyledText>
        </StyledView>

        <StyledView className="bg-white/20 px-2 py-0.5 rounded-full flex-row items-center">
          <Ionicons name="globe-outline" size={12} color="white" />
          <StyledText className="text-white text-[10px] font-bold ml-1">
            EN
          </StyledText>
          <Ionicons name="chevron-down" size={12} color="white" />
        </StyledView>
      </LinearGradient>
    </StyledTouchableOpacity>
  );
};

export default EmergencyBar;
