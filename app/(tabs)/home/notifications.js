import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import EmergencyBar from "../../../components/tabs/home/EmergencyBar";
import { useLanguage } from "../../../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const TODAY_NOTIFICATIONS = (t) => [
  {
    id: "1",
    title: t("notifUnreadTitle"),
    subtitle: t("notifUnreadSubtitle"),
    highlighted: true,
  },
  {
    id: "2",
    title: t("notifUnreadTitle"),
    subtitle: t("notifUnreadSubtitle"),
    highlighted: false,
  },
  {
    id: "3",
    title: t("notifUnreadTitle"),
    subtitle: t("notifUnreadSubtitle"),
    highlighted: false,
  },
  {
    id: "4",
    title: t("notifUnreadTitle"),
    subtitle: t("notifUnreadSubtitle"),
    highlighted: false,
  },
  {
    id: "5",
    title: t("notifUnreadTitle"),
    subtitle: t("notifUnreadSubtitle"),
    highlighted: false,
  },
];

const PAST_NOTIFICATIONS = (t) => [
  {
    id: "p1",
    title: t("notifUnreadTitle"),
    subtitle: t("notifUnreadSubtitle"),
    highlighted: false,
  },
  {
    id: "p2",
    title: t("notifUnreadTitle"),
    subtitle: t("notifUnreadSubtitle"),
    highlighted: false,
  },
  {
    id: "p3",
    title: t("notifUnreadTitle"),
    subtitle: t("notifUnreadSubtitle"),
    highlighted: false,
  },
];

const NotificationItem = ({ item }) => {
  if (item.highlighted) {
    return (
      <StyledView style={styles.highlightedCard}>
        <StyledView style={styles.highlightedIconWrap}>
          <Ionicons name="notifications" size={22} color="#111" />
          <StyledView style={styles.redDot} />
        </StyledView>
        <StyledView style={{ flex: 1 }}>
          <StyledText style={styles.highlightedTitle}>{item.title}</StyledText>
          <StyledText style={styles.highlightedSubtitle}>
            {item.subtitle}
          </StyledText>
        </StyledView>
      </StyledView>
    );
  }

  return (
    <StyledView style={styles.normalCard}>
      <StyledView style={styles.normalIconWrap}>
        <Ionicons name="flash" size={20} color="#555" />
      </StyledView>
      <StyledView style={{ flex: 1 }}>
        <StyledText style={styles.normalTitle}>{item.title}</StyledText>
        <StyledText style={styles.normalSubtitle}>{item.subtitle}</StyledText>
      </StyledView>
    </StyledView>
  );
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("today");
  const [headerVisible, setHeaderVisible] = useState(true);

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;

    if (currentOffsetY <= 10) {
      setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      setHeaderVisible(false);
    }
  };

  const notifications =
    activeTab === "today" ? TODAY_NOTIFICATIONS(t) : PAST_NOTIFICATIONS(t);

  return (
    <StyledView style={{ flex: 1, backgroundColor: "#F0F4FA" }}>
      <SafeAreaView edges={["top"]}>
        <EmergencyBar visible={headerVisible} />

        {/* Header */}
        <StyledView style={styles.headerRow}>
          <StyledTouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={20} color="#FB923C" />
          </StyledTouchableOpacity>

          <StyledText style={styles.headerTitle}>
            {t("notifications")}
          </StyledText>

          <StyledTouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <StyledText style={styles.cancelText}>{t("cancel")}</StyledText>
          </StyledTouchableOpacity>
        </StyledView>

        {/* Tab Switcher */}
        <StyledView style={styles.tabContainer}>
          <StyledTouchableOpacity
            style={[styles.tab, activeTab === "today" && styles.tabActive]}
            onPress={() => setActiveTab("today")}
            activeOpacity={0.8}
          >
            <StyledText
              style={[
                styles.tabText,
                activeTab === "today"
                  ? styles.tabTextActive
                  : styles.tabTextInactive,
              ]}
            >
              {t("notifToday")}
            </StyledText>
          </StyledTouchableOpacity>

          <StyledTouchableOpacity
            style={[styles.tab, activeTab === "past" && styles.tabActive]}
            onPress={() => setActiveTab("past")}
            activeOpacity={0.8}
          >
            <StyledText
              style={[
                styles.tabText,
                activeTab === "past"
                  ? styles.tabTextActive
                  : styles.tabTextInactive,
              ]}
            >
              {t("notifPast")}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </SafeAreaView>

      {/* Notification List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {notifications.map((item) => (
          <NotificationItem key={item.id} item={item} />
        ))}
      </ScrollView>
    </StyledView>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#94A3B8",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 4,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 13,
  },
  tabActive: {
    backgroundColor: "#005B96",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "700",
  },
  tabTextActive: {
    color: "white",
  },
  tabTextInactive: {
    color: "#005B96",
  },
  // Highlighted (first/unread) card
  highlightedCard: {
    backgroundColor: "#F59E0B",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  highlightedIconWrap: {
    width: 42,
    height: 42,
    backgroundColor: "white",
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    position: "relative",
  },
  redDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: "#EF4444",
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "white",
  },
  highlightedTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  highlightedSubtitle: {
    fontSize: 12,
    color: "#1F2937",
    opacity: 0.75,
  },
  // Normal notification card
  normalCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  normalIconWrap: {
    width: 40,
    height: 40,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  normalTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  normalSubtitle: {
    fontSize: 12,
    color: "#94A3B8",
  },
});
