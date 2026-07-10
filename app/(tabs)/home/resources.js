import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, Linking, Alert, ActivityIndicator, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLanguage } from "../../../context/LanguageContext";
import CustomHeader from "../../../components/CustomHeader";
import api from "../../../context/api";
import { useEducationStore } from "../../../store/useEducationStore";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function Resources() {
  const router = useRouter();
  const { t } = useLanguage();
  const [headerVisible, setHeaderVisible] = useState(true);
  const [resources, setResources] = useState([]);
  const [contentResources, setContentResources] = useState([]);
  const [educationItems, setEducationItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const setItems = useEducationStore((state) => state.setItems);
  const setSelectedGuideId = useEducationStore((state) => state.setSelectedGuideId);

  useEffect(() => {
    setLoading(true);

    const fetchResources = api.get("/resources")
      .then((res) => {
        const json = res.data;
        if (json.success && json.data && Array.isArray(json.data.resources)) {
          setResources(json.data.resources);
        }
      })
      .catch((error) => {
        // Logging is handled globally in the API interceptors
      });

    const fetchEducation = api.get("/microeducation")
      .then((res) => {
        const json = res.data;
        if (json.success && json.data && Array.isArray(json.data.items)) {
          setEducationItems(json.data.items);
          setItems(json.data.items);
        }
      })
      .catch((error) => {
        // Logging is handled globally in the API interceptors
      });

    const fetchContent = api.get("/content-resources")
      .then((res) => {
        const json = res.data;
        if (json.success && json.data && Array.isArray(json.data.resources)) {
          setContentResources(json.data.resources);
        }
      })
      .catch((error) => {
        // Logging is handled globally in the API interceptors
      });

    Promise.allSettled([fetchResources, fetchEducation, fetchContent])
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    if (currentOffsetY <= 10) {
      setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      setHeaderVisible(false);
    }
  };

  const handleDownload = (fileName, downloadPath) => {
    if (downloadPath) {
      const fullUrl = `${api.defaults.baseURL}${downloadPath}`;
      Alert.alert(
        "Download Resource",
        `Do you want to download and open "${fileName}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Download",
            onPress: async () => {
              try {
                if (Platform.OS === "android") {
                  const safeFileName = fileName.replace(/[^a-zA-Z0-9]/g, "_") + ".pdf";
                  const localUri = `${FileSystem.documentDirectory}${safeFileName}`;

                  Alert.alert("Downloading", "Please wait while the PDF is downloading...");

                  const { uri } = await FileSystem.downloadAsync(
                    fullUrl,
                    localUri,
                    {
                      headers: {
                        "ngrok-skip-browser-warning": "true"
                      }
                    }
                  );

                  const contentUri = await FileSystem.getContentUriAsync(uri);

                  await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
                    data: contentUri,
                    flags: 1, // Intent.FLAG_GRANT_READ_URI_PERMISSION
                    type: "application/pdf",
                  });
                } else {
                  Linking.openURL(fullUrl).catch((err) => {
                    Alert.alert("Error", "Could not open download link.");
                  });
                }
              } catch (err) {
                console.error(err);
                Alert.alert("Error", "Failed to download and open PDF. Please ensure a PDF reader is installed.");
              }
            }
          }
        ]
      );
    } else {
      Alert.alert("Download Started", `${fileName} is downloading...`);
    }
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText="Learn & Resources"
        rightText="Home"
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10, paddingHorizontal: 24 }}
      >
        {/* 1. Learn Safely - Resource Library Card */}
        <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-6 shadow-xs mb-6 mt-4">
          <StyledText className="text-[#005B96] text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
            LEARN SAFELY
          </StyledText>
          <StyledText className="text-[#002B49] text-[22px] font-black mb-2">
            Resource Library
          </StyledText>
          <StyledText className="text-[#64748B] text-xs leading-5 mb-4">
            Browse practical guidance, downloadable resources, and micro-education without starting a report or AI flow.
          </StyledText>

          <StyledView className="flex-row flex-wrap items-center">
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home/micro-cards/micro-education")}
              className="bg-[#005B96] px-4 py-2.5 rounded-full mr-2 mb-2"
            >
              <StyledText className="text-white text-[11px] font-bold">
                Open micro-education
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home/micro-cards")}
              className="bg-white border border-[#CBD5E1] px-4 py-2.5 rounded-full mb-2"
            >
              <StyledText className="text-[#475569] text-[11px] font-bold">
                Browse micro-cards
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        {/* 2. Downloadable Resources Card */}
        <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-6 shadow-xs mb-6">
          <StyledView className="flex-row justify-between items-center mb-1">
            <StyledText className="text-[#002B49] text-base font-black">
              Downloadable resources
            </StyledText>
            <StyledView className="bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-[#DBEAFE]">
              <StyledText className="text-[#005B96] text-[9px] font-extrabold uppercase tracking-wider">
                {loading ? "..." : `${contentResources.length} LISTED`}
              </StyledText>
            </StyledView>
          </StyledView>
          <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mb-4">
            Backend resources appear here when available.
          </StyledText>

          {loading && contentResources.length === 0 ? (
            <ActivityIndicator size="small" color="#005B96" className="py-6" />
          ) : contentResources.length > 0 ? (
            contentResources.map((item, index) => (
              <StyledView
                key={item.id}
                className={`bg-[#F8FAFC] border border-[#CBD5E1]/30 rounded-2xl p-4 ${
                  index === contentResources.length - 1 ? "" : "mb-4"
                }`}
              >
                <StyledText className="text-[#002B49] text-[13px] font-black mb-1">
                  {item.name}
                </StyledText>
                <StyledText className="text-[#64748B] text-[10px] font-semibold mb-3">
                  {item.category} | {item.language} | {item.jurisdiction}
                </StyledText>
                <StyledTouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleDownload(item.name, item.downloadPath)}
                  className="w-full bg-[#005B96] py-2 rounded-xl flex-row items-center justify-center"
                >
                  <StyledText className="text-white text-[11px] font-bold mr-1.5">
                    Download
                  </StyledText>
                  <Ionicons name="open-outline" size={13} color="white" />
                </StyledTouchableOpacity>
              </StyledView>
            ))
          ) : (
            <StyledText className="text-[#64748B] text-xs text-center py-4 font-semibold">
              No downloadable resources found.
            </StyledText>
          )}
        </StyledView>

        {/* 3. Micro-education Card */}
        <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-6 shadow-xs mb-6">
          <StyledView className="flex-row items-center mb-1">
            <StyledView className="w-7 h-7 bg-[#EFF6FF] rounded-lg items-center justify-center mr-2.5">
              <Ionicons name="albums-outline" size={15} color="#005B96" />
            </StyledView>
            <StyledText className="text-[#002B49] text-base font-black">
              Micro-education
            </StyledText>
          </StyledView>
          <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mb-4 mt-0.5">
            Short guidance cards for quick learning.
          </StyledText>

          {/* Grid of Micro Learning Cards */}
          <StyledView className="space-y-3 mb-4">
            {educationItems.slice(0, 4).map((item) => (
              <StyledTouchableOpacity
                key={item.id}
                activeOpacity={0.85}
                onPress={() => {
                  setSelectedGuideId(item.id);
                  router.push("/home/micro-cards");
                }}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 rounded-2xl p-4"
              >
                <StyledText className="text-[#94A3B8] text-[8.5px] font-extrabold uppercase tracking-wider mb-1">
                  {item.tag}
                </StyledText>
                <StyledText className="text-[#002B49] text-xs font-black mb-1">
                  {item.title}
                </StyledText>
                <StyledText className="text-[#64748B] text-[10px] leading-4 font-semibold">
                  {item.summary}
                </StyledText>
              </StyledTouchableOpacity>
            ))}
          </StyledView>

          {/* Action Buttons */}
          <StyledView className="w-full">
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home/micro-cards/micro-education")}
              className="w-full bg-[#005B96] py-2.5 rounded-full items-center justify-center mb-3"
            >
              <StyledText className="text-white text-xs font-bold">
                Open micro-education
              </StyledText>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home/micro-cards")}
              className="w-full bg-white border border-[#CBD5E1] py-2.5 rounded-full items-center justify-center"
            >
              <StyledText className="text-[#002B49] text-xs font-bold">
                Browse micro-cards
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>

        {/* 4. Support Directory Card */}
        <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-6 shadow-xs mb-4">
          <StyledText className="text-[#005B96] text-[10px] font-extrabold uppercase tracking-wider mb-1.5">
            SUPPORT DIRECTORY
          </StyledText>
          <StyledText className="text-[#002B49] text-[18px] font-black leading-6 mb-2">
            Banks, legal aid, and counseling services
          </StyledText>
          <StyledText className="text-[#64748B] text-[11px] leading-4.5 font-semibold mb-3.5">
            Published admin directory entries appear here for quick contact and availability checks.
          </StyledText>

          <StyledView className="bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#DBEAFE] self-start mb-4">
            <StyledText className="text-[#005B96] text-[9px] font-extrabold uppercase tracking-wider">
              {loading ? "..." : `${resources.length} LISTED`}
            </StyledText>
          </StyledView>

          {/* Directory Grid/List */}
          {loading ? (
            <ActivityIndicator size="small" color="#005B96" className="py-6" />
          ) : resources.length === 0 ? (
            <StyledText className="text-[#64748B] text-xs text-center py-4 font-semibold">
              No support listings found.
            </StyledText>
          ) : (
            <StyledView className="space-y-3">
              {resources.map((resource) => (
                <StyledView
                  key={resource.id || resource._id}
                  className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 rounded-2xl p-4 flex-row justify-between items-start"
                >
                  <StyledView className="flex-1 mr-3">
                    <StyledView className="bg-[#E2F0D9] px-2 py-0.5 rounded-md self-start mb-1.5">
                      <StyledText className="text-[#385723] text-[8.5px] font-extrabold">
                        {resource.category}
                      </StyledText>
                    </StyledView>
                    <StyledText className="text-[#002B49] text-xs font-bold mb-1">
                      {resource.name}
                    </StyledText>
                    <StyledText className="text-[#94A3B8] text-[10px] font-semibold">
                      {resource.region}
                    </StyledText>
                    <StyledTouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        if (resource.contact) {
                          Linking.openURL(`tel:${resource.contact.replace(/\s+/g, "")}`);
                        }
                      }}
                      className="mt-1"
                    >
                      <StyledText className="text-[#64748B] text-[10px] font-bold">
                        {resource.contact}
                      </StyledText>
                    </StyledTouchableOpacity>
                  </StyledView>
                  <Ionicons name="heart" size={16} color="#005B96" className="mt-1" />
                </StyledView>
              ))}
            </StyledView>
          )}
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
