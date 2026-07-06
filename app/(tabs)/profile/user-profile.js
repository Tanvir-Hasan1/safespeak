import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Linking,
  StyleSheet,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLanguage } from "../../../context/LanguageContext";
import CustomHeader from "../../../components/CustomHeader";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function UserProfileScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [headerVisible, setHeaderVisible] = useState(true);

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    if (currentOffsetY <= 10) {
      setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      setHeaderVisible(false);
    }
  };

  const handleAction = (actionName) => {
    Alert.alert("Action Triggered", `${actionName} simulated successfully.`);
  };

  const handleEmergencyPress = () => {
    Alert.alert(
      "Emergency Actions",
      "Dial emergency services immediately:",
      [
        {
          text: "📞 Call 000 (Police/Ambulance)",
          onPress: () => Linking.openURL("tel:000"),
        },
        {
          text: "📞 Call 1800RESPECT",
          onPress: () => Linking.openURL("tel:1800737732"),
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const renderInfoRow = (label, val, actionLabel = null, actionName = null) => {
    return (
      <StyledView className="flex-row items-center justify-between py-3 border-b border-[#F1F5F9]">
        <StyledView className="flex-1 pr-4">
          <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-wider mb-0.5">
            {label}
          </StyledText>
          <StyledText className="text-[#002B49] text-xs font-bold">
            {val}
          </StyledText>
        </StyledView>
        {actionLabel && (
          <StyledTouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleAction(actionName || label)}
          >
            <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-wider">
              {actionLabel}
            </StyledText>
          </StyledTouchableOpacity>
        )}
      </StyledView>
    );
  };

  const renderSecurityRow = (label, val, actionLabel, actionName) => {
    return (
      <StyledView className="flex-row items-center justify-between py-3 border-b border-[#F1F5F9]">
        <StyledView className="flex-1 pr-4">
          <StyledText className="text-[#002B49] text-xs font-bold mb-0.5">
            {label}
          </StyledText>
          <StyledText className="text-[#94A3B8] text-[10px] font-semibold">
            {val}
          </StyledText>
        </StyledView>
        <StyledTouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleAction(actionName)}
        >
          <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-wider">
            {actionLabel}
          </StyledText>
        </StyledTouchableOpacity>
      </StyledView>
    );
  };

  const renderActivityCard = (iconName, iconColor, count, label) => {
    return (
      <StyledView className="bg-white border border-[#E2E8F0] p-4 rounded-[20px] flex-1 min-w-[45%] mb-3.5 shadow-xs">
        <StyledView className="w-8 h-8 rounded-full items-center justify-center mb-2" style={{ backgroundColor: `${iconColor}20` }}>
          <Ionicons name={iconName} size={15} color={iconColor} />
        </StyledView>
        <StyledText className="text-[#002B49] text-xl font-black mb-0.5">
          {count}
        </StyledText>
        <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold uppercase tracking-wider">
          {label}
        </StyledText>
      </StyledView>
    );
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText="Settings"
        rightText="Cancel"
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 160, paddingTop: 10, paddingHorizontal: 24 }}
      >
        {/* Top Header Title & Actions */}
        <StyledView className="mt-4 mb-5 flex-row justify-between items-start">
          <StyledView className="flex-1 mr-4">
            <StyledText className="text-[#002B49] text-3xl font-black mb-1">
              My Profile
            </StyledText>
            <StyledText className="text-[#64748B] text-xs font-semibold">
              Manage your account and preferences
            </StyledText>
          </StyledView>

          {/* Action Button Row */}
          <StyledView className="flex-row items-center space-x-2">
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleAction("Edit Profile")}
              className="bg-white border border-[#D7E1EE] px-3.5 py-1.5 rounded-xl flex-row items-center h-[34px] shadow-xs"
            >
              <Ionicons name="create-outline" size={13} color="#005B96" style={{ marginRight: 5 }} />
              <StyledText className="text-[#005B96] text-[10px] font-bold">
                Edit Profile
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleAction("Configure Settings")}
              className="bg-white border border-[#D7E1EE] w-[34px] h-[34px] rounded-xl items-center justify-center shadow-xs"
            >
              <Ionicons name="settings-outline" size={14} color="#005B96" />
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        {/* 1. Large User Blue Card */}
        <StyledView className="w-full bg-[#005B96] rounded-[28px] p-6 shadow-xs mb-5">
          <StyledView className="flex-row items-center mb-4">
            {/* Avatar Circle */}
            <StyledView className="w-16 h-16 rounded-full bg-white border-2 border-white items-center justify-center mr-4 relative">
              <StyledText className="text-[#005B96] text-2xl font-black">
                H
              </StyledText>
              <StyledTouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleAction("Update Avatar")}
                className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-white items-center justify-center border border-[#005B96] shadow-xs"
              >
                <Ionicons name="camera" size={11} color="#005B96" />
              </StyledTouchableOpacity>
            </StyledView>

            {/* Username & Status Badge */}
            <StyledView>
              <StyledText className="text-white text-lg font-black mb-1">
                Hasantanvir529
              </StyledText>
              <StyledView className="bg-[#D1FAE5] px-2 py-0.5 rounded-md self-start flex-row items-center">
                <StyledView className="w-1.5 h-1.5 rounded-full bg-[#057A55] mr-1.5" />
                <StyledText className="text-[#057A55] text-[8.5px] font-extrabold uppercase tracking-wider">
                  Email pending
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledView>

          {/* Details list */}
          <StyledView className="border-t border-white/10 pt-3 space-y-2">
            <StyledView className="flex-row items-center">
              <Ionicons name="mail" size={13} color="rgba(255,255,255,0.7)" style={{ marginRight: 8 }} />
              <StyledText className="text-white/90 text-[11px] font-semibold">
                hasantanvir529@gmail.com
              </StyledText>
            </StyledView>
            <StyledView className="flex-row items-center mt-1.5">
              <Ionicons name="calendar" size={13} color="rgba(255,255,255,0.7)" style={{ marginRight: 8 }} />
              <StyledText className="text-white/90 text-[11px] font-semibold">
                Member since July 2, 2026
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* 2. Flat Status Cards */}
        {/* Account Status Card */}
        <StyledView className="w-full bg-white rounded-[20px] border border-[#E2E8F0] p-4 flex-row justify-between items-center mb-3 shadow-xs">
          <StyledView className="flex-row items-center flex-1 pr-4">
            <StyledView className="w-8 h-8 rounded-full bg-[#DCFCE7] items-center justify-center mr-3">
              <Ionicons name="shield-checkmark" size={14} color="#15803D" />
            </StyledView>
            <StyledView className="flex-1">
              <StyledText className="text-[#002B49] text-xs font-bold">
                Account Status
              </StyledText>
              <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mt-0.5 leading-4">
                Your account is active and in good standing.
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledView className="bg-[#DCFCE7] px-2.5 py-0.5 rounded-md border border-[#BBF7D0]">
            <StyledText className="text-[#15803D] text-[9px] font-extrabold uppercase tracking-wider">
              Active
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Role Card */}
        <StyledView className="w-full bg-white rounded-[20px] border border-[#E2E8F0] p-4 flex-row justify-between items-center mb-3 shadow-xs">
          <StyledView className="flex-row items-center flex-1 pr-4">
            <StyledView className="w-8 h-8 rounded-full bg-[#EFF6FF] items-center justify-center mr-3">
              <Ionicons name="person" size={14} color="#005B96" />
            </StyledView>
            <StyledView className="flex-1">
              <StyledText className="text-[#002B49] text-xs font-bold">
                Role
              </StyledText>
              <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mt-0.5 leading-4">
                You can report incidents, get support and access resources.
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledView className="bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-[#DBEAFE]">
            <StyledText className="text-[#005B96] text-[9px] font-extrabold uppercase tracking-wider">
              Public User
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Email Verified Card */}
        <StyledView className="w-full bg-white rounded-[20px] border border-[#E2E8F0] p-4 flex-row justify-between items-center mb-5 shadow-xs">
          <StyledView className="flex-row items-center flex-1 pr-4">
            <StyledView className="w-8 h-8 rounded-full bg-[#FEE2E2] items-center justify-center mr-3">
              <Ionicons name="mail-unread" size={14} color="#B91C1C" />
            </StyledView>
            <StyledView className="flex-1">
              <StyledText className="text-[#002B49] text-xs font-bold">
                Email Verified
              </StyledText>
              <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mt-0.5 leading-4">
                Verify your email to improve account recovery.
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledView className="bg-[#FEE2E2] px-2.5 py-0.5 rounded-md border border-[#FCA5A5]">
            <StyledText className="text-[#B91C1C] text-[9px] font-extrabold uppercase tracking-wider">
              Pending
            </StyledText>
          </StyledView>
        </StyledView>

        {/* 3. Profile Information Card */}
        <StyledView className="w-full bg-white rounded-[28px] border border-[#E2E8F0] p-5 shadow-xs mb-5">
          <StyledText className="text-[#002B49] text-base font-black mb-3">
            Profile Information
          </StyledText>

          {renderInfoRow("Full Name", "Hasantanvir529")}
          {renderInfoRow("Email", "hasantanvir529@gmail.com")}
          {renderInfoRow("Phone", "Not added", "Add", "Add Phone")}
          {renderInfoRow("Language", "en", "Edit", "Edit Language")}
          {renderInfoRow("Timezone", "(GMT+6) Dhaka, Bangladesh", "Edit", "Edit Timezone")}
          {renderInfoRow("Preferred Contact", "In-app", "Edit", "Edit Preferred Contact")}
        </StyledView>

        {/* 4. Security Card */}
        <StyledView className="w-full bg-white rounded-[28px] border border-[#E2E8F0] p-5 shadow-xs mb-5">
          <StyledText className="text-[#002B49] text-base font-black mb-3">
            Security
          </StyledText>

          {renderSecurityRow("Password", "••••••••", "Change", "Change Password")}
          {renderSecurityRow("Two-Factor Authentication", "Off", "Enable", "Enable 2FA")}
          {renderSecurityRow("Login Devices", "2 active sessions", "Manage", "Manage Devices")}
        </StyledView>

        {/* 5. Activity Summary Section */}
        <StyledView className="mb-5">
          <StyledView className="flex-row justify-between items-center mb-3">
            <StyledText className="text-[#002B49] text-base font-black">
              Activity Summary
            </StyledText>
            <StyledTouchableOpacity activeOpacity={0.7} onPress={() => handleAction("View all Activity")}>
              <StyledText className="text-[#005B96] text-xs font-bold">
                View all
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Cards Grid */}
          <StyledView className="flex-row flex-wrap justify-between">
            {renderActivityCard("document-text-outline", "#8B5CF6", "1", "Reports Submitted")}
            {renderActivityCard("people-outline", "#F59E0B", "1", "Support Requests")}
            {renderActivityCard("eye-outline", "#10B981", "0", "Resources Viewed")}
            {renderActivityCard("notifications-outline", "#3B82F6", "0", "Notifications")}
          </StyledView>
        </StyledView>

        {/* 6. Account Actions Card */}
        <StyledView className="w-full bg-white rounded-[28px] border border-[#E2E8F0] p-5 shadow-xs mb-5">
          <StyledView className="flex-row items-center mb-3">
            <StyledView className="w-9 h-9 rounded-full bg-[#EFF6FF] items-center justify-center mr-3">
              <Ionicons name="settings-outline" size={16} color="#005B96" />
            </StyledView>
            <StyledView className="flex-1">
              <StyledText className="text-[#002B49] text-sm font-black mb-0.5">
                Account Actions
              </StyledText>
              <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold">
                Download a backend-generated export or deactivate your account.
              </StyledText>
            </StyledView>
          </StyledView>

          {/* Download Backend Export Button */}
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleAction("Download Backend Export")}
            className="w-full bg-white border border-[#D7E1EE] py-3 rounded-xl flex-row items-center justify-center mb-2.5 h-[42px] shadow-xs"
          >
            <Ionicons name="download-outline" size={13} color="#005B96" style={{ marginRight: 6 }} />
            <StyledText className="text-[#005B96] text-xs font-bold">
              Download Backend Export
            </StyledText>
          </StyledTouchableOpacity>

          {/* Privacy Settings Button */}
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleAction("Privacy Settings")}
            className="w-full bg-white border border-[#D7E1EE] py-3 rounded-xl flex-row items-center justify-center mb-2.5 h-[42px] shadow-xs"
          >
            <Ionicons name="lock-closed-outline" size={13} color="#005B96" style={{ marginRight: 6 }} />
            <StyledText className="text-[#005B96] text-xs font-bold">
              Privacy Settings
            </StyledText>
          </StyledTouchableOpacity>

          {/* Deactivate Account Button */}
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleAction("Deactivate Account")}
            className="w-full bg-white border border-[#FEE2E2] py-3 rounded-xl flex-row items-center justify-center mb-2.5 h-[42px]"
          >
            <Ionicons name="trash-outline" size={13} color="#EF4444" style={{ marginRight: 6 }} />
            <StyledText className="text-[#EF4444] text-xs font-bold">
              Deactivate Account
            </StyledText>
          </StyledTouchableOpacity>

          {/* Logout Button */}
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={() => handleAction("Logout")}
            className="w-full bg-white border border-[#CBD5E1] py-3 rounded-xl flex-row items-center justify-center h-[42px]"
          >
            <Ionicons name="log-out-outline" size={13} color="#64748B" style={{ marginRight: 6 }} />
            <StyledText className="text-[#64748B] text-xs font-bold">
              Logout
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
