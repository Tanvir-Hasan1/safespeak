import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Linking,
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

export default function IncidentHistory() {
  const router = useRouter();
  const { t } = useLanguage();

  const [headerVisible, setHeaderVisible] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "draft", "in_review"

  // Mock Incident History List (enabling fully demonstrable sorting & filtering)
  const initialIncidents = [
    {
      id: "SSR-20260704-OQHO2T3K",
      title: "Harassment near main corridor",
      date: "Updated 05 July 2026, 1:28 am",
      status: "draft",
    },
    {
      id: "SSR-20260706-XY78Z9A1",
      title: "Report of online safety incident",
      date: "Updated 06 July 2026, 4:15 pm",
      status: "in_review",
    },
  ];

  // Dynamic Metrics based on all records
  const totalReports = initialIncidents.length;
  const submittedOrReceived = initialIncidents.filter(
    (i) => i.status === "submitted" || i.status === "received"
  ).length;
  const lifecycleActions = initialIncidents.filter(
    (i) => i.status === "draft" || i.status === "in_review"
  ).length;

  // Filtered List
  const filteredIncidents = initialIncidents.filter((incident) => {
    const matchesSearch =
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || incident.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    if (currentOffsetY <= 10) {
      if (!headerVisible) setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      if (headerVisible) setHeaderVisible(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        backText={t("yourReports")}
        rightText={t("cancel")}
        blueTheme={false}
        showDivider={true}
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Main Card Wrapper */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-sm mb-8">
          {/* Incident History Header */}
          <StyledView className="items-center mb-6">
            <StyledView className="w-12 h-12 bg-[#EFF6FF] rounded-full items-center justify-center mb-3">
              <Ionicons name="folder-outline" size={24} color="#005B96" />
            </StyledView>
            <StyledText className="text-[#0F172A] text-[24px] font-bold text-center leading-8">
              {t("yourIncidentHistory")}
            </StyledText>
            <StyledText className="text-[#64748B] text-xs text-center mt-1.5 px-4 leading-4 font-semibold">
              {t("historySubtitle")}
            </StyledText>
          </StyledView>

          {/* Stats List */}
          <StyledView className="space-y-3 mb-6">
            {/* Total Reports */}
            <StyledView className="bg-white rounded-[20px] p-4 border border-[#EBF3FC] shadow-xs">
              <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider mb-1">
                {t("totalReportsLabel")}
              </StyledText>
              <StyledText className="text-[#005B96] text-3xl font-extrabold">
                {totalReports}
              </StyledText>
            </StyledView>

            {/* Submitted or Received */}
            <StyledView className="bg-white rounded-[20px] p-4 border border-[#EBF3FC] shadow-xs">
              <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider mb-1">
                {t("submittedOrReceivedLabel")}
              </StyledText>
              <StyledText className="text-[#137333] text-3xl font-extrabold">
                {submittedOrReceived}
              </StyledText>
            </StyledView>

            {/* Lifecycle Actions */}
            <StyledView className="bg-white rounded-[20px] p-4 border border-[#EBF3FC] shadow-xs">
              <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider mb-1">
                {t("lifecycleActionsLabel")}
              </StyledText>
              <StyledText className="text-[#D97706] text-3xl font-extrabold">
                {lifecycleActions}
              </StyledText>
            </StyledView>
          </StyledView>

          {/* Functional Search Box */}
          <StyledView className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-full flex-row items-center px-4 py-2.5 mb-6">
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <StyledTextInput
              className="flex-1 text-[#0F172A] text-xs ml-2 font-semibold p-0"
              placeholder={t("searchPlaceholder")}
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <StyledTouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={16} color="#94A3B8" />
              </StyledTouchableOpacity>
            )}
          </StyledView>

          {/* Interactive Filter Pills */}
          <StyledView className="flex-row items-center space-x-2 mb-6">
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveFilter("all")}
              className={`px-4 py-2 rounded-full ${
                activeFilter === "all"
                  ? "bg-[#005B96]"
                  : "bg-white border border-[#E2E8F0]"
              }`}
            >
              <StyledText
                className={`text-xs font-bold ${
                  activeFilter === "all" ? "text-white" : "text-[#64748B]"
                }`}
              >
                {t("allReportsLabel")}
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveFilter("draft")}
              className={`px-4 py-2 rounded-full ${
                activeFilter === "draft"
                  ? "bg-[#005B96]"
                  : "bg-white border border-[#E2E8F0]"
              }`}
            >
              <StyledText
                className={`text-xs font-bold ${
                  activeFilter === "draft" ? "text-white" : "text-[#64748B]"
                }`}
              >
                {t("draftsLabelText")}
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => setActiveFilter("in_review")}
              className={`px-4 py-2 rounded-full ${
                activeFilter === "in_review"
                  ? "bg-[#005B96]"
                  : "bg-white border border-[#E2E8F0]"
              }`}
            >
              <StyledText
                className={`text-xs font-bold ${
                  activeFilter === "in_review" ? "text-white" : "text-[#64748B]"
                }`}
              >
                {t("inReviewLabel")}
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Dynamic Incident List */}
          {filteredIncidents.length === 0 ? (
            <StyledText className="text-[#94A3B8] text-xs text-center my-8">
              No reports found matching your criteria.
            </StyledText>
          ) : (
            filteredIncidents.map((incident) => (
              <StyledView
                key={incident.id}
                className="bg-white border border-[#E2E8F0] rounded-[24px] p-5 shadow-xs mb-4"
              >
                {/* Top row with status badge and ref (preventing overlap) */}
                <StyledView className="flex-row items-center justify-between mb-3.5 flex-wrap gap-y-2">
                  <StyledView
                    className={`px-2.5 py-1 rounded-full flex-row items-center ${
                      incident.status === "draft" ? "bg-[#FEF3C7]" : "bg-[#EFF6FF]"
                    }`}
                  >
                    <StyledText
                      className={`text-[10px] font-extrabold uppercase ${
                        incident.status === "draft"
                          ? "text-[#D97706]"
                          : "text-[#005B96]"
                      }`}
                    >
                      •{" "}
                      {incident.status === "draft"
                        ? t("draftStatusLabel")
                        : t("inReviewLabel")}
                    </StyledText>
                  </StyledView>
                  <StyledText
                    className="text-[#94A3B8] text-[10px] font-bold flex-shrink ml-2 text-right"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    SafeSpeak ref {incident.id}
                  </StyledText>
                </StyledView>

                {/* Title & Timestamp */}
                <StyledText className="text-[#0F172A] text-[16px] font-bold mb-1">
                  {incident.title}
                </StyledText>
                <StyledText className="text-[#64748B] text-xs mb-5 font-semibold">
                  {incident.date}
                </StyledText>

                {/* Main Action Buttons */}
                <StyledTouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push("/home/report-submission/detail")}
                  className="bg-[#005B96] rounded-full py-3.5 flex-row items-center justify-center w-full mb-3 shadow-xs"
                >
                  <StyledText className="text-white font-bold text-sm">
                    {t("openDetail")}
                  </StyledText>
                </StyledTouchableOpacity>

                <StyledTouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => router.push("/home/report-submission/detail")}
                  className="bg-white border border-[#E2E8F0] rounded-full py-3.5 flex-row items-center justify-center w-full mb-5"
                >
                  <StyledText className="text-[#475569] font-bold text-sm">
                    {t("reviewSubmission")}
                  </StyledText>
                </StyledTouchableOpacity>

                {/* Action Pills Row (using margins to prevent wrapper overlap) */}
                <StyledView className="flex-row flex-wrap">
                  <StyledTouchableOpacity className="bg-white border border-[#E2E8F0] px-3.5 py-2 rounded-full flex-row items-center mr-2 mb-2">
                    <Ionicons
                      name="document-text-outline"
                      size={14}
                      color="#64748B"
                    />
                    <StyledText className="text-[#64748B] text-[11px] font-bold ml-1.5">
                      {t("withdraw")}
                    </StyledText>
                  </StyledTouchableOpacity>

                  <StyledTouchableOpacity className="bg-white border border-[#E2E8F0] px-3.5 py-2 rounded-full flex-row items-center mr-2 mb-2">
                    <Ionicons
                      name="bookmark-outline"
                      size={14}
                      color="#64748B"
                    />
                    <StyledText className="text-[#64748B] text-[11px] font-bold ml-1.5">
                      {t("markInfoOnly")}
                    </StyledText>
                  </StyledTouchableOpacity>

                  <StyledTouchableOpacity className="bg-[#FFF1F1] border border-[#FEE2E2] px-3.5 py-2 rounded-full flex-row items-center mr-2 mb-2">
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                    <StyledText className="text-[#EF4444] text-[11px] font-bold ml-1.5">
                      {t("requestDeletion")}
                    </StyledText>
                  </StyledTouchableOpacity>

                  <StyledTouchableOpacity className="bg-[#FFF1F1] border border-[#FEE2E2] px-3.5 py-2 rounded-full flex-row items-center mb-2">
                    <Ionicons name="trash-outline" size={14} color="#EF4444" />
                    <StyledText className="text-[#EF4444] text-[11px] font-bold ml-1.5">
                      {t("delete")}
                    </StyledText>
                  </StyledTouchableOpacity>
                </StyledView>
              </StyledView>
            ))
          )}
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
