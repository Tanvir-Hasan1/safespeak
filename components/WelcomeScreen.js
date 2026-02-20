import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { styled } from "nativewind";
import Constants from "expo-constants";
import Logo from "../assets/logos/safespeak-logo.svg";
import SocialSignIns from "./SocialSignIns";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import { useNavigation } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const videoSource = require("../assets/videos/Australia_Map_Cinematic_Loop_Animation.mp4");

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.muted = false; // User changed this to false
    player.play();
  });

  useEffect(() => {
    const focusListener = navigation.addListener("focus", () => {
      player.play();
    });

    const blurListener = navigation.addListener("blur", () => {
      player.pause();
    });

    return () => {
      focusListener();
      blurListener();
    };
  }, [navigation, player]);

  return (
    <View style={styles.container}>
      <VideoView
        style={StyleSheet.absoluteFill}
        player={player}
        resizeMode="cover"
        nativeControls={false}
      />

      {/* Overlay for readability */}
      <StyledView className="absolute inset-0 bg-black/40" />

      {/* White Gradient from Top to Middle */}
      <LinearGradient
        colors={["rgba(255,255,255,0.9)", "transparent"]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
        }}
      />

      {/* Main Container */}
      <StyledView className="flex-1 justify-between items-center px-6 py-12">
        {/* Top Section: Logo */}
        <StyledView className="flex-col items-center mt-10">
          <StyledView className="flex-row items-center mb-2">
            <Logo width={40} height={40} />
            <StyledText className="text-[#005b96] text-3xl font-bold ml-3">
              SafeSpeak
            </StyledText>
          </StyledView>
          <StyledText className="text-black/80 font-bold mb-2">
            SafeSpeak: Real Stories, Real Support
          </StyledText>
        </StyledView>

        {/* Bottom Section: Content */}
        <StyledView className="w-full items-center space-y-6">
          {/* Hero Text */}
          <StyledText className="text-white text-3xl font-bold text-center leading-tight mb-2">
            A safe, multilingual space to understand, report, and get support
          </StyledText>

          {/* Disclaimer */}
          <StyledText className="text-white/80 text-center text-sm px-4 mb-4">
            We don't track you. We don't sell data. You control what you share
          </StyledText>

          {/* Buttons */}
          <SocialSignIns />

          {/* Footer Links */}
          <StyledText className="text-white/60 text-xs mt-4">
            By signing up, you agree to our{" "}
            <Text className="underline">Terms</Text> and{" "}
            <Text className="underline">Privacy Policy</Text>.
          </StyledText>
        </StyledView>
      </StyledView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WelcomeScreen;
