import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../../../components/CustomHeader";
import { useRouter } from "expo-router";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const RED_FLAGS = [
  {
    id: 1,
    title: "Urgent Language",
    description: "The message uses high-pressure tactics to force immediate action.",
    icon: "warning-outline",
    color: "#FEF3C7", // Amber-50
    iconColor: "#F59E0B", // Amber-500
  },
  {
    id: 2,
    title: "Suspicious Sender",
    description: "The sender's domain (noreply-security.net) does not match the official source.",
    icon: "at-outline",
    color: "#FEF7E6", // Custom lighter amber
    iconColor: "#F59E0B",
  },
];

export default function ScamRiskResults() {
  const router = useRouter();

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title="Scam Risk Results" showCancel={true} />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Risk Score Card */}
        <StyledView className="bg-white rounded-[32px] p-6 mt-6 items-center shadow-sm">
          <StyledText className="text-[#EF4444] text-[64px] font-black leading-[74px]">
            85%
          </StyledText>
          <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[2px] mt-[-6px]">
            HIGH RISK
          </StyledText>

          <StyledText className="text-[#EF4444] text-xl font-black mt-6 text-center">
            High Risk Detected
          </StyledText>
          <StyledText className="text-[#64748B] text-sm font-medium text-center leading-5 mt-3">
            This communication matches known scam patterns. We strongly advise
            against clicking any links or providing personal information.
          </StyledText>
        </StyledView>

        {/* Detected Red Flags Section */}
        <StyledView className="mt-8 mb-4 flex-row justify-between items-center">
          <StyledText className="text-[#1F2937] text-lg font-black">
            Detected Red Flags
          </StyledText>
          <StyledView className="bg-[#FEE2E2] px-3 py-1 rounded-full">
            <StyledText className="text-[#EF4444] text-[10px] font-bold uppercase tracking-wider">
              2 FOUND
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Red Flags List */}
        {RED_FLAGS.map((flag) => (
          <StyledView
            key={flag.id}
            className="bg-white rounded-[24px] p-5 mb-4 shadow-sm"
          >
            <StyledView className="flex-row items-start">
              <StyledView
                className="w-12 h-12 rounded-xl items-center justify-center"
                style={{ backgroundColor: flag.color }}
              >
                <Ionicons name={flag.icon} size={24} color={flag.iconColor} />
              </StyledView>
              <StyledView className="flex-1 ml-4">
                <StyledText className="text-[#1F2937] text-base font-bold">
                  {flag.title}
                </StyledText>
                <StyledText className="text-[#64748B] text-xs font-medium leading-4 mt-1">
                  {flag.description}
                </StyledText>

                <StyledTouchableOpacity 
                  onPress={() => router.push("/home/scam-shield/recommended-steps")}
                  className="flex-row items-center mt-3 justify-end"
                >
                  <StyledText className="text-[#005B96] text-xs font-bold">
                    How to stay safe
                  </StyledText>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color="#005B96"
                    className="ml-1"
                  />
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          </StyledView>
        ))}

        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/home/scam-shield/submit-report")}
          className="bg-[#D32F2F] rounded-full py-4 items-center justify-center flex-row mt-4 shadow-lg shadow-red-200"
        >
          <Ionicons name="alert-circle-outline" size={20} color="white" />
          <StyledText className="text-white text-base font-bold ml-3">
            Report This Incident
          </StyledText>
        </StyledTouchableOpacity>

        {/* Stay Protected Card */}
        <StyledView className="mt-8 bg-[#FAFAFA] rounded-[24px] p-5 border border-[#E2E8F0]">
          <StyledView className="flex-row items-center mb-2">
            <Ionicons name="shield-checkmark" size={18} color="#3B82F6" />
            <StyledText className="ml-2 text-[#005B96] font-bold text-sm">
              Stay Protected
            </StyledText>
          </StyledView>
          <StyledText className="text-[#475569] text-xs font-medium leading-4">
            Always verify communications through official channels. When in
            doubt, contact the organization directly using their official
            contact information.
          </StyledText>

          <StyledView className="mt-5 bg-[#FEFCE8] p-3 rounded-xl border border-[#FEF08A]">
            <StyledText className="text-[#A16207] text-[9px] font-bold text-center leading-4 items-center">
              <Ionicons name="warning-outline" size={10} /> **This is
              information, not legal advice.**
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
