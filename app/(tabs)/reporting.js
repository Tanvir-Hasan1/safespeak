import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

export default function Reporting() {
  return (
    <StyledView className="flex-1 items-center justify-center bg-white">
      <StyledText className="text-2xl font-bold">Reporting Screen</StyledText>
    </StyledView>
  );
}
