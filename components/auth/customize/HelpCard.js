import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);

const HelpCard = () => {
  return (
    <StyledView
      className="bg-[#E6F0FF] p-3 rounded-3xl mb-8 flex-row items-center"
      style={{
        borderColor: "#99b9ceff",
        borderWidth: 2,
        borderStyle: "dashed",
      }}
    >
      <StyledView className="bg-[#002B49] p-3 rounded-full mr-4">
        <Ionicons name="book" size={24} color="white" />
      </StyledView>
      <StyledView className="flex-1">
        <StyledText className="text-[#002B49] font-bold text-lg">
          How SafeSpeak helps
        </StyledText>
        <StyledText className="text-gray-600 text-sm">
          Take a 30s tour of our secure reporting tools.
        </StyledText>
      </StyledView>
      <Ionicons name="chevron-forward" size={24} color="#005b96" />
    </StyledView>
  );
};

export default HelpCard;
