import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Linking,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const { width } = Dimensions.get("window");

export default function TriageExplanation() {
  const router = useRouter();

  const recommendedSteps = [
    {
      id: 1,
      title: "I'm feeling stressed",
      subtitle: "Mindfulness & grounding",
      icon: "body-outline",
      iconBg: "#FFEDD5",
      iconColor: "#FB923C",
    },
  ];

  const safetyItems = [
    {
      id: 1,
      title: "Worried for others?",
      subtitle: "How to ask & help",
      icon: "people-outline",
      bg: "bg-[#005B96]",
    },
    {
      id: 2,
      title: "Self-Help Library",
      subtitle: "Tools & guides",
      icon: "book-outline",
      bg: "bg-[#005B96]",
    },
  ];

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title="Triage Explanation" showCancel={true} />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <StyledView className="mt-4 mb-6">
          <StyledText className="text-[#005B96] text-2xl font-bold">
            Triage Explanation
          </StyledText>
        </StyledView>

        {/* Main Card */}
        <StyledView className="bg-white rounded-[40px] p-8 items-center shadow-sm mb-8">
          <StyledText className="text-[#005B96] text-3xl font-light mb-4">
            cardirology
          </StyledText>
          <StyledView className="w-full h-[1px] bg-[#E2E8F0] mb-4" />
          <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest mb-1">
            INCIDENT CLASSIFICATION
          </StyledText>
          <StyledText className="text-[#005B96] text-2xl font-bold text-center mb-6">
            Mental Health Support
          </StyledText>
          <StyledText className="text-[#64748B] text-sm text-center leading-5 mb-2">
            Based on your inputs, we have identified a need for emotional
            support and resources.
          </StyledText>
          <StyledText className="text-[#94A3B8] text-xs italic text-center">
            This is an AI assessment and not a clinical diagnosis.
          </StyledText>
        </StyledView>

        <StyledText className="text-[#94A3B8] text-xs text-center mb-8 px-4">
          This is information only and not legal advice. Please consult with a
          professional for legal representation.
        </StyledText>

        {/* Recommended Steps */}
        <StyledView className="flex-row items-center justify-between mb-4">
          <StyledText className="text-[#1F2937] text-lg font-bold">
            Recommended Steps
          </StyledText>
          <StyledTouchableOpacity>
            <StyledText className="text-[#94A3B8] text-xs">
              Save to history
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/home/report-submission/recommendations")}
          className="bg-white rounded-[24px] p-4 flex-row items-center justify-between shadow-sm mb-6"
        >
          <StyledView className="flex-row items-center">
            <StyledView
              className="w-12 h-12 rounded-2xl items-center justify-center"
              style={{ backgroundColor: "#FFEDD5" }}
            >
              <Ionicons name="body-outline" size={24} color="#FB923C" />
            </StyledView>
            <StyledView className="ml-4">
              <StyledText className="text-[#1F2937] text-base font-bold">
                I'm feeling stressed
              </StyledText>
              <StyledText className="text-[#94A3B8] text-xs">
                Mindfulness & grounding
              </StyledText>
            </StyledView>
          </StyledView>
          <Ionicons name="arrow-forward" size={20} color="#94A3B8" />
        </StyledTouchableOpacity>

        {/* Action Grid 1 */}
        <StyledView className="flex-row space-x-4 mb-6">
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/home/report-submission/recommendations")}
            className="flex-1 bg-[#005B96] rounded-[32px] p-6 justify-between h-40"
          >
            <StyledView className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
              <Ionicons name="people-outline" size={20} color="white" />
            </StyledView>
            <StyledView>
              <StyledText className="text-white text-lg font-bold">
                Worried for others?
              </StyledText>
              <StyledText className="text-white/70 text-xs">
                How to ask & help
              </StyledText>
            </StyledView>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => router.push("/home/report-submission/recommendations")}
            className="flex-1 bg-[#005B96] rounded-[32px] p-6 justify-between h-40"
          >
            <StyledView className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
              <Ionicons name="book-outline" size={20} color="white" />
            </StyledView>
            <StyledView>
              <StyledText className="text-white text-lg font-bold">
                Self-Help Library
              </StyledText>
              <StyledText className="text-white/70 text-xs">
                Tools & guides
              </StyledText>
            </StyledView>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Your Safety */}
        <StyledText className="text-[#1F2937] text-lg font-bold mb-4">
          Your Safety
        </StyledText>

        <StyledView className="flex-row space-x-4">
          <StyledView className="flex-1 bg-[#FFF1F1] rounded-[40px] p-5 border border-[#FEE2E2]">
            <StyledView className="w-10 h-10 bg-[#FF5A5A] rounded-full items-center justify-center mb-3">
              <Ionicons name="shield-outline" size={20} color="white" />
            </StyledView>
            <StyledText className="text-[#1F2937] text-lg font-bold mb-1">
              I don't feel safe
            </StyledText>
            <StyledText className="text-[#64748B] text-[11px] leading-4 mb-3">
              If you are in immediate danger, connect now.
            </StyledText>
            <StyledTouchableOpacity
              onPress={() => Linking.openURL("tel:000")}
              className="bg-[#FF5A5A] rounded-2xl py-3 flex-row items-center justify-center"
            >
              <Ionicons name="call" size={16} color="white" />
              <StyledText className="text-white font-bold ml-2">
                CALL 000
              </StyledText>
            </StyledTouchableOpacity>
            <StyledText className="text-[#94A3B8] text-[10px] text-center mt-2">
              Stay on this screen
            </StyledText>
          </StyledView>

          <StyledView className="flex-1">
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home/report-submission/attachments")}
              className="bg-[#005B96] rounded-[32px] p-5 justify-between flex-1 mb-4"
            >
              <Ionicons name="lock-closed-outline" size={20} color="white" />
              <StyledView>
                <StyledText className="text-white text-base font-bold">
                  eSafety
                </StyledText>
                <StyledText className="text-white/70 text-[10px]">
                  Online abuse removal
                </StyledText>
              </StyledView>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home/report-submission/attachments")}
              className="bg-[#005B96] rounded-[32px] p-5 justify-between flex-1"
            >
              <Ionicons name="headset-outline" size={20} color="white" />
              <StyledView>
                <StyledText className="text-white text-base font-bold">
                  Counseling
                </StyledText>
                <StyledText className="text-white/70 text-[10px]">
                  24/7 Crisis Support
                </StyledText>
              </StyledView>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        <StyledText className="text-[#94A3B8] text-[10px] text-center mt-10 leading-4">
          This tool provides information and support options but is not a
          substitute for professional medical advice, diagnosis, or treatment.
        </StyledText>
      </StyledScrollView>
    </StyledView>
  );
}
