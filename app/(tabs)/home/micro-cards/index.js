import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity, TextInput, Alert, Modal, ImageBackground, Animated, Dimensions } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLanguage } from "../../../../context/LanguageContext";
import CustomHeader from "../../../../components/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEducationStore } from "../../../../store/useEducationStore";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

const TOPICS = ["All topics", "Racial support", "Legal", "Safety", "Scams & Fraud"];

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

const detailContentByTheme = {
  identify: {
    eyebrow: "Recognize the pattern",
    headline: "Spot harm early before it becomes normalized.",
    summary: "Bullying and harassment often escalate through repetition, isolation, and shifts in power. Early recognition helps users respond before the situation gets harder to describe.",
    paragraph1: "A useful first step is naming the pattern. Repeated humiliation, exclusion, intimidation, threats, or targeted comments can all signal abuse even when each moment feels small in isolation.",
    paragraph2: "Users should not have to prove the full story before they are allowed to seek help. A frontend flow can support this by validating uncertainty, offering examples, and guiding people into a safer next step.",
    takeaway: "If a behavior is repeated, targeted, or makes someone feel unsafe, treat it as a pattern worth documenting.",
    cta: "Open a safety checklist",
    steps: [
      { title: "Note who was involved and where it happened.", highlight: "GET PROTECTED", tip: "Record dates, channels used, and names of individuals who participated or witnessed the behavior." },
      { title: "Record repeated phrases, gestures, or actions.", highlight: "KEEP RECORDS", tip: "Capture exact words if possible, noting the emotional impact and frequency of occurrences." },
      { title: "Mark whether the behavior affected work, study, housing, or safety.", highlight: "STAY SAFE", tip: "Flag any immediate changes in your routine, attendance, or productivity due to threats." }
    ]
  },
  document: {
    eyebrow: "Preserve the details",
    headline: "Capture evidence in a way that stays usable later.",
    summary: "Documentation becomes much stronger when users record facts close to the event and keep files organized without adding friction during a stressful moment.",
    paragraph1: "Useful evidence can include screenshots, dates, voice notes, photos, or a short written description of what happened. Frontend guidance should make these options feel flexible.",
    paragraph2: "The most helpful UI pattern is small, direct prompts: what happened, when it happened, and whether anything needs urgent follow-up. That keeps users moving without forcing a long narrative.",
    takeaway: "Simple, consistent notes usually matter more than a perfect statement written all at once.",
    cta: "Review evidence tips",
    steps: [
      { title: "Save screenshots before messages disappear.", highlight: "GET PROTECTED", tip: "Take screenshots on your phone or device and store them securely in a private album or folder." },
      { title: "Keep a short timeline with dates and locations.", highlight: "KEEP RECORDS", tip: "Create a list of key events chronologically to help support services understand the timeline easily." },
      { title: "Separate what you saw directly from what someone else told you.", highlight: "STAY SAFE", tip: "Clearly distinguish direct observations from second-hand information to maintain evidence clarity." }
    ]
  },
  report: {
    eyebrow: "Report with control",
    headline: "Give users options without making the flow feel risky.",
    summary: "Reporting works better when the interface clearly explains what happens next, what is optional, and how privacy controls affect visibility.",
    paragraph1: "A trauma-aware reporting flow should explain each step in plain language. Users need to know whether they can stay anonymous, whether follow-up is optional, and who receives the report.",
    paragraph2: "Frontend can reduce abandonment by breaking the process into small decisions: share now, save for later, or seek guidance first. That preserves agency and improves completion rates.",
    takeaway: "Users are more likely to report when the interface makes privacy and next steps explicit.",
    cta: "View reporting steps",
    steps: [
      { title: "Show which fields are optional before users start typing.", highlight: "GET PROTECTED", tip: "Identify and prioritize necessary fields, leaving optional ones for later when comfortable." },
      { title: "Explain referral pathways before the final submit action.", highlight: "KEEP RECORDS", tip: "Understand where your information is sent and who will review it before submitting." },
      { title: "Keep Quick Exit visible throughout the reporting flow.", highlight: "STAY SAFE", tip: "Ensure you can navigate away instantly in case your environment becomes unsafe." }
    ]
  },
  footprint: {
    eyebrow: "Reduce digital exposure",
    headline: "Help users understand the trail they may be leaving behind.",
    summary: "Shared devices, browser history, screenshots, and location metadata can all create risk. Good frontend patterns reduce that exposure without blocking access.",
    paragraph1: "Shared devices, cloud backups, and location services can inadvertently broadcast sensitive routines or conversations.",
    paragraph2: "Using private browser sessions and checking lock screen settings are simple, low-effort checks to boost privacy.",
    paragraph3: "Educating yourself on device traces empowers you to use digital tools with greater confidence and safety.",
    takeaway: "Proactive digital privacy habits significantly minimize location, messaging, and account risks across shared networks.",
    cta: "Review Privacy Steps",
    steps: [
      { title: "Use a private device when possible.", highlight: "GET PROTECTED", tip: "Access sensitive info using private windows, or clean up cookies and history after use." },
      { title: "Avoid saving sensitive screenshots in public albums.", highlight: "KEEP RECORDS", tip: "Hide or secure folders containing records so they cannot be accessed accidentally." },
      { title: "Check notification previews and shared browser sessions.", highlight: "STAY SAFE", tip: "Disable previews on your lock screen so sensitive alerts are kept private." }
    ]
  },
  rights: {
    eyebrow: "Know your options",
    headline: "Understand rights, records, and safer next steps.",
    summary: "Rights guidance works best when it is practical, plain-language, and paired with options for trusted follow-up.",
    paragraph1: "Every student, worker, and tenant has fundamental protections against intimidation, harassment, and discrimination.",
    paragraph2: "Familiarizing yourself with organization rules or terms of service helps formulate clear boundaries and statements.",
    paragraph3: "Seeking advice from specialized legal clinics provides a clear understanding of possible legal avenues before committing.",
    takeaway: "Knowing the standards of conduct and local safety laws helps you identify and advocate for your rights in any setting.",
    cta: "Review Rights Guidance",
    steps: [
      { title: "Write down the setting and people involved.", highlight: "GET PROTECTED", tip: "Determine the jurisdiction or local guidelines that apply to the location of the incident." },
      { title: "Keep copies of messages, policies, or documents.", highlight: "KEEP RECORDS", tip: "Keep files that define code of conduct, tenancy terms, or safety policies close by." },
      { title: "Ask a trusted service which reporting pathway fits.", highlight: "STAY SAFE", tip: "Get advice from a local legal aid center before taking official legal steps." }
    ]
  },
  wellbeing: {
    eyebrow: "Support your wellbeing",
    headline: "Use short steps that lower pressure while you decide what comes next.",
    summary: "Wellbeing support should make the next action feel smaller, safer, and easier to complete.",
    paragraph1: "Your physical safety and emotional recovery come first. Give yourself permission to pause and regroup in a safe space.",
    paragraph2: "Reaching out to a trusted contact or helpline can offer the external support needed to process challenging experiences.",
    paragraph3: "Focusing on one small task at a time prevents overwhelm and builds confidence for subsequent safety decisions.",
    takeaway: "Lowering the pressure on yourself by taking small, safe, and deliberate steps helps clear mental fog and reduces anxiety.",
    cta: "Open Wellbeing Tips",
    steps: [
      { title: "Pause and move to a safer place if possible.", highlight: "GET PROTECTED", tip: "Take time out of the stressful situation to clear your mind and ensure physical safety." },
      { title: "Choose one trusted person or service to contact.", highlight: "KEEP RECORDS", tip: "Connect with a friend, advocate, or counseling service to talk through how you feel." },
      { title: "Keep the next action small and specific.", highlight: "STAY SAFE", tip: "Focus on one manageable action rather than trying to plan everything at once." }
    ]
  }
};

const hackerImage = { uri: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop" };

export default function MicroCards() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTopic, setActiveTopic] = useState("All topics");
  const [searchQuery, setSearchQuery] = useState("");
  const [headerVisible, setHeaderVisible] = useState(true);

  // Modal States & Animation Ref
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  // Zustand store
  const storeItems = useEducationStore((state) => state.items);
  const selectedGuideId = useEducationStore((state) => state.selectedGuideId);
  const setSelectedGuideId = useEducationStore((state) => state.setSelectedGuideId);

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

  // Auto-open guide modal if navigated from resources page
  useEffect(() => {
    if (selectedGuideId && guides.length > 0) {
      const guide = guides.find((item) => item.id === selectedGuideId);
      if (guide) {
        openCardDetail(guide);
        setSelectedGuideId(null);
      }
    }
  }, [selectedGuideId, guides]);

  const handleScroll = (event) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    if (currentOffsetY <= 10) {
      setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      setHeaderVisible(false);
    }
  };

  const handleDownload = (fileName) => {
    Alert.alert("Download Started", `${fileName} is downloading...`);
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
        backText="Cyber Bullying"
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
            Micro-Cards
          </StyledText>
          <StyledText className="text-[#64748B] text-xs leading-5">
            Click a card
          </StyledText>
        </StyledView>

        {/* Search Input */}
        <StyledView className="w-full bg-white rounded-full border border-[#E2E8F0] px-4 flex-row items-center h-[46px] shadow-xs mb-5">
          <Ionicons name="search-outline" size={18} color="#94A3B8" />
          <StyledTextInput
            placeholder="Search cards, topics, or filters..."
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
                  <StyledText className="text-white text-lg font-black leading-6 mb-1">
                    {guide.title}
                  </StyledText>
                  <StyledText className="text-white/80 text-[10px] font-bold uppercase tracking-wide mb-3">
                    {guide.tag}  |  {guide.duration}
                  </StyledText>
                </StyledView>

                {/* Play Card Button */}
                <StyledTouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => openCardDetail(guide)}
                  className="bg-white px-5 py-2.5 rounded-full self-start shadow-xs"
                >
                  <StyledText className="text-[#005B96] text-[11px] font-bold">
                    Play card
                  </StyledText>
                </StyledTouchableOpacity>
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
            2 listed
          </StyledText>

          <StyledView className="space-y-3">
            {/* Doc 1 */}
            <StyledView className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 p-4 rounded-[20px] flex-row justify-between items-center">
              <StyledView className="flex-row items-center flex-1 mr-3">
                <StyledView className="w-8 h-8 rounded-full bg-[#EFF6FF] items-center justify-center mr-3 shrink-0">
                  <Ionicons name="document-text" size={14} color="#005B96" />
                </StyledView>
                <StyledView className="flex-1">
                  <StyledText className="text-[#002B49] text-xs font-bold">
                    Legal Support Framework 2024
                  </StyledText>
                  <StyledText className="text-[#64748B] text-[9.5px] font-semibold">
                    Legal Awareness | English | Federal
                  </StyledText>
                </StyledView>
              </StyledView>
              <StyledTouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleDownload("Legal Support Framework 2024")}
                className="w-8 h-8 rounded-full bg-[#005B96] items-center justify-center"
              >
                <Ionicons name="download" size={14} color="white" />
              </StyledTouchableOpacity>
            </StyledView>

            {/* Doc 2 */}
            <StyledView className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 p-4 rounded-[20px] flex-row justify-between items-center">
              <StyledView className="flex-row items-center flex-1 mr-3">
                <StyledView className="w-8 h-8 rounded-full bg-[#EFF6FF] items-center justify-center mr-3 shrink-0">
                  <Ionicons name="document-text" size={14} color="#005B96" />
                </StyledView>
                <StyledView className="flex-1">
                  <StyledText className="text-[#002B49] text-xs font-bold">
                    Legal Support Framework 2026
                  </StyledText>
                  <StyledText className="text-[#64748B] text-[9.5px] font-semibold">
                    Online Abuse | English | NSW
                  </StyledText>
                </StyledView>
              </StyledView>
              <StyledTouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleDownload("Legal Support Framework 2026")}
                className="w-8 h-8 rounded-full bg-[#005B96] items-center justify-center"
              >
                <Ionicons name="download" size={14} color="white" />
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledScrollView>

      {/* Spring Animated Micro Cards Modal */}
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
                backgroundColor: "#F0F4FA",
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
              <SafeAreaView className="bg-[#F0F4FA]" edges={["top"]}>
                <StyledView className="flex-row items-center justify-between px-6 py-4">
                  <StyledTouchableOpacity
                    activeOpacity={0.7}
                    onPress={closeCardDetail}
                    className="flex-row items-center"
                  >
                    <Ionicons name="chevron-back" size={20} color="#1F2937" />
                    <StyledText className="text-[#1F2937] text-base font-semibold ml-1">
                      Micro-Cards
                    </StyledText>
                  </StyledTouchableOpacity>

                  <StyledTouchableOpacity
                    activeOpacity={0.7}
                    onPress={closeCardDetail}
                    className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm"
                  >
                    <Ionicons name="close" size={20} color="#002B49" />
                  </StyledTouchableOpacity>
                </StyledView>
              </SafeAreaView>

              <StyledScrollView
                className="flex-1 px-6"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
              >
                <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-6 mt-4 shadow-xs">
                  <StyledText className="text-[#005B96] text-xs font-bold uppercase tracking-wider mb-2">
                    {selectedGuide.tag}
                  </StyledText>
                  <StyledText className="text-[#002B49] text-2xl font-black mb-3">
                    {selectedGuide.title}
                  </StyledText>
                  <StyledText className="text-[#4B5563] text-sm leading-6 font-semibold">
                    {selectedGuide.desc}
                  </StyledText>
                </StyledView>
              </StyledScrollView>
            </Animated.View>
          </StyledView>
        </Modal>
      )}
    </StyledView>
  );
}
