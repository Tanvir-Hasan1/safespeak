import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Alert,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../components/CustomHeader";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

// Reusable animated dropdown component to avoid layout animation conflicts with the New Architecture
const AnimatedDropdown = ({ label, value, options, onSelect, isOpen, onToggle, zIndex }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        setShouldRender(false);
      });
    }
  }, [isOpen]);

  const opacity = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const translateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 0],
  });

  return (
    <StyledView style={{ zIndex }} className="relative">
      <StyledText className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider mb-1">
        {label}
      </StyledText>
      <StyledTouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        className={`flex-row items-center justify-between border rounded-xl p-3 bg-white ${
          isOpen ? "border-[#005B96] border-2" : "border-[#E2E8F0]"
        }`}
      >
        <StyledText className="text-[#1E293B] text-xs font-semibold">
          {value}
        </StyledText>
        <Ionicons name="chevron-down" size={14} color="#64748B" />
      </StyledTouchableOpacity>

      {shouldRender && (
        <Animated.View
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#CBD5E1",
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 5,
            zIndex: 999,
            overflow: "hidden",
            opacity,
            transform: [{ translateY }],
          }}
        >
          {options.map((opt) => {
            const isSelected = value === opt;
            return (
              <StyledTouchableOpacity
                key={opt}
                activeOpacity={0.7}
                onPress={() => {
                  onSelect(opt);
                }}
                className={`py-3 px-4 ${isSelected ? "bg-[#E0F2FE]" : "bg-white"}`}
              >
                <StyledText className={`text-xs ${isSelected ? "text-[#0F172A] font-semibold" : "text-[#334155]"}`}>
                  {opt}
                </StyledText>
              </StyledTouchableOpacity>
            );
          })}
        </Animated.View>
      )}
    </StyledView>
  );
};

export default function LocalIntelligence() {
  const router = useRouter();
  const [headerVisible, setHeaderVisible] = useState(true);

  // Active open dropdown tracker ("timeframe", "jurisdiction", "region", "category", or null)
  const [openDropdown, setOpenDropdown] = useState(null);

  // Filter States
  const [timeframe, setTimeframe] = useState("30 days");
  const [jurisdiction, setJurisdiction] = useState("All jurisdictions");
  const [region, setRegion] = useState("All threshold-safe regions");
  const [category, setCategory] = useState("All threshold-safe categories");

  // Options arrays matching mockups
  const timeframeOptions = ["30 days", "90 days", "12 months", "All time"];
  const jurisdictionOptions = ["All jurisdictions", "NSW", "VIC", "QLD", "ACT"];
  const regionOptions = ["All threshold-safe regions", "Sydney", "Melbourne", "Newcastle"];
  const categoryOptions = ["All threshold-safe categories", "Online abuse", "Scam", "Discrimination"];

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y <= 10) {
      setHeaderVisible(true);
    } else if (y > 50) {
      setHeaderVisible(false);
    }
  };

  const toggleDropdown = (key) => {
    if (openDropdown === key) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(key);
    }
  };

  const closeDropdowns = () => {
    if (openDropdown !== null) {
      setOpenDropdown(null);
    }
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText="Local Intelligence"
        rightText="Home"
        showCancel={true}
        headerVisible={headerVisible}
      />

      <StyledView className="flex-1 relative">
        <StyledScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {/* Dismissal Overlay inside the ScrollView: only active when a dropdown is open */}
          {openDropdown !== null && (
            <TouchableWithoutFeedback onPress={closeDropdowns}>
              <View style={{ ...StyleSheet.absoluteFillObject, zIndex: 40 }} />
            </TouchableWithoutFeedback>
          )}

          {/* Main Context Card */}
          <StyledView className="bg-white rounded-[24px] p-5 shadow-sm mb-4 border border-[#E2E8F0] z-50">
            <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-wider mb-1">
              PUBLIC AGGREGATE INTELLIGENCE
            </StyledText>
            <StyledText className="text-[#002B49] text-2xl font-bold mb-2">
              Local intelligence
            </StyledText>
            <StyledText className="text-[#64748B] text-xs leading-5 mb-4">
              Anonymised, consented reports are shown only when the privacy threshold is met. Low-count cells stay hidden and no person-level report data is exposed.
            </StyledText>

            {/* MINIMUM CELL SIZE Subcard */}
            <StyledView className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 mb-4">
              <StyledText className="text-[#64748B] text-[9px] font-bold uppercase tracking-widest mb-1">
                MINIMUM CELL SIZE
              </StyledText>
              <StyledText className="text-[#0F172A] text-3xl font-black mb-1">
                5
              </StyledText>
              <StyledText className="text-[#64748B] text-[10px]">
                Counts below this are privacy protected.
              </StyledText>
            </StyledView>

            {/* Filter Dropdowns Stack */}
            <StyledView className="space-y-4 mb-2">
              {/* Timeframe */}
              <AnimatedDropdown
                label="TIMEFRAME"
                value={timeframe}
                options={timeframeOptions}
                onSelect={(opt) => {
                  setTimeframe(opt);
                  setOpenDropdown(null);
                }}
                isOpen={openDropdown === "timeframe"}
                onToggle={() => toggleDropdown("timeframe")}
                zIndex={100}
              />

              {/* Jurisdiction */}
              <AnimatedDropdown
                label="JURISDICTION"
                value={jurisdiction}
                options={jurisdictionOptions}
                onSelect={(opt) => {
                  setJurisdiction(opt);
                  setOpenDropdown(null);
                }}
                isOpen={openDropdown === "jurisstate"}
                onToggle={() => toggleDropdown("jurisstate")}
                zIndex={90}
              />

              {/* LGA / Region */}
              <AnimatedDropdown
                label="LGA / REGION"
                value={region}
                options={regionOptions}
                onSelect={(opt) => {
                  setRegion(opt);
                  setOpenDropdown(null);
                }}
                isOpen={openDropdown === "regionstate"}
                onToggle={() => toggleDropdown("regionstate")}
                zIndex={80}
              />

              {/* Category */}
              <AnimatedDropdown
                label="CATEGORY"
                value={category}
                options={categoryOptions}
                onSelect={(opt) => {
                  setCategory(opt);
                  setOpenDropdown(null);
                }}
                isOpen={openDropdown === "categorystate"}
                onToggle={() => toggleDropdown("categorystate")}
                zIndex={70}
              />
            </StyledView>

            {/* Status Metrics Cards Grid */}
            <StyledView className="flex-row flex-wrap justify-between mt-4">
              {/* Card 1: Anonymised Only */}
              <StyledView className="w-[48%] bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 mb-3">
                <StyledView className="w-7 h-7 bg-[#EFF6FF] rounded-lg items-center justify-center mb-2">
                  <Ionicons name="lock-closed" size={14} color="#005B96" />
                </StyledView>
                <StyledText className="text-[#64748B] text-[8px] font-bold uppercase tracking-widest">
                  ANONYMISED ONLY
                </StyledText>
                <StyledText className="text-[#0F172A] text-sm font-bold mt-0.5">
                  Enabled
                </StyledText>
              </StyledView>

              {/* Card 2: Consented Reports */}
              <StyledView className="w-[48%] bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 mb-3">
                <StyledView className="w-7 h-7 bg-[#EFF6FF] rounded-lg items-center justify-center mb-2">
                  <Ionicons name="shield-checkmark" size={14} color="#005B96" />
                </StyledView>
                <StyledText className="text-[#64748B] text-[8px] font-bold uppercase tracking-widest">
                  CONSENTED REPORTS
                </StyledText>
                <StyledText className="text-[#0F172A] text-sm font-bold mt-0.5">
                  Only
                </StyledText>
              </StyledView>

              {/* Card 3: Visible Areas */}
              <StyledView className="w-[48%] bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 mb-3">
                <StyledView className="w-7 h-7 bg-[#EFF6FF] rounded-lg items-center justify-center mb-2">
                  <Ionicons name="map" size={14} color="#005B96" />
                </StyledView>
                <StyledText className="text-[#64748B] text-[8px] font-bold uppercase tracking-widest">
                  VISIBLE AREAS
                </StyledText>
                <StyledText className="text-[#0F172A] text-sm font-bold mt-0.5">
                  0
                </StyledText>
              </StyledView>

              {/* Card 4: Report Count */}
              <StyledView className="w-[48%] bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 mb-3">
                <StyledView className="w-7 h-7 bg-[#EFF6FF] rounded-lg items-center justify-center mb-2">
                  <Ionicons name="bar-chart" size={14} color="#005B96" />
                </StyledView>
                <StyledText className="text-[#64748B] text-[8px] font-bold uppercase tracking-widest">
                  REPORT COUNT
                </StyledText>
                <StyledText className="text-[#0F172A] text-[10px] font-bold mt-0.5 leading-4">
                  Privacy protected: fewer than 5
                </StyledText>
              </StyledView>
            </StyledView>

            {/* Caption Box */}
            <StyledView className="border border-dashed border-[#CBD5E1] rounded-2xl p-3.5 bg-[#F8FAFC] mt-1">
              <StyledText className="text-[#64748B] text-[10px] leading-4">
                Aggregate data is below the public threshold for the current filters. The backend returned privacy-protected cells instead of exact low counts.
              </StyledText>
            </StyledView>
          </StyledView>

          {/* THRESHOLD-SAFE AREAS Card */}
          <StyledView className="bg-white rounded-[24px] p-5 shadow-sm mb-4 border border-[#E2E8F0]">
            <StyledView className="flex-row items-center justify-between mb-3">
              <StyledView>
                <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-wider">
                  THRESHOLD-SAFE AREAS
                </StyledText>
                <StyledText className="text-[#002B49] text-lg font-bold">
                  Area signals
                </StyledText>
              </StyledView>
              <Ionicons name="map-outline" size={20} color="#005B96" />
            </StyledView>

            <StyledView className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 items-center justify-center">
              <StyledText className="text-[#64748B] text-xs text-center leading-5">
                No threshold-safe area aggregates are available for these filters.
              </StyledText>
            </StyledView>
          </StyledView>

          {/* THRESHOLD-SAFE CATEGORIES Card */}
          <StyledView className="bg-white rounded-[24px] p-5 shadow-sm mb-4 border border-[#E2E8F0]">
            <StyledView className="flex-row items-center justify-between mb-3">
              <StyledView>
                <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-wider">
                  THRESHOLD-SAFE CATEGORIES
                </StyledText>
                <StyledText className="text-[#002B49] text-lg font-bold">
                  Category mix
                </StyledText>
              </StyledView>
              <Ionicons name="analytics-outline" size={20} color="#005B96" />
            </StyledView>

            <StyledView className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 items-center justify-center">
              <StyledText className="text-[#64748B] text-xs text-center leading-5">
                No threshold-safe category aggregates are available for these filters.
              </StyledText>
            </StyledView>
          </StyledView>

          {/* THRESHOLD-SAFE TREND Card */}
          <StyledView className="bg-white rounded-[24px] p-5 shadow-sm mb-4 border border-[#E2E8F0]">
            <StyledView className="flex-row items-center justify-between mb-3">
              <StyledView>
                <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-wider">
                  THRESHOLD-SAFE TREND
                </StyledText>
                <StyledText className="text-[#002B49] text-lg font-bold">
                  Monthly signals
                </StyledText>
              </StyledView>
              <StyledTouchableOpacity
                activeOpacity={0.7}
                onPress={() => Alert.alert("Refresh", "Data refreshed.")}
                className="flex-row items-center space-x-1"
              >
                <Ionicons name="refresh" size={14} color="#64748B" />
                <StyledText className="text-[#64748B] text-xs font-semibold ml-1">
                  Refresh
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>

            {/* Trend Content Box */}
            <StyledView className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl p-5 items-center justify-center mb-1">
              <Ionicons name="trending-up" size={32} color="#005B96" className="mb-2" />
              <StyledText className="text-[#005B96] text-xs text-center font-semibold mb-3">
                Monthly cells are below the public threshold for these filters.
              </StyledText>

              <StyledView className="border-t border-[#BFDBFE] pt-3 w-full">
                <StyledText className="text-[#005B96] text-[10px] text-center leading-4">
                  Backend privacy contract: consented reports only, anonymised aggregates only, no user or admin analytics outputs, no PII, and no exact low counts.
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledScrollView>
      </StyledView>
    </StyledView>
  );
}
