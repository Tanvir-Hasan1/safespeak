import React from "react";
import { View, Text, TouchableOpacity, ImageBackground } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const IntelligenceMap = React.memo(() => {
  return (
    <StyledView className="px-6 mb-20">
      <StyledText className="text-[#1F2937] text-2xl font-bold mb-4">
        Local Intelligence
      </StyledText>

      <StyledView className="h-60 rounded-[40px] overflow-hidden shadow-sm relative">
        <ImageBackground
          source={require("../../../assets/map-bg.png")}
          className="flex-1"
          resizeMode="cover"
        >
          <StyledView className="absolute inset-0 bg-white/5" />

          {/* Map Marker Placeholder */}
          <StyledView className="absolute top-1/2 left-1/2 mt-[-20px] ml-[-20px]">
            <StyledView className="bg-orange-500/20 p-5 rounded-full">
              <StyledView className="bg-white/40 p-1.5 rounded-full">
                <StyledView className="bg-orange-500 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm" />
              </StyledView>
            </StyledView>
          </StyledView>

          {/* Floating Info Card */}
          <StyledView className="absolute bottom-4 left-3 right-3 bg-[#F3F4F6]/95 p-3.5 rounded-[24px] flex-row items-center justify-between border border-white/50 shadow-sm">
            <StyledView className="flex-1">
              <StyledText className="text-orange-500 text-[9px] font-bold uppercase tracking-wider">
                Current Location
              </StyledText>
              <StyledText
                className="text-[#002B49] text-[14px] font-bold mt-0.5"
                numberOfLines={1}
              >
                3 Active Zones Nearby
              </StyledText>
            </StyledView>

            <StyledTouchableOpacity className="bg-[#FF8A00] px-5 py-2.5 rounded-full ml-2">
              <StyledText className="text-white font-bold text-[12px]">
                Details
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </ImageBackground>
      </StyledView>
    </StyledView>
  );
});

export default IntelligenceMap;
