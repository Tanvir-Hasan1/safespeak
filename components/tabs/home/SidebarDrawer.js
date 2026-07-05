import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const { width } = Dimensions.get("window");
const DRAWER_WIDTH = 280;

export default function SidebarDrawer({ isOpen, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const [slideAnim] = useState(new Animated.Value(-DRAWER_WIDTH));
  const [backdropOpacity] = useState(new Animated.Value(0));
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -DRAWER_WIDTH,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShouldRender(false);
      });
    }
  }, [isOpen]);

  const menuItems = [
    {
      label: "Home",
      icon: "home-outline",
      route: "/home",
    },
    {
      label: "Report Incident",
      icon: "alert-circle-outline",
      route: "/home/incident-builder",
    },
    {
      label: "ScamShield",
      icon: "shield-outline",
      route: "/home/scam-shield",
    },
    {
      label: "Get Support",
      icon: "call-outline",
      route: "/home/get-support",
    },
    {
      label: "Learn & Resources",
      icon: "book-outline",
      route: "/home/resources",
    },
    {
      label: "Notifications",
      icon: "notifications-outline",
      route: "/home/notifications",
      hasDot: true,
    },
  ];

  const handleNavigation = (route) => {
    onClose();
    // Delay routing slightly to let drawer slide out first
    setTimeout(() => {
      if (route === "/home") {
        router.replace("/home");
      } else {
        router.push(route);
      }
    }, 150);
  };

  return (
    <Modal
      transparent={true}
      visible={shouldRender}
      onRequestClose={onClose}
      animationType="none"
    >
      <StyledView className="flex-1 relative flex-row">
        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.4)",
              opacity: backdropOpacity,
            }}
          />
        </TouchableWithoutFeedback>

        {/* Drawer Body */}
        <Animated.View
          style={{
            width: DRAWER_WIDTH,
            height: "100%",
            backgroundColor: "#F8FAFC",
            paddingHorizontal: 24,
            paddingTop: 80,
            transform: [{ translateX: slideAnim }],
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 16,
          }}
        >
          <StyledView className="space-y-4">
            {menuItems.map((item, idx) => {
              // Determine active/highlight state dynamically based on the current pathname
              const isActive =
                pathname === item.route ||
                (item.route !== "/home" && pathname.startsWith(item.route));

              return (
                <StyledTouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  onPress={() => handleNavigation(item.route)}
                  className={`flex-row items-center px-4 py-3 rounded-full justify-between ${
                    isActive ? "bg-[#FEF3C7]" : "bg-transparent"
                  }`}
                >
                  <StyledView className="flex-row items-center space-x-4">
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={isActive ? "#D97706" : "#475569"}
                    />
                    <StyledText
                      className={`text-sm font-semibold ml-3 ${
                        isActive ? "text-[#D97706]" : "text-[#475569]"
                      }`}
                    >
                      {item.label}
                    </StyledText>
                  </StyledView>

                  {/* Red dot for notifications */}
                  {item.hasDot && (
                    <StyledView className="w-2 h-2 bg-[#EF4444] rounded-full mr-2" />
                  )}
                </StyledTouchableOpacity>
              );
            })}
          </StyledView>
        </Animated.View>
      </StyledView>
    </Modal>
  );
}
