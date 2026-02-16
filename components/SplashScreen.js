import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);

const SplashScreen = () => {
  return (
    <StyledView className="flex-1 bg-[#004e80] items-center justify-center relative">
      <StyledView className="items-center mb-10">
        <StyledView className="flex-row items-center">
          <StyledText className="text-white text-6xl font-serif tracking-widest">
            Safe
          </StyledText>
          <Ionicons
            name="checkmark-sharp"
            size={50}
            color="#4ade80"
            style={{ marginLeft: -5, marginTop: 5 }}
          />
        </StyledView>
        <StyledText className="text-white text-6xl font-serif tracking-widest mt-[-10px]">
          Speak
        </StyledText>
      </StyledView>

      <StyledView className="absolute bottom-10 items-center">
        <StyledText className="text-white/80 text-sm mb-2">
          Preparing secure environment...
        </StyledText>
        <StyledView className="flex-row space-x-1">
          <StyledView className="w-2 h-2 bg-white/50 rounded-full" />
          <StyledView className="w-2 h-2 bg-white/80 rounded-full" />
          <StyledView className="w-2 h-2 bg-white rounded-full" />
        </StyledView>
      </StyledView>
    </StyledView>
  );
};

export default SplashScreen;
