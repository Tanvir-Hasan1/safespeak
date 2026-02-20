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

const RECOMMENDATIONS = [
  {
    id: 1,
    title: "Contact Your Bank",
    description:
      "Contact Your Bank - If you have lost money, shared your card details, or think someone can access your account, contact your bank immediately.",
    icon: "business-outline",
    iconColor: "#FB923C",
    bgColor: "#FFF7ED",
    buttonText: "Call Fraud Department",
  },
  {
    id: 2,
    title: "Report to ACCC Scamwatch",
    description:
      "Report to Scamwatch. Choose this if you have not lost money, but want the government to be aware of a scam. \n\nCrucial for community prevention.",
    icon: "trending-down-outline",
    iconColor: "#FB923C",
    bgColor: "#FFF7ED",
    buttonText: "Launch Report Tool",
  },
  {
    id: 3,
    title: "Report to ReportCyber",
    description:
      "Report to ReportCyber - Choose this if you clicked a link, shared personal details, lost money, or believe your identity or accounts are at risk.",
    icon: "hammer-outline",
    iconColor: "#FB923C",
    bgColor: "#FFF7ED",
    buttonText: "Launch Report Tool",
  },
];

export default function RecommendedSteps() {
  const router = useRouter();

  return (
    <StyledView className="flex-1 bg-[#FDFDFD]">
      <CustomHeader title="Recommended Steps" showCancel={true} />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Warning Banner */}
        <StyledView className="mt-4 bg-[#FEFCE8] p-3 rounded-xl border border-[#FEF08A]">
          <StyledView className="flex-row items-start">
            <Ionicons name="warning-outline" size={16} color="#A16207" />
            <StyledText className="ml-2 flex-1 text-[#A16207] text-[10px] font-bold leading-5">
              **SafeSpeak does not submit reports on your behalf. We explain
              your options and guide you to the right place based on what
              happened.**
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Header Section */}
        <StyledView className="mt-8 items-center">
          <StyledText className="text-[#1F2937] text-2xl font-black">
            Next Steps
          </StyledText>
          <StyledText className="text-[#94A3B8] text-sm font-medium text-center mt-1 leading-5 px-4">
            Follow these critical actions to secure your assets and report the
            incident.
          </StyledText>
        </StyledView>

        {/* Steps List */}
        <StyledView className="mt-8 space-y-8">
          {RECOMMENDATIONS.map((step) => (
            <StyledView key={step.id} className="items-center">
              <StyledView className="flex-row items-start w-full">
                <StyledView
                  className="w-10 h-10 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: step.bgColor }}
                >
                  <Ionicons
                    name={step.icon}
                    size={20}
                    color={step.iconColor}
                  />
                </StyledView>
                <StyledView className="flex-1 ml-4">
                  <StyledText className="text-[#1F2937] text-lg font-bold">
                    {step.title}
                  </StyledText>
                  <StyledText className="text-[#94A3B8] text-[11px] font-medium leading-4 mt-1">
                    {step.description}
                  </StyledText>
                </StyledView>
              </StyledView>

              <StyledTouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/home/scam-shield/submit-report")}
                className="bg-[#FF8A00] rounded-full py-3 px-10 mt-4 shadow-sm w-full items-center"
              >
                <StyledText className="text-white text-base font-bold">
                  {step.buttonText}
                </StyledText>
              </StyledTouchableOpacity>
              
              {/* Divider */}
              <StyledView className="w-full h-[1px] bg-[#F1F5F9] mt-8" />
            </StyledView>
          ))}
        </StyledView>

        {/* Documentation Section */}
        <StyledView className="mt-8 bg-white rounded-[32px] p-6 shadow-sm border border-[#F1F5F9]">
          <StyledView className="flex-row items-center mb-4">
            <Ionicons name="time-outline" size={20} color="#94A3B8" />
            <StyledText className="ml-3 flex-1 text-[#64748B] text-sm font-medium leading-5">
              All generated documentation and chat logs are automatically saved
              to your <StyledText className="text-[#005B96] font-bold">History</StyledText>.
            </StyledText>
          </StyledView>

          <StyledTouchableOpacity
            activeOpacity={0.7}
            className="bg-[#F1F5F9] rounded-full py-3 flex-row items-center justify-center mb-4"
          >
            <Ionicons name="download-outline" size={18} color="#002B49" />
            <StyledText className="text-[#002B49] text-sm font-bold ml-3">
              Prefilled Report
            </StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            activeOpacity={0.7}
            className="bg-[#F1F5F9] rounded-full py-3 flex-row items-center justify-center"
          >
            <Ionicons name="document-text-outline" size={18} color="#002B49" />
            <StyledView className="ml-3 items-center">
                <StyledText className="text-[#002B49] text-sm font-bold">
                Incident Summary
                </StyledText>
            </StyledView>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
