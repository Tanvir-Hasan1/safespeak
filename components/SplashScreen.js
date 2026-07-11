import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);

const SplashScreen = () => {
  const barWidth = useRef(new Animated.Value(0)).current;

  // Animation values for the three loading dots
  const dot1Scale = useRef(new Animated.Value(1)).current;
  const dot2Scale = useRef(new Animated.Value(1)).current;
  const dot3Scale = useRef(new Animated.Value(1)).current;

  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // 1. Loading bar animation
    Animated.timing(barWidth, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    // 2. Chasing / pulsating dots wave animation
    const createDotAnimation = (scaleVal, opacityVal) => {
      return Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleVal, {
            toValue: 1.4,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityVal, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleVal, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacityVal, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]);
    };

    Animated.loop(
      Animated.stagger(150, [
        createDotAnimation(dot1Scale, dot1Opacity),
        createDotAnimation(dot2Scale, dot2Opacity),
        createDotAnimation(dot3Scale, dot3Opacity),
      ])
    ).start();
  }, [barWidth, dot1Opacity, dot1Scale, dot2Opacity, dot2Scale, dot3Opacity, dot3Scale]);

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
        <StyledText className="text-white/80 text-sm mb-3">
          Preparing secure environment...
        </StyledText>
        
        {/* Pulsating Chasing Dots */}
        <StyledView className="flex-row items-center gap-x-2.5">
          <Animated.View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "white",
              opacity: dot1Opacity,
              transform: [{ scale: dot1Scale }],
            }}
          />
          <Animated.View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "white",
              opacity: dot2Opacity,
              transform: [{ scale: dot2Scale }],
            }}
          />
          <Animated.View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "white",
              opacity: dot3Opacity,
              transform: [{ scale: dot3Scale }],
            }}
          />
        </StyledView>
      </StyledView>
    </StyledView>
  );
};

export default SplashScreen;
