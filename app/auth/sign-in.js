import React, { useState } from "react";
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

export default function SignIn() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6 py-6"
      >
        {/* Top: Back arrow */}
        <StyledTouchableOpacity onPress={() => router.back()} className="mb-4">
          <Ionicons name="arrow-back" size={24} color="black" />
        </StyledTouchableOpacity>

        {/* Middle: centered content */}
        <StyledView className="flex-1 justify-center">
          <StyledText className="text-2xl font-bold mb-8">
            {t("signInTitle")}
          </StyledText>

          <StyledTextInput
            placeholder={t("emailPlaceholder")}
            placeholderTextColor="#000"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full border border-gray-300 rounded-lg p-4 text-base text-gray-800"
          />
          <StyledText className="text-lg text-black text-center mt-6 font-bold">
            We don't track you. We don't sell data. You control what you share.
          </StyledText>
        </StyledView>

        {/* Bottom: Continue button */}
        <StyledTouchableOpacity
          className="w-full bg-[#FB923C] py-4 rounded-full items-center"
          onPress={() => router.push("/auth/verify")}
        >
          <StyledText className="text-white text-lg font-bold">
            {t("continueBtn")}
          </StyledText>
        </StyledTouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
