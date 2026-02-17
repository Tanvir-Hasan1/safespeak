import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import OptionCard from "../../components/auth/customize/OptionCard";
import HelpCard from "../../components/auth/customize/HelpCard";
import Tick from "../../assets/icons/tick.svg";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

export default function Customize() {
  const router = useRouter();
  const [privacyMode, setPrivacyMode] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-[#F0F4FA]">
      <StyledScrollView className="flex-1 px-6 pt-6">
        <StyledView className="flex-row justify-between items-center mb-6">
          <StyledView className="flex-row items-center">
            <StyledText className="text-[#002B49] text-3xl font-serif font-bold">
              Safe
            </StyledText>
            <StyledView className="ml-2 mt-1">
              <Tick width={30} height={30} />
            </StyledView>
          </StyledView>
          <StyledView className="bg-white px-3 py-3r rounded-full flex-row items-center shadow-sm">
            <Ionicons name="flag-outline" size={16} color="black" />
            <StyledText className="text-black ml-2 font-medium">
              English (US)
            </StyledText>
            <Ionicons
              name="chevron-down"
              size={16}
              color="gray"
              className="ml-1"
            />
          </StyledView>
        </StyledView>
        <StyledText className="text-[#002B49] text-3xl font-serif font-bold mb-8 mt-[-20px]">
          Speak
        </StyledText>

        <StyledText className="text-[#002B49] text-3xl font-bold mb-2">
          Customize your experience
        </StyledText>
        <StyledText className="text-gray-500 mb-8">
          Tailor SafeSpeak to your specific needs and safety preferences.
        </StyledText>

        <OptionCard
          icon="people"
          title="Cultural Profile"
          description="Community specific resources & support networks."
          hasArrow
        />

        <StyledView className="flex-row justify-between mb-4">
          <StyledView className="flex-1 mr-2">
            <OptionCard
              variant="grid"
              icon="eye-off-outline"
              title="Privacy Mode"
              description="Quick-exit & covert icon"
              hasSwitch
              value={privacyMode}
              onValueChange={setPrivacyMode}
              iconBgColor="bg-orange-100"
              iconColor="#EA580C"
            />
          </StyledView>
          <StyledView className="flex-1 ml-2">
            <OptionCard
              variant="grid"
              icon="location"
              title="Location Services"
              description="Find nearby centers"
              hasArrow
            />
          </StyledView>
        </StyledView>

        <HelpCard />

        <StyledTouchableOpacity
          className="w-full bg-[#FB923C] py-4 rounded-full items-center mb-10 shadow-lg"
          onPress={() => router.replace("/(tabs)/home")}
        >
          <StyledText className="text-white text-lg font-bold">
            Get Started
          </StyledText>
        </StyledTouchableOpacity>
        <StyledView>
          <StyledText className="text-center text-gray-500 mb-10">
            Not a substitute for legal advice, counselling, or crisis services.
          </StyledText>
        </StyledView>
      </StyledScrollView>
    </SafeAreaView>
  );
}
