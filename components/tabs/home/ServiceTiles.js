import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

const ServiceTiles = React.memo(() => {
  const router = useRouter();

  return (
    <StyledView className="px-6 flex-row mb-10 h-72">
      {/* Left Column */}
      <StyledView className="flex-1 mr-2 flex-col">
        {/* Scam Shield */}
        <StyledTouchableOpacity
          className="flex-1 bg-[#005B96] p-4 rounded-[40px] items-start justify-between mb-4"
          activeOpacity={0.7}
          onPress={() => router.push("/home/scam-shield")}
        >
          <StyledView>
            <StyledText className="text-white/60 text-[10px] font-bold uppercase tracking-widest">
              Cyber
            </StyledText>
            <StyledText className="text-white text-lg font-bold mt-1">
              SCAM{"\n"}SHIELD
            </StyledText>
          </StyledView>
          <Ionicons name="shield-checkmark" size={32} color="white" />
        </StyledTouchableOpacity>

        {/* Legal Resources */}
        <StyledTouchableOpacity
          className="flex-1 bg-[#FBBF24] p-4 rounded-[40px] items-start justify-between"
          activeOpacity={0.7}
          onPress={() => router.push("/home/resources")}
        >
          <StyledView>
            <StyledText className="text-black/60 text-[10px] font-bold uppercase tracking-widest">
              Legal
            </StyledText>
            <StyledText className="text-black text-lg font-bold mt-1">
              RESOURCES
            </StyledText>
          </StyledView>
          <Ionicons name="folder-open" size={32} color="black" />
        </StyledTouchableOpacity>
      </StyledView>

      {/* Right Column */}
      <StyledView className="flex-1 ml-2">
        {/* Micro-Cards */}
        <StyledTouchableOpacity
          className="h-full bg-[#F97316] p-4 rounded-[40px] justify-center"
          activeOpacity={0.7}
          onPress={() => router.push("/home/micro-cards")}
        >
          <StyledView className="mb-4">
            <StyledText className="text-white text-2xl font-extrabold leading-tight">
              Micro-{"\n"}Cards
            </StyledText>
          </StyledView>

          <StyledView className="bg-white/20 p-4 rounded-[25px] border border-white/10">
            <StyledText className="text-white text-[9px] font-bold">
              4 Lessons • 12 mins
            </StyledText>
          </StyledView>
        </StyledTouchableOpacity>
      </StyledView>
    </StyledView>
  );
});

export default ServiceTiles;
