import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import EmergencyBar from "../../../components/tabs/home/EmergencyBar";
import ProfileMenuItem from "../../../components/tabs/profile/ProfileMenuItem";
import CulturalFaithCard from "../../../components/tabs/profile/CulturalFaithCard";
import FeatureCard from "../../../components/tabs/profile/FeatureCard";
import HelpSupportCard from "../../../components/tabs/profile/HelpSupportCard";
import FAQCard from "../../../components/tabs/profile/FAQCard";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledScrollView = styled(ScrollView);

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <StyledView className="flex-1 bg-[#F8FAFC]">
      <SafeAreaView className="bg-white" edges={["top"]}>
        <EmergencyBar />
      </SafeAreaView>

      <StyledScrollView
        className="flex-1 px-4 pt-6 mb-16"
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting */}
        <StyledView className="items-center mb-8">
          <StyledText className="text-[#002B49] text-3xl font-bold mb-1">
            Hey Alex!
          </StyledText>
          <StyledText className="text-[#94A3B8] text-base">
            Your space is safe and secure.
          </StyledText>
        </StyledView>

        {/* Cultural & Faith Profile Card */}
        <CulturalFaithCard religion="Muslim" onChange={() => {}} />

        {/* Main Grid Modules */}
        <StyledView className="flex-row justify-between">
          <StyledView className="w-[47%]">
            <FeatureCard
              icon="language"
              title="Language"
              subtitle="English"
              action="UPDATE"
              iconBg="bg-[#E0F2FE]"
              iconColor="#0369A1"
            />
            <FeatureCard
              icon="shield-checkmark"
              title="Email & Security"
              subtitle="Active & Secure"
              action="MANAGE"
              iconBg="bg-[#DCFCE7]"
              iconColor="#15803D"
            />
          </StyledView>

          <StyledView className="w-[50%] items-stretch">
            <HelpSupportCard
              onChatPress={() => router.push("/profile/help-support")}
            />
          </StyledView>
        </StyledView>

        {/* FAQ Section */}
        <FAQCard />

        {/* Footer Links */}
        <StyledView className="mt-8 mb-12">
          <ProfileMenuItem
            title="Terms and conditions"
            onPress={() => router.push("/profile/terms")}
          />
          <ProfileMenuItem
            title="Privacy Policy"
            onPress={() => router.push("/profile/privacy")}
          />
          <ProfileMenuItem
            title="About us"
            onPress={() => router.push("/profile/about")}
          />
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
