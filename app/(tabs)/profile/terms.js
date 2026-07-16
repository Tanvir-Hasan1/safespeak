import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { useRouter } from "expo-router";
import SafeSpeakScreen from "../../../components/SafeSpeakScreen";
import { useLanguage } from "../../../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function TermsScreen() {
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
        {/* Top Terms of Use Card Container */}
        <StyledView className="bg-white rounded-[24px] border border-[#E2E8F0] p-6 mt-4 mb-6 shadow-xs">
          <StyledText className="text-[#005B96] text-[10px] font-extrabold uppercase tracking-widest mb-1.5">
            PUBLISHED MAY 24, 2026
          </StyledText>
          <StyledText className="text-[#0B1F33] text-3xl font-black mb-3">
            Terms of Use
          </StyledText>
          <StyledText className="text-[#64748B] text-xs leading-5 mb-5">
            Please read our terms of use carefully to understand your rights, responsibilities, and use of our platform.
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

        {/* SafeSpeak Terms of Use Details */}
        <StyledView className="px-1">
          <StyledText className="text-[#0B1F33] text-[20px] font-black mb-3.5">
            SafeSpeak Terms of Use
          </StyledText>

          <StyledText className="text-[#475569] text-xs leading-5 mb-4">
            SafeSpeak provides a secure channel to build incident records, explore support options, and coordinate referrals. The service is provided as-is without warranties of any kind.
          </StyledText>

          <StyledText className="text-[#475569] text-xs leading-5 mb-4">
            You agree to use SafeSpeak only for lawful purposes. You must not submit false reports, upload malicious files, or attempt to compromise the security controls of the platform.
          </StyledText>

          <StyledText className="text-[#475569] text-xs leading-5 mb-4">
            SafeSpeak is not a direct emergency service provider. SafeSpeak does not monitor submissions in real time to dispatch emergency help. Always call 000 in immediate danger.
          </StyledText>

          <StyledText className="text-[#475569] text-xs leading-5 mb-4">
            All trademarks, logos, educational material, and software on the SafeSpeak platform are protected by intellectual property rights owned or licensed by SafeSpeak.
          </StyledText>

          <StyledText className="text-[#475569] text-xs leading-5 mb-4">
            We reserve the right to modify, suspend, or terminate access to our platform at our sole discretion, without notice, for any violation of these terms.
          </StyledText>
        </StyledView>
      </SafeSpeakScreen>
    </StyledView>
  );
}
