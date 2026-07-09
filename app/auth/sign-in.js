import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useLanguage } from "../../context/LanguageContext";
import api from "../../context/api";
import { useAuthStore } from "../../store/useAuthStore";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTextInput = styled(TextInput);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function SignIn() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSignIn = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password.trim()) {
      Alert.alert("Required Fields", "Please enter both your email and password.");
      return;
    }

    setLoading(true);
    api.post("/auth/login", {
      email: trimmedEmail,
      password: password,
    })
      .then((res) => {
        setLoading(false);
        const json = res.data;
        if (json.success && json.data) {
          // Store in global Zustand store
          useAuthStore.getState().setAuth(json.data.user, json.data.tokens);
          
          // Proceed directly to customization step, bypassing OTP verification
          router.push("/auth/customize");
        } else {
          Alert.alert("Login Failed", json.message || "Invalid credentials.");
        }
      })
      .catch((err) => {
        setLoading(false);
        const errMsg = err.response?.data?.message || "An error occurred during login. Check your credentials.";
        Alert.alert("Login Error", errMsg);
      });
  };

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
          <StyledText className="text-3xl font-bold text-[#002B49] mb-2">
            {t("signInTitle")}
          </StyledText>
          <StyledText className="text-gray-500 mb-8 text-base">
            Enter your credentials to access your secure profile.
          </StyledText>

          {/* Email input group */}
          <StyledView className="mb-5">
            <StyledText className="text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </StyledText>
            <StyledView className="flex-row items-center border border-gray-300 rounded-lg px-4 bg-white">
              <Ionicons name="mail-outline" size={20} color="#6B7280" style={{ marginRight: 10 }} />
              <StyledTextInput
                placeholder={t("emailPlaceholder")}
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 py-4 text-base text-gray-800"
              />
            </StyledView>
          </StyledView>

          {/* Password input group */}
          <StyledView className="mb-2">
            <StyledText className="text-sm font-semibold text-gray-700 mb-2">
              Password
            </StyledText>
            <StyledView className="flex-row items-center border border-gray-300 rounded-lg px-4 bg-white">
              <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={{ marginRight: 10 }} />
              <StyledTextInput
                placeholder={t("passwordPlaceholder")}
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 py-4 text-base text-gray-800"
              />
              <StyledTouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#6B7280"
                />
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>

          {/* Forgot Password link */}
          <StyledTouchableOpacity 
            className="items-end mb-6"
            onPress={() => Alert.alert("Reset Password", "A password reset link will be sent to your email.")}
          >
            <StyledText className="text-[#FB923C] font-semibold text-sm">
              {t("forgotPasswordLink")}
            </StyledText>
          </StyledTouchableOpacity>

          <StyledText className="text-base text-gray-600 text-center font-bold mt-6 leading-relaxed">
            We don't track you. We don't sell data. You control what you share.
          </StyledText>
        </StyledView>

        {/* Bottom actions */}
        <StyledView className="mb-4">
          <StyledTouchableOpacity
            className={`w-full py-4 rounded-full items-center shadow-md ${
              loading ? "bg-orange-300" : "bg-[#FB923C]"
            }`}
            onPress={handleSignIn}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <StyledText className="text-white text-lg font-bold">
                {t("signInBtn")}
              </StyledText>
            )}
          </StyledTouchableOpacity>

          <StyledView className="flex-row justify-center mt-4">
            <StyledText className="text-gray-500 text-sm">Don't have an account? </StyledText>
            <StyledTouchableOpacity onPress={() => Alert.alert("Registration", "Please register on our web application.")}>
              <StyledText className="text-[#FB923C] font-bold text-sm">Sign Up</StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

