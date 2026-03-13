import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);

const SplashScreen = () => {
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barWidth, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();
  }, []);

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

        {/* Animated loading bar */}
        <StyledView className="w-48 h-[3px] bg-white/20 rounded-full mt-6 overflow-hidden">
          <Animated.View
            style={{
              height: "100%",
              backgroundColor: "white",
              borderRadius: 999,
              width: barWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ["0%", "100%"],
              }),
            }}
          />
        </StyledView>
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
