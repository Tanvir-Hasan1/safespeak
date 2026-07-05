import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLanguage } from "../../../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ServiceTiles = React.memo(() => {
  const router = useRouter();
  const { t, language } = useLanguage();

  return (
    <StyledView className="px-6 flex-col mb-10">
      {/* Scam Shield Card */}
      <StyledTouchableOpacity
        className="w-full bg-[#004B73] h-40 rounded-[28px] p-5 mb-4 relative overflow-hidden flex-row justify-between"
        activeOpacity={0.8}
        onPress={() => router.push("/home/scam-shield")}
      >
        {/* Left content */}
        <StyledView className="justify-between h-full z-10">
          <StyledView>
            <StyledText className="text-[#38BDF8] text-[10px] font-black uppercase tracking-widest">
              {t("cyber")}
            </StyledText>
            <StyledText className="text-white text-2xl font-black mt-1 leading-none uppercase">
              {t("scamShield")}
            </StyledText>
          </StyledView>

          {/* Small Icon in rounded square */}
          <StyledView className="w-10 h-10 bg-white/10 rounded-[12px] border border-white/20 items-center justify-center">
            <Ionicons name="shield-checkmark" size={20} color="white" />
          </StyledView>
        </StyledView>

        {/* Large watermark icon on the right */}
        <Ionicons
          name="shield"
          size={140}
          color="rgba(255, 255, 255, 0.05)"
          style={{ position: "absolute", right: -10, top: -10, zIndex: 0 }}
        />
      </StyledTouchableOpacity>

      {/* Legal Resources Card */}
      <StyledTouchableOpacity
        className="w-full bg-[#FBBF24] h-40 rounded-[28px] p-5 mb-4 relative overflow-hidden flex-row justify-between"
        activeOpacity={0.8}
        onPress={() => router.push("/home/resources")}
      >
        {/* Left content */}
        <StyledView className="justify-between h-full z-10">
          <StyledView>
            <StyledText className="text-black/50 text-[10px] font-black uppercase tracking-widest">
              {t("legal")}
            </StyledText>
            <StyledText className="text-black text-2xl font-black mt-1 leading-none uppercase">
              {t("resources")}
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Large watermark icon on the right */}
        <Ionicons
          name="folder"
          size={120}
          color="rgba(0, 0, 0, 0.04)"
          style={{ position: "absolute", right: 20, bottom: -10, zIndex: 0 }}
        />
      </StyledTouchableOpacity>

      {/* Micro-Cards Card */}
      <StyledTouchableOpacity
        className="w-full bg-[#F97316] h-40 rounded-[28px] p-5 relative overflow-hidden flex-col justify-between"
        activeOpacity={0.8}
        onPress={() => router.push("/home/micro-cards")}
      >
        {/* Top content */}
        <StyledView className="z-10">
          <StyledText className="text-white text-2xl font-black uppercase">
            {t("microCards").replace("\n", "")}
          </StyledText>
        </StyledView>

        {/* Bottom progress bar content */}
        <StyledView className="w-full z-10">
          <StyledText className="text-white/95 text-[10px] font-bold">
            {t("microCardsMeta")}
          </StyledText>
          {/* Progress Bar Track */}
          <StyledView className="w-full h-1.5 bg-white/25 rounded-full mt-2 overflow-hidden">
            {/* Progress Bar Fill (approx 60%) */}
            <StyledView className="w-[60%] h-full bg-white rounded-full" />
          </StyledView>
        </StyledView>
      </StyledTouchableOpacity>
    </StyledView>
  );
});

export default ServiceTiles;
