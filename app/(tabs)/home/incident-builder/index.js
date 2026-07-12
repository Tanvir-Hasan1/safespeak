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
  Modal,
  Image,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import CustomHeader from "../../../../components/CustomHeader";
import { useLanguage } from "../../../../context/LanguageContext";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledImage = styled(Image);

export default function IncidentDetails() {
  const router = useRouter();
  const { t } = useLanguage();

  // Header visible state
  const [headerVisible, setHeaderVisible] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
 
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
 
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);
  const [location, setLocation] = useState("");
  const [summary, setSummary] = useState("");

  // Ask Approved Sources Input
  const [askQuery, setAskQuery] = useState("");

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
    router.push("/home/report-submission/evidence-review");
  };

  // Evidence file picker
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
        multiple: true,
      });
      if (!result.canceled && result.assets?.length > 0) {
        const newFiles = result.assets.map((asset) => {
          const mime = asset.mimeType || "";
          const isMedia = mime.startsWith("image/") || mime.startsWith("video/");
          return { uri: asset.uri, name: asset.name, mimeType: mime, isMedia };
        });
        setEvidenceFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (err) {
      console.warn("File pick error:", err);
    }
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
              <StyledTouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowDatePicker(true)}
                className="bg-white rounded-xl border border-[#D7E1EE] p-3 mt-1.5 h-[42px] justify-between flex-row items-center"
              >
                <StyledText className={`text-xs font-semibold ${date ? 'text-[#1F2A3A]' : 'text-[#94A3B8]'}`}>
                  {date || "Select date..."}
                </StyledText>
                <Ionicons name="calendar-outline" size={16} color="#94A3B8" />
              </StyledTouchableOpacity>
            </StyledView>

            {showDatePicker && (
              <Modal
                transparent
                animationType="fade"
                visible={showDatePicker}
                onRequestClose={() => setShowDatePicker(false)}
              >
                <StyledTouchableOpacity
                  activeOpacity={1}
                  onPress={() => setShowDatePicker(false)}
                  className="flex-1 bg-black/40 justify-center items-center px-6"
                >
                  <StyledTouchableOpacity
                    activeOpacity={1}
                    className="w-full bg-white rounded-[28px] p-5 shadow-lg border border-[#E2E8F0]"
                  >
                    {/* Header */}
                    <StyledView className="flex-row justify-between items-center mb-4">
                      <StyledTouchableOpacity
                        onPress={() => {
                          if (currentMonth === 0) {
                            setCurrentMonth(11);
                            setCurrentYear(c => c - 1);
                          } else {
                            setCurrentMonth(c => c - 1);
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-[#F1F5F9] items-center justify-center"
                      >
                        <Ionicons name="chevron-back" size={16} color="#475569" />
                      </StyledTouchableOpacity>

                      <StyledText className="text-[#0F172A] font-bold text-sm">
                        {monthNames[currentMonth]} {currentYear}
                      </StyledText>

                      <StyledTouchableOpacity
                        onPress={() => {
                          if (currentMonth === 11) {
                            setCurrentMonth(0);
                            setCurrentYear(c => c + 1);
                          } else {
                            setCurrentMonth(c => c + 1);
                          }
                        }}
                        className="w-8 h-8 rounded-full bg-[#F1F5F9] items-center justify-center"
                      >
                        <Ionicons name="chevron-forward" size={16} color="#475569" />
                      </StyledTouchableOpacity>
                    </StyledView>

                    {/* Weekday labels */}
                    <StyledView className="flex-row mb-2">
                      {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                        <StyledText key={day} className="flex-1 text-center text-[10px] font-bold text-[#94A3B8]">
                          {day}
                        </StyledText>
                      ))}
                    </StyledView>

                    {/* Days grid */}
                    <StyledView className="flex-row flex-wrap">
                      {daysArray.map((day, idx) => (
                        <StyledTouchableOpacity
                          key={idx}
                          disabled={day === null}
                          onPress={() => {
                            const formattedDay = String(day).padStart(2, "0");
                            const formattedMonth = String(currentMonth + 1).padStart(2, "0");
                            setDate(`${formattedDay}/${formattedMonth}/${currentYear}`);
                            setShowDatePicker(false);
                          }}
                          className={`w-[14.28%] h-9 items-center justify-center rounded-lg`}
                        >
                          <StyledText className={`text-xs font-semibold ${
                            day === null ? "text-transparent" : "text-[#1F2A3A]"
                          }`}>
                            {day || ""}
                          </StyledText>
                        </StyledTouchableOpacity>
                      ))}
                    </StyledView>

                    {/* Footer Close */}
                    <StyledTouchableOpacity
                      onPress={() => setShowDatePicker(false)}
                      className="mt-4 bg-[#F1F5F9] py-2 rounded-xl items-center"
                    >
                      <StyledText className="text-[#475569] text-xs font-bold">
                        Cancel
                      </StyledText>
                    </StyledTouchableOpacity>
                  </StyledTouchableOpacity>
                </StyledTouchableOpacity>
              </Modal>
            )}

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

            {/* What Happened */}
            <StyledView>
              <StyledText className="text-[#7E90A8] text-[9px] font-extrabold uppercase tracking-wider">
                WHAT HAPPENED
              </StyledText>
              <StyledTextInput
                value={summary}
                onChangeText={setSummary}
                multiline
                numberOfLines={4}
                className="bg-white rounded-xl border border-[#D7E1EE] p-3 text-xs font-semibold text-[#1F2A3A] mt-1.5 min-h-[90px] textAlignVertical-top"
                placeholder="Describe what happened in your own words. Include who was involved, where it happened, and anything you want the receiving team to understand."
                placeholderTextColor="#94A3B8"
              />
            </StyledView>
          </StyledView>

          {/* Evidence Card */}
          <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-5 shadow-xs mb-5">
            {/* Header */}
            <StyledText className="text-[#7E90A8] text-[9px] font-extrabold uppercase tracking-wider mb-1">
              EVIDENCE
            </StyledText>
            <StyledText className="text-[#0F172A] text-xl font-black mb-1">
              Attach supporting files
            </StyledText>
            <StyledText className="text-[#64748B] text-xs leading-4 mb-4">
              Add screenshots, documents, audio, video, or photos if you want them included with the report.
            </StyledText>

            {/* File count badge */}
            <StyledView className="bg-[#FFF8E7] border border-[#FDE68A] rounded-full px-3.5 py-1 self-start mb-4">
              <StyledText className="text-[#92400E] text-[10px] font-bold">
                {evidenceFiles.length} {evidenceFiles.length === 1 ? "file" : "files"} ready
              </StyledText>
            </StyledView>

            {/* Preview tiles for images/videos */}
            {evidenceFiles.filter(f => f.isMedia).length > 0 && (
              <StyledView className="flex-row flex-wrap gap-2 mb-4">
                {evidenceFiles.filter(f => f.isMedia).map((file, idx) => (
                  <StyledView key={idx} className="w-20 h-20 rounded-xl overflow-hidden border border-[#E2E8F0] relative">
                    <StyledImage
                      source={{ uri: file.uri }}
                      className="w-full h-full"
                      style={{ resizeMode: "cover" }}
                    />
                    <StyledTouchableOpacity
                      onPress={() => setEvidenceFiles(prev => prev.filter((_, i) => i !== evidenceFiles.indexOf(file)))}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full items-center justify-center"
                    >
                      <Ionicons name="close" size={10} color="white" />
                    </StyledTouchableOpacity>
                  </StyledView>
                ))}
              </StyledView>
            )}

            {/* Non-media file list */}
            {evidenceFiles.filter(f => !f.isMedia).length > 0 && (
              <StyledView className="mb-4 space-y-2">
                {evidenceFiles.filter(f => !f.isMedia).map((file, idx) => (
                  <StyledView key={idx} className="flex-row items-center bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5">
                    <Ionicons name="document-outline" size={16} color="#475569" />
                    <StyledText className="flex-1 text-[#334155] text-[11px] font-semibold ml-2" numberOfLines={1}>
                      {file.name}
                    </StyledText>
                    <StyledTouchableOpacity
                      onPress={() => setEvidenceFiles(prev => prev.filter((_, i) => i !== evidenceFiles.indexOf(file)))}
                    >
                      <Ionicons name="close-circle" size={16} color="#94A3B8" />
                    </StyledTouchableOpacity>
                  </StyledView>
                ))}
              </StyledView>
            )}

            {/* Upload zone */}
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={handlePickFile}
              className="border border-dashed border-[#CBD5E1] rounded-[20px] py-8 px-4 items-center justify-center bg-[#FAFBFD]"
            >
              <Ionicons name="folder" size={32} color="#F59E0B" style={{ marginBottom: 8 }} />
              <StyledText className="text-[#0F172A] text-xs font-bold text-center">
                Drag, drop, or click to upload
              </StyledText>
              <StyledText className="text-[#64748B] text-[10px] text-center mt-1 leading-4">
                Images, video, audio, PDF,{"\n"}DOC, DOCX, and TXT are{"\n"}supported.
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Bottom Actions Row */}
          <StyledView className="flex-row justify-between items-center mt-2 mb-4">
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.back()}
              className="bg-white border border-[#CBD5E1] py-3 px-6 rounded-full"
            >
              <StyledText className="text-[#334155] text-xs font-bold">
                Save draft
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={handleNext}
              className="bg-[#0A66A8] py-3 px-6 rounded-full flex-row items-center shadow-xs"
            >
              <StyledText className="text-white text-xs font-bold mr-1.5">
                Continue to Review
              </StyledText>
              <Ionicons name="chevron-forward" size={13} color="white" />
            </StyledTouchableOpacity>
          </StyledView>

        </StyledScrollView>
      </KeyboardAvoidingView>
    </StyledView>
  );
}
