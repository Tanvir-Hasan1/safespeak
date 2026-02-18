import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Dimensions,
} from "react-native";

import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";
import Sphere from "../../../../assets/images/home/Sphere.svg";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);

const { width } = Dimensions.get("window");
const SPHERE_SIZE = Math.min(width * 0.5, 320);

export default function IncidentBuilder() {
  const router = useRouter();
  const [response, setResponse] = useState("");
  const [metadataEnabled, setMetadataEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title={isRecording ? "" : "Timeline Builder"}
        onRightPress={() => {}}
        rightIcon={isRecording ? "document-text-outline" : undefined}
      />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 40 }}
      >
        {/* Hero Section - Sphere */}
        <StyledView
          className={`${isRecording ? "mt-4" : "mt-8"} items-center justify-center`}
        >
          <Sphere width={SPHERE_SIZE} height={SPHERE_SIZE} />
        </StyledView>

        {isRecording ? (
          <StyledView className="w-full items-center">
            {/* Listening Section */}
            <StyledView className="mt-10 items-center">
              <StyledText className="text-[#002B49] text-2xl font-light text-center leading-9">
                I'm listening,{" "}
                <StyledText className="font-bold">Raihan</StyledText>... take
                your time.
              </StyledText>
            </StyledView>

            {/* Transcript Box */}
            <StyledView className="w-full mt-10 bg-white/60 border border-white rounded-[32px] p-6 shadow-sm">
              <StyledText className="text-[#002B49] text-xs font-bold uppercase tracking-widest mb-4">
                Real-time Transcript
              </StyledText>
              <StyledText className="text-[#64748B] text-base italic leading-6">
                "It happened yesterday evening near the..."
              </StyledText>
            </StyledView>

            {/* Stop Recording Button */}
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsRecording(false)}
              className="w-full mt-12 bg-[#EF4444] rounded-[32px] py-6 flex-row items-center justify-center shadow-lg"
            >
              <StyledView className="w-6 h-6 bg-white rounded-md items-center justify-center mr-3">
                <Ionicons name="stop" size={14} color="#EF4444" />
              </StyledView>
              <StyledText className="text-white text-lg font-bold">
                Stop Recording
              </StyledText>
            </StyledTouchableOpacity>

            {/* Bottom Input Area (Matching screenshot) */}
            <StyledView className="w-full mt-10 bg-white rounded-full flex-row items-center px-4 py-3 shadow-md border border-[#E2E8F0]">
              <StyledTextInput
                placeholder="Type your response..."
                value={response}
                onChangeText={setResponse}
                className="flex-1 text-[#1F2937] text-base px-2"
                placeholderTextColor="#94A3B8"
              />
              <StyledTouchableOpacity className="p-2 mr-2 bg-[#F1F5F9] rounded-full">
                <Ionicons name="mic" size={22} color="#EF4444" />
              </StyledTouchableOpacity>
              <StyledTouchableOpacity className="bg-[#FB923C] w-10 h-10 rounded-full items-center justify-center shadow-sm">
                <Ionicons
                  name="send"
                  size={18}
                  color="white"
                  className="ml-0.5"
                />
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        ) : (
          <StyledView className="w-full items-center">
            {/* Greeting Section */}
            <StyledView className="mt-10 items-center">
              <StyledText className="text-[#002B49] text-2xl font-light text-center leading-9">
                Hi <StyledText className="font-bold">Raihan</StyledText>, can
                you remind{"\n"}me, how can I help you{"\n"}today?
              </StyledText>
            </StyledView>

            {/* Input Section - Linked to Chat */}
            <StyledTouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push("/home/incident-builder/chat")}
              className="w-full mt-12 bg-white rounded-full flex-row items-center px-4 py-3 shadow-md border border-[#E2E8F0]"
            >
              <StyledTextInput
                placeholder="Type your response..."
                value={response}
                editable={false}
                className="flex-1 text-[#1F2937] text-base px-2"
                placeholderTextColor="#94A3B8"
              />
              <StyledView className="p-2 mr-2 bg-[#F1F5F9] rounded-full">
                <Ionicons name="mic-outline" size={22} color="#94A3B8" />
              </StyledView>
              <StyledView className="bg-[#FB923C] w-10 h-10 rounded-full items-center justify-center shadow-sm">
                <Ionicons
                  name="send"
                  size={18}
                  color="white"
                  className="ml-0.5"
                />
              </StyledView>
            </StyledTouchableOpacity>

            {/* Metadata Capture Card */}
            <StyledView className="w-full mt-6 bg-white rounded-[32px] flex-row items-center p-5 shadow-sm border border-[#E2E8F0]">
              <StyledView className="w-12 h-12 bg-[#EFF6FF] rounded-2xl items-center justify-center">
                <Ionicons name="location-outline" size={24} color="#3B82F6" />
              </StyledView>
              <StyledView className="flex-1 ml-4">
                <StyledText className="text-[#002B49] text-base font-bold">
                  Metadata Capture
                </StyledText>
                <StyledText className="text-[#94A3B8] text-xs font-medium">
                  GPS & Device Intelligence
                </StyledText>
              </StyledView>
              <Switch
                trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                thumbColor={"#FFFFFF"}
                ios_backgroundColor="#E2E8F0"
                onValueChange={setMetadataEnabled}
                value={metadataEnabled}
              />
            </StyledView>

            {/* Recording Button */}
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => setIsRecording(true)}
              className="w-full mt-12 bg-[#FB923C] rounded-[32px] py-6 items-center shadow-lg"
            >
              <StyledText className="text-white text-lg font-bold">
                Tap to start recording
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        )}
      </StyledScrollView>
    </StyledView>
  );
}
