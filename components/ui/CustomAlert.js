import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function CustomAlert({
  visible,
  title = "Unsupported File Format",
  message = "Please choose only PDF documents and images (PNG, JPG, JPEG, WebP, etc.).",
  onClose,
  buttonText = "Okay",
}) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <StyledView className="flex-1 bg-black/40 items-center justify-center px-6">
        <StyledView className="bg-white rounded-[24px] p-6 w-full max-w-[320px] items-center shadow-lg border border-[#E2E8F0]">
          <StyledView className="w-12 h-12 bg-[#FEF3C7] rounded-full items-center justify-center mb-4">
            <Ionicons name="warning" size={26} color="#D97706" />
          </StyledView>
          
          <StyledText className="text-[#1E293B] text-base font-bold mb-2 text-center">
            {title}
          </StyledText>
          
          <StyledText className="text-[#64748B] text-xs text-center leading-[18px] mb-5 px-3">
            {message}
          </StyledText>

          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            className="bg-[#005B96] w-full rounded-full py-3.5 items-center justify-center shadow-sm"
          >
            <StyledText className="text-white text-sm font-bold">
              {buttonText}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledView>
    </Modal>
  );
}
