import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { useRouter } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function QuickActionsAndActivity() {
  const router = useRouter();

  const actions = [
    { label: "Report New Incident", route: "/home/incident-builder" },
    { label: "Check for Scams", route: "/home/scam-shield" },
    { label: "Find Support", route: "/home/smart-dialer" },
    { label: "Learn Something New", route: "/home/micro-cards" },
  ];

  return (
    <StyledView className="px-6 space-y-4 mb-8">
      {/* Quick Actions Card */}
      <StyledView className="bg-white rounded-[28px] p-5 border border-[#E2E8F0] shadow-sm">
        <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-wider mb-4">
          QUICK ACTIONS
        </StyledText>
        
        <StyledView className="space-y-3">
          {actions.map((action, idx) => (
            <StyledTouchableOpacity
              key={idx}
              activeOpacity={0.7}
              onPress={() => router.push(action.route)}
              className="w-full bg-[#F8FAFC] border border-[#EFF6FF] rounded-[20px] py-4 px-5 items-start justify-center"
            >
              <StyledText className="text-[#1E293B] text-sm font-semibold">
                {action.label}
              </StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledView>
      </StyledView>

      {/* Activity and Recommendations Card */}
      <StyledView className="bg-white rounded-[28px] p-5 border border-[#E2E8F0] shadow-sm">
        <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-wider mb-4">
          ACTIVITY AND RECOMMENDATIONS
        </StyledText>

        <StyledView className="space-y-3">
          {/* Activity Summary Sub-card */}
          <StyledView className="bg-[#F8FAFC] border border-[#EFF6FF] rounded-[20px] p-4">
            <StyledText className="text-[#1E293B] text-sm font-bold mb-1">
              Activity summary
            </StyledText>
            <StyledText className="text-[#64748B] text-xs leading-5">
              Recent report and support activity appears here when backend data is available. No fake counts are shown.
            </StyledText>
          </StyledView>

          {/* Recommendations Sub-card */}
          <StyledView className="bg-[#F8FAFC] border border-[#EFF6FF] rounded-[20px] p-4">
            <StyledText className="text-[#1E293B] text-sm font-bold mb-1">
              Recommendations
            </StyledText>
            <StyledText className="text-[#64748B] text-xs leading-5">
              Start with a safe report, browse support, or use Learn & Resources if you want information without saving anything yet.
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledView>
  );
}
