import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";

import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);

export default function AIBotChat() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height),
    );
    const hideSubscription = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const chatMessages = [
    {
      id: 1,
      type: "ai",
      text: "I'm helping you structure your report. Who was involved in this incident?",
    },
    {
      id: 2,
      type: "user",
      text: "It was a manager from the logistics department and two witnesses.",
    },
    {
      id: 3,
      type: "ai",
      text: "Thank you. Can you describe where exactly in the office this occurred?",
    },
  ];

  return (
    <StyledView
      className="flex-1 bg-[#F0F4FA]"
      style={{ paddingBottom: keyboardHeight }}
    >
      <CustomHeader title="AI Chatbot Assistant" />

      <StyledView className="flex-1">
        <StyledScrollView
          className="flex-1 px-4"
          contentContainerStyle={{ paddingVertical: 20, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {chatMessages.map((msg) => (
            <StyledView
              key={msg.id}
              className={`mb-4 max-w-[80%] ${
                msg.type === "user" ? "self-end" : "self-start"
              }`}
            >
              <StyledView
                className={`p-4 rounded-[24px] ${
                  msg.type === "user"
                    ? "bg-white border border-[#E2E8F0]"
                    : "bg-white/60 border border-white"
                }`}
                style={
                  msg.type === "user"
                    ? { borderBottomRightRadius: 4 }
                    : { borderTopLeftRadius: 4 }
                }
              >
                <StyledText className="text-[#002B49] text-base leading-6">
                  {msg.text}
                </StyledText>
              </StyledView>
            </StyledView>
          ))}

          {/* Live Timeline Builder Card */}
          <StyledView className="mt-6 bg-[#F8FAFC]/80 border border-white rounded-[40px] p-6 shadow-sm">
            <StyledView className="flex-row items-center justify-between mb-6">
              <StyledView className="flex-row items-center">
                <Ionicons
                  name="git-network-outline"
                  size={20}
                  color="#3B82F6"
                />
                <StyledText className="ml-3 text-[#64748B] text-xs font-bold uppercase tracking-widest">
                  Live Timeline Builder
                </StyledText>
              </StyledView>
              <StyledView className="bg-[#DBEAFE] px-3 py-1 rounded-full">
                <StyledText className="text-[#3B82F6] text-[10px] font-bold uppercase">
                  Updating
                </StyledText>
              </StyledView>
            </StyledView>

            {/* Timeline Steps */}
            <StyledView className="space-y-4">
              {/* WHO */}
              <StyledView className="bg-white/80 p-4 rounded-[24px] flex-row items-center justify-between border border-white shadow-sm">
                <StyledView>
                  <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase mb-1">
                    Who
                  </StyledText>
                  <StyledText className="text-[#002B49] text-base font-bold">
                    Manager & 2 Witnesses
                  </StyledText>
                </StyledView>
                <StyledView className="bg-[#EFF6FF] rounded-full p-1">
                  <Ionicons name="checkmark-circle" size={24} color="#3B82F6" />
                </StyledView>
              </StyledView>

              {/* WHAT */}
              <StyledView className="bg-white border border-[#3B82F6]/30 p-4 rounded-[24px] flex-row items-center justify-between shadow-sm mt-3">
                <StyledView>
                  <StyledText className="text-[#3B82F6] text-[10px] font-bold uppercase mb-1">
                    What
                  </StyledText>
                  <StyledText className="text-[#94A3B8] text-base font-medium">
                    Waiting for details...
                  </StyledText>
                </StyledView>
                <StyledView className="w-2 h-2 bg-[#3B82F6] rounded-full mr-2" />
              </StyledView>

              {/* WHERE */}
              <StyledView className="bg-white/40 p-4 rounded-[24px] mt-3">
                <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase mb-1">
                  Where
                </StyledText>
                <StyledText className="text-[#94A3B8] text-base font-medium italic">
                  Processing from transcript...
                </StyledText>
              </StyledView>
            </StyledView>

            {/* Report Button */}
            <StyledTouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/home/report-submission")}
              className="self-end px-2"
            >
              <StyledText className="text-[#FF8A00] text-sm font-bold uppercase tracking-widest">
                Report >>
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledScrollView>

        {/* Bottom Input Section */}
        <StyledView className="p-4 bg-transparent">
          <StyledView className="bg-white rounded-full flex-row items-center px-4 py-3 shadow-md border border-[#E2E8F0]">
            <StyledTextInput
              placeholder="Type your response..."
              value={message}
              onChangeText={setMessage}
              className="flex-1 text-[#1F2937] text-base px-2"
              placeholderTextColor="#94A3B8"
            />
            <StyledTouchableOpacity className="p-2 mr-2 bg-[#F1F5F9] rounded-full">
              <Ionicons name="mic-outline" size={22} color="#94A3B8" />
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
      </StyledView>
    </StyledView>
  );
}
