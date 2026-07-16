import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SafeSpeakScreen from "../../../components/SafeSpeakScreen";
import { useLanguage } from "../../../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

export default function HelpSupportScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <StyledView className="flex-1 bg-[#F8FAFC]">
      <SafeSpeakScreen
        backText="Profile Settings"
        rightText="Cancel"
        onRightPress={() => router.back()}
        showCancel={false}
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
        blueTheme={false}
      >
        {/* Centered Flag Icon Illustration */}
        <StyledView className="items-center justify-center pt-6 mb-4">
          <StyledView className="w-24 h-24 rounded-[32px] bg-[#F1F5F9] items-center justify-center">
            <Ionicons name="flag-sharp" size={32} color="#1E293B" />
          </StyledView>
        </StyledView>

        {/* Orange Large Headings */}
        <StyledText className="text-[#FF8A00] text-3xl font-black text-center mb-1.5">
          Hello, how can we assist{"\n"}you?
        </StyledText>
        <StyledText className="text-[#94A3B8] text-[13px] font-semibold text-center mb-6 leading-5 px-4">
          Our team is ready to help you resolve any issues promptly.
        </StyledText>

        {/* Support Input Card */}
        <StyledView className="bg-white rounded-[24px] border border-[#E2E8F0] p-5 shadow-xs">
          {/* Title Field */}
          <StyledText className="text-[#0F172A] text-xs font-bold mb-2">
            Title
          </StyledText>
          <StyledTextInput
            className="w-full border border-[#CBD5E1] bg-white rounded-xl px-4 py-3 text-xs text-[#0F172A] mb-5 h-[46px]"
            placeholder="Enter the title of your issue"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
          />

          {/* Description Field */}
          <StyledText className="text-[#0F172A] text-xs font-bold mb-2">
            Write in below box
          </StyledText>
          <StyledTextInput
            className="w-full border border-[#CBD5E1] bg-white rounded-xl px-4 py-3 text-xs text-[#0F172A] min-h-[140px] mb-6"
            placeholder="Write here..."
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />

          {/* Send Button */}
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (!title.trim() || !description.trim()) {
                Alert.alert("Error", "Please fill in all fields.");
                return;
              }
              console.log("Support request sent:", { title, description });
              Alert.alert("Success", "Your support request has been submitted.");
              setTitle("");
              setDescription("");
            }}
            className="w-full bg-[#FF8A00] rounded-full py-4 flex-row items-center justify-center shadow-sm"
          >
            <StyledText className="text-white text-xs font-bold mr-1">
              Send
            </StyledText>
            <Ionicons name="chevron-forward" size={13} color="white" />
          </StyledTouchableOpacity>
        </StyledView>
      </SafeSpeakScreen>
    </StyledView>
  );
}
