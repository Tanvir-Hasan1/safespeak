import React, { Component, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { styled } from "nativewind";
import Constants from "expo-constants";
import Logo from "../assets/logos/safespeak-logo.svg";
import SocialSignIns from "./SocialSignIns";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import { useNavigation } from "expo-router";
import { useLanguage } from "../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const videoSource = require("../assets/videos/Australia_Map_Cinematic_Loop_Animation.mp4");

// Error boundary to catch native VideoPlayer constructor failures on recycled activities
class VideoErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("VideoPlayer failed to initialize, falling back to static background:", error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

// Inner component using the official hook for playing local video assets
const VideoBackground = ({ navigation }) => {
  const player = useVideoPlayer(videoSource, (playerInstance) => {
    playerInstance.loop = true;
    playerInstance.muted = true;
    playerInstance.play();
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
    <VideoView
      style={StyleSheet.absoluteFill}
      player={player}
      resizeMode="cover"
      nativeControls={false}
    />
  );
};

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const { t } = useLanguage();

  return (
    <View style={styles.container}>
      <VideoErrorBoundary>
        <VideoBackground navigation={navigation} />
      </VideoErrorBoundary>

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
            {t("welcomeTagline")}
          </StyledText>
        </StyledView>

        {/* Bottom Section: Content */}
        <StyledView className="w-full items-center space-y-6">
          {/* Hero Text */}
          <StyledText className="text-white text-3xl font-bold text-center leading-tight mb-2">
            {t("welcomeHero")}
          </StyledText>

          {/* Disclaimer */}
          <StyledText className="text-white/80 text-center text-sm px-4 mb-4">
            {t("welcomeDisclaimer")}
          </StyledText>

          {/* Buttons */}
          <SocialSignIns />

          {/* Footer Links */}
          <StyledText className="text-white/60 text-xs mt-4">
            {t("welcomeTerms")}{" "}
            <Text className="underline">{t("welcomeTermsLink")}</Text>{" "}
            {t("welcomeAnd")}{" "}
            <Text className="underline">{t("welcomePrivacyLink")}</Text>.
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
