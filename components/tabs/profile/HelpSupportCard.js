import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import Cartoon from "../../../assets/icons/cartoon.svg";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const HelpSupportCard = ({ onChatPress }) => (
  <StyledView className="bg-white rounded-[32px] px-3 py-4 shadow-sm border border-[#F1F5F9] mb-4 flex-1 items-center justify-between">
    <StyledView className="w-full flex-col justify-start mb-4">
      <StyledView className="w-10 h-10 bg-[#FCE7F3] rounded-xl items-center justify-center">
        <Ionicons name="headset" size={20} color="#BE185D" />
      </StyledView>
      <StyledText className="text-[#1F2937] text-base font-bold mt-4 w-full">
        Help & support
      </StyledText>
    </StyledView>

    <StyledView className="items-center">
      <StyledView className="w-24 h-24 bg-[#FFEDD5] rounded-full items-center justify-center mb-4 overflow-hidden">
        <Cartoon width={100} height={100} />
      </StyledView>
      <StyledTouchableOpacity
        onPress={onChatPress}
        className="bg-[#005A9E] rounded-full py-2 px-6"
      >
        <StyledText className="text-white font-bold text-sm">
          Chat Now
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  </StyledView>
);

export default HelpSupportCard;
