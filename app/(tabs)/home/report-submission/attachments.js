import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledImage = styled(Image);

export default function Attachments() {
  const router = useRouter();

  const files = [
    { id: 1, type: "image", uri: "https://picsum.photos/200/200?random=1" },
    { id: 2, type: "video", uri: "https://picsum.photos/200/200?random=2" },
    { id: 3, type: "doc", name: "evidence_doc.pdf", size: "2.4 MB" },
    { id: 4, type: "audio", name: "audio_record_01.mp3", progress: 0.5 },
  ];

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title="Attachments" showCancel={true} />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <StyledView className="mt-6 mb-8">
          <StyledText className="text-[#64748B] text-sm font-bold uppercase tracking-widest mb-3">
            Incident Description
          </StyledText>
          <StyledView className="bg-white rounded-[32px] p-5 shadow-sm border border-[#E2E8F0] relative">
            <StyledTextInput
              multiline
              placeholder="Describe the incident details..."
              placeholderTextColor="#94A3B8"
              className="text-[#1F2937] text-sm leading-6 min-h-[120px]"
              textAlignVertical="top"
            />
            <StyledTouchableOpacity className="absolute bottom-4 right-4 bg-[#F1F5F9] px-4 py-2 rounded-full flex-row items-center">
              <Ionicons name="mic-outline" size={18} color="#94A3B8" />
              <StyledText className="text-[#94A3B8] text-[10px] font-bold uppercase ml-2">
                Dictate
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        <StyledView className="flex-row items-center justify-between mb-6">
          <StyledText className="text-[#1F2937] text-xl font-bold">
            Attached Files
          </StyledText>
          <StyledView className="bg-[#FFEDD5] px-3 py-1 rounded-full">
            <StyledText className="text-[#FB923C] text-xs font-bold">
              3 Ready
            </StyledText>
          </StyledView>
        </StyledView>

        {/* Files Grid */}
        <StyledView className="flex-row flex-wrap -mx-2">
          {files.map((file) => (
            <StyledView key={file.id} className="w-1/2 p-2">
              <StyledView className="bg-white rounded-[32px] overflow-hidden border border-[#E2E8F0] shadow-sm aspect-square relative">
                {file.type === "image" || file.type === "video" ? (
                  <>
                    <StyledImage
                      source={{ uri: file.uri }}
                      className="w-full h-full"
                    />
                    {file.type === "video" && (
                      <StyledView className="absolute inset-0 items-center justify-center bg-black/10">
                        <StyledView className="w-10 h-10 bg-white/40 rounded-full items-center justify-center border border-white">
                          <Ionicons name="play" size={20} color="white" />
                        </StyledView>
                      </StyledView>
                    )}
                    {file.type === "image" ? (
                       <StyledView className="absolute bottom-3 left-3 bg-black/20 p-1.5 rounded-lg">
                          <Ionicons name="image-outline" size={14} color="white" />
                       </StyledView>
                    ) : (
                        <StyledView className="absolute bottom-3 right-3 bg-black/40 px-2 py-1 rounded-lg">
                          <StyledText className="text-white text-[10px] font-bold">0:45</StyledText>
                        </StyledView>
                    )}
                  </>
                ) : file.type === "doc" ? (
                  <StyledView className="flex-1 p-6 justify-center items-center">
                    <StyledView className="w-12 h-12 bg-[#FFF7ED] rounded-2xl items-center justify-center mb-4">
                      <Ionicons name="document-text" size={24} color="#FB923C" />
                    </StyledView>
                    <StyledText className="text-[#1F2937] text-sm font-bold text-center mb-1">
                      {file.name}
                    </StyledText>
                    <StyledText className="text-[#94A3B8] text-xs">
                      {file.size}
                    </StyledText>
                  </StyledView>
                ) : (
                  <StyledView className="flex-1 p-6 justify-center">
                    <StyledView className="flex-row items-center mb-4">
                       <StyledView className="w-10 h-10 bg-[#F1F5F9] rounded-xl items-center justify-center">
                          <Ionicons name="cloud-upload-outline" size={20} color="#FB923C" />
                       </StyledView>
                    </StyledView>
                    <StyledText className="text-[#1F2937] text-[11px] font-bold mb-3">
                      {file.name}
                    </StyledText>
                    <StyledView className="w-full h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <StyledView
                        className="h-full bg-[#FB923C]"
                        style={{ width: `${file.progress * 100}%` }}
                      />
                    </StyledView>
                    <StyledText className="text-[#FB923C] text-[10px] font-bold mt-2 self-end">
                      {file.progress * 100}%
                    </StyledText>
                  </StyledView>
                )}
                
                {/* Delete button */}
                <StyledTouchableOpacity className="absolute top-3 right-3 bg-black/10 w-7 h-7 rounded-full items-center justify-center border border-white/40">
                  <Ionicons name="close" size={16} color="white" />
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          ))}
        </StyledView>

        {/* Bottom Actions moved inside ScrollView */}
        <StyledView className="mt-10">
          <StyledView className="bg-white rounded-full flex-row items-center px-5 py-3 shadow-lg border border-[#E2E8F0] mb-4">
            <StyledTextInput
              placeholder="Type your response..."
              className="flex-1 text-[#1F2937] text-sm"
              placeholderTextColor="#94A3B8"
            />
            <StyledTouchableOpacity className="p-2 mx-1">
              <Ionicons name="mic-outline" size={22} color="#94A3B8" />
            </StyledTouchableOpacity>
            <StyledTouchableOpacity className="bg-[#FB923C] w-10 h-10 rounded-full items-center justify-center">
              <Ionicons name="send" size={18} color="white" />
            </StyledTouchableOpacity>
          </StyledView>

          <StyledTouchableOpacity 
            activeOpacity={0.8}
            onPress={() => router.push("/home/report-submission/evidence-review")}
            className="bg-[#FB923C] rounded-[32px] py-4 items-center justify-center shadow-lg"
          >
            <StyledText className="text-white text-base font-bold">
              Continue
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
