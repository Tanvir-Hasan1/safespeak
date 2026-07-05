import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
  Animated,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../../context/LanguageContext";
import { useRouter } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const LANGUAGES = [
  { code: "EN", key: "en", label: "English", flag: "🇬🇧" },
  { code: "ES", key: "es", label: "Español", flag: "🇪🇸" },
];

const callEmergency = () => Linking.openURL("tel:000");
const callRespect = () => Linking.openURL("tel:1800737732");

const EmergencyBar = React.memo(({ visible = true, absolute = false }) => {
  const { language, setLanguage, t } = useLanguage();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({ top: 0, right: 0 });
  const langButtonRef = React.useRef(null);
  const router = useRouter();

  const animatedValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: visible ? 1 : 0,
      duration: 200,
      useNativeDriver: absolute,
    }).start();
  }, [visible, absolute]);

  const selectedLang =
    LANGUAGES.find((l) => l.key === language) || LANGUAGES[0];

  const openDropdown = () => {
    if (langButtonRef.current) {
      langButtonRef.current.measure((fx, fy, width, height, px, py) => {
        setAnchorPosition({ top: py + height + 4, right: 16 });
        setDropdownVisible(true);
      });
    } else {
      setDropdownVisible(true);
    }
  };

  const selectLanguage = (lang) => {
    setLanguage(lang.key);
    setDropdownVisible(false);
  };

  const goToSmartDialer = () => {
    router.push("/home/smart-dialer");
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 0],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const height = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 125],
  });

  const containerStyle = absolute
    ? {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transform: [{ translateY }],
        opacity,
      }
    : {
        height,
        opacity,
        overflow: "hidden",
      };

  return (
    <>
      <Animated.View style={containerStyle}>
        <StyledView className="w-full px-4 pt-2 pb-2">
          <StyledView className="bg-slate-100 p-3 rounded-[28px] border border-rose-500/85 shadow-sm">
            {/* Row 1: Emergency & 1800RESPECT */}
            <StyledView className="flex-row justify-between mb-2">
              <StyledTouchableOpacity
                activeOpacity={0.7}
                onPress={callEmergency}
                className="flex-1 mr-1 bg-[#EF4444] rounded-full py-2.5 items-center justify-center flex-row"
              >
                <Ionicons name="alert-circle" size={14} color="white" style={{ marginRight: 4 }} />
                <StyledText className="text-white font-extrabold text-[11px] uppercase">
                  {t("emergencyCallShort")}
                </StyledText>
              </StyledTouchableOpacity>

              <StyledTouchableOpacity
                activeOpacity={0.7}
                onPress={callRespect}
                className="flex-1 ml-1 bg-[#0F5D9F] rounded-full py-2.5 items-center justify-center flex-row"
              >
                <Ionicons name="call" size={14} color="white" style={{ marginRight: 4 }} />
                <StyledText className="text-white font-extrabold text-[11px] uppercase">
                  {t("respectCallLabel")}
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>

            {/* Row 2: Smart Dialer & Language Selector */}
            <StyledView className="flex-row justify-between items-center">
              <StyledTouchableOpacity
                activeOpacity={0.7}
                onPress={goToSmartDialer}
                className="flex-1 mr-1 bg-[#10B981] rounded-full py-2.5 items-center justify-center flex-row"
              >
                <Ionicons name="call-outline" size={13} color="white" style={{ marginRight: 4 }} />
                <StyledText className="text-white font-extrabold text-[11px] uppercase">
                  {t("smartDialer")}
                </StyledText>
              </StyledTouchableOpacity>

              <StyledTouchableOpacity
                ref={langButtonRef}
                onPress={openDropdown}
                activeOpacity={0.7}
                className="flex-1 ml-1 bg-slate-700 rounded-full py-2.5 flex-row items-center justify-center"
              >
                <Text style={{ fontSize: 13, marginRight: 4 }}>{selectedLang.flag}</Text>
                <StyledText className="text-white font-bold text-[11px]">
                  {selectedLang.code}
                </StyledText>
                <Ionicons name="chevron-down" size={10} color="white" style={{ marginLeft: 4 }} />
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
      </Animated.View>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setDropdownVisible(false)}
        >
          <View
            style={{
              position: "absolute",
              top: anchorPosition.top,
              right: anchorPosition.right,
              backgroundColor: "white",
              borderRadius: 10,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 8,
              minWidth: 140,
              overflow: "hidden",
            }}
          >
            {LANGUAGES.map((lang, index) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => selectLanguage(lang)}
                activeOpacity={0.7}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 10,
                  paddingHorizontal: 14,
                  backgroundColor:
                    selectedLang.code === lang.code ? "#FFF1F2" : "white",
                  borderBottomWidth: index < LANGUAGES.length - 1 ? 1 : 0,
                  borderBottomColor: "#F1F5F9",
                }}
              >
                <Text style={{ fontSize: 18, lineHeight: 22 }}>
                  {lang.flag}
                </Text>
                <Text
                  style={{
                    marginLeft: 8,
                    fontSize: 13,
                    fontWeight: selectedLang.code === lang.code ? "700" : "500",
                    color:
                      selectedLang.code === lang.code ? "#E11D48" : "#1F2937",
                  }}
                >
                  {lang.label}
                </Text>
                {selectedLang.code === lang.code && (
                  <Ionicons
                    name="checkmark"
                    size={14}
                    color="#E11D48"
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
});

export default EmergencyBar;
