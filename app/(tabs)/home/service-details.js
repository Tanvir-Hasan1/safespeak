import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, Switch } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../../components/CustomHeader";
import ScaleIcon from "../../../assets/icons/scale.svg";
import HandWithHeartIcon from "../../../assets/icons/hand-with-heart.svg";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function ServiceDetails() {
  const [includeSummary, setIncludeSummary] = useState(false);

  return (
    <StyledView className="flex-1 bg-[#F9FAFB]">
      <CustomHeader title="Service Details" />

      <StyledScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Service Header Card */}
        <StyledView className="items-center px-6 pt-10 pb-8">
          <StyledView className="w-24 h-24 bg-white rounded-[30px] items-center justify-center shadow-sm relative mb-6">
            <ScaleIcon width={40} height={40} />
            <StyledView className="absolute bottom-1 right-1 w-4 h-4 bg-[#22C55E] rounded-full border-2 border-white" />
          </StyledView>

          <StyledText className="text-[#111827] text-2xl font-black mb-1">
            Community Legal Centre
          </StyledText>
          <StyledText className="text-[#3B82F6] text-base font-semibold mb-4">
            Legal Support Services
          </StyledText>

          <StyledView className="flex-row items-center bg-[#F0FDF4] px-4 py-1.5 rounded-full border border-[#DCFCE7]">
            <Ionicons name="checkmark-circle" size={16} color="#22C55E" />
            <StyledText className="text-[#15803D] text-[13px] font-bold ml-1.5">
              Available Now
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Contact Information */}
        <StyledView className="px-6 mb-10">
          <StyledText className="text-[#111827] text-lg font-bold mb-4 ml-1">
            Contact Information
          </StyledText>

          <StyledTouchableOpacity
            className="flex-row items-center bg-white p-5 rounded-[32px] mb-4 shadow-sm"
            activeOpacity={0.7}
          >
            <StyledView className="w-14 h-14 bg-[#EFF6FF] rounded-2xl items-center justify-center mr-4">
              <Ionicons name="call" size={24} color="#3B82F6" />
            </StyledView>
            <StyledView className="flex-1">
              <StyledText className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-[1px] mb-0.5">
                PHONE
              </StyledText>
              <StyledText className="text-[#002B49] text-[20px] font-black">
                (02) 5550 0123
              </StyledText>
            </StyledView>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            className="flex-row items-center bg-white p-5 rounded-[32px] mb-4 shadow-sm"
            activeOpacity={0.7}
          >
            <StyledView className="w-14 h-14 bg-[#EFF6FF] rounded-2xl items-center justify-center mr-4">
              <Ionicons name="mail" size={24} color="#3B82F6" />
            </StyledView>
            <StyledView className="flex-1">
              <StyledText className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-[1px] mb-0.5">
                EMAIL
              </StyledText>
              <StyledText className="text-[#002B49] text-[18px] font-black">
                contact@clc.org.au
              </StyledText>
            </StyledView>
            <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            className="flex-row items-center bg-white p-5 rounded-[32px] shadow-sm"
            activeOpacity={0.7}
          >
            <StyledView className="w-14 h-14 bg-[#EFF6FF] rounded-2xl items-center justify-center mr-4">
              <Ionicons name="globe" size={24} color="#3B82F6" />
            </StyledView>
            <StyledView className="flex-1">
              <StyledText className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-[1px] mb-0.5">
                LANGUAGES
              </StyledText>
              <StyledText className="text-[#002B49] text-[18px] font-black">
                English, Arabic, Mandarin
              </StyledText>
            </StyledView>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Warm Referral Section */}
        <StyledView className="bg-[#F3F4F6]/60 mx-4 rounded-[50px] p-8 pb-10">
          <StyledView className="flex-row items-center mb-4">
            <StyledView className="bg-white p-3 rounded-2xl mr-4 shadow-sm">
              <HandWithHeartIcon width={28} height={28} />
            </StyledView>
            <StyledText className="text-[#002B49] text-[24px] font-black">
              Warm Referral
            </StyledText>
          </StyledView>

          <StyledText className="text-[#6B7280] text-[15px] font-medium leading-5 mb-8">
            A warm referral ensures the provider has the context they need to
            help you immediately without repeating your story.
          </StyledText>

          <StyledView className="bg-white rounded-[40px] p-4 mb-8 shadow-sm flex-row items-center justify-between">
            <StyledView className="flex-1 pr-4">
              <StyledText className="text-[#111827] text-sm font-bold mb-1">
                Include Incident Summary
              </StyledText>
              <StyledText className="text-[#9CA3AF] text-sm">
                Shares your recent report securely.
              </StyledText>
            </StyledView>
            <Switch
              value={includeSummary}
              onValueChange={setIncludeSummary}
              trackColor={{ false: "#E5E7EB", true: "#005696" }}
              thumbColor="white"
              style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] }}
            />
          </StyledView>

          <StyledTouchableOpacity
            className="bg-[#FF8A00] flex-row items-center justify-center py-4 rounded-full shadow-lg shadow-orange-300"
            activeOpacity={0.5}
          >
            <StyledText className="text-white text-[18px] font-black mr-2">
              Send Referral
            </StyledText>
            <Ionicons name="paper-plane-outline" size={24} color="white" />
          </StyledTouchableOpacity>
        </StyledView>

        {/* Relevant Resources Accordion */}
        <StyledView className="px-8 mt-10 mb-10">
          <StyledTouchableOpacity className="flex-row items-center justify-between">
            <StyledText className="text-[#002B49] text-xl font-black">
              Relevant Resources
            </StyledText>
            <Ionicons name="chevron-down" size={24} color="#9CA3AF" />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
