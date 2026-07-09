import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../components/CustomHeader";
import { useLanguage } from "../../../context/LanguageContext";
import api from "../../../context/api";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const NotificationItem = ({ item, onPress }) => {
  if (item.unread) {
    return (
      <StyledTouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.highlightedCard}>
        <StyledView style={styles.highlightedIconWrap}>
          <Ionicons name="notifications" size={22} color="#111" />
          <StyledView style={styles.redDot} />
        </StyledView>
        <StyledView style={{ flex: 1 }}>
          <StyledText style={styles.highlightedTitle}>{item.title}</StyledText>
          <StyledText style={styles.highlightedSubtitle}>
            {item.body}
          </StyledText>
        </StyledView>
      </StyledTouchableOpacity>
    );
  }

  return (
    <StyledTouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.normalCard}>
      <StyledView style={styles.normalIconWrap}>
        <Ionicons name="flash-outline" size={20} color="#555" />
      </StyledView>
      <StyledView style={{ flex: 1 }}>
        <StyledText style={styles.normalTitle}>{item.title}</StyledText>
        <StyledText style={styles.normalSubtitle}>{item.body}</StyledText>
      </StyledView>
    </StyledTouchableOpacity>
  );
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("today");
  const [headerVisible, setHeaderVisible] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    setLoading(true);
    const viewParam = activeTab === "today" ? "today" : "past";
    api.get(`/notifications?view=${viewParam}&limit=50`)
      .then((res) => {
        const json = res.data;
        if (json.success && json.data && Array.isArray(json.data.notifications)) {
          setNotifications(json.data.notifications);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch notifications:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, [activeTab]);

  const handleMarkRead = (notificationId) => {
    const notif = notifications.find((n) => n.id === notificationId);
    if (!notif || !notif.unread) return;

    api.post("/notifications/read", { notificationId })
      .then((res) => {
        if (res.data.success) {
          setNotifications((prev) =>
            prev.map((n) => (n.id === notificationId ? { ...n, unread: false } : n))
          );
        }
      })
      .catch((err) => {
        console.warn("Failed to mark notification read:", err);
      });
  };

  const handleMarkAllRead = () => {
    const unreadIds = notifications.filter((n) => n.unread).map((n) => n.id);
    if (unreadIds.length === 0) return;

    api.post("/notifications/read-all", { notificationIds: unreadIds })
      .then((res) => {
        if (res.data.success) {
          setNotifications((prev) =>
            prev.map((n) => (unreadIds.includes(n.id) ? { ...n, unread: false } : n))
          );
        }
      })
      .catch((err) => {
        console.warn("Failed to mark all notifications read:", err);
      });
  };

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;

    if (currentOffsetY <= 10) {
      setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      setHeaderVisible(false);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <StyledView style={{ flex: 1, backgroundColor: "#F0F4FA" }}>
      <CustomHeader
        title=""
        backText="Notification"
        rightText="Mark all read"
        onRightPress={handleMarkAllRead}
        rightTextColor={unreadCount > 0 ? "#FB923C" : "#94A3B8"}
        rightDisabled={unreadCount === 0}
        headerVisible={headerVisible}
      />

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

      {/* Notification List */}
      {loading && notifications.length === 0 ? (
        <StyledView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#005B96" />
        </StyledView>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onPress={() => handleMarkRead(item.id)}
              />
            ))
          ) : (
            <StyledText style={{ textAlign: "center", color: "#64748B", fontSize: 14, marginTop: 40, fontWeight: "500" }}>
              No notifications.
            </StyledText>
          )}
        </ScrollView>
      )}
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
