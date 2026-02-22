import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../components/CustomHeader";
import HelpAndSupport from "../../../assets/icons/help-and-support.svg";
import { useLanguage } from "../../../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

export default function HelpSupportScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <StyledView className="flex-1 bg-[#F8FAFC]">
      <CustomHeader title={t("helpSupportHeader")} />

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 60 }}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Illustration Section */}
        <StyledView className="items-center justify-center pt-6">
          <HelpAndSupport width={200} height={200} />
        </StyledView>

        <StyledText className="text-[#002B49] text-xl font-medium text-center mb-8 opacity-60">
          {t("helpSupportGreeting")}
        </StyledText>

        {/* Title Input */}
        <StyledView className="mb-6">
          <StyledText className="text-[#1F2937] text-xl font-bold mb-3">
            {t("helpTitle")}
          </StyledText>
          <StyledTextInput
            className="w-full bg-[#fdf2ff] border border-[#f3e8ff] rounded-xl px-5 py-4 text-[#1F2937] text-base"
            placeholder={t("helpTitlePlaceholder")}
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
          />
        </StyledView>

        {/* Description Input */}
        <StyledView className="mb-10">
          <StyledText className="text-[#1F2937] text-xl font-bold mb-3">
            {t("helpDescription")}
          </StyledText>
          <StyledTextInput
            className="w-full bg-[#fdf2ff] border border-[#f3e8ff] rounded-3xl px-5 py-4 text-[#1F2937] text-base min-h-[160px]"
            placeholder={t("helpDescriptionPlaceholder")}
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            value={description}
            onChangeText={setDescription}
          />
        </StyledView>

        {/* Send Button */}
        <StyledTouchableOpacity
          activeOpacity={0.8}
          className="w-full bg-[#FB923C] rounded-full py-5 items-center shadow-lg"
          onPress={() => {
            // Handle send
            console.log("Support request sent:", { title, description });
          }}
        >
          <StyledText className="text-white text-lg font-bold">
            {t("send")}
          </StyledText>
        </StyledTouchableOpacity>
      </KeyboardAwareScrollView>
    </StyledView>
  );
}
