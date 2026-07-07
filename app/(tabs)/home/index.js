import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import EmergencyBar from "../../../components/tabs/home/EmergencyBar";
import ProfileHeader from "../../../components/tabs/home/ProfileHeader";
import ReportingHub from "../../../components/tabs/home/ReportingHub";
import ServiceTiles from "../../../components/tabs/home/ServiceTiles";
import IntelligenceMap from "../../../components/tabs/home/IntelligenceMap";
import QuickActionsAndActivity from "../../../components/tabs/home/QuickActionsAndActivity";
import SidebarDrawer from "../../../components/tabs/home/SidebarDrawer";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);

export default function Home() {
  const [headerVisible, setHeaderVisible] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;

    if (currentOffsetY <= 10) {
      setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      setHeaderVisible(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F4FA]" edges={["top"]}>
      <StyledView className="flex-1 relative">
        <StyledScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 175, paddingBottom: 40 }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <ProfileHeader onMenuPress={() => setSidebarOpen(true)} />
          <ReportingHub />
          <ServiceTiles />
          <IntelligenceMap />
          <QuickActionsAndActivity />
        </StyledScrollView>
        <EmergencyBar visible={headerVisible} absolute={true} />
        <SidebarDrawer isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </StyledView>
    </SafeAreaView>
  );
}
