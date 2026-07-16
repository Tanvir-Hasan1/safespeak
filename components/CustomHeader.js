import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import EmergencyBar from "./tabs/home/EmergencyBar";
import { useLanguage } from "../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const CustomHeader = ({
  title,
  showCancel = true,
  rightIcon,
  onRightPress,
  headerVisible = true,
  backText,
  rightText,
  blueTheme = false,
  showDivider = false,
  simpleBack = false,
  rightTextColor,
  rightDisabled = false,
  plainRightIcon = false,
  showOnlyEmergencyBar = false,
}) => {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <SafeAreaView className="bg-[#F0F4FA]" edges={["top"]}>
      <EmergencyBar visible={headerVisible} />
      {!showOnlyEmergencyBar && (
        <StyledView
          className={`flex-row items-center justify-between px-6 py-4 bg-[#F0F4FA] ${showDivider ? "border-b border-[#E2E8F0]" : ""
            }`}
        >
          {/* Back Button */}
          {backText ? (
            <StyledTouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.back()}
              className="flex-row items-center"
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={blueTheme ? "#0B5A9E" : "#475569"}
              />
              <StyledText
                className={`text-base font-bold ml-1 ${blueTheme ? "text-[#0B5A9E]" : "text-[#475569]"
                  }`}
              >
                {backText}
              </StyledText>
            </StyledTouchableOpacity>
          ) : (
            <StyledView className="flex-row items-center">
              {simpleBack && (
                <StyledTouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => router.back()}
                  className="mr-3"
                >
                  <Ionicons name="chevron-back" size={24} color="#475569" />
                </StyledTouchableOpacity>
              )}
              {title ? (
                <StyledText className="text-[#0F172A] text-[22px] font-bold">
                  {title}
                </StyledText>
              ) : (
                <StyledView className="w-10" />
              )}
            </StyledView>
          )}

          {/* Right Action */}
          {rightIcon ? (
            <StyledTouchableOpacity
              activeOpacity={0.7}
              onPress={onRightPress}
              className={
                plainRightIcon
                  ? ""
                  : "w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm"
              }
            >
              <Ionicons
                name={rightIcon}
                size={plainRightIcon ? 20 : 18}
                color={blueTheme ? "#0B5A9E" : "#475569"}
              />
            </StyledTouchableOpacity>
          ) : rightText ? (
            <StyledTouchableOpacity
              activeOpacity={0.7}
              onPress={onRightPress || (() => router.back())}
              disabled={rightDisabled}
            >
              <StyledText
                style={rightTextColor ? { color: rightTextColor } : null}
                className="text-[#94A3B8] text-base font-medium"
              >
                {rightText || t("cancel")}
              </StyledText>
            </StyledTouchableOpacity>
          ) : (
            <StyledView className="w-10" />
          )}
        </StyledView>
      )}
    </SafeAreaView>
  );
};

export default CustomHeader;
