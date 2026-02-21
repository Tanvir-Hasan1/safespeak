import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function DetailedExplanations() {
  const router = useRouter();
  const [legalRightsExpanded, setLegalRightsExpanded] = useState(true);

  return (
    <StyledView className="flex-1 bg-white">
      <CustomHeader title="Detailed Explanations" showCancel={true} />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <StyledView className="mt-6 mb-8">
          <StyledText className="text-[#64748B] text-sm leading-6">
            Please review the following information carefully. These guidelines are
            tailored to your current situation and location.
          </StyledText>
        </StyledView>

        {/* Legal Rights Section */}
        <StyledView className="bg-[#F8FAFC] rounded-[40px] p-6 mb-6 border border-[#F1F5F9]">
          <StyledTouchableOpacity
            activeOpacity={0.7}
            onPress={() => setLegalRightsExpanded(!legalRightsExpanded)}
            className="flex-row items-center justify-between mb-4"
          >
            <StyledView className="flex-row items-center">
              <StyledView className="w-10 h-10 bg-[#FFF7ED] rounded-xl items-center justify-center mr-4">
                <Ionicons name="hammer-outline" size={20} color="#FB923C" />
              </StyledView>
              <StyledText className="text-[#FB923C] text-lg font-bold">
                Legal Rights
              </StyledText>
            </StyledView>
            <Ionicons
              name={legalRightsExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#94A3B8"
            />
          </StyledTouchableOpacity>

          {legalRightsExpanded && (
            <StyledView>
              <StyledView className="mb-4">
                <StyledText className="text-[#1F2937] text-base font-bold mb-2">
                  Right to Silence
                </StyledText>
                <StyledText className="text-[#64748B] text-xs leading-5">
                  You have the right to remain silent. Anything you say can be used
                  against you in legal proceedings. It is crucial to understand that
                  silence cannot be used as an admission of guilt.
                </StyledText>
              </StyledView>

              <StyledView className="mb-6">
                <StyledText className="text-[#1F2937] text-base font-bold mb-2">
                  Legal Counsel
                </StyledText>
                <StyledText className="text-[#64748B] text-xs leading-5">
                  You have the right to legal counsel immediately. If you cannot afford
                  a private attorney, a public defender must be appointed to you prior
                  to any interrogation.
                </StyledText>
              </StyledView>

              {/* Interpreter Access Box */}
              <StyledView className="bg-white rounded-[24px] overflow-hidden border border-[#F1F5F9] shadow-sm relative">
                <StyledView className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FB923C]" />
                <StyledView className="p-6">
                  <StyledText className="text-[#FB923C] text-xs font-bold uppercase tracking-widest mb-2">
                    Interpreter Access
                  </StyledText>
                  <StyledText className="text-[#94A3B8] text-xs leading-5">
                    You are entitled to a state-provided interpreter for all official
                    questioning if you are not fluent in the primary language.
                  </StyledText>
                </StyledView>
              </StyledView>
            </StyledView>
          )}
        </StyledView>

        {/* Info Cards Grid */}
        <StyledView className="flex-row space-x-4 mb-6">
          <StyledTouchableOpacity
            activeOpacity={0.8}
            className="flex-1 bg-[#005B96] rounded-[32px] p-4 h-40 justify-between"
          >
            <StyledView className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
              <Ionicons name="globe-outline" size={20} color="white" />
            </StyledView>
            <StyledView>
              <StyledText className="text-white text-base font-bold mb-1">
                Cultural Rights
              </StyledText>
              <StyledText className="text-white/60 text-[10px] leading-4">
                Universal protections for identity & heritage
              </StyledText>
            </StyledView>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            activeOpacity={0.8}
            className="flex-1 bg-[#005B96] rounded-[32px] p-4 h-40 justify-between"
          >
            <StyledView className="w-10 h-10 bg-white/20 rounded-xl items-center justify-center">
              <Ionicons name="eye-outline" size={20} color="white" />
            </StyledView>
            <StyledView>
              <StyledText className="text-white text-base font-bold mb-1">
                What to Expect
              </StyledText>
              <StyledText className="text-white/60 text-[10px] leading-4">
                Step-by-step walkthrough of the legal process
              </StyledText>
            </StyledView>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Action Bar */}
        <StyledView className="bg-[#F0F7FF] rounded-[24px] p-4 flex-row items-center border border-[#E0F2FE] mb-8">
          <StyledTouchableOpacity className="flex-1 flex-row items-center justify-center">
            <Ionicons name="bookmark-outline" size={22} color="#FB923C" />
            <StyledText className="text-[#FB923C] text-xs font-bold ml-3 text-center">
              Save to{"\n"}History
            </StyledText>
          </StyledTouchableOpacity>

          <StyledView className="w-[1px] h-8 bg-[#E2E8F0] mx-2" />

          <StyledTouchableOpacity className="flex-1 flex-row items-center justify-center">
            <Ionicons name="share-social-outline" size={22} color="#FB923C" />
            <StyledText className="text-[#FB923C] text-xs font-bold ml-3 text-center">
              Share{"\n"}Report
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Local Storage Indicator */}
        <StyledView className="flex-row items-center justify-center opacity-40">
          <Ionicons name="lock-closed-outline" size={16} color="#64748B" />
          <StyledText className="text-[#64748B] text-xs ml-2">
            Info saved to local storage.
          </StyledText>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
