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

export default function Recommendations() {
  const router = useRouter();

  const handleAction = () => {
    router.push("/home/report-submission/attachments");
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title="Recommendations" showCancel={true} />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <StyledView className="mt-4 mb-6">
          <StyledText className="text-[#64748B] text-base leading-6">
            Based on your answers, here are the recommended next steps to ensure your safety.
          </StyledText>
        </StyledView>

        {/* Immediate Danger Card */}
        <StyledView className="bg-white rounded-[40px] p-8 items-start shadow-sm mb-6 border border-[#E2E8F0]">
          <StyledView className="w-12 h-12 bg-[#FFF1F1] rounded-full items-center justify-center mb-6">
            <Ionicons name="shield-outline" size={24} color="#EF4444" />
          </StyledView>
          <StyledText className="text-[#1F2937] text-xl font-bold mb-3">
            Immediate Danger
          </StyledText>
          <StyledText className="text-[#64748B] text-sm leading-5 mb-8">
            If you or someone else is in immediate danger, please contact the police immediately.
          </StyledText>
          <StyledTouchableOpacity
            onPress={() => Linking.openURL("tel:000")}
            className="w-full bg-[#FB923C] rounded-full py-4 flex-row items-center justify-center shadow-lg shadow-orange-200"
          >
            <Ionicons name="call" size={18} color="white" />
            <StyledText className="text-white font-bold ml-2">
              Contact Police (000)
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* eSafety Commissioner Card */}
        <StyledView className="bg-white rounded-[40px] p-8 items-start shadow-sm mb-6 border border-[#E2E8F0]">
          <StyledView className="w-12 h-12 bg-[#EFF6FF] rounded-full items-center justify-center mb-6">
            <Ionicons name="flash-outline" size={24} color="#3B82F6" />
          </StyledView>
          <StyledText className="text-[#1F2937] text-xl font-bold mb-3">
            eSafety Commissioner
          </StyledText>
          <StyledText className="text-[#64748B] text-sm leading-5 mb-8">
            File a formal report regarding online abuse or cyberbullying to get content removed.
          </StyledText>
          <StyledTouchableOpacity
            onPress={handleAction}
            className="w-full bg-[#F1F5F9] rounded-full py-4 flex-row items-center justify-center"
          >
            <StyledText className="text-[#1F2937] font-bold mr-2">
              Report to eSafety
            </StyledText>
            <Ionicons name="arrow-forward" size={18} color="#1F2937" />
          </StyledTouchableOpacity>
        </StyledView>

        {/* Counseling Support Card */}
        <StyledView className="bg-white rounded-[40px] p-8 items-start shadow-sm border border-[#E2E8F0] mb-6">
          <StyledView className="w-12 h-12 bg-[#F0FDF4] rounded-full items-center justify-center mb-6">
            <Ionicons name="headset-outline" size={24} color="#22C55E" />
          </StyledView>
          <StyledText className="text-[#1F2937] text-xl font-bold mb-3">
            Counseling Support
          </StyledText>
          <StyledText className="text-[#64748B] text-sm leading-5 mb-8">
            Speak confidentially with a crisis counselor available 24/7 for mental health support.
          </StyledText>
          <StyledTouchableOpacity
            onPress={handleAction}
            className="w-full bg-[#F1F5F9] rounded-full py-4 flex-row items-center justify-center"
          >
            <StyledText className="text-[#1F2937] font-bold mr-2">
              Call Lifeline
            </StyledText>
            <Ionicons name="arrow-forward" size={18} color="#1F2937" />
          </StyledTouchableOpacity>
        </StyledView>


        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/home/report-submission/detailed-explanations")}
          className="bg-[#005B96] rounded-[32px] py-4 items-center justify-center shadow-lg"
        >
          <StyledText className="text-white text-base font-bold">
            Read More Detailed Explanations
          </StyledText>
        </StyledTouchableOpacity>
      </StyledScrollView>
    </StyledView>
  );
}
