import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";
import { useLanguage } from "../../../../context/LanguageContext";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

export default function EvidenceReview() {
  const router = useRouter();
  const { t } = useLanguage();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [expandedId, setExpandedId] = useState("WHO");

  // State for AI-assisted timeline items
  const [timelineItems, setTimelineItems] = useState([
    {
      id: "WHO",
      label: "WHO",
      content: "Not provided yet",
      isProvided: false,
    },
    {
      id: "WHAT",
      label: "WHAT",
      content: "A manager used threatening language and blocked my path near the elevator. Two colleagues witnessed the incident.",
      isProvided: true,
    },
    {
      id: "WHEN",
      label: "WHEN",
      content: "2026-02-22",
      isProvided: true,
    },
    {
      id: "WHERE",
      label: "WHERE",
      content: "Building A, Corridor 2",
      isProvided: true,
    },
    {
      id: "HOW",
      label: "HOW",
      content: "Not provided yet",
      isProvided: false,
    },
    {
      id: "WITNESSES",
      label: "WITNESSES",
      content: "Not provided yet",
      isProvided: false,
    },
    {
      id: "REPEATED",
      label: "REPEATED",
      content: "Not provided yet",
      isProvided: false,
    },
    {
      id: "INJURIES",
      label: "INJURIES",
      content: "Not provided yet",
      isProvided: false,
    },
    {
      id: "EVIDENCE",
      label: "EVIDENCE",
      content: "Not provided yet",
      isProvided: false,
    },
  ]);

  // Search input state
  const [askQuery, setAskQuery] = useState(
    "What should I review before choosing a support or government contact?"
  );

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y <= 10) setHeaderVisible(true);
    else if (y > 50) setHeaderVisible(false);
  };

  const handleAddManualEntry = () => {
    Alert.prompt(
      "Add Manual Entry",
      "Enter details for this custom timeline point:",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Add",
          onPress: (text) => {
            if (!text || text.trim() === "") return;
            const newId = `CUSTOM_${Date.now()}`;
            setTimelineItems((prev) => [
              ...prev,
              {
                id: newId,
                label: "MANUAL ENTRY",
                content: text,
                isProvided: true,
              },
            ]);
            setExpandedId(newId);
          },
        },
      ],
      "plain-text"
    );
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        backText="Timeline Builder"
        rightIcon="time-outline"
        onRightPress={() => Alert.alert("History", "No history found.")}
        headerVisible={headerVisible}
        showCancel={false}
      />

      <StyledScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Title & Description */}
        <StyledView className="mt-6 mb-5 items-center">
          <StyledText className="text-[#0B5A9E] text-3xl font-extrabold text-center">
            Evidence Review
          </StyledText>
          <StyledText className="text-[#6B7280] text-[13px] text-center leading-5 mt-2 px-3">
            If AI-assisted structuring was used, verify the timeline below before
            saving this prepared report for review.
          </StyledText>
        </StyledView>

        {/* Backend Status Card */}
        <StyledView className="bg-white rounded-[16px] px-5 py-4 border border-[#E2E8F0] shadow-sm mb-3">
          <StyledText className="text-[#1F2937] text-[13px] font-bold">
            Current backend status: <StyledText className="text-[#6B7280]">draft</StyledText>
          </StyledText>
        </StyledView>

        {/* Local Warning Info Card */}
        <StyledView className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] shadow-sm mb-4">
          <StyledText className="text-[#4B5563] text-[12px] leading-[18px]">
            Choose a police, government, or support contact from the admin-managed
            directory. SafeSpeak will not call, email, or share anything automatically:
            you decide whether to contact directly or share the prepared information.
          </StyledText>
          <StyledText className="text-[#B45309] text-[11px] font-bold leading-[16px] mt-3">
            Stored locally only: some review fields are shown from this browser session and are not stored in the backend.
          </StyledText>
        </StyledView>

        {/* Review with Approved Sources Card */}
        <StyledView className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] shadow-sm mb-4">
          <StyledText className="text-[#0B5A9E] text-[11px] font-bold uppercase tracking-wider mb-1">
            REVIEW WITH APPROVED SOURCES
          </StyledText>
          <StyledText className="text-[#6B7280] text-[11px] leading-4 mb-4">
            Ask a cited question before sharing. If approved sources are insufficient,
            SafeSpeak shows a fallback and no fake citations.
          </StyledText>

          <StyledTextInput
            value={askQuery}
            onChangeText={setAskQuery}
            multiline
            placeholder="Type your question..."
            className="border border-[#E2D6F0] bg-[#F8FAFF] rounded-[10px] p-3 text-[12px] text-[#374151] min-h-[44px] mb-3"
          />

          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert("Ask Support", `Query submitted: "${askQuery}"`)}
            className="bg-[#0B5A9E] rounded-[10px] py-[10px] flex-row items-center justify-center"
          >
            <Ionicons name="search" size={14} color="white" />
            <StyledText className="text-white text-xs font-bold ml-1.5">Ask</StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Contact Option Card */}
        <StyledView className="bg-white rounded-[20px] p-5 border border-[#E2E8F0] shadow-sm mb-5">
          <StyledView className="flex-row items-center justify-between mb-1">
            <StyledText className="text-[#7C8DA3] text-[11px] font-bold uppercase tracking-wider">
              CONTACT OPTION
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[10px] font-bold">
              0 options available
            </StyledText>
          </StyledView>
          <StyledText className="text-[#374151] text-[11.5px] leading-5 mb-4">
            Language 'en' in 'NSW'.
          </StyledText>

          <StyledView className="bg-[#FFFBEB] rounded-[10px] border border-[#FEF3C7] p-3">
            <StyledText className="text-[#B45309] text-[11px] leading-4 font-semibold text-center">
              No active destinations match this report yet. Add or activate them in the admin dashboard.
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Timeline Section */}
        <StyledView className="relative pl-7 mb-5">
          {/* Vertical line */}
          <StyledView className="absolute left-[11px] top-4 bottom-2 w-[2px] bg-[#E2E8F0]" />

          {timelineItems.map((item) => {
            const isOpen = expandedId === item.id;
            return (
              <StyledView key={item.id} className="relative mb-4">
                {/* Dot marker on line */}
                <StyledView
                  className={`absolute -left-[26px] top-[14px] w-5 h-5 rounded-full border-[3px] border-white z-10 items-center justify-center shadow-sm ${isOpen ? "bg-[#0B5A9E]" : "bg-[#CBD5E1]"
                    }`}
                />

                {/* Main Card */}
                <StyledView
                  className={`bg-white rounded-[24px] border border-[#E2E8F0] shadow-sm overflow-hidden ${isOpen ? "border-l-[6px] border-l-[#0B5A9E] p-5" : "p-4"
                    }`}
                >
                  <StyledTouchableOpacity
                    activeOpacity={0.75}
                    onPress={() => setExpandedId(isOpen ? null : item.id)}
                    className="flex-row items-center justify-between"
                  >
                    <StyledView
                      className={`px-2.5 py-0.5 rounded-md ${isOpen ? "bg-[#EFF6FF]" : "bg-transparent"
                        }`}
                    >
                      <StyledText
                        className={`text-[10px] font-bold tracking-[1.5px] ${isOpen ? "text-[#0B5A9E]" : "text-[#7C8DA3]"
                          }`}
                      >
                        {item.label}
                      </StyledText>
                    </StyledView>
                    <Ionicons
                      name={isOpen ? "chevron-up" : "chevron-down"}
                      size={14}
                      color="#8FA0B6"
                    />
                  </StyledTouchableOpacity>

                  {isOpen ? (
                    <StyledView className="mt-3">
                      <StyledText className="text-[#1F2937] text-[13px] leading-5 font-semibold">
                        {item.content}
                      </StyledText>
                      <StyledText className="text-[#B45309] text-[11px] font-semibold mt-2.5">
                        Stored locally only
                      </StyledText>
                    </StyledView>
                  ) : (
                    <StyledText
                      numberOfLines={1}
                      className="text-[#6B7280] text-[12px] mt-1.5 leading-4"
                    >
                      {item.content}
                    </StyledText>
                  )}
                </StyledView>
              </StyledView>
            );
          })}
        </StyledView>

        {/* Dash Box to Add Manual Entry */}
        <StyledView className="pl-7 mb-6">
          <StyledTouchableOpacity
            activeOpacity={0.7}
            onPress={handleAddManualEntry}
            className="w-full rounded-[16px] border border-dashed border-[#CBD5E1] items-center justify-center bg-[#F8FAFC] py-[14px]"
          >
            <StyledView className="flex-row items-center">
              <Ionicons name="add-circle" size={18} color="#94A3B8" />
              <StyledText className="text-xs text-[#94A3B8] font-bold ml-1.5">
                Add Manual Entry
              </StyledText>
            </StyledView>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Share Action Button */}
        <StyledTouchableOpacity
          activeOpacity={0.82}
          onPress={() => {
            Alert.alert(
              "Share Report",
              "Do you want to finalize and share this timeline with selected services?",
              [
                { text: "Cancel" },
                {
                  text: "Share",
                  onPress: () => {
                    Alert.alert(
                      "Success",
                      "Report has been shared successfully.",
                      [
                        {
                          text: "OK",
                          onPress: () => router.replace("/home"),
                        },
                      ]
                    );
                  },
                },
              ]
            );
          }}
          className="bg-[#F59E0B] rounded-full py-[14px] flex-row items-center justify-center shadow-md mb-3"
        >
          <StyledText className="text-white text-sm font-bold">
            Share with selected service
          </StyledText>
          <Ionicons name="chevron-forward" size={14} color="white" className="ml-1" />
        </StyledTouchableOpacity>
      </StyledScrollView>
    </StyledView>
  );
}
