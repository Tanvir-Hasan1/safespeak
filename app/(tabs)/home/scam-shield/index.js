import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledImage = styled(Image);

const { width } = Dimensions.get("window");

export default function AnalyzeMessage() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    // Request permission if not already granted
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "We need access to your gallery to upload screenshots."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => ({
        id: Date.now() + Math.random(),
        uri: asset.uri,
      }));
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title="Analyze Message" showCancel={true} />

      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Instructions */}
        <StyledView className="mt-4 mb-6">
          <StyledText className="text-[#1F2937] text-base font-medium leading-6">
            Paste the suspicious message or upload a screenshot to check for
            safety risks.
          </StyledText>
        </StyledView>

        {/* Message Content Card */}
        <StyledView className="bg-white rounded-[24px] p-5 shadow-sm mb-6">
          <StyledText className="text-[#005B96] text-[10px] font-bold uppercase tracking-widest mb-3">
            MESSAGE CONTENT
          </StyledText>
          <StyledTextInput
            multiline
            placeholder="Paste SMS, Email, or Web link text here..."
            className="text-[#94A3B8] text-base font-medium leading-6"
            placeholderTextColor="#94A3B8"
            value={message}
            onChangeText={setMessage}
            textAlignVertical="top"
          />
        </StyledView>

        {/* Upload Action */}
        <StyledTouchableOpacity
          activeOpacity={0.8}
          className="bg-[#005B96] rounded-full py-3 flex-row items-center justify-center mb-6 shadow-md"
          onPress={pickImage}
        >
          <Ionicons name="camera-outline" size={20} color="white" />
          <StyledText className="text-white text-base font-bold ml-3">
            Upload Screenshot
          </StyledText>
        </StyledTouchableOpacity>

        {/* Image Grid/List */}
        <StyledView className="flex-row items-center space-x-4 mb-8">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 2 }}
          >
            <StyledView className="flex-row items-center">
              {images.map((img) => (
                <StyledView key={img.id} className="relative mr-4">
                  <StyledImage
                    source={{ uri: img.uri }}
                    className="w-20 h-20 rounded-2xl"
                    resizeMode="cover"
                  />
                  <StyledTouchableOpacity
                    onPress={() => removeImage(img.id)}
                    className="absolute -top-2 -right-2 bg-[#FB923C] w-6 h-6 rounded-full items-center justify-center border-2 border-white z-10"
                  >
                    <Ionicons name="close" size={14} color="white" />
                  </StyledTouchableOpacity>
                </StyledView>
              ))}

              {/* Placeholder Add Button */}
              <StyledTouchableOpacity
                onPress={pickImage}
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#CBD5E1] items-center justify-center bg-[#F8FAFC]"
              >
                <Ionicons name="images-outline" size={28} color="#94A3B8" />
              </StyledTouchableOpacity>
            </StyledView>
          </ScrollView>
        </StyledView>

        {/* Analyze Button */}
        <StyledTouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.push("/home/scam-shield/results")}
          className="bg-[#FF8A00] rounded-full py-4 items-center justify-center flex-row shadow-lg shadow-orange-300"
        >
          <Ionicons name="shield-outline" size={22} color="white" />
          <StyledText className="text-white text-lg font-bold uppercase tracking-widest ml-3">
            ANALYZE NOW
          </StyledText>
        </StyledTouchableOpacity>
      </StyledScrollView>
    </StyledView>
  );
}
