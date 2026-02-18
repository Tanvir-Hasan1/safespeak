import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import EmergencyBar from "./tabs/home/EmergencyBar";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CustomHeader = ({
  title,
  showCancel = true,
  rightIcon,
  onRightPress,
}) => {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-[#F0F4FA]" edges={["top"]}>
      <EmergencyBar />
      <StyledView className="flex-row items-center justify-between px-6 py-4">
        {/* Back Button */}
        <StyledTouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
        >
          <Ionicons name="chevron-back" size={20} color="#FB923C" />
        </StyledTouchableOpacity>

        {/* Title */}
        <StyledText className="text-[#1F2937] text-lg font-bold">
          {title}
        </StyledText>

        {/* Right Action */}
        {rightIcon ? (
          <StyledTouchableOpacity
            activeOpacity={0.7}
            onPress={onRightPress}
            className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
          >
            <Ionicons name={rightIcon} size={24} color="#002B49" />
          </StyledTouchableOpacity>
        ) : showCancel ? (
          <StyledTouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <StyledText className="text-[#94A3B8] text-base font-medium">
              Cancel
            </StyledText>
          </StyledTouchableOpacity>
        ) : (
          <StyledView className="w-10" />
        )}
      </StyledView>
    </SafeAreaView>
  );
};

export default CustomHeader;
