import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLanguage } from "../../../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const LANGUAGES = [
  { code: "EN", key: "en", label: "English" },
  { code: "ES", key: "es", label: "Español" },
];

const EmergencyBar = React.memo(() => {
  const { language, setLanguage, t } = useLanguage();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState({ top: 0, right: 0 });
  const langButtonRef = React.useRef(null);

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

  return (
    <>
      <StyledTouchableOpacity
        className="w-full px-4 pt-2 pb-2"
        activeOpacity={1}
      >
        <LinearGradient
          colors={["#F43F5E", "#E11D48"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-full flex-row items-center justify-between px-4 py-2"
          style={{ borderRadius: 999 }}
        >
          <StyledView className="flex-row items-center space-x-2">
            <Ionicons name="sunny" size={16} color="white" />
            <StyledText className="text-white font-semibold text-xs">
              {t("emergencyCall")}
            </StyledText>
          </StyledView>

          <TouchableOpacity
            ref={langButtonRef}
            onPress={openDropdown}
            activeOpacity={0.7}
          >
            <StyledView className="bg-white/20 px-2 py-0.5 rounded-full flex-row items-center">
              <Ionicons name="globe-outline" size={12} color="white" />
              <StyledText className="text-white text-[10px] font-bold ml-1">
                {selectedLang.code}
              </StyledText>
              <Ionicons
                name={dropdownVisible ? "chevron-up" : "chevron-down"}
                size={12}
                color="white"
              />
            </StyledView>
          </TouchableOpacity>
        </LinearGradient>
      </StyledTouchableOpacity>

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
                <Ionicons
                  name="globe-outline"
                  size={14}
                  color={
                    selectedLang.code === lang.code ? "#E11D48" : "#64748B"
                  }
                />
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
