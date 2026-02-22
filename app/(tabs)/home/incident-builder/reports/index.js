import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../../components/CustomHeader";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);

const FILTER_OPTIONS = ["All Reports", "Drafts", "In Review"];

const INCIDENTS = [
  {
    id: "1",
    type: "Harassment Incident - Wing A",
    department: "Legal Compliance Dept.",
    date: "OCT 12, 2023",
    status: "ACTION REQUIRED",
    statusColor: "#E2D3C4",
    statusTextColor: "#8B6B4E",
    icon: "shield-outline",
    iconBg: "#C7D2FE",
    iconColor: "#6366F1",
  },
  {
    id: "2",
    type: "Wellbeing Support Request",
    department: "Mental Health Team",
    date: "OCT 15, 2023",
    status: "SUBMITTED",
    statusColor: "#D1D5DB",
    statusTextColor: "#002B49",
    icon: "heart-outline",
    iconBg: "#FCD4D4",
    iconColor: "#F43F5E",
  },
  {
    id: "3",
    type: "Safety Concern - Main Entry",
    department: "Campus Security",
    date: "OCT 20, 2023",
    status: "DRAFT",
    statusColor: "#D1D5DB",
    statusTextColor: "#002B49",
    icon: "lock-closed-outline",
    iconBg: "#D1FAE5",
    iconColor: "#10B981",
  },
];

export default function IncidentHistory() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState("All Reports");
  const [searchQuery, setSearchQuery] = useState("");

  const renderIncidentCard = ({ item }) => (
    <StyledView className="flex-row items-center mb-4">
      <StyledView className="flex-1 bg-white rounded-[32px] p-5 shadow-sm border border-[#E2E8F0]">
        <StyledView className="flex-row items-center mb-3">
          <StyledView
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: item.iconBg }}
          >
            <Ionicons name={item.icon} size={20} color={item.iconColor} />
          </StyledView>
          <StyledView
            className="ml-3 px-3 py-1 rounded-lg"
            style={{ backgroundColor: item.statusColor }}
          >
            <StyledText
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: item.statusTextColor }}
            >
              {item.status}
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledText className="text-[#002B49] text-base font-bold mb-1">
          {item.type}
        </StyledText>

        <StyledView className="flex-row items-center mb-3">
          <Ionicons name="business" size={14} color="#94A3B8" />
          <StyledText className="text-[#94A3B8] text-xs ml-1 font-medium">
            {item.department}
          </StyledText>
        </StyledView>

        <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest">
          {item.date}
        </StyledText>
      </StyledView>

      {/* Blue side arrow button matching Image 2 */}
      <StyledTouchableOpacity
        activeOpacity={0.7}
        className="bg-[#005294] w-14 h-32 rounded-[24px] ml-[-20px] items-center justify-center z-[-1] pl-4"
        onPress={() => router.push("/home/incident-builder/reports/overview")}
      >
        <Ionicons name="chevron-forward" size={20} color="white" />
      </StyledTouchableOpacity>
    </StyledView>
  );

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title="Your Reports" />

      <StyledScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <StyledView className="px-6 pt-2 items-center">
          <StyledView className="w-16 h-16 bg-[#3B82F6]/10 rounded-full items-center justify-center mb-4">
            <StyledView className="w-12 h-12 bg-[#3B82F6] rounded-full items-center justify-center shadow-lg border-4 border-white">
              <StyledView className="w-4 h-4 bg-white rounded-full" />
            </StyledView>
          </StyledView>

          <StyledText className="text-[#002B49] text-2xl font-bold text-center">
            Your Incident History
          </StyledText>
          <StyledText className="text-[#94A3B8] text-sm font-medium mt-1">
            SafeSpeak Secure Records
          </StyledText>
        </StyledView>

        {/* Search Bar */}
        <StyledView className="px-6 mt-8">
          <StyledView className="bg-white/60 rounded-full flex-row items-center px-4 py-3 border border-white">
            <Ionicons name="search" size={20} color="#94A3B8" />
            <StyledTextInput
              placeholder="Search reports..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-[#002B49] text-base"
              placeholderTextColor="#94A3B8"
            />
          </StyledView>
        </StyledView>

        {/* Filters */}
        <StyledView className="px-6 mt-6">
          <StyledScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row"
          >
            {FILTER_OPTIONS.map((filter) => (
              <StyledTouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`mr-3 px-6 py-3 rounded-full ${
                  activeFilter === filter
                    ? "bg-[#3B82F6]"
                    : "bg-white border border-[#E2E8F0]"
                }`}
              >
                <StyledText
                  className={`text-sm font-bold ${
                    activeFilter === filter ? "text-white" : "text-[#94A3B8]"
                  }`}
                >
                  {filter}
                </StyledText>
              </StyledTouchableOpacity>
            ))}
          </StyledScrollView>
        </StyledView>

        {/* Incident List */}
        <StyledView className="px-6 mt-8">
          {INCIDENTS.map((item) => (
            <React.Fragment key={item.id}>
              {renderIncidentCard({ item })}
            </React.Fragment>
          ))}
        </StyledView>

        {/* Bottom Stats View Moved inside ScrollView */}
        <StyledView className="flex-row justify-between px-6 mt-4">
          <StyledView className="bg-white rounded-[24px] p-4 flex-1 mr-3 shadow-sm border border-[#E2E8F0]">
            <StyledView className="w-8 h-8 bg-[#005294] rounded-full items-center justify-center mb-2">
              <Ionicons name="information" size={16} color="white" />
            </StyledView>
            <StyledText className="text-[#002B49] text-lg font-bold">
              12
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[8px] font-bold uppercase tracking-wider">
              TOTAL ACTIVE
            </StyledText>
          </StyledView>

          <StyledView className="bg-white rounded-[24px] p-4 flex-1 shadow-sm border border-[#E2E8F0]">
            <StyledView className="w-8 h-8 bg-[#10B981] rounded-full items-center justify-center mb-2">
              <Ionicons name="checkmark-circle" size={16} color="white" />
            </StyledView>
            <StyledText className="text-[#002B49] text-lg font-bold">
              48
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[8px] font-bold uppercase tracking-wider">
              ARCHIVED
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
