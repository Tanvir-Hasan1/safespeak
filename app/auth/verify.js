import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useLanguage } from "../../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function Verify() {
  const router = useRouter();
  const { t } = useLanguage();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (text, index) => {
    if (!text && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6 justify-between py-6"
      >
        <StyledTouchableOpacity onPress={() => router.back()} className="mb-8">
          <Ionicons name="arrow-back" size={24} color="black" />
        </StyledTouchableOpacity>

        <StyledView>
          <StyledText className="text-2xl font-bold mb-2">
            {t("verifyTitle")}
          </StyledText>
          <StyledText className="text-gray-600 mb-8">
            {t("verifySubtitle")}
          </StyledText>

          <StyledView className="flex-row justify-between w-full mb-6">
            {otp.map((digit, index) => (
              <StyledTextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace") {
                    handleBackspace(digit, index);
                  }
                }}
                keyboardType="number-pad"
                maxLength={1}
                className="w-[20%] h-16 border border-gray-400 rounded-lg text-center text-2xl font-bold"
              />
            ))}
          </StyledView>

          <StyledTouchableOpacity>
            <StyledText className="text-[#005b96]">
              {t("didntReceive")}{" "}
              <Text className="underline">{t("resend")}</Text>
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        <StyledTouchableOpacity
          className="w-full bg-[#FB923C] py-4 rounded-full items-center"
          onPress={() => router.push("/auth/customize")}
        >
          <StyledText className="text-white text-lg font-bold">
            {t("verifyBtn")}
          </StyledText>
        </StyledTouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
