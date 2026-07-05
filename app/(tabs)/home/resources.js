import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Linking, Alert } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLanguage } from "../../../context/LanguageContext";
import CustomHeader from "../../../components/CustomHeader";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function Resources() {
  const router = useRouter();
  const { t } = useLanguage();
  const [headerVisible, setHeaderVisible] = useState(true);

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    if (currentOffsetY <= 10) {
      setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      setHeaderVisible(false);
    }
  };

  const handleDownload = (fileName) => {
    Alert.alert("Download Started", `${fileName} is downloading...`);
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText="Learn & Resources"
        rightText="Home"
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10, paddingHorizontal: 24 }}
      >
        {/* 1. Learn Safely - Resource Library Card */}
        <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-6 shadow-xs mb-6 mt-4">
          <StyledText className="text-[#005B96] text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
            LEARN SAFELY
          </StyledText>
          <StyledText className="text-[#002B49] text-[22px] font-black mb-2">
            Resource Library
          </StyledText>
          <StyledText className="text-[#64748B] text-xs leading-5 mb-4">
            Browse practical guidance, downloadable resources, and micro-education without starting a report or AI flow.
          </StyledText>

          <StyledView className="flex-row flex-wrap items-center">
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home/micro-cards/micro-education")}
              className="bg-[#005B96] px-4 py-2.5 rounded-full mr-2 mb-2"
            >
              <StyledText className="text-white text-[11px] font-bold">
                Open micro-education
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home/micro-cards")}
              className="bg-white border border-[#CBD5E1] px-4 py-2.5 rounded-full mb-2"
            >
              <StyledText className="text-[#475569] text-[11px] font-bold">
                Browse micro-cards
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        {/* 2. Downloadable Resources Card */}
        <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-6 shadow-xs mb-6">
          <StyledView className="flex-row justify-between items-center mb-1">
            <StyledText className="text-[#002B49] text-base font-black">
              Downloadable resources
            </StyledText>
            <StyledView className="bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-[#DBEAFE]">
              <StyledText className="text-[#005B96] text-[9px] font-extrabold uppercase tracking-wider">
                LIBRARY
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mb-4">
            Backend resources appear here when available.
          </StyledText>

          {/* Doc 1 */}
          <StyledView className="bg-[#F8FAFC] border border-[#CBD5E1]/30 rounded-2xl p-4 mb-4">
            <StyledText className="text-[#002B49] text-[13px] font-black mb-1">
              Legal Support Framework 2024
            </StyledText>
            <StyledText className="text-[#64748B] text-[10px] font-semibold mb-3">
              Legal Awareness | English | Federal
            </StyledText>
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleDownload("Legal Support Framework 2024")}
              className="w-full bg-[#005B96] py-2 rounded-xl flex-row items-center justify-center"
            >
              <StyledText className="text-white text-[11px] font-bold mr-1.5">
                Download
              </StyledText>
              <Ionicons name="open-outline" size={13} color="white" />
            </StyledTouchableOpacity>
          </StyledView>

          {/* Doc 2 */}
          <StyledView className="bg-[#F8FAFC] border border-[#CBD5E1]/30 rounded-2xl p-4">
            <StyledText className="text-[#002B49] text-[13px] font-black mb-1">
              Legal Support Framework 2026
            </StyledText>
            <StyledText className="text-[#64748B] text-[10px] font-semibold mb-3">
              Online Abuse | English | NSW
            </StyledText>
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleDownload("Legal Support Framework 2026")}
              className="w-full bg-[#005B96] py-2 rounded-xl flex-row items-center justify-center"
            >
              <StyledText className="text-white text-[11px] font-bold mr-1.5">
                Download
              </StyledText>
              <Ionicons name="open-outline" size={13} color="white" />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        {/* 3. Micro-education Card */}
        <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-6 shadow-xs mb-6">
          <StyledView className="flex-row items-center mb-1">
            <StyledView className="w-7 h-7 bg-[#EFF6FF] rounded-lg items-center justify-center mr-2.5">
              <Ionicons name="albums-outline" size={15} color="#005B96" />
            </StyledView>
            <StyledText className="text-[#002B49] text-base font-black">
              Micro-education
            </StyledText>
          </StyledView>
          <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mb-4 mt-0.5">
            Short guidance cards for quick learning.
          </StyledText>

          {/* Grid of Micro Learning Cards */}
          <StyledView className="space-y-3 mb-4">
            {/* Learning Item 1 */}
            <StyledView className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 rounded-2xl p-4">
              <StyledText className="text-[#94A3B8] text-[8.5px] font-extrabold uppercase tracking-wider mb-1">
                CYBER
              </StyledText>
              <StyledText className="text-[#002B49] text-xs font-black mb-1">
                Bullying
              </StyledText>
              <StyledText className="text-[#64748B] text-[10px] leading-4 font-semibold">
                Protect your digital footprint & safer from potential online threats.
              </StyledText>
            </StyledView>

            {/* Learning Item 2 */}
            <StyledView className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 rounded-2xl p-4">
              <StyledText className="text-[#94A3B8] text-[8.5px] font-extrabold uppercase tracking-wider mb-1">
                HARASSMENT
              </StyledText>
              <StyledText className="text-[#002B49] text-xs font-black mb-1">
                Discrimination
              </StyledText>
              <StyledText className="text-[#64748B] text-[10px] leading-4 font-semibold">
                Discrimination occurs when employees are treated unfairly for personal traits.
              </StyledText>
            </StyledView>

            {/* Learning Item 3 */}
            <StyledView className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 rounded-2xl p-4">
              <StyledText className="text-[#94A3B8] text-[8.5px] font-extrabold uppercase tracking-wider mb-1">
                PROTECTION
              </StyledText>
              <StyledText className="text-[#002B49] text-xs font-black mb-1">
                Online Safety
              </StyledText>
              <StyledText className="text-[#64748B] text-[10px] leading-4 font-semibold">
                Protect your digital footprint & safer from potential online threats.
              </StyledText>
            </StyledView>

            {/* Learning Item 4 */}
            <StyledView className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 rounded-2xl p-4">
              <StyledText className="text-[#94A3B8] text-[8.5px] font-extrabold uppercase tracking-wider mb-1">
                SCAM
              </StyledText>
              <StyledText className="text-[#002B49] text-xs font-black mb-1">
                Protect Your Identity After a Scam
              </StyledText>
              <StyledText className="text-[#64748B] text-[10px] leading-4 font-semibold">
                Take early steps to secure accounts, bank access, and identity documents after a scam or privacy breach.
              </StyledText>
            </StyledView>
          </StyledView>

          {/* Open All learning */}
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/home/micro-cards")}
            className="w-full bg-white border border-[#CBD5E1] py-2.5 rounded-full items-center justify-center flex-row"
          >
            <StyledText className="text-[#475569] text-xs font-bold mr-1">
              Open all learning content
            </StyledText>
            <Ionicons name="chevron-forward" size={13} color="#475569" />
          </StyledTouchableOpacity>
        </StyledView>

        {/* 4. Support Directory Card */}
        <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-6 shadow-xs mb-4">
          <StyledText className="text-[#005B96] text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
            SUPPORT DIRECTORY
          </StyledText>
          <StyledText className="text-[#002B49] text-[18px] font-black leading-6 mb-2">
            Banks, legal aid, and counseling services
          </StyledText>
          <StyledText className="text-[#64748B] text-[11px] leading-4.5 font-semibold mb-3.5">
            Published admin directory entries appear here for quick contact and availability checks.
          </StyledText>

          <StyledView className="bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#DBEAFE] self-start mb-4">
            <StyledText className="text-[#005B96] text-[9px] font-extrabold uppercase tracking-wider">
              2 LISTED
            </StyledText>
          </StyledView>

          {/* Directory Grid/List */}
          <StyledView className="space-y-3">
            {/* Listing 1 */}
            <StyledView className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 rounded-2xl p-4 flex-row justify-between items-start">
              <StyledView className="flex-1 mr-3">
                <StyledView className="bg-[#E2F0D9] px-2 py-0.5 rounded-md self-start mb-1.5">
                  <StyledText className="text-[#385723] text-[8.5px] font-extrabold">
                    Counseling
                  </StyledText>
                </StyledView>
                <StyledText className="text-[#002B49] text-xs font-bold mb-1">
                  Test
                </StyledText>
                <StyledText className="text-[#94A3B8] text-[10px] font-semibold">
                  Australia
                </StyledText>
                <StyledTouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => Linking.openURL("tel:+54455453")}
                  className="mt-1"
                >
                  <StyledText className="text-[#64748B] text-[10px] font-bold">
                    +54 455 453
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
              <Ionicons name="heart" size={16} color="#005B96" className="mt-1" />
            </StyledView>

            {/* Listing 2 */}
            <StyledView className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 rounded-2xl p-4 flex-row justify-between items-start">
              <StyledView className="flex-1 mr-3">
                <StyledView className="bg-[#E2F0D9] px-2 py-0.5 rounded-md self-start mb-1.5">
                  <StyledText className="text-[#385723] text-[8.5px] font-extrabold">
                    Counseling
                  </StyledText>
                </StyledView>
                <StyledText className="text-[#002B49] text-xs font-bold mb-1">
                  Test organization name
                </StyledText>
                <StyledText className="text-[#94A3B8] text-[10px] font-semibold">
                  AU
                </StyledText>
                <StyledTouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => Linking.openURL("tel:+932382328")}
                  className="mt-1"
                >
                  <StyledText className="text-[#64748B] text-[10px] font-bold">
                    +93 2382 328
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
              <Ionicons name="heart" size={16} color="#005B96" className="mt-1" />
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
