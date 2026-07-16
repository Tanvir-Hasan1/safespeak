import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Modal,
  PanResponder,
  Animated,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLanguage } from "../../../context/LanguageContext";
import SafeSpeakScreen from "../../../components/SafeSpeakScreen";
import { useProfileStore } from "../../../store/useProfileStore";
import api from "../../../context/api";

const StyledAnimatedView = styled(Animated.View);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function ProfileScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageSheet, setShowLanguageSheet] = useState(false);

  // Animated Y position for language bottom sheet swipe-to-dismiss
  const panY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 120) {
          Animated.timing(panY, {
            toValue: 400,
            duration: 200,
            useNativeDriver: true,
          }).start(() => {
            setShowLanguageSheet(false);
            panY.setValue(0);
          });
        } else {
          Animated.spring(panY, {
            toValue: 0,
            bounciness: 6,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (showLanguageSheet) {
      panY.setValue(0);
    }
  }, [showLanguageSheet]);

  // Profile preferences state from Zustand store
  const {
    culturalProfile,
    faithProfile,
    communityBg,
    interpreterLang,
    shareContext,
    aiProcessing,
    audioTranscription,
    cloudSync,
    warmReferral,
    externalSharing,
    anonymisedAnalytics,
    setPreferences,
    setConsent,
  } = useProfileStore();

  // API loading states
  const [loading, setLoading] = useState(true);
  const [consentHistoryLength, setConsentHistoryLength] = useState(0);

  // Load profile and consents on mount
  const loadData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Profile
      const profileRes = await api.get("/profile");
      const p = profileRes.data?.data?.profile || profileRes.data?.profile || {};

      setPreferences({
        culturalProfile: p.culturalProfile || "Prefer not to say",
        faithProfile: p.faithProfile || "Prefer not to say",
        communityBg: p.communityProfile || "Prefer not to say",
        interpreterLang: p.interpreterLanguage || "English",
        shareContext: typeof p.referralSharingPreference === "boolean" ? p.referralSharingPreference : false,
      });

      // 2. Fetch Consents
      const consentRes = await api.get("/consents/current");
      const c = consentRes.data?.data?.consent || consentRes.data?.consent || {};

      setConsent({
        aiProcessing: Boolean(c.process_with_ai),
        audioTranscription: Boolean(c.transcribe_audio),
        cloudSync: Boolean(c.cloud_sync),
        warmReferral: Boolean(c.warm_referral),
        externalSharing: Boolean(c.share_with_agencies),
        anonymisedAnalytics: Boolean(c.use_anonymised_analytics),
      });

      // 3. Fetch Consent History
      const historyRes = await api.get("/consents/history");
      const hist = historyRes.data?.data?.history || historyRes.data?.history || [];
      setConsentHistoryLength(hist.length);
    } catch (err) {
      console.warn("Failed to load profile and consents data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updatePreferenceOnBackend = async (key, val) => {
    try {
      const payload = {};
      if (key === "cultural") payload.culturalProfile = val;
      else if (key === "faith") payload.faithProfile = val;
      else if (key === "community") payload.communityProfile = val;
      else if (key === "interpreter") payload.interpreterLanguage = val;
      else if (key === "shareContext") payload.referralSharingPreference = val;

      await api.patch("/profile", payload);
    } catch (err) {
      console.warn(`Failed to update preference ${key} on backend:`, err);
      Alert.alert("Error", "Could not save preference change.");
    }
  };

  const updateConsentOnBackend = async (flag, state) => {
    try {
      if (state) {
        await api.post("/consents/update", {
          flags: { [flag]: true },
          source: "privacy_self_service",
        });
      } else {
        await api.post("/consents/withdraw", {
          flags: { [flag]: true },
          source: "privacy_self_service",
        });
      }

      // Refresh history count
      const historyRes = await api.get("/consents/history");
      const hist = historyRes.data?.data?.history || historyRes.data?.history || [];
      setConsentHistoryLength(hist.length);
    } catch (err) {
      console.warn(`Failed to update consent flag ${flag} to ${state}:`, err);
      Alert.alert("Error", "Could not save consent change.");
    }
  };

  const setCulturalProfile = (val) => {
    setPreferences({ culturalProfile: val });
    updatePreferenceOnBackend("cultural", val);
  };
  const setFaithProfile = (val) => {
    setPreferences({ faithProfile: val });
    updatePreferenceOnBackend("faith", val);
  };
  const setCommunityBg = (val) => {
    setPreferences({ communityBg: val });
    updatePreferenceOnBackend("community", val);
  };
  const setInterpreterLang = (val) => {
    setPreferences({ interpreterLang: val });
    updatePreferenceOnBackend("interpreter", val);
  };
  const setShareContext = (val) => {
    setPreferences({ shareContext: val });
    updatePreferenceOnBackend("shareContext", val);
  };

  const setAiProcessing = (val) => {
    setConsent({ aiProcessing: val });
    updateConsentOnBackend("process_with_ai", val);
  };
  const setAudioTranscription = (val) => {
    setConsent({ audioTranscription: val });
    updateConsentOnBackend("transcribe_audio", val);
  };
  const setCloudSync = (val) => {
    setConsent({ cloudSync: val });
    updateConsentOnBackend("cloud_sync", val);
  };
  const setWarmReferral = (val) => {
    setConsent({ warmReferral: val });
    updateConsentOnBackend("warm_referral", val);
  };
  const setExternalSharing = (val) => {
    setConsent({ externalSharing: val });
    updateConsentOnBackend("share_with_agencies", val);
  };
  const setAnonymisedAnalytics = (val) => {
    setConsent({ anonymisedAnalytics: val });
    updateConsentOnBackend("use_anonymised_analytics", val);
  };

  // Active dropdown tracking state
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleAction = (actionName) => {
    if (actionName === "Change Language") {
      setShowLanguageSheet(true);
      return;
    }
    Alert.alert("Action Triggered", `${actionName} simulated successfully.`);
  };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            try {
              const { useAuthStore } = require("../../../store/useAuthStore");
              useAuthStore.getState().clearAuth();
            } catch (e) {
              // Ignore if store not yet loaded
            }
            router.replace("/");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderDropdown = (label, value, options, onSelect, dropdownKey) => {
    const isOpen = activeDropdown === dropdownKey;
    return (
      <StyledView className="mb-4" style={{ zIndex: isOpen ? 1000 : 1 }}>
        <StyledText className="text-[#002B49] text-xs font-bold mb-1.5">
          {label}
        </StyledText>
        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setActiveDropdown(isOpen ? null : dropdownKey);
          }}
          className="bg-white rounded-xl border border-[#D7E1EE] px-4 py-3 flex-row justify-between items-center h-[46px]"
        >
          <StyledText className="text-[#1F2A3A] text-xs font-semibold">
            {value}
          </StyledText>
          <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={14} color="#94A3B8" />
        </StyledTouchableOpacity>

        {isOpen && (
          <StyledView
            className="bg-white border border-[#D7E1EE] rounded-xl mt-1 max-h-[220px] overflow-hidden shadow-md"
            style={{ elevation: 5 }}
          >
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
              {options.map((opt) => {
                const isSelected = opt === value;
                return (
                  <StyledTouchableOpacity
                    key={opt}
                    activeOpacity={0.7}
                    onPress={() => {
                      onSelect(opt);
                      setActiveDropdown(null);
                    }}
                    className={`px-4 py-3 border-b border-[#F1F5F9] flex-row justify-between items-center ${
                      isSelected ? "bg-[#EFF6FF]" : "bg-white"
                    }`}
                  >
                    <StyledText className={`text-xs ${isSelected ? "text-[#005B96] font-extrabold" : "text-[#475569] font-medium"}`}>
                      {opt}
                    </StyledText>
                    {isSelected && (
                      <Ionicons name="checkmark" size={14} color="#005B96" />
                    )}
                  </StyledTouchableOpacity>
                );
              })}
            </ScrollView>
          </StyledView>
        )}
      </StyledView>
    );
  };

  const renderConsentCard = (title, desc, value, onValueChange) => {
    return (
      <StyledView className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-[20px] flex-row items-center justify-between mb-4">
        <StyledView className="flex-1 pr-4">
          <StyledText className="text-[#002B49] text-xs font-bold leading-5">
            {title}
          </StyledText>
          {desc && (
            <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mt-1 leading-normal">
              {desc}
            </StyledText>
          )}
        </StyledView>
        <Switch
          trackColor={{ false: "#E2E8F0", true: "#005B96" }}
          thumbColor={"#FFFFFF"}
          ios_backgroundColor="#E2E8F0"
          onValueChange={onValueChange}
          value={value}
          style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
        />
      </StyledView>
    );
  };

  if (loading) {
    return (
      <SafeSpeakScreen
        backText="Profile"
        contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#005B96" />
      </SafeSpeakScreen>
    );
  }

  return (
    <SafeSpeakScreen
      backText="Profile"
      contentContainerStyle={{ paddingBottom: 120, paddingTop: 10 }}
      className="flex-1 px-6"
    >
      {activeDropdown !== null && (
        <Pressable
          style={[StyleSheet.absoluteFillObject, { zIndex: 99 }]}
          onPress={() => setActiveDropdown(null)}
        />
      )}

      {/* Greeting Banner */}
      <StyledView className="mt-4 mb-6" style={{ zIndex: 1 }}>
        <StyledText className="text-[#002B49] text-3xl font-black mb-1">
          Hey Alex!
        </StyledText>
        <StyledText className="text-[#64748B] text-xs font-semibold">
          Your space is safe and secure.
        </StyledText>
      </StyledView>

      {/* 1. Cultural & Faith Profile Card */}
      <StyledView className="w-full bg-[#005B96] rounded-[28px] p-6 shadow-xs mb-5" style={{ zIndex: 1 }}>
        <StyledText className="text-white text-lg font-black mb-3">
          Cultural & Faith Profile
        </StyledText>

        <StyledView className="flex-row items-center mb-3.5">
          <StyledView className="w-8 h-8 bg-white/20 rounded-lg items-center justify-center mr-3">
            <Ionicons name="business" size={16} color="white" />
          </StyledView>
          <StyledText className="text-white text-sm font-bold">
            {faithProfile || "No religion"}
          </StyledText>
        </StyledView>

        <StyledText className="text-white/90 text-[11px] leading-4 font-semibold mb-4">
          Your cultural preferences help us tailor the support we provide to ensure it aligns with your values.
        </StyledText>

        {/* Nested cultural and language block */}
        <StyledView className="bg-white/10 rounded-[20px] p-4 border border-white/20">
          <StyledText className="text-white/60 text-[9px] font-extrabold uppercase tracking-widest mb-1">
            {culturalProfile ? culturalProfile.replace(" Australian", "").toUpperCase() : "GENERAL"}
          </StyledText>
          <StyledText className="text-white text-base font-black mb-1">
            {interpreterLang || "English"}
          </StyledText>
          <StyledText className="text-white/80 text-[10px] font-semibold">
            Changes sync securely to backend.
          </StyledText>
        </StyledView>
      </StyledView>

      {/* 2. Profile Preferences Card */}
      <StyledView
        className="w-full bg-white rounded-[28px] border border-[#E2E8F0] p-5 shadow-xs mb-5"
        style={{ zIndex: activeDropdown !== null ? 1000 : 1 }}
      >
        <StyledText className="text-[#002B49] text-base font-black mb-1">
          Profile preferences
        </StyledText>
        <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mb-4 leading-4">
          These selections help tailor warm referrals, call scripts, and culturally responsive support.
        </StyledText>

        {renderDropdown(
          "Cultural profile",
          culturalProfile,
          [
            "Aboriginal and Torres Strait Islander",
            "African Australian",
            "Arab Australian",
            "South Asian Australian",
            "Southeast Asian Australian",
            "East Asian Australian",
            "Pacific Islander Australian",
            "Jewish Community",
            "Multicultural Mixed Heritage",
            "Prefer not to say",
          ],
          setCulturalProfile,
          "cultural"
        )}

        {renderDropdown(
          "Faith profile",
          faithProfile,
          [
            "Buddhist",
            "Christian",
            "Hindu",
            "Jewish",
            "Muslim",
            "Sikh",
            "No religion",
            "Spiritual but not religious",
            "Prefer not to say",
          ],
          setFaithProfile,
          "faith"
        )}

        {renderDropdown(
          "Community background",
          communityBg,
          [
            "Migrant",
            "Refugee or asylum seeker",
            "International student",
            "Temporary visa holder",
            "Permanent resident",
            "LGBTQIA+",
            "Disability community",
            "Youth",
            "Senior",
            "Prefer not to say",
          ],
          setCommunityBg,
          "community"
        )}

        {renderDropdown(
          "Interpreter language",
          interpreterLang,
          [
            "English",
            "Arabic",
            "Mandarin Chinese",
            "Cantonese",
            "Vietnamese",
            "Punjabi",
            "Hindi",
            "Nepali",
            "Greek",
            "Bangla",
            "Urdu",
            "Spanish",
          ],
          setInterpreterLang,
          "language"
        )}

        {/* Share cultural context in warm referrals toggle card */}
        <StyledView className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-[20px] flex-row items-center justify-between mt-1 mb-4">
          <StyledView className="flex-1 pr-4">
            <StyledText className="text-[#002B49] text-xs font-bold leading-5">
              Share cultural context in warm referrals
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mt-1 leading-4">
              Include your community, faith, and preferred language when a referral is prepared.
            </StyledText>
          </StyledView>
          <Switch
            trackColor={{ false: "#E2E8F0", true: "#005B96" }}
            thumbColor={"#FFFFFF"}
            ios_backgroundColor="#E2E8F0"
            onValueChange={setShareContext}
            value={shareContext}
            style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
          />
        </StyledView>

        {/* Inset Box */}
        <StyledView className="bg-[#EFF6FF] border-l-4 border-[#01579B] p-4 rounded-r-xl mt-4">
          <StyledText className="text-[#94A3B8] text-[9px] font-extrabold uppercase tracking-widest mb-1">
            CALL SCRIPTS WILL USE
          </StyledText>
          <StyledText className="text-[#01579B] text-base font-black mb-2">
            {interpreterLang || "English"}
          </StyledText>
          <StyledText className="text-[#94A3B8] text-[9px] font-extrabold uppercase tracking-widest mb-0.5">
            REFERRAL STATUS
          </StyledText>
          <StyledText className="text-[#64748B] text-[10px] leading-4">
            {shareContext ? "Context shared in referrals" : "Profile context will stay private"}
          </StyledText>
        </StyledView>
      </StyledView>

      {/* 3. Consent Center Card */}
      <StyledView className="w-full bg-white rounded-[28px] border border-[#E2E8F0] p-5 shadow-xs mb-5" style={{ zIndex: 1 }}>
        <StyledView className="flex-row justify-between items-center mb-1">
          <StyledText className="text-[#002B49] text-xl font-black">
            Consent Center
          </StyledText>
          <StyledView className="bg-[#EFF6FF] w-16 h-16 rounded-full border border-[#DBEAFE] items-center justify-center">
            <StyledText className="text-[#005B96] text-sm font-black leading-4">
              {consentHistoryLength}
            </StyledText>
            <StyledText className="text-[#005B96] text-[7.5px] font-extrabold text-center uppercase tracking-wider leading-3">
              • HISTORY{"\n"}ENTRIES
            </StyledText>
          </StyledView>
        </StyledView>
        <StyledText className="text-[#94A3B8] text-[10.5px] font-semibold mb-5 leading-4.5 pr-2">
          Review AI processing, audio transcription, cloud sync, referrals, analytics, and external sharing before those actions are used.
        </StyledText>

        {renderConsentCard(
          "AI processing",
          "Needed for assistant, triage, RAG, and ScamShield analysis.",
          aiProcessing,
          setAiProcessing
        )}

        {renderConsentCard(
          "Audio transcription",
          "Needed before voice notes or audio evidence can be transcribed.",
          audioTranscription,
          setAudioTranscription
        )}

        {renderConsentCard(
          "Cloud sync",
          "Needed before evidence files upload to the Evidence Vault.",
          cloudSync,
          setCloudSync
        )}

        {renderConsentCard(
          "Warm referral",
          "Needed before SafeSpeak prepares a real support referral.",
          warmReferral,
          setWarmReferral
        )}

        {renderConsentCard(
          "External sharing",
          "Needed before anything is sent to agencies or outside services.",
          externalSharing,
          setExternalSharing
        )}

        {renderConsentCard(
          "Anonymised analytics",
          "Controls whether your data may be used in privacy-safe aggregate insights.",
          anonymisedAnalytics,
          setAnonymisedAnalytics
        )}
      </StyledView>

      {/* 4. My SafeSpeak Card */}
      <StyledView className="w-full bg-white rounded-[28px] border border-[#E2E8F0] p-5 shadow-xs mb-5" style={{ zIndex: 1 }}>
        <StyledText className="text-[#002B49] text-xl font-black mb-1.5">
          My SafeSpeak
        </StyledText>
        <StyledText className="text-[#94A3B8] text-[10.5px] font-semibold mb-5 leading-4.5 pr-2">
          Manage profile details, consent history, reports, language and cultural preferences, and data control requests from one place.
        </StyledText>

        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/profile/user-profile")}
          className="w-full bg-white border border-[#D7E1EE] py-3.5 rounded-full flex-row items-center justify-center mb-5 h-[48px]"
        >
          <Ionicons name="person-circle-outline" size={16} color="#005B96" style={{ marginRight: 8 }} />
          <StyledText className="text-[#005B96] text-xs font-bold">
            Open User Profile
          </StyledText>
        </StyledTouchableOpacity>

        {/* Sub-cards */}
        <StyledView className="space-y-4 pt-2">
          {/* 1. Profile management */}
          <StyledView className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-[20px] mb-4">
            <StyledText className="text-[#002B49] text-xs font-bold">
              Profile management
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mt-1.5 mb-3.5 leading-normal">
              Open your account profile, verification status, security summary, and profile data controls.
            </StyledText>
            <StyledTouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleAction("Profile management")}
            >
              <StyledText className="text-[#005B96] text-[10.5px] font-bold">
                Open
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* 2. Reports center */}
          <StyledView className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-[20px] mb-4">
            <StyledText className="text-[#002B49] text-xs font-bold">
              Reports center
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mt-1.5 mb-3.5 leading-normal">
              Review saved or prepared reports and continue only when you choose.
            </StyledText>
            <StyledTouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleAction("Reports center")}
            >
              <StyledText className="text-[#005B96] text-[10.5px] font-bold">
                Open
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* 3. Consent history */}
          <StyledView className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-[20px] mb-4">
            <StyledText className="text-[#002B49] text-xs font-bold">
              Consent history
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mt-1.5 leading-normal">
              {consentHistoryLength} consent history entr{consentHistoryLength === 1 ? "y" : "ies"} currently available from the backend.
            </StyledText>
          </StyledView>

          {/* 4. Data export and deletion */}
          <StyledView className="bg-[#F8FAFC] border border-[#E2E8F0] p-5 rounded-[20px] mb-2">
            <StyledText className="text-[#002B49] text-xs font-bold">
              Data export and deletion
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mt-1.5 leading-normal">
              Download a backend-generated export or create a deletion request that appears in the admin privacy queue.
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>

      {/* 5. Data Report and Deletion Card */}
      <StyledView className="w-full bg-white rounded-[28px] border border-[#E2E8F0] p-5 shadow-xs mb-5" style={{ zIndex: 1 }}>
        <StyledText className="text-[#002B49] text-base font-black mb-1">
          Data report and deletion
        </StyledText>
        <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mb-4 leading-4">
          SafeSpeak stores all timelines, draft reports, and logs locally on your device. You can download this information or delete it permanently. Profiles are synced to cloud only when you explicitly allow.
        </StyledText>

        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleAction("Delete all data")}
          className="w-full bg-white border border-[#CBD5E1] py-3.5 rounded-full items-center justify-center mb-5"
        >
          <StyledText className="text-[#005B96] text-xs font-bold">
            Delete all data
          </StyledText>
        </StyledTouchableOpacity>

        {/* Sequential Step Items */}
        <StyledView className="space-y-4">
          {[
            { num: "1", title: "Download local backup", desc: "Record of your timelines and choices stored in JSON" },
            { num: "2", title: "Check cloud sync status", desc: "Your synced account status is currently active" },
            { num: "3", title: "Account delete notice", desc: "Deleting your account will erase cloud backup logs immediately" },
          ].map((step, idx) => (
            <StyledView key={idx} className="flex-row items-start">
              <StyledView className="w-6 h-6 rounded-full bg-[#EFF6FF] items-center justify-center mr-3 shrink-0">
                <StyledText className="text-[#005B96] text-[10px] font-bold">
                  {step.num}
                </StyledText>
              </StyledView>
              <StyledView className="flex-1">
                <StyledText className="text-[#002B49] text-xs font-bold">
                  {step.title}
                </StyledText>
                <StyledText className="text-[#64748B] text-[10px] leading-4">
                  {step.desc}
                </StyledText>
              </StyledView>
            </StyledView>
          ))}
        </StyledView>

        {/* Need Assistance Inset Card */}
        <StyledView className="bg-[#EFF6FF] border border-[#BFDBFE] rounded-[20px] p-4 flex-row items-center justify-between mt-5">
          <StyledText className="text-[#005B96] text-[10.5px] font-bold">
            NEED ASSISTANCE? Contact support team
          </StyledText>
          <Ionicons name="chatbubble" size={14} color="#005B96" />
        </StyledView>
      </StyledView>

      {/* 6. Language Feature Card */}
      <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-4 flex-row items-center justify-between mb-4 shadow-xs" style={{ zIndex: 1 }}>
        <StyledView className="flex-row items-center">
          <StyledView className="w-9 h-9 rounded-full bg-[#E0F2FE] items-center justify-center mr-3">
            <Ionicons name="language" size={16} color="#0369A1" />
          </StyledView>
          <StyledView>
            <StyledText className="text-[#002B49] text-xs font-bold">
              Language
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold">
              {language === "es" ? "Español" : "English"}
            </StyledText>
          </StyledView>
        </StyledView>
        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleAction("Change Language")}
          className="bg-[#EFF6FF] px-4 py-1.5 rounded-lg"
        >
          <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-wider">
            Change
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {/* 7. Email & Security Feature Card */}
      <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-4 flex-row items-center justify-between mb-4 shadow-xs" style={{ zIndex: 1 }}>
        <StyledView className="flex-row items-center">
          <StyledView className="w-9 h-9 rounded-full bg-[#DCFCE7] items-center justify-center mr-3">
            <Ionicons name="shield-checkmark" size={16} color="#15803D" />
          </StyledView>
          <StyledView>
            <StyledText className="text-[#002B49] text-xs font-bold">
              Email & Security
            </StyledText>
            <StyledText className="text-[#15803D] text-[9.5px] font-bold">
              Active Secure
            </StyledText>
          </StyledView>
        </StyledView>
        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleAction("Manage Security")}
          className="bg-[#EFF6FF] px-4 py-1.5 rounded-lg"
        >
          <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-wider">
            Manage
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {/* 8. Account Settings Card */}
      <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-4 flex-row items-center justify-between mb-4 shadow-xs" style={{ zIndex: 1 }}>
        <StyledView className="flex-row items-center">
          <StyledView className="w-9 h-9 rounded-full bg-[#EFF6FF] items-center justify-center mr-3">
            <Ionicons name="settings-outline" size={16} color="#005B96" />
          </StyledView>
          <StyledView>
            <StyledText className="text-[#002B49] text-xs font-bold">
              Account Settings
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold">
              Configure your preferences
            </StyledText>
          </StyledView>
        </StyledView>
        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleAction("Edit Account Settings")}
          className="bg-[#EFF6FF] px-4 py-1.5 rounded-lg"
        >
          <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-wider">
            Edit settings
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {/* 9. FAQs Card */}
      <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-4 flex-row items-center justify-between mb-4 shadow-xs" style={{ zIndex: 1 }}>
        <StyledView className="flex-row items-center">
          <StyledView className="w-9 h-9 rounded-full bg-[#EFF6FF] items-center justify-center mr-3">
            <Ionicons name="help-circle-outline" size={18} color="#005B96" />
          </StyledView>
          <StyledView>
            <StyledText className="text-[#002B49] text-xs font-bold">
              FAQs
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold">
              Frequently asked questions
            </StyledText>
          </StyledView>
        </StyledView>
        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleAction("View FAQs")}
          className="bg-[#EFF6FF] px-4 py-1.5 rounded-lg"
        >
          <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-wider">
            View all
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {/* 10. Help & Support Card */}
      <StyledView className="w-full bg-white rounded-[28px] border border-[#E2E8F0] p-5 shadow-xs mb-6" style={{ zIndex: 1 }}>
        <StyledView className="flex-row items-center mb-3">
          <StyledView className="w-9 h-9 rounded-full bg-[#FCE7F3] items-center justify-center mr-3">
            <Ionicons name="chatbubbles-outline" size={16} color="#DB2777" />
          </StyledView>
          <StyledView>
            <StyledText className="text-[#002B49] text-sm font-black">
              Help & Support
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[10px] font-semibold">
              Reach our helpline support representatives
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/profile/help-support")}
          className="w-full bg-[#005B96] py-3.5 rounded-full items-center justify-center mt-2 shadow-xs"
        >
          <StyledText className="text-white text-xs font-bold">
            Contact us
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {/* Logout Button */}
      <StyledTouchableOpacity
        activeOpacity={0.8}
        onPress={handleLogout}
        className="w-full bg-white border border-[#EF4444]/30 py-3.5 rounded-full items-center justify-center flex-row mb-6 shadow-xs"
        style={{ zIndex: 1 }}
      >
        <Ionicons name="log-out-outline" size={16} color="#EF4444" className="mr-2" />
        <StyledText className="text-[#EF4444] text-xs font-bold">
          Log out
        </StyledText>
      </StyledTouchableOpacity>

      {/* Privacy Policy & Terms of Use Links */}
      <StyledView className="flex-row justify-center items-center space-x-6 mt-4 mb-10" style={{ zIndex: 1 }}>
        <StyledTouchableOpacity activeOpacity={0.7} onPress={() => router.push("/profile/privacy")}>
          <StyledText className="text-[#64748B] text-xs font-bold">
            Privacy Policy
          </StyledText>
        </StyledTouchableOpacity>
        <StyledText className="text-[#CBD5E1]">|</StyledText>
        <StyledTouchableOpacity activeOpacity={0.7} onPress={() => router.push("/profile/terms")}>
          <StyledText className="text-[#64748B] text-xs font-bold">
            Terms of Use
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>

      {/* Interactive Bottom Sheet Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguageSheet}
        onRequestClose={() => setShowLanguageSheet(false)}
      >
        <StyledView className="flex-1 justify-end bg-black/40">
          {/* Backdrop Touch Area */}
          <Pressable className="absolute inset-0" onPress={() => setShowLanguageSheet(false)} />

          {/* Bottom Sheet Container */}
          <StyledAnimatedView
            style={{
              transform: [{ translateY: panY }],
            }}
            className="bg-white rounded-t-[32px] p-6 pb-10 shadow-2xl z-50"
          >
            {/* Grab Handle Pill Area with PanResponder */}
            <StyledView
              {...panResponder.panHandlers}
              className="w-full py-2.5 items-center justify-center mb-3"
            >
              <StyledView className="w-12 h-1 bg-[#E2E8F0] rounded-full" />
            </StyledView>

            <StyledText className="text-[#0B1F33] text-lg font-black mb-1">
              Select Language
            </StyledText>
            <StyledText className="text-[#64748B] text-[11px] font-semibold mb-6">
              Choose your preferred language for the SafeSpeak interface.
            </StyledText>

            {/* Language Options Stack */}
            {[
              { code: "en", label: "English", sub: "English (US/UK)", icon: "🇬🇧" },
              { code: "es", label: "Español", sub: "Spanish (ES)", icon: "🇪🇸" },
            ].map((item) => {
              const isSelected = language === item.code;
              return (
                <StyledTouchableOpacity
                  key={item.code}
                  activeOpacity={0.8}
                  onPress={() => {
                    setLanguage(item.code);
                    setShowLanguageSheet(false);
                  }}
                  className={`flex-row items-center justify-between p-4 rounded-2xl mb-3 border ${
                    isSelected
                      ? "bg-[#F0F7FF] border-[#BFDBFE]"
                      : "bg-white border-[#E2E8F0]"
                  }`}
                >
                  <StyledView className="flex-row items-center">
                    <StyledText className="text-xl mr-3">{item.icon}</StyledText>
                    <StyledView>
                      <StyledText className={`text-xs font-bold ${isSelected ? "text-[#005B96]" : "text-[#0F172A]"}`}>
                        {item.label}
                      </StyledText>
                      <StyledText className="text-[#64748B] text-[9.5px] font-semibold mt-0.5">
                        {item.sub}
                      </StyledText>
                    </StyledView>
                  </StyledView>

                  {/* Radio Indicator */}
                  <StyledView className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                    isSelected ? "border-[#005B96] bg-[#005B96]" : "border-[#CBD5E1]"
                  }`}>
                    {isSelected && (
                      <StyledView className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </StyledView>
                </StyledTouchableOpacity>
              );
            })}

            {/* Cancel Button */}
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowLanguageSheet(false)}
              className="w-full bg-[#F1F5F9] rounded-full py-4 items-center justify-center mt-3"
            >
              <StyledText className="text-[#475569] text-xs font-bold">
                Cancel
              </StyledText>
            </StyledTouchableOpacity>
          </StyledAnimatedView>
        </StyledView>
      </Modal>
    </SafeSpeakScreen>
  );
}
