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

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 px-6 justify-between py-6"
      >
        <StyledView>
          <StyledTouchableOpacity
            onPress={() => router.back()}
            className="mb-8"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </StyledTouchableOpacity>

          <StyledText className="text-2xl font-bold mb-8">Sign In</StyledText>

          <StyledTextInput
            placeholder="Email"
            placeholderTextColor="#000"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="w-full border border-gray-300 rounded-lg p-4 text-base text-gray-800"
          />
        </StyledView>

        <StyledTouchableOpacity
          className="w-full bg-[#FB923C] py-4 rounded-full items-center"
          onPress={() => router.push("/auth/verify")}
        >
          <StyledText className="text-white text-lg font-bold">
            Continue
          </StyledText>
        </StyledTouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
