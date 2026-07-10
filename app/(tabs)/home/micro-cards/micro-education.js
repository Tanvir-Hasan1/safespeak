import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert, Modal, Animated, Dimensions, Linking, Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLanguage } from "../../../../context/LanguageContext";
import CustomHeader from "../../../../components/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEducationStore } from "../../../../store/useEducationStore";
import api from "../../../../context/api";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

// Tone → background color mapping
const TONE_BG = {
  blue:   "bg-[#0E5C9E]",
  orange: "bg-[#EA580C]",
  green:  "bg-[#22883B]",
  teal:   "bg-[#0D9488]",
  violet: "bg-[#7C3AED]",
  amber:  "bg-[#D97706]",
};

// Tone → icon mapping
const TONE_ICON = {
  blue:   "shield-checkmark-outline",
  orange: "alert-circle-outline",
  green:  "shield-outline",
  teal:   "key-outline",
  violet: "heart-outline",
  amber:  "business-outline",
};

const TOPICS = ["All topics", "Racial support", "Legal", "Safety", "Scams & Fraud"];


const detailContentByTheme = {
  identify: {
    takeaway: "Understanding the nature of online threats empowers you to take actionable steps to protect your identity and mental well-being.",
    cta: "Get Protected",
    paragraph1: "This topic focuses on practical awareness and low-friction safety habits. Protect your digital footprint & data from potential online threats.",
    paragraph2: "Start by identifying early signs, document what matters, and choose one immediate protective step you can take today.",
    paragraph3: "Support options work best when used consistently. Build a small routine, keep records, and ask for trusted professional help when needed."
  },
  document: {
    takeaway: "Preserving details systematically guarantees that your evidence remains clear, chronological, and ready for support review.",
    cta: "Review Evidence Tips",
    paragraph1: "Detailed timelines and digital records help clarify incidents when seeking legal assistance or support agency referrals.",
    paragraph2: "Capture screenshots, write notes, and save dates/links safely without creating digital clutter or local exposure risks.",
    paragraph3: "Having direct facts readily available avoids the burden of repeatedly explaining distressing memories to different representatives."
  },
  report: {
    takeaway: "Entering details with clarity and knowing your referral pathways beforehand lowers stress levels during the submission phase.",
    cta: "View Reporting Steps",
    paragraph1: "Trauma-aware systems guide you step-by-step through reporting pathways so you stay fully in control of what is shared.",
    paragraph2: "Understanding the difference between anonymous disclosures and formal investigations helps set realistic expectations.",
    paragraph3: "Safety buttons remain accessible on every screen to ensure you can exit instantly if someone enters your space."
  },
  footprint: {
    takeaway: "Proactive digital privacy habits significantly minimize location, messaging, and account risks across shared networks.",
    cta: "Review Privacy Steps",
    paragraph1: "Shared devices, cloud backups, and location services can inadvertently broadcast sensitive routines or conversations.",
    paragraph2: "Using private browser sessions and checking lock screen settings are simple, low-effort checks to boost privacy.",
    paragraph3: "Educating yourself on device traces empowers you to use digital tools with greater confidence and safety."
  },
  rights: {
    takeaway: "Knowing the standards of conduct and local safety laws helps you identify and advocate for your rights in any setting.",
    cta: "Review Rights Guidance",
    paragraph1: "Every student, worker, and tenant has fundamental protections against intimidation, harassment, and discrimination.",
    paragraph2: "Familiarizing yourself with organization rules or terms of service helps formulate clear boundaries and statements.",
    paragraph3: "Seeking advice from specialized legal clinics provides a clear understanding of possible legal avenues before committing."
  },
  wellbeing: {
    takeaway: "Lowering the pressure on yourself by taking small, safe, and deliberate steps helps clear mental fog and reduces anxiety.",
    cta: "Open Wellbeing Tips",
    paragraph1: "Your physical safety and emotional recovery come first. Give yourself permission to pause and regroup in a safe space.",
    paragraph2: "Reaching out to a trusted contact or helpline can offer the external support needed to process challenging experiences.",
    paragraph3: "Focusing on one small task at a time prevents overwhelm and builds confidence for subsequent safety decisions."
  }
};

export default function MicroEducation() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTopic, setActiveTopic] = useState("All topics");
  const [searchQuery, setSearchQuery] = useState("");
  const [headerVisible, setHeaderVisible] = useState(true);

  // Modal States & Animation Ref
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [contentResources, setContentResources] = useState([]);

  useEffect(() => {
    api.get("/content-resources")
      .then((res) => {
        const json = res.data;
        if (json.success && json.data && Array.isArray(json.data.resources)) {
          setContentResources(json.data.resources);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch content resources:", err);
      });
  }, []);
  const [modalVisible, setModalVisible] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  // Zustand store
  const storeItems = useEducationStore((state) => state.items);
  const selectedGuideId = useEducationStore((state) => state.selectedGuideId);
  const setSelectedGuideId = useEducationStore((state) => state.setSelectedGuideId);

  // Auto-open guide modal if navigated from resources page
  useEffect(() => {
    if (selectedGuideId && storeItems.length > 0) {
      const guide = storeItems.find((item) => item.id === selectedGuideId);
      if (guide) {
        openCardDetail(guide);
        setSelectedGuideId(null);
      }
    }
  }, [selectedGuideId, storeItems]);

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

  const openCardDetail = (guide) => {
    setSelectedGuide(guide);
    setModalVisible(true);
    Animated.spring(animValue, {
      toValue: 1,
      stiffness: 230,
      damping: 32,
      mass: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const closeCardDetail = () => {
    Animated.timing(animValue, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedGuide(null);
    });
  };

  // Use API items from store, fall back to empty array
  const guides = storeItems.map((item) => ({
    id: item.id,
    tag: item.tag?.toUpperCase() || "",
    title: item.title,
    theme: "identify",
    bg: TONE_BG[item.tone] || "bg-[#0E5C9E]",
    icon: TONE_ICON[item.tone] || "shield-checkmark-outline",
    category: "Safety",
    desc: item.summary,
    duration: item.readTimeLabel,
    detailHeading: item.detailHeading,
    detailBody: item.detailBody,
    detailTakeaway: item.detailTakeaway,
    cta: item.cta,
  }));

  const filteredGuides = guides.filter((guide) => {
    const matchesTopic = activeTopic === "All topics" || guide.category === activeTopic;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.tag.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTopic && matchesSearch;
  });

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText="Micro-education"
        rightText="Cancel"
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10, paddingHorizontal: 24 }}
      >
        {/* Main Header Description */}
        <StyledView className="w-full mt-4 mb-6">
          <StyledText className="text-[#002B49] text-[26px] font-black leading-8 mb-2">
            Learn. Protect. Thrive.
          </StyledText>
          <StyledText className="text-[#64748B] text-xs leading-5">
            Micro-educational guides and cards. Read brief summaries, learn safety steps, or get details on common issues.
          </StyledText>
        </StyledView>

        {/* Search Input */}
        <StyledView className="w-full bg-white rounded-full border border-[#E2E8F0] px-4 flex-row items-center h-[46px] shadow-xs mb-5">
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <StyledTextInput
            placeholder="Search educational guides..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 ml-2 text-sm text-[#1F2937]"
            placeholderTextColor="#94A3B8"
          />
        </StyledView>

        {/* Filter Pills Scroll */}
        <StyledScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-6"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          {TOPICS.map((topic) => (
            <StyledTouchableOpacity
              key={topic}
              activeOpacity={0.8}
              onPress={() => setActiveTopic(topic)}
              className={`px-5 py-2 rounded-full mr-2.5 border ${
                activeTopic === topic
                  ? "bg-[#005B96] border-[#005B96]"
                  : "bg-white border-[#E2E8F0]"
              }`}
            >
              <StyledText
                className={`text-[11px] font-bold ${
                  activeTopic === topic ? "text-white" : "text-[#64748B]"
                }`}
              >
                {topic}
              </StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledScrollView>

        {/* Vertical Stack of Custom Color Cards */}
        <StyledView className="space-y-4 mb-6">
          {filteredGuides.map((guide) => (
            <StyledTouchableOpacity
              key={guide.id}
              activeOpacity={0.9}
              onPress={() => openCardDetail(guide)}
              className={`w-full ${guide.bg} rounded-[24px] p-5 shadow-xs relative overflow-hidden flex-row justify-between min-h-[140px]`}
            >
              {/* Left Column Content */}
              <StyledView className="flex-1 justify-between pr-4 z-10">
                <StyledView>
                  <StyledText className="text-white/60 text-[9px] font-extrabold uppercase tracking-widest mb-1">
                    {guide.tag}
                  </StyledText>
                  <StyledText className="text-white text-lg font-black leading-6 mb-1.5">
                    {guide.title}
                  </StyledText>
                  <StyledText className="text-white/95 text-[10px] leading-4 font-semibold">
                    {guide.desc}
                  </StyledText>
                </StyledView>

                {/* Duration Badge */}
                <StyledView className="bg-white/25 rounded-md px-2.5 py-1 mt-3.5 self-start">
                  <StyledText className="text-white text-[9px] font-extrabold uppercase tracking-wider">
                    {guide.duration}
                  </StyledText>
                </StyledView>
              </StyledView>

              {/* Watermark Icon Right Alignment */}
              <StyledView className="justify-end items-end w-14 shrink-0 opacity-15">
                <Ionicons name={guide.icon} size={64} color="white" />
              </StyledView>
            </StyledTouchableOpacity>
          ))}
        </StyledView>

        {/* Downloadable Safety Resources Card */}
        <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-5 shadow-xs mb-4">
          <StyledText className="text-[#002B49] text-base font-black">
            Downloadable safety resources
          </StyledText>
          <StyledText className="text-[#94A3B8] text-[9px] font-semibold mb-4 mt-0.5">
            {contentResources.length} listed
          </StyledText>

          <StyledView className="space-y-3">
            {contentResources.length > 0 ? (
              contentResources.map((item) => (
                <StyledView key={item.id} className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 p-4 rounded-[20px] flex-row justify-between items-center">
                  <StyledView className="flex-row items-center flex-1 mr-3">
                    <StyledView className="w-8 h-8 rounded-full bg-[#EFF6FF] items-center justify-center mr-3 shrink-0">
                      <Ionicons name="document-text" size={14} color="#005B96" />
                    </StyledView>
                    <StyledView className="flex-1">
                      <StyledText className="text-[#002B49] text-xs font-bold">
                        {item.name}
                      </StyledText>
                      <StyledText className="text-[#64748B] text-[9.5px] font-semibold">
                        {item.category} | {item.language} | {item.jurisdiction}
                      </StyledText>
                    </StyledView>
                  </StyledView>
                  <StyledTouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => handleDownload(item.name, item.downloadPath)}
                    className="w-8 h-8 rounded-full bg-[#005B96] items-center justify-center"
                  >
                    <Ionicons name="download" size={14} color="white" />
                  </StyledTouchableOpacity>
                </StyledView>
              ))
            ) : (
              <StyledText className="text-[#64748B] text-xs text-center py-4 font-semibold">
                No downloadable resources found.
              </StyledText>
            )}
          </StyledView>
        </StyledView>
      </StyledScrollView>

      {/* Spring Animated Micro Education Modal */}
      {selectedGuide && (
        <Modal
          transparent
          visible={modalVisible}
          onRequestClose={closeCardDetail}
          animationType="none"
        >
          <StyledView className="flex-1 justify-end">
            {/* Backdrop with Fade transition */}
            <Animated.View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(11, 23, 40, 0.4)",
                opacity: animValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1]
                })
              }}
            >
              <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={closeCardDetail} />
            </Animated.View>

            {/* Modal Content with Custom Spring transition */}
            <Animated.View
              style={{
                height: "92%",
                width: "100%",
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                overflow: "hidden",
                transform: [
                  {
                    translateY: animValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [SCREEN_HEIGHT, 0]
                    })
                  }
                ]
              }}
            >
              {/* Modal Header */}
              <SafeAreaView className="bg-white" edges={["top"]}>
                <StyledView className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100">
                  <StyledTouchableOpacity
                    activeOpacity={0.7}
                    onPress={closeCardDetail}
                    className="flex-row items-center"
                  >
                    <Ionicons name="chevron-back" size={20} color="#1F2937" />
                    <StyledText className="text-[#1F2937] text-base font-semibold ml-1">
                      micro-cards
                    </StyledText>
                  </StyledTouchableOpacity>

                  <StyledTouchableOpacity
                    activeOpacity={0.7}
                    onPress={closeCardDetail}
                    className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center"
                  >
                    <Ionicons name="close" size={20} color="#1F2937" />
                  </StyledTouchableOpacity>
                </StyledView>
              </SafeAreaView>

              <StyledScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 60 }}
              >
                {/* Header Section */}
                <StyledView className="mt-6 mb-8">
                  <StyledText className="text-[#005B96] text-xs font-bold uppercase tracking-wider mb-2">
                    {selectedGuide.tag}
                  </StyledText>
                  <StyledText className="text-[#002B49] text-3xl font-black mb-4 leading-9">
                    {selectedGuide.title}
                  </StyledText>
                  <StyledText className="text-[#4B5563] text-sm leading-6 font-medium">
                    {selectedGuide.desc}
                  </StyledText>
                </StyledView>

                {/* Key Takeaway Section - Clean layout with accent border */}
                {selectedGuide.detailTakeaway ? (
                  <StyledView className="border-l-4 border-[#005B96] pl-4 mb-8">
                    <StyledText className="text-[#002B49] text-xs font-bold uppercase tracking-wider mb-2">
                      Key Takeaway
                    </StyledText>
                    <StyledText className="text-[#4B5563] text-sm leading-6 mb-4 font-semibold">
                      {selectedGuide.detailTakeaway}
                    </StyledText>
                    {selectedGuide.cta ? (
                      <StyledTouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => Alert.alert("Action Triggered", `Opening: ${selectedGuide.cta}`)}
                        className="bg-[#005B96] py-2.5 px-6 rounded-full self-start"
                      >
                        <StyledText className="text-white text-xs font-bold">
                          {selectedGuide.cta}
                        </StyledText>
                      </StyledTouchableOpacity>
                    ) : null}
                  </StyledView>
                ) : null}

                {/* Detail Overview Section */}
                {selectedGuide.detailBody ? (
                  <StyledView className="mb-6">
                    <StyledText className="text-[#002B49] text-lg font-bold mb-3">
                      {selectedGuide.detailHeading || "Overview"}
                    </StyledText>
                    <StyledText className="text-[#64748B] text-sm leading-6 font-semibold">
                      {selectedGuide.detailBody}
                    </StyledText>
                  </StyledView>
                ) : null}
              </StyledScrollView>
            </Animated.View>
          </StyledView>
        </Modal>
      )}
    </StyledView>
  );
}
