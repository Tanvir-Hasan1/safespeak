import React from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import EmergencyBar from "../../components/tabs/home/EmergencyBar";
import ProfileHeader from "../../components/tabs/home/ProfileHeader";
import ReportingHub from "../../components/tabs/home/ReportingHub";
import ServiceTiles from "../../components/tabs/home/ServiceTiles";
import IntelligenceMap from "../../components/tabs/home/IntelligenceMap";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-[#F0F4FA]" edges={["top"]}>
      <EmergencyBar />
      <StyledScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <ProfileHeader />
        <ReportingHub />
        <ServiceTiles />
        <IntelligenceMap />
      </StyledScrollView>
    </SafeAreaView>
  );
}
