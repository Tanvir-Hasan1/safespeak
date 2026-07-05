import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
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

export default function IncidentDetails() {
  const router = useRouter();
  const { t } = useLanguage();

  // Header visible state
  const [headerVisible, setHeaderVisible] = useState(true);

  // Form State
  const [title, setTitle] = useState("Harassment near main corridor");
  const [date, setDate] = useState("sdf");
  const [location, setLocation] = useState("main corridor");
  const [summary, setSummary] = useState(
    "A manager used threatening language and blocked the reporter's path"
  );

  // Ask Approved Sources Input
  const [askQuery, setAskQuery] = useState(
    "What support or evidence options should I consider for this report?"
  );

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    if (currentOffsetY <= 10) {
      setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      setHeaderVisible(false);
    }
  };

  // Dynamic completeness calculation
  const getCompleteness = () => {
    let score = 0;
    if (title.trim()) score += 25;
    if (date.trim() && date !== "sdf") score += 25;
    if (location.trim()) score += 25;
    if (summary.trim()) score += 25;
    return score || 25; // Base score
  };

  const handleNext = () => {
    Alert.alert(
      "Report Saved as Draft",
      "Your incident details have been secured.",
      [
        {
          text: "Return Home",
          onPress: () => router.push("/home"),
        },
        { text: "Dismiss", style: "cancel" },
      ]
    );
  };

  const handleAiHelper = (helperName) => {
    if (helperName === "Generate summary") {
      setSummary(
        "A senior manager repeatedly used intimidating language and physical blocking techniques near the main corridor entrance, obstructing my exit path."
      );
      Alert.alert(
        "AI Summary Generated",
        "A professional, information-only summary draft has been updated in the summary field."
      );
    } else if (helperName === "Extract fields") {
      Alert.alert(
        "Extracted Fields",
        "• Involved Party: Manager\n• Action: Threatening & Blocking\n• Zone: Main corridor\n• Incident Date: Pending verification"
      );
    } else if (helperName === "Clarifying questions") {
      Alert.alert(
        "Clarifying Questions",
        "1. Did this occurrence happen during working hours?\n2. Were there any other team members present as witnesses?"
      );
    } else {
      Alert.alert("AI helper", `${helperName} trigger simulated successfully.`);
    }
  };

  const handleAskSource = () => {
    if (!askQuery.trim()) return;
    Alert.alert(
      "Source Citation Found",
      "According to NSW Fair Work guidelines, keep logs of all incidents, including dates, witnesses, and details of conversation. Reach out to HR or legal services immediately."
    );
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText="Report Submission"
        rightText="Cancel"
        headerVisible={headerVisible}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        className="flex-1"
      >
        <StyledScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
        >
          {/* Main Title & Progress Block */}
          <StyledView className="w-full mt-4 mb-5">
            <StyledText className="text-[#64748B] text-[9.5px] font-extrabold uppercase tracking-widest mb-1.5">
              INCIDENT BUILDER
            </StyledText>
            <StyledText className="text-[#002B49] text-3xl font-black mb-2">
              Incident Details
            </StyledText>
            <StyledText className="text-[#64748B] text-xs leading-5 mb-4">
              Capture key facts clearly so the right team can respond quickly.
            </StyledText>

            {/* Step progress bar segments */}
            <StyledView className="flex-row items-center justify-between space-x-1.5 mb-1.5">
              <StyledView className="h-1.5 bg-[#005B96] rounded-full flex-1" />
              <StyledView className="h-1.5 bg-[#005B96] rounded-full flex-1" />
              <StyledView className="h-1.5 bg-[#E2E8F0] rounded-full flex-1" />
              <StyledView className="h-1.5 bg-[#E2E8F0] rounded-full flex-1" />
              <StyledView className="h-1.5 bg-[#E2E8F0] rounded-full flex-1" />
            </StyledView>
            <StyledText className="text-[#005B96] text-[9px] font-extrabold uppercase tracking-wider">
              STEP 2 OF 5
            </StyledText>
          </StyledView>

          {/* Safety-First Report Flow Card */}
          <StyledView className="w-full bg-[#EFF6FF] border border-[#BFDBFE] rounded-[24px] p-5 mb-5 shadow-xs">
            <StyledView className="flex-row items-start mb-2">
              <Ionicons name="shield-checkmark" size={16} color="#005B96" className="mt-0.5" />
              <StyledText className="text-[#005B96] text-[10px] font-extrabold uppercase tracking-widest ml-2">
                SAFETY-FIRST REPORT FLOW
              </StyledText>
            </StyledView>
            <StyledText className="text-[#4B5563] text-xs leading-5 mb-4">
              Nothing is auto-submitted on entry. Reports are created, updated, or prepared only when you explicitly continue or save.
            </StyledText>
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home/smart-dialer")}
              className="bg-white border border-[#CBD5E1] py-2 px-4 rounded-full flex-row items-center self-start"
            >
              <Ionicons name="call" size={12} color="#005B96" />
              <StyledText className="text-[#005B96] text-[11px] font-bold ml-1.5">
                Smart Dialer
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Form Fields Card */}
          <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-5 shadow-xs mb-5">
            {/* Incident Title */}
            <StyledView className="mb-4">
              <StyledText className="text-[#7E90A8] text-[9px] font-extrabold uppercase tracking-wider">
                INCIDENT TITLE
              </StyledText>
              <StyledTextInput
                value={title}
                onChangeText={setTitle}
                className="bg-white rounded-xl border border-[#D7E1EE] p-3 text-xs font-semibold text-[#1F2A3A] mt-1.5 h-[42px]"
                placeholder="Enter incident title..."
                placeholderTextColor="#94A3B8"
              />
            </StyledView>

            {/* Date */}
            <StyledView className="mb-4">
              <StyledText className="text-[#7E90A8] text-[9px] font-extrabold uppercase tracking-wider">
                DATE
              </StyledText>
              <StyledTextInput
                value={date}
                onChangeText={setDate}
                className="bg-white rounded-xl border border-[#D7E1EE] p-3 text-xs font-semibold text-[#1F2A3A] mt-1.5 h-[42px]"
                placeholder="Enter date..."
                placeholderTextColor="#94A3B8"
              />
            </StyledView>

            {/* Location */}
            <StyledView className="mb-4">
              <StyledText className="text-[#7E90A8] text-[9px] font-extrabold uppercase tracking-wider">
                LOCATION
              </StyledText>
              <StyledTextInput
                value={location}
                onChangeText={setLocation}
                className="bg-white rounded-xl border border-[#D7E1EE] p-3 text-xs font-semibold text-[#1F2A3A] mt-1.5 h-[42px]"
                placeholder="Enter location..."
                placeholderTextColor="#94A3B8"
              />
            </StyledView>

            {/* Summary */}
            <StyledView>
              <StyledText className="text-[#7E90A8] text-[9px] font-extrabold uppercase tracking-wider">
                SUMMARY
              </StyledText>
              <StyledTextInput
                value={summary}
                onChangeText={setSummary}
                multiline
                numberOfLines={4}
                className="bg-white rounded-xl border border-[#D7E1EE] p-3 text-xs font-semibold text-[#1F2A3A] mt-1.5 min-h-[90px] textAlignVertical-top"
                placeholder="Describe details here..."
                placeholderTextColor="#94A3B8"
              />
            </StyledView>
          </StyledView>

          {/* Completeness Card */}
          <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-5 shadow-xs mb-5">
            <StyledText className="text-[#7E90A8] text-[9px] font-extrabold uppercase tracking-wider mb-2.5">
              COMPLETENESS
            </StyledText>
            {/* Progress bar */}
            <StyledView className="h-2 bg-[#E7EEF8] rounded-full w-full mb-2">
              <StyledView
                style={{ width: `${getCompleteness()}%` }}
                className="h-2 bg-[#0F5D9F] rounded-full"
              />
            </StyledView>
            <StyledText className="text-[#1F2A3A] text-xs font-bold mb-4">
              {getCompleteness()}% completed
            </StyledText>

            {/* Checklist bullets */}
            <StyledView className="space-y-2">
              <StyledView className="flex-row items-center">
                <Ionicons
                  name="shield-checkmark"
                  size={13}
                  color={title.trim() ? "#0F5D9F" : "#94A3B8"}
                />
                <StyledText className="text-[#60728A] text-[10.5px] font-semibold ml-2">
                  Incident type identified
                </StyledText>
              </StyledView>

              <StyledView className="flex-row items-center">
                <Ionicons
                  name="folder-open"
                  size={13}
                  color={summary.trim() ? "#0F5D9F" : "#94A3B8"}
                />
                <StyledText className="text-[#60728A] text-[10.5px] font-semibold ml-2">
                  Who/What/Where captured
                </StyledText>
              </StyledView>

              <StyledView className="flex-row items-center">
                <Ionicons
                  name="time"
                  size={13}
                  color={getCompleteness() === 100 ? "#0F5D9F" : "#94A3B8"}
                />
                <StyledText className="text-[#60728A] text-[10.5px] font-semibold ml-2">
                  Add evidence to strengthen case
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledView>

          {/* AI Report Helpers Card */}
          <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-5 shadow-xs mb-5">
            <StyledText className="text-[#7E90A8] text-[9px] font-extrabold uppercase tracking-wider mb-1.5">
              AI REPORT HELPERS
            </StyledText>
            <StyledText className="text-[#64748B] text-[11px] leading-4.5 font-semibold mb-3">
              AI output is information-only. Review and edit every suggestion before applying it to the draft.
            </StyledText>

            {/* Human review pill */}
            <StyledView className="bg-[#FFF8E7] border border-[#FEE2E2]/35 rounded-full px-3 py-1 self-start mb-4">
              <StyledText className="text-[#D97706] text-[9.5px] font-bold uppercase tracking-wider">
                Human review required
              </StyledText>
            </StyledView>

            {/* AI Action Rows */}
            <StyledView className="space-y-3">
              {[
                { title: "Extract fields", desc: "Preview who, what, when, where, and risk fields." },
                { title: "Clarifying questions", desc: "Generate questions to fill gaps before review." },
                { title: "Generate summary", desc: "Draft an information-only summary for review." },
                { title: "Triage preview", desc: "Preview support needs and recommended next steps." },
                { title: "Translate", desc: "Translate the summary while preserving tone." },
                { title: "Redact PII", desc: "Create a redacted version of the summary." },
              ].map((helper, idx) => (
                <StyledTouchableOpacity
                  key={idx}
                  activeOpacity={0.8}
                  onPress={() => handleAiHelper(helper.title)}
                  className="bg-[#F8FAFC] border border-[#CBD5E1]/30 p-3.5 rounded-[20px] flex-row items-center"
                >
                  <StyledView className="w-8 h-8 rounded-full bg-[#EFF6FF] items-center justify-center mr-3">
                    <Ionicons name="sparkles-outline" size={13} color="#005B96" />
                  </StyledView>
                  <StyledView className="flex-1 pr-2">
                    <StyledText className="text-[#002B49] text-xs font-bold">
                      {helper.title}
                    </StyledText>
                    <StyledText className="text-[#64748B] text-[10px] leading-4 font-semibold mt-0.5">
                      {helper.desc}
                    </StyledText>
                  </StyledView>
                  <Ionicons name="chevron-forward" size={14} color="#94A3B8" />
                </StyledTouchableOpacity>
              ))}
            </StyledView>
          </StyledView>

          {/* Ask Approved Sources Card */}
          <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-5 shadow-xs mb-6">
            <StyledText className="text-[#7E90A8] text-[9px] font-extrabold uppercase tracking-wider mb-1.5">
              ASK APPROVED SOURCES
            </StyledText>
            <StyledText className="text-[#64748B] text-[11px] leading-4.5 font-semibold mb-3">
              Use this for source-backed questions while crafting. No citations means SafeSpeak shows a fallback instead of a legal conclusion.
            </StyledText>

            <StyledTextInput
              value={askQuery}
              onChangeText={setAskQuery}
              className="bg-white rounded-xl border border-[#D7E1EE] p-3 text-xs font-semibold text-[#1F2A3A] mb-4 min-h-[46px]"
              placeholder="Type your question..."
              placeholderTextColor="#94A3B8"
            />

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={handleAskSource}
              className="bg-[#005B96] py-3 rounded-full flex-row justify-center items-center shadow-xs"
            >
              <Ionicons name="search" size={14} color="white" className="mr-1.5" />
              <StyledText className="text-white text-xs font-bold">
                Ask
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Bottom Actions Row */}
          <StyledView className="flex-row justify-between items-center mt-2 mb-4">
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back()}
              className="bg-[#F8FAFC] border border-[#CBD5E1] py-3 px-6 rounded-full"
            >
              <StyledText className="text-[#334155] text-xs font-bold">
                Back
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={handleNext}
              className="bg-[#005B96] py-3 px-6 rounded-full flex-row items-center shadow-xs"
            >
              <StyledText className="text-white text-xs font-bold mr-1.5">
                Next: Evidence
              </StyledText>
              <Ionicons name="chevron-forward" size={13} color="white" />
            </StyledTouchableOpacity>
          </StyledView>

        </StyledScrollView>
      </KeyboardAvoidingView>
    </StyledView>
  );
}
