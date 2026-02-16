import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import GoogleLogo from "../assets/icons/Google.svg";
import MailLogo from "../assets/icons/Mail.svg";

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

const SocialSignIns = () => {
  const router = useRouter();
  return (
    <StyledView className="w-full space-y-3">
      {/* Apple */}
      {/* Apple */}
      <StyledTouchableOpacity className="w-full">
        <LinearGradient
          colors={["#515b75ff", "#041633ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            paddingVertical: 16,
            borderRadius: 999,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="logo-apple" size={24} color="white" />
          <StyledText className="text-white font-semibold text-lg ml-2">
            Sign In with Apple
          </StyledText>
        </LinearGradient>
      </StyledTouchableOpacity>

      {/* Google */}
      <StyledTouchableOpacity className="w-full bg-white py-4 rounded-full flex-row items-center justify-center border border-gray-300">
        <GoogleLogo width={24} height={24} />
        <StyledText className="text-black font-semibold text-lg ml-2">
          Sign In with Google
        </StyledText>
      </StyledTouchableOpacity>

      {/* Email */}
      <StyledTouchableOpacity
        className="w-full bg-white py-4 rounded-full flex-row items-center justify-center border border-gray-300"
        onPress={() => router.push("/auth/sign-in")}
      >
        <MailLogo width={24} height={24} />
        <StyledText className="text-gray-600 font-semibold text-lg ml-2">
          Sign In with Email
        </StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default SocialSignIns;
