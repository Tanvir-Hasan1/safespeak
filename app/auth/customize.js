import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import OptionCard from "../../components/auth/customize/OptionCard";
import HelpCard from "../../components/auth/customize/HelpCard";
import Tick from "../../assets/icons/tick.svg";

import { useLanguage } from "../../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledScrollView = styled(ScrollView);

const LANGUAGES = [
  { code: "en", label: "English (US)", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

export default function Customize() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const [privacyMode, setPrivacyMode] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const selectedLang =
    LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

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

          {/* Language Toggle */}
          <StyledView className="relative">
            <StyledTouchableOpacity
              className="bg-white px-3 py-3 rounded-full flex-row items-center shadow-sm"
              onPress={() => setShowLangDropdown((v) => !v)}
            >
              <StyledText className="text-base mr-1">
                {selectedLang.flag}
              </StyledText>
              <StyledText className="text-black ml-1 font-medium">
                {selectedLang.label}
              </StyledText>
              <Ionicons
                name={showLangDropdown ? "chevron-up" : "chevron-down"}
                size={16}
                color="gray"
                style={{ marginLeft: 4 }}
              />
            </StyledTouchableOpacity>

            {showLangDropdown && (
              <StyledView className="absolute top-12 right-0 bg-white rounded-2xl shadow-lg z-50 overflow-hidden w-44">
                {LANGUAGES.map((lang) => (
                  <StyledTouchableOpacity
                    key={lang.code}
                    className={`flex-row items-center px-4 py-3 ${
                      language === lang.code ? "bg-orange-50" : ""
                    }`}
                    onPress={() => {
                      setLanguage(lang.code);
                      setShowLangDropdown(false);
                    }}
                  >
                    <StyledText className="text-base mr-2">
                      {lang.flag}
                    </StyledText>
                    <StyledText
                      className={`font-medium ${
                        language === lang.code
                          ? "text-[#FB923C]"
                          : "text-gray-800"
                      }`}
                    >
                      {lang.label}
                    </StyledText>
                    {language === lang.code && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color="#FB923C"
                        style={{ marginLeft: "auto" }}
                      />
                    )}
                  </StyledTouchableOpacity>
                ))}
              </StyledView>
            )}
          </StyledView>
        </StyledView>

        <StyledText className="text-[#002B49] text-3xl font-serif font-bold mb-8 mt-[-20px]">
          Speak
        </StyledText>

        <StyledText className="text-[#002B49] text-3xl font-bold mb-2">
          {t("customizeTitle")}
        </StyledText>
        <StyledText className="text-gray-500 mb-8">
          {t("customizeSubtitle")}
        </StyledText>

        <OptionCard
          icon="people"
          title={t("culturalProfile")}
          description={t("culturalProfileDesc")}
          hasArrow
        />

        <StyledView className="flex-row justify-between mb-4">
          <StyledView className="flex-1 mr-2">
            <OptionCard
              variant="grid"
              icon="eye-off-outline"
              title={t("privacyMode")}
              description={t("privacyModeDesc")}
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
              title={t("locationServices")}
              description={t("locationServicesDesc")}
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
            {t("getStarted")}
          </StyledText>
        </StyledTouchableOpacity>
        <StyledView>
          <StyledText className="text-center text-gray-500 mb-10">
            {t("notSubstitute")}
          </StyledText>
        </StyledView>
      </StyledScrollView>
    </SafeAreaView>
  );
}
