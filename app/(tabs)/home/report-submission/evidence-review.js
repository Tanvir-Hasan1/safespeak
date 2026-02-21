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

export default function EvidenceReview() {
  const router = useRouter();
  const [expanded, setExpanded] = useState("WHO");

  const timelineItems = [
    {
      id: "WHO",
      label: "WHO",
      content: "Officer John Doe",
      subLabel: "PERSON OF INTEREST",
      aiSuggested: true,
      confidence: "98% Confidence",
    },
    { id: "WHAT", label: "WHAT", content: "Verbal harassment incident..." },
    { id: "WHERE", label: "WHERE", content: "1234 Elm Street, Breakroom 4B" },
    { id: "WHEN", label: "WHEN", content: "Oct 14, 2023 - 2:30 PM EST" },
  ];

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title="Timeline Builder" showCancel={true} />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <StyledView className="mt-4 mb-8">
          <StyledText className="text-[#005B96] text-3xl font-bold mb-2">
            Evidence Review
          </StyledText>
          <StyledText className="text-[#64748B] text-base leading-6">
            Our AI has structured your narrative. Please verify the timeline
            events below before final submission.
          </StyledText>
        </StyledView>

        {/* Timeline List */}
        <StyledView className="relative">
          {/* Vertical Line */}
          <StyledView className="absolute left-[11px] top-4 bottom-2 w-[2px] bg-[#E2E8F0]" />

          {timelineItems.map((item) => (
            <StyledView key={item.id} className="flex-row items-start mb-6">
              {/* Dot */}
              <StyledView
                className={`w-6 h-6 rounded-full border-4 border-[#F0F4FA] z-10 mr-4 ${
                  expanded === item.id ? "bg-[#005B96]" : "bg-[#CBD5E1]"
                }`}
              />

              {/* Card */}
              <StyledView
                className={`flex-1 bg-white rounded-[24px] border shadow-sm overflow-hidden ${
                  expanded === item.id
                    ? "border-[#FFCC80] p-6"
                    : "border-[#E2E8F0] p-4"
                }`}
              >
                <StyledTouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setExpanded(item.id === expanded ? null : item.id)}
                  className="flex-row items-center justify-between"
                >
                  <StyledView
                    className={`px-3 py-1 rounded-md ${
                      expanded === item.id ? "bg-[#E0F2FE]" : "bg-transparent"
                    }`}
                  >
                    <StyledText
                      className={`text-[10px] font-bold tracking-widest ${
                        expanded === item.id ? "text-[#005B96]" : "text-[#94A3B8]"
                      }`}
                    >
                      {item.label}
                    </StyledText>
                  </StyledView>
                  <Ionicons
                    name={expanded === item.id ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#94A3B8"
                  />
                </StyledTouchableOpacity>

                {expanded === item.id ? (
                  <StyledView className="mt-4">
                    {item.subLabel && (
                      <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase mb-1">
                        {item.subLabel}
                      </StyledText>
                    )}
                    <StyledText className="text-[#1F2937] text-xl font-bold mb-2">
                      {item.content}
                    </StyledText>
                    {item.aiSuggested && (
                      <StyledView className="flex-row items-center mb-6">
                        <Ionicons name="sparkles" size={14} color="#10B981" />
                        <StyledText className="text-[#10B981] text-xs font-medium ml-2">
                          AI Suggested • {item.confidence}
                        </StyledText>
                      </StyledView>
                    )}
                    <StyledTouchableOpacity className="flex-row items-center justify-end">
                      <Ionicons name="pencil" size={16} color="#FB923C" />
                      <StyledText className="text-[#FB923C] text-sm font-bold ml-2">
                        Edit Details
                      </StyledText>
                    </StyledTouchableOpacity>
                  </StyledView>
                ) : (
                  <StyledText className="text-[#1F2937] text-base font-medium mt-1">
                    {item.content}
                  </StyledText>
                )}
              </StyledView>
            </StyledView>
          ))}
        </StyledView>

        {/* Manual Entry Button container with left margin */}
        <StyledView className="ml-10">
          <StyledTouchableOpacity
            activeOpacity={0.7}
            className="flex-row items-center justify-center bg-[#F8FAFC] border-2 border-dashed border-[#E2E8F0] rounded-[24px] py-4"
          >
            <StyledView className="bg-[#FFEDD5] w-8 h-8 rounded-full items-center justify-center mr-3">
              <Ionicons name="add" size={20} color="#FB923C" />
            </StyledView>
            <StyledText className="text-[#1F2937] text-base font-bold">
              Add Manual Entry
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Submit Button in its own full-width container */}
        <StyledView className="mt-10">
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => {}}
            className="bg-[#FB923C] rounded-[24px] py-6 flex-row items-center justify-center shadow-lg shadow-orange-300"
          >
            <StyledText className="text-white text-lg font-bold">
              Submit Report
            </StyledText>
            <Ionicons name="send" size={20} color="white" className="ml-3" />
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
