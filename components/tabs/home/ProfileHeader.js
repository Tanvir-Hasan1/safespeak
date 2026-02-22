import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useLanguage } from "../../../context/LanguageContext";
import { useRouter } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ProfileHeader = React.memo(({ name = "Alex Rivera" }) => {
  const { t } = useLanguage();
  const router = useRouter();
  return (
    <StyledView className="flex-row items-center justify-between px-6 py-4 bg-white mx-4 rounded-3xl shadow-sm border border-gray-100">
      <StyledView>
        <StyledText className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
          {t("welcomeBack")}
        </StyledText>
        <StyledText className="text-[#002B49] text-xl font-bold">
          {name}
        </StyledText>
      </StyledView>

      <StyledTouchableOpacity
        className="relative"
        activeOpacity={0.7}
        onPress={() => router.push("/home/notifications")}
      >
        <StyledView className="p-2">
          <Ionicons name="notifications" size={28} color="black" />
        </StyledView>
        <StyledView className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
      </StyledTouchableOpacity>
    </StyledView>
  );
});

export default ProfileHeader;
