import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  Image,
  Alert,
  Linking,
  Animated,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../components/CustomHeader";
import { useLanguage } from "../../../context/LanguageContext";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

const callEmergency = () => Linking.openURL("tel:000");

// Reusable animated dropdown component to avoid layout animation conflicts with the New Architecture
const AnimatedDropdown = ({ headerLabel, value, options, onSelect, isOpen, onToggle, zIndex }) => {
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
    <StyledView style={{ zIndex }} className="w-[48%] relative">
      <StyledTouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        className={`bg-white border px-5 py-2.5 rounded-full flex-row items-center justify-between ${
          isOpen ? "border-[#005B96] border-2" : "border-[#E2E8F0]"
        }`}
      >
        <StyledText className="text-[#3B82F6] text-xs font-bold">
          {value}
        </StyledText>
        <Ionicons name="chevron-down" size={12} color="#3B82F6" />
      </StyledTouchableOpacity>

      {shouldRender && (
        <Animated.View
          style={{
            position: "absolute",
            top: 44,
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#CBD5E1",
            borderRadius: 12,
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
          {/* Header (blue background, white text) */}
          <StyledView className="bg-[#1D63D3] py-2 px-4">
            <StyledText className="text-white text-xs font-bold">
              {headerLabel}
            </StyledText>
          </StyledView>

          {/* Options List */}
          {options.map((opt) => {
            const isSelected = value === opt;
            return (
              <StyledTouchableOpacity
                key={opt}
                activeOpacity={0.7}
                onPress={() => {
                  onSelect(opt);
                }}
                className={`py-2.5 px-4 ${isSelected ? "bg-[#E0F2FE]" : "bg-white"}`}
              >
                <StyledText className="text-[#1D63D3] text-xs font-semibold">
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

// Custom dropdown for Advocate form fields to match design
const FormDropdown = ({ labelText, value, options, onSelect, isOpen, onToggle, zIndex, footerText }) => {
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
    <StyledView style={{ zIndex }} className="w-full relative">
      <StyledText className="text-[#94A3B8] text-[9px] font-extrabold uppercase tracking-wider mb-1">
        {labelText}
      </StyledText>
      <StyledTouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        className={`bg-white border rounded-xl px-4 py-2.5 flex-row items-center justify-between ${
          isOpen ? "border-[#005B96] border-2" : "border-[#E2E8F0]"
        }`}
      >
        <StyledText className="text-[#002B49] text-xs font-semibold">
          {value}
        </StyledText>
        <Ionicons name="chevron-down" size={14} color="#94A3B8" />
      </StyledTouchableOpacity>

      {shouldRender && (
        <Animated.View
          style={{
            position: "absolute",
            top: 58,
            left: 0,
            right: 0,
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: "#CBD5E1",
            borderRadius: 12,
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
          {/* Header option */}
          <StyledView className="bg-[#1D63D3] py-2 px-4">
            <StyledText className="text-white text-xs font-bold">
              {value}
            </StyledText>
          </StyledView>

          {/* Options */}
          {options.map((opt) => {
            const isSelected = value === opt;
            return (
              <StyledTouchableOpacity
                key={opt}
                activeOpacity={0.7}
                onPress={() => {
                  onSelect(opt);
                }}
                className={`py-2.5 px-4 ${isSelected ? "bg-[#E0F2FE]" : "bg-white"}`}
              >
                <StyledText className="text-[#1D63D3] text-xs font-semibold">
                  {opt}
                </StyledText>
              </StyledTouchableOpacity>
            );
          })}

          {/* Optional matches info footer */}
          {footerText && (
            <StyledView className="bg-[#F1F5F9] border-t border-[#E2E8F0] p-3">
              <StyledText className="text-[#64748B] text-[10px] font-semibold leading-4">
                {footerText}
              </StyledText>
            </StyledView>
          )}
        </Animated.View>
      )}
    </StyledView>
  );
};

export default function GetSupport() {
  const router = useRouter();
  const { t } = useLanguage();

  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isIssueOpen, setIsIssueOpen] = useState(false);
  const [isAdvRegionOpen, setIsAdvRegionOpen] = useState(false);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isPreferenceOpen, setIsPreferenceOpen] = useState(false);

  // State variables for search and filters
  const [searchText, setSearchText] = useState("");
  const [regionFilter, setRegionFilter] = useState("Region");
  const [serviceFilter, setServiceFilter] = useState("Service Type");

  // State variables for Advocate Matching selector filters
  const [advLanguage, setAdvLanguage] = useState("EN");
  const [advIssue, setAdvIssue] = useState("Any issue");
  const [advRegion, setAdvRegion] = useState("Any region");
  const [advAvailability, setAdvAvailability] = useState("Any availability");

  // State variables for Advocate Request Form
  const [contactPreference, setContactPreference] = useState("In-app follow-up");
  const [notes, setNotes] = useState("");
  const [consentChecked, setConsentChecked] = useState(false);
  const [selectedAdvocateId, setSelectedAdvocateId] = useState(1);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [showConsentRequired, setShowConsentRequired] = useState(false);
  const [showRequestCreatedStatus, setShowRequestCreatedStatus] = useState(false);

  // Simulated scroll header visibility toggles
  const [headerVisible, setHeaderVisible] = useState(true);

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    if (currentOffsetY <= 10) {
      setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      setHeaderVisible(false);
    }
  };

  const handlePreviewRequest = () => {
    if (!consentChecked) {
      Alert.alert("Consent Required", "Please confirm that you understand the request copy before continuing.");
      return;
    }
    if (!isPreviewExpanded) {
      setIsPreviewExpanded(true);
    } else {
      setShowConsentRequired(true);
    }
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText="Safe Connections"
        rightText="Cancel"
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10, paddingHorizontal: 24 }}
      >
        {/* Find support main header */}
        <StyledView className="w-full items-center mb-6 mt-4">
          <StyledText className="text-[#002B49] text-[26px] font-black text-center leading-8">
            Find the support you need
          </StyledText>
          <StyledText className="text-[#64748B] text-xs text-center leading-5 mt-2 px-3">
            Find organizations and services that can help. You decide who to contact and how.
          </StyledText>
        </StyledView>

        {/* Search Bar & Pill Filters */}
        <StyledView className="w-full space-y-3 mb-6">
          {/* Search Input */}
          <StyledView className="w-full bg-white rounded-full border border-[#E2E8F0] px-4 flex-row items-center h-[46px] shadow-xs">
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <StyledTextInput
              placeholder="Search by name, topic, or type..."
              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 ml-2 text-sm text-[#1F2937]"
              placeholderTextColor="#94A3B8"
            />
          </StyledView>

          {/* Region & Service Type drop down buttons */}
          <StyledView style={{ zIndex: 100 }} className="flex-row justify-center space-x-2.5">
            <AnimatedDropdown
              headerLabel="Region"
              value={regionFilter}
              options={["Region", "National", "NSW", "VIC", "QLD"]}
              onSelect={(val) => {
                setRegionFilter(val);
                setIsRegionOpen(false);
              }}
              isOpen={isRegionOpen}
              onToggle={() => {
                setIsRegionOpen(!isRegionOpen);
                setIsServiceOpen(false);
              }}
              zIndex={50}
            />

            <AnimatedDropdown
              headerLabel="Service Type"
              value={serviceFilter}
              options={["Service Type", "Legal Support", "Community Support", "Crisis Support"]}
              onSelect={(val) => {
                setServiceFilter(val);
                setIsServiceOpen(false);
              }}
              isOpen={isServiceOpen}
              onToggle={() => {
                setIsServiceOpen(!isServiceOpen);
                setIsRegionOpen(false);
              }}
              zIndex={50}
            />
          </StyledView>
        </StyledView>

        {/* Featured Legal Aid NSW Card */}
        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/home/service-details")}
          className="w-full bg-white rounded-[24px] border border-[#E2E8F0] overflow-hidden mb-6 shadow-sm"
        >
          {/* Mock Graphic container representing the Legal Aid NSW image */}
          <StyledView className="w-full h-[150px] bg-[#002B49] justify-between p-4 relative">
            <StyledView className="absolute inset-0 bg-[#0F5D9F]/10" />
            {/* Image Placeholder graphics */}
            <StyledView className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
              <Ionicons name="heart" size={16} color="white" />
            </StyledView>
            <StyledView className="space-y-1">
              <StyledText className="text-white text-base font-extrabold">
                Legal Aid NSW
              </StyledText>
              <StyledText className="text-white/80 text-[10px] leading-4 font-semibold">
                Free legal information, advice, and support for people who need help understanding their rights and legal options.
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledTouchableOpacity>

        {/* Advocate Matching Panel */}
        <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-5 mb-6 shadow-sm">
          <StyledView className="flex-row items-start justify-between mb-3">
            <StyledView className="flex-1 mr-2">
              <StyledText className="text-[#005B96] text-[10px] font-extrabold uppercase tracking-wider">
                ADVOCATE MATCHING
              </StyledText>
              <StyledText className="text-[#002B49] text-[16px] font-black leading-5 mt-1">
                Request help from an authorized support person
              </StyledText>
            </StyledView>
            <StyledView className="bg-[#EFF6FF] px-2.5 py-1 rounded-full border border-[#DBEAFE]">
              <StyledText className="text-[#005B96] text-[9px] font-extrabold uppercase tracking-wide">
                2 Matches
              </StyledText>
            </StyledView>
          </StyledView>

          <StyledText className="text-[#64748B] text-[11px] leading-4 mb-4">
            Filter available advocate options, preview exactly what will be shared, then choose whether to create a request. SafeSpeak does not contact anyone automatically.
          </StyledText>

          {/* Request Status Banner */}
          {showRequestCreatedStatus && (
            <StyledView className="w-full bg-[#F8FAFC] border border-[#DBEAFE] rounded-full py-3 px-5 mb-5 items-center justify-center">
              <StyledText className="text-[#005B96] text-[11px] font-bold text-center">
                Advocate request created. Status: pending.
              </StyledText>
            </StyledView>
          )}

          {/* Advocate Request Consent Required Card */}
          {showConsentRequired && (
            <StyledView className="w-full bg-white border border-[#CBD5E1]/60 rounded-[24px] p-5 mb-5 shadow-xs flex-row items-start">
              {/* Icon Container */}
              <StyledView className="w-10 h-10 bg-[#EFF6FF] rounded-full items-center justify-center mr-3.5 shrink-0">
                <Ionicons name="shield-checkmark" size={18} color="#005B96" />
              </StyledView>

              {/* Text & Buttons */}
              <StyledView className="flex-1">
                <StyledText className="text-[#002B49] text-xs font-black mb-1">
                  Advocate request consent required
                </StyledText>
                <StyledText className="text-[#64748B] text-[11px] leading-4 font-semibold mb-3">
                  SafeSpeak needs your permission before creating an advocate contact request or sharing request details.
                </StyledText>

                {/* Warm Referral lock pill */}
                <StyledView className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-full px-3 py-1 self-start flex-row items-center mb-4">
                  <Ionicons name="lock-closed" size={10} color="#005B96" style={{ marginRight: 4 }} />
                  <StyledText className="text-[#005B96] text-[9px] font-extrabold uppercase tracking-wider">
                    Warm Referral
                  </StyledText>
                </StyledView>

                {/* Primary/Secondary Buttons */}
                <StyledView className="flex-row flex-wrap items-center mb-1">
                  <StyledTouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setShowConsentRequired(false);
                      setShowRequestCreatedStatus(true);
                      setIsPreviewExpanded(false);
                      setNotes("");
                    }}
                    className="bg-[#005B96] px-4 py-2 rounded-full mr-2 mb-2"
                  >
                    <StyledText className="text-white text-[10px] font-bold">
                      Allow advocate request
                    </StyledText>
                  </StyledTouchableOpacity>

                  <StyledTouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      setShowConsentRequired(false);
                      setIsPreviewExpanded(false);
                      Alert.alert(
                        "Request Cancelled",
                        "Service discovery remains available and no advocate request was created."
                      );
                    }}
                    className="bg-white border border-[#E2E8F0] px-4 py-2 rounded-full mr-2 mb-2"
                  >
                    <StyledText className="text-[#475569] text-[10px] font-bold">
                      Not now
                    </StyledText>
                  </StyledTouchableOpacity>
                </StyledView>

                {/* Review consent settings button */}
                <StyledTouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => Alert.alert("Consent Settings", "Loading consent options...")}
                  className="bg-white border border-[#E2E8F0] px-4 py-2 rounded-full self-start mb-2"
                >
                  <StyledText className="text-[#475569] text-[10px] font-bold">
                    Review consent settings
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          )}

          {/* Form Selectors Dropdowns */}
          <StyledView className="space-y-3.5 mb-5">
            {/* Language filter selector */}
            <FormDropdown
              labelText="Language"
              value={advLanguage}
              options={["EN", "AR", "ES"]}
              onSelect={(val) => {
                setAdvLanguage(val);
                setIsLanguageOpen(false);
              }}
              isOpen={isLanguageOpen}
              onToggle={() => {
                setIsLanguageOpen(!isLanguageOpen);
                setIsIssueOpen(false);
                setIsAdvRegionOpen(false);
                setIsAvailabilityOpen(false);
              }}
              zIndex={40}
            />

            {/* Issue Type selector */}
            <FormDropdown
              labelText="Issue Type"
              value={advIssue}
              options={["Any issue", "Scams", "Discrimination", "Racial Abuse", "Domestic Violence"]}
              onSelect={(val) => {
                setAdvIssue(val);
                setIsIssueOpen(false);
              }}
              isOpen={isIssueOpen}
              onToggle={() => {
                setIsIssueOpen(!isIssueOpen);
                setIsLanguageOpen(false);
                setIsAdvRegionOpen(false);
                setIsAvailabilityOpen(false);
              }}
              zIndex={30}
            />

            {/* Region selector */}
            <FormDropdown
              labelText="Region"
              value={advRegion}
              options={["Any region", "AU", "national", "NSW", "VIC", "QLD"]}
              onSelect={(val) => {
                setAdvRegion(val);
                setIsAdvRegionOpen(false);
              }}
              isOpen={isAdvRegionOpen}
              onToggle={() => {
                setIsAdvRegionOpen(!isAdvRegionOpen);
                setIsLanguageOpen(false);
                setIsIssueOpen(false);
                setIsAvailabilityOpen(false);
              }}
              zIndex={20}
              footerText="Matches: General Support, Domestic Violence, Racial Abuse, Migrant Challenges, Cyber Scam"
            />

            {/* Availability selector */}
            <FormDropdown
              labelText="Availability"
              value={advAvailability}
              options={["Any availability", "Request Based"]}
              onSelect={(val) => {
                setAdvAvailability(val);
                setIsAvailabilityOpen(false);
              }}
              isOpen={isAvailabilityOpen}
              onToggle={() => {
                setIsAvailabilityOpen(!isAvailabilityOpen);
                setIsLanguageOpen(false);
                setIsIssueOpen(false);
                setIsAdvRegionOpen(false);
              }}
              zIndex={10}
            />
          </StyledView>

          {/* Results Match Cards */}
          <StyledView className="space-y-3 mb-5 border-t border-[#E2E8F0] pt-4">
            {/* Match 1 */}
            <StyledTouchableOpacity
              activeOpacity={0.9}
              onPress={() => setSelectedAdvocateId(1)}
              className={`w-full bg-white rounded-2xl p-4 border ${
                selectedAdvocateId === 1 ? "border-[#1D63D3] border-2" : "border-[#E2E8F0]"
              }`}
            >
              <StyledView className="flex-row justify-between items-start mb-1">
                <StyledView className="flex-1 mr-2">
                  <StyledText className="text-[#002B49] text-sm font-bold">
                    General Support
                  </StyledText>
                  <StyledText className="text-[#64748B] text-[10px] font-medium leading-4 mt-0.5">
                    Languages: en | Request Based
                  </StyledText>
                </StyledView>
                <StyledView className="bg-[#E2F0D9] px-2.5 py-1 rounded-lg">
                  <StyledText className="text-[#385723] text-[9px] font-extrabold uppercase tracking-wider text-center">
                    INFORMATION ONLY
                  </StyledText>
                </StyledView>
              </StyledView>
              <StyledText className="text-[#94A3B8] text-[9px] font-semibold mt-1">
                Matches: General Support, Domestic Violence, Racial Abuse, Migrant Challenges, Cyber Scam
              </StyledText>
            </StyledTouchableOpacity>

            {/* Match 2 */}
            <StyledTouchableOpacity
              activeOpacity={0.9}
              onPress={() => setSelectedAdvocateId(2)}
              className={`w-full bg-white rounded-2xl p-4 border ${
                selectedAdvocateId === 2 ? "border-[#1D63D3] border-2" : "border-[#E2E8F0]"
              }`}
            >
              <StyledView className="flex-row justify-between items-start mb-1">
                <StyledView className="flex-1 mr-2">
                  <StyledText className="text-[#002B49] text-sm font-bold">
                    Multilingual Support
                  </StyledText>
                  <StyledText className="text-[#64748B] text-[10px] font-medium leading-4 mt-0.5">
                    Languages: en, ar, es | Request Based
                  </StyledText>
                </StyledView>
                <StyledView className="bg-[#E2F0D9] px-2 py-1 rounded-lg w-[85px] items-center justify-center">
                  <StyledText className="text-[#385723] text-[8px] font-extrabold uppercase tracking-wider text-center leading-3">
                    INFORMATION{"\n"}ONLY
                  </StyledText>
                </StyledView>
              </StyledView>
              <StyledText className="text-[#94A3B8] text-[9px] font-semibold mt-1">
                Matches: General Support, Migrant Challenges, Racial Abuse
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Advocate Request Form */}
          <StyledView className="border-t border-[#E2E8F0] pt-4 space-y-4">
            <StyledText className="text-[#005B96] text-[10px] font-extrabold uppercase tracking-wider">
              ADVOCATE REQUEST FORM
            </StyledText>

            {/* Contact Preference Selection */}
            <FormDropdown
              labelText="Safe contact preference"
              value={contactPreference}
              options={["In-app follow-up", "Email", "Phone", "No direct contact yet"]}
              onSelect={(val) => {
                setContactPreference(val);
                setIsPreferenceOpen(false);
              }}
              isOpen={isPreferenceOpen}
              onToggle={() => {
                setIsPreferenceOpen(!isPreferenceOpen);
              }}
              zIndex={5}
            />

            {/* Notes Textarea */}
            <StyledView>
              <StyledText className="text-[#94A3B8] text-[9px] font-extrabold uppercase tracking-wider mb-1">
                Notes for the advocate
              </StyledText>
              <StyledTextInput
                multiline
                numberOfLines={3}
                placeholder="Share only what feels safe and necessary."
                value={notes}
                onChangeText={setNotes}
                className="w-full border border-[#E2E8F0] rounded-xl p-3 text-xs text-[#002B49] bg-white leading-5"
                placeholderTextColor="#94A3B8"
              />
            </StyledView>

            {/* Consent Checkbox */}
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => setConsentChecked(!consentChecked)}
              className="flex-row items-start px-1"
            >
              <StyledView className={`w-4 h-4 rounded mr-2.5 mt-0.5 justify-center items-center border ${
                consentChecked ? "bg-[#005B96] border-[#005B96]" : "bg-white border-[#94A3B8]"
              }`}>
                {consentChecked && (
                  <Ionicons name="checkmark" size={12} color="white" />
                )}
              </StyledView>
              <StyledText className="flex-1 text-[#64748B] text-[10px] leading-[15px]">
                I understand SafeSpeak will construct advocate request only after my consent and will not call, email, or contact anyone automatically.
              </StyledText>
            </StyledTouchableOpacity>

            {/* Shared Fields Preview (Expanded Section) */}
            {isPreviewExpanded && (
              <StyledView className="w-full bg-[#F8FAFC] border border-[#DBEAFE] rounded-2xl p-4 mt-2 mb-1">
                <StyledText className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider mb-3">
                  SHARED FIELDS PREVIEW
                </StyledText>
                
                <StyledText className="text-[#64748B] text-xs leading-5">
                  <StyledText className="font-bold text-[#002B49]">Advocate type:</StyledText> {selectedAdvocateId === 1 ? "General Support" : "Multilingual Support"}
                </StyledText>

                <StyledText className="text-[#64748B] text-xs leading-5 mt-1">
                  <StyledText className="font-bold text-[#002B49]">Language:</StyledText> {advLanguage}
                </StyledText>

                <StyledText className="text-[#64748B] text-xs leading-5 mt-1">
                  <StyledText className="font-bold text-[#002B49]">Safe contact:</StyledText> {contactPreference}
                </StyledText>

                <StyledText className="text-[#64748B] text-xs leading-5 mt-1">
                  <StyledText className="font-bold text-[#002B49]">Notes:</StyledText> {notes ? notes : "Safe contact preference: in app No evidence files, full report payload, or hidden profile data included."}
                </StyledText>

                <StyledText className="text-[#C27803] text-[10px] font-bold mt-3 leading-4">
                  No evidence files, full report payload, or hidden profile data will be shared.
                </StyledText>

                <StyledTouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsPreviewExpanded(false)}
                  className="mt-3.5"
                >
                  <StyledText className="text-[#005B96] text-xs font-bold">
                    Edit before creating request
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            )}

            {/* Preview / Submit request button */}
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={handlePreviewRequest}
              className="bg-[#005B96] py-3 rounded-xl items-center justify-center"
            >
              <StyledText className="text-white text-xs font-bold">
                {isPreviewExpanded ? "Create advocate request" : "Preview request"}
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        {/* Support Sections List */}
        <StyledView className="w-full mb-6">
          <StyledText className="text-[#005B96] text-[10px] font-extrabold uppercase tracking-wider mb-3.5">
            SUPPORT SECTIONS
          </StyledText>

          <StyledView className="space-y-2.5">
            {[
              "Emergency Support",
              "Legal Support",
              "Community Support",
              "Advocate Matching",
              "Safety Planning",
            ].map((sectionName) => (
              <StyledTouchableOpacity
                key={sectionName}
                activeOpacity={0.7}
                onPress={() => Alert.alert("Support Navigation", `Navigate to ${sectionName}`)}
                className="bg-white border border-[#CBD5E1]/30 rounded-[20px] p-4 flex-row justify-between items-center shadow-xs"
              >
                <StyledText className="text-[#002B49] text-[13px] font-bold">
                  {sectionName}
                </StyledText>
                <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
              </StyledTouchableOpacity>
            ))}
          </StyledView>
        </StyledView>

        {/* Warm Referral Consent panel */}
        <StyledView className="w-full bg-white border border-[#CBD5E1]/30 rounded-[24px] p-5 shadow-xs mb-4">
          <StyledText className="text-[#005B96] text-[10px] font-extrabold uppercase tracking-wider">
            WARM REFERRAL CONSENT
          </StyledText>
          <StyledText className="text-[#64748B] text-[11px] leading-4.5 font-semibold mt-1 mb-4">
            Support recommendations can come from the backend. Any warm referral still requires explicit consent before details are shared externally.
          </StyledText>

          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert("Consent Settings", "Loading consent options...")}
            className="border border-[#475569]/40 bg-white py-2.5 rounded-full items-center justify-center"
          >
            <StyledText className="text-[#475569] text-xs font-bold">
              Review consent settings
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
