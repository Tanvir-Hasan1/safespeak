import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { useRouter } from "expo-router";
import SafeSpeakScreen from "../../../components/SafeSpeakScreen";
import { useLanguage } from "../../../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function PrivacyScreen() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <StyledView className="flex-1 bg-[#F8FAFC]">
      <SafeSpeakScreen
        showHeader={false}
        showOnlyEmergencyBar={true}
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
      >
        {/* Top Privacy Policy Card Container */}
        <StyledView className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 mt-4 mb-6 shadow-xs">
          <StyledText className="text-[#005B96] text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
            PUBLISHED MAY 24, 2026
          </StyledText>
          <StyledText className="text-[#0B1F33] text-3xl font-black mb-3">
            Privacy Policy
          </StyledText>
          <StyledText className="text-[#64748B] text-xs leading-5 mb-5">
            Please read our privacy policy carefully to understand how we collect, use, and protect your personal information.
          </StyledText>
          
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.back()}
            className="border border-[#0B5A9E]/30 rounded-full py-2.5 items-center justify-center w-full"
          >
            <StyledText className="text-[#0B5A9E] text-xs font-bold">
              Profile Settings
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* SafeSpeak Privacy Policy Details */}
        <StyledView className="px-1">
          <StyledText className="text-[#0B1F33] text-[20px] font-black mb-3.5">
            SafeSpeak Privacy Policy
          </StyledText>

          <StyledText className="text-[#475569] text-xs leading-5 mb-4">
            SafeSpeak collects only the information needed to provide secure reporting, support navigation, consent management, and account services.
          </StyledText>

          <StyledText className="text-[#475569] text-xs leading-5 mb-4">
            You can use SafeSpeak with an account or through supported anonymous sessions. Where anonymous use is available, personal identifying details are optional unless you choose to share them for official verification.
          </StyledText>

          <StyledText className="text-[#475569] text-xs leading-5 mb-4">
            Reports, evidence metadata, consent records, support requests, and account details are handled with role-based access controls. Evidence files and sensitive metadata should be shared only when you intentionally choose to upload or submit them.
          </StyledText>

          <StyledText className="text-[#475569] text-xs leading-5 mb-4">
            SafeSpeak asks for explicit consent before cloud sync, AI processing, transcription, analytics use, warm referrals, or external agency sharing. You can review or withdraw consent where the product makes those controls available.
          </StyledText>

          <StyledText className="text-[#475569] text-xs leading-5 mb-4">
            You may request access, export, correction, or deletion of eligible personal information from the privacy controls in your account. Some records may need to be retained where safety, legal, audit, or operational obligations apply.
          </StyledText>

          <StyledText className="text-[#475569] text-xs leading-5 mb-4">
            This policy should be reviewed by the SafeSpeak legal or privacy owner before production release in each operating jurisdiction.
          </StyledText>
        </StyledView>
      </SafeSpeakScreen>
    </StyledView>
  );
}
