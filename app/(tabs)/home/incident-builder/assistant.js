import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useLanguage } from "../../../../context/LanguageContext";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledScrollView = styled(ScrollView);

const Sphere = require("../../../../assets/images/home/Sphere.png");

const TOPICS = {
  domestic_violence: {
    title: "Domestic violence",
    greetingPhrase: "with domestic violence concerns",
    description: "I experienced domestic violence and want to understand my options safely.",
    startText: "I may be experiencing domestic or family violence and I want to understand safe options.",
    legalTitle: "Domestic Violence Support & Pathways",
    legalDesc: "Information only, not legal advice. SafeSpeak will cite only approved, current, legally reviewed sources.",
    pathways: [
      { title: "Start incident report", desc: "Open the report flow with domestic violence context." },
      { title: "Understand reporting options", desc: "Open guided reporting options with SafeSpeak." },
      { title: "Find support", desc: "Browse support services and immediate safety planning." },
      { title: "Save evidence", desc: "Go to the evidence step with this topic in context." },
      { title: "Talk with SafeSpeak", desc: "Start a guided assistant conversation with this topic." }
    ],
    nswPoints: [
      "Keep a dated record of what happened if it is safe to do so.",
      "NSW Police and national domestic violence hotlines (like 1800RESPECT) provide immediate support and intervention.",
      "Safety planning is vital. SafeSpeak can guide you through securing your digital and physical footprints."
    ],
    nswPathways: [
      {
        title: "NSW domestic violence pathway",
        desc: "SafeSpeak can help organize details for domestic violence reporting or support applications once approved sources are available.",
        req: "DETAILED LEGAL EXPLANATIONS REQUIRE APPROVED NSW SOURCES."
      },
      {
        title: "Family law & protection pathways",
        desc: "Some safety concerns may involve Apprehended Domestic Violence Orders (ADVO) information.",
        req: "CITATIONS APPEAR ONLY FROM APPROVED FAMILY LAW SOURCES."
      },
      {
        title: "eSafety & digital stalking pathway",
        desc: "For digital stalking or abuse, safety planning, app audits, and eSafety information are critical.",
        req: "USE APPROVED eSAFETY SOURCES BEFORE PUBLIC CITATION."
      }
    ]
  },
  racial_abuse: {
    title: "Racial Abuse",
    greetingPhrase: "with racial abuse concerns",
    description: "I experienced racial abuse and want to understand my options safely.",
    startText: "I experienced racial abuse and want to understand my options safely.",
    legalTitle: "NSW Legal Awareness",
    legalDesc: "Information only, not legal advice. SafeSpeak will cite only approved, current, legally reviewed sources.",
    pathways: [
      { title: "Start incident report", desc: "Open the report flow with racial abuse context." },
      { title: "Understand reporting options", desc: "Open guided reporting options with SafeSpeak." },
      { title: "Find support", desc: "Browse support services and community support options." },
      { title: "Save evidence", desc: "Go to the evidence step with this topic in context." },
      { title: "Talk with SafeSpeak", desc: "Start a guided assistant conversation with this topic." }
    ],
    nswPoints: [
      "Keep a dated record of what happened if it is safe.",
      "NSW and Commonwealth pathways can both be relevant for racial abuse or discrimination concerns.",
      "Online abuse may also involve platform reporting, eSafety information, and immediate safety planning."
    ],
    nswPathways: [
      {
        title: "NSW discrimination pathway",
        desc: "SafeSpeak can help organize details for Anti-Discrimination NSW style complaint information once approved sources are available.",
        req: "DETAILED LEGAL EXPLANATIONS REQUIRE APPROVED NSW SOURCES."
      },
      {
        title: "Commonwealth pathway",
        desc: "Some racial discrimination concerns may involve Australian Human Rights Commission information.",
        req: "CITATIONS APPEAR ONLY FROM APPROVED COMMONWEALTH SOURCES."
      },
      {
        title: "Online abuse pathway",
        desc: "For online incidents, evidence collection, platform reports, and eSafety information may be relevant.",
        req: "USE APPROVED ESAFETY SOURCES BEFORE PUBLIC CITATION."
      }
    ]
  },
  cyber_scam: {
    title: "Cyber scam",
    greetingPhrase: "with cyber scam concerns",
    description: "I experienced a cyber scam and want to understand my options safely.",
    startText: "I think I may be dealing with a cyber scam and need help assessing it.",
    legalTitle: "Cyber Scam & Security Awareness",
    legalDesc: "Information only, not legal advice. SafeSpeak will cite only approved, current, legally reviewed sources.",
    pathways: [
      { title: "Start incident report", desc: "Open the report flow with cyber scam context." },
      { title: "Understand reporting options", desc: "Open guided reporting options with SafeSpeak." },
      { title: "Find support", desc: "Browse scam support services and identity protection options." },
      { title: "Save evidence", desc: "Go to the evidence step with this topic in context." },
      { title: "Talk with SafeSpeak", desc: "Start a guided assistant conversation with this topic." }
    ],
    nswPoints: [
      "Keep records of messages, transaction receipts, bank details, and communication headers.",
      "Report to Scamwatch and the Australian Signals Directorate (ACSC) as soon as possible.",
      "Contact your financial institution immediately to stop pending transfers and secure accounts."
    ],
    nswPathways: [
      {
        title: "Scam recovery pathway",
        desc: "SafeSpeak can help organize details for financial complaints or ID recovery once approved sources are available.",
        req: "DETAILED COMPLAINT DETAILS REQUIRE APPROVED FINANCIAL CORRESPONDENCE."
      },
      {
        title: "IDCARE & identity pathway",
        desc: "If identity credentials were compromised, IDCARE offers free support to safeguard your credentials.",
        req: "CITATIONS REQUIRE COMPROMISED CREDENTIAL DOCUMENTATION."
      },
      {
        title: "eSafety & online safety pathway",
        desc: "If scammers use social platforms or threaten dissemination, platform safety guidelines and eSafety reports apply.",
        req: "USE APPROVED PLATFORM SOURCES BEFORE PUBLIC CITATION."
      }
    ]
  },
  migrant_challenges: {
    title: "Migrant Challenges",
    greetingPhrase: "with migrant challenges",
    description: "I experienced migrant challenges and want to understand my options safely.",
    startText: "I am facing migrant-related challenges and want safe, culturally appropriate guidance.",
    legalTitle: "Migrant & International Student Support",
    legalDesc: "Information only, not legal advice. SafeSpeak will cite only approved, current, legally reviewed sources.",
    pathways: [
      { title: "Start incident report", desc: "Open the report flow with migrant challenges context." },
      { title: "Understand reporting options", desc: "Open guided reporting options with SafeSpeak." },
      { title: "Find support", desc: "Browse support services and student/migrant community options." },
      { title: "Save evidence", desc: "Go to the evidence step with this topic in context." },
      { title: "Talk with SafeSpeak", desc: "Start a guided assistant conversation with this topic." }
    ],
    nswPoints: [
      "Workplace exploitation, visa threats, and language barriers are common student and migrant challenges.",
      "Your visa status is protected in many cases when reporting workplace or wage exploitation under the Assurance Protocol.",
      "Local community legal centers offer free, confidential advice that will not affect your visa status."
    ],
    nswPathways: [
      {
        title: "Fair Work Ombudsman pathway",
        desc: "SafeSpeak can help organize details of wage underpayment or workplace unfairness without fear of visa cancellation.",
        req: "DETAILED EXPLANATIONS REQUIRE APPROVED WORKPLACE RESTRICTIONS INFO."
      },
      {
        title: "Visa and migration pathway",
        desc: "Information regarding your rights under specific student or working visas in Australia.",
        req: "CITATIONS APPEAR ONLY FROM APPROVED DEPARTMENT OF HOME AFFAIRS LAWS."
      },
      {
        title: "Community legal support",
        desc: "Connection points for community legal advice and advocacy services near you.",
        req: "USE APPROVED LOCAL ADVICE SERVICES BEFORE PUBLIC CITATION."
      }
    ]
  }
};

const KeyboardAvoidingViewWrapper = KeyboardAvoidingView;

export default function VoiceAssistant() {
  const router = useRouter();
  const { topic } = useLocalSearchParams();
  const { t } = useLanguage();
  const scrollViewRef = useRef(null);
  const insets = useSafeAreaInsets();

  const currentTopicKey = (topic && TOPICS[topic]) ? topic : "racial_abuse";
  const currentTopic = TOPICS[currentTopicKey];
  
  // State variables
  const [headerVisible, setHeaderVisible] = useState(true);
  const [conversationStarted, setConversationStarted] = useState(false);
  const [response, setResponse] = useState("");
  const [metadataEnabled, setMetadataEnabled] = useState(true);
  const [showTriageButton, setShowTriageButton] = useState(false);

  const isDraggingRef = useRef(false);

  const handleScroll = (event) => {
    if (!isDraggingRef.current) return;
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    if (currentOffsetY <= 10) {
      setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      setHeaderVisible(false);
    }
  };
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [continuousTranscript, setContinuousTranscript] = useState("");
  
  // Messages log
  const [messages, setMessages] = useState([]);

  // Dynamic sound wave visualizer bars
  const [barHeights, setBarHeights] = useState([12, 18, 8, 24, 14, 18, 10, 22, 16, 26, 12, 18, 8, 20]);

  // Simulate audio visualizer animation when active
  useEffect(() => {
    let interval;
    if (isVoiceRecording) {
      interval = setInterval(() => {
        setBarHeights(
          Array.from({ length: 18 }, () => Math.floor(Math.random() * 22) + 4)
        );
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isVoiceRecording]);

  // Simulate continuous speech transcription in Voice Mode
  useEffect(() => {
    let timeout;
    if (isVoiceModeActive && !isVoiceMuted) {
      timeout = setTimeout(() => {
        setContinuousTranscript(
          "Yesterday evening, I received a phishing scam message containing a suspicious link asking for my account verification."
        );
      }, 2500);
    }
    return () => clearTimeout(timeout);
  }, [isVoiceModeActive, isVoiceMuted]);

  // Helper to send a message
  const sendMessage = (textVal) => {
    if (!textVal || textVal.trim().length === 0) return;

    setConversationStarted(true);

    // Append user message
    const userMsg = {
      id: Date.now(),
      type: "user",
      text: textVal,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Check if user is asking for triage
    const isTriageRequest = textVal.toLowerCase().includes("triage");

    // Simulate AI response after 1.2 seconds
    setTimeout(() => {
      let aiMsg;
      if (isTriageRequest) {
        setShowTriageButton(true);
        aiMsg = {
          id: Date.now() + 1,
          type: "ai",
          text: "Continue to Triage",
        };
      } else {
        aiMsg = {
          id: Date.now() + 1,
          type: "ai",
          text: "I've processed that detail and added it to your timeline. Let's capture the rest of the incident specifics. Do you have any evidence or screenshots?",
        };
      }
      setMessages((prev) => [...prev, aiMsg]);
    }, 1200);
  };

  const handleSendPress = () => {
    sendMessage(response);
    setResponse("");
  };

  const handleTranscribeConfirm = () => {
    const transcript = "Yesterday evening, I received a phishing scam message containing a suspicious link asking for my account verification.";
    setResponse(transcript); 
    setIsVoiceRecording(false); 
  };

  if (isVoiceModeActive) {
    return (
      <StyledView className="flex-1 bg-[#F0F4FA] justify-between items-center px-6 pt-16 pb-12">
        <StyledView className="w-full items-center">
          <StyledView className="bg-white rounded-full flex-row items-center px-5 py-3 shadow-xs border border-[#E2E8F0] mt-4">
            <Ionicons
              name={isVoiceMuted ? "mic-off" : "mic"}
              size={16}
              color={isVoiceMuted ? "#64748B" : "#3B82F6"}
            />
            <StyledText
              className={`text-xs font-semibold ml-2 ${
                isVoiceMuted ? "text-[#64748B]" : "text-[#3B82F6]"
              }`}
            >
              {isVoiceMuted ? "Muted" : "Listening..."}
            </StyledText>
          </StyledView>

          {continuousTranscript ? (
            <StyledView className="bg-white/80 border border-white rounded-[20px] px-5 py-3 mt-4 mx-6 shadow-xs max-w-[90%]">
              <StyledText className="text-[#002B49] text-sm leading-5 text-center italic font-medium">
                "{continuousTranscript}"
              </StyledText>
            </StyledView>
          ) : null}
        </StyledView>

        <StyledView className="flex-1 items-center justify-center">
          <Image
            source={Sphere}
            style={{ width: 220, height: 220, opacity: isVoiceMuted ? 0.75 : 1 }}
            resizeMode="contain"
          />
        </StyledView>

        <StyledView className="w-full bg-white rounded-full flex-row items-center px-4 py-2 border border-[#E2E8F0] justify-between h-[52px]">
          <StyledTextInput
            placeholder={isVoiceMuted ? "Listening paused" : "Type your response..."}
            editable={false}
            className="flex-1 text-[#94A3B8] text-sm px-2"
            placeholderTextColor="#94A3B8"
          />
          <StyledView className="flex-row items-center space-x-2">
            <StyledTouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsVoiceMuted(!isVoiceMuted)}
              className={`w-9 h-9 rounded-full items-center justify-center mr-1 ${
                isVoiceMuted ? "bg-[#F1F5F9]" : "bg-[#EFF6FF]"
              }`}
            >
              <Ionicons
                name={isVoiceMuted ? "mic-off" : "mic"}
                size={18}
                color={isVoiceMuted ? "#64748B" : "#005B96"}
              />
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                if (continuousTranscript) {
                  sendMessage(continuousTranscript);
                }
                setIsVoiceModeActive(false);
                setIsVoiceMuted(false);
                setContinuousTranscript("");
              }}
              className="bg-[#005B96] px-5 py-2.5 rounded-full flex-row items-center"
            >
              <StyledText className="text-white text-xs font-bold">
                ••• End
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        backText="AI Conversation"
        rightText="Cancel"
        blueTheme={true}
        showDivider={true}
        headerVisible={headerVisible}
      />

      <KeyboardAvoidingViewWrapper
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        style={{ flex: 1 }}
      >
        <StyledScrollView
          ref={scrollViewRef}
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 10,
            paddingBottom: 20,
            paddingHorizontal: 24,
            flexGrow: 1,
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onScrollBeginDrag={() => {
            isDraggingRef.current = true;
          }}
          onScrollEndDrag={() => {
            isDraggingRef.current = false;
          }}
          onMomentumScrollBegin={() => {
            isDraggingRef.current = true;
          }}
          onMomentumScrollEnd={() => {
            isDraggingRef.current = false;
          }}
        >
          {messages.length === 0 && !conversationStarted ? (
            <StyledView className="my-8 items-center justify-center min-h-[140px]">
              <StyledText className="text-[#002B49] text-[22px] font-semibold text-center leading-8 px-4">
                Hi{" "}
                <StyledText className="text-[#3B82F6] font-bold">
                  Hasantanvir529
                </StyledText>
                , can you remind me, how can I help you {topic && TOPICS[topic] ? currentTopic.greetingPhrase : "today"}?
              </StyledText>
            </StyledView>
          ) : (
            <StyledView className="w-full space-y-4 my-4">
              {messages.map((msg) => (
                <StyledView key={msg.id} className="w-full flex-col mb-4">
                  <StyledView
                    className={`max-w-[80%] ${
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
                      <StyledText className="text-[#002B49] text-[15px] leading-5">
                        {msg.text}
                      </StyledText>
                    </StyledView>
                  </StyledView>
                </StyledView>
              ))}
            </StyledView>
          )}


          {!conversationStarted && (
            <StyledView className="w-full space-y-6 mt-6">
              <StyledView className="w-full bg-[#EBF3FC] border border-[#C5DFF8] rounded-[24px] p-5 shadow-xs">
              <StyledText className="text-[11px] font-extrabold uppercase tracking-wider text-[#3B82F6]">
                {currentTopic.title}
              </StyledText>
              <StyledText className="text-[#002B49] text-[15px] font-semibold mt-1.5 mb-3 leading-5">
                {currentTopic.description}
              </StyledText>

              <StyledView className="bg-white border border-[#CBD5E1] rounded-full px-4 py-1.5 self-center mb-4">
                <StyledText className="text-[#64748B] text-[10px] font-bold text-center uppercase tracking-wide">
                  This information is general information only.
                </StyledText>
              </StyledView>

              <StyledTouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  setResponse(currentTopic.startText);
                  setConversationStarted(true);
                  scrollViewRef.current?.scrollTo({ y: 0, animated: true });
                }}
                className="bg-[#005B96] py-3.5 rounded-full flex-row items-center justify-center shadow-xs mb-5"
              >
                <StyledText className="text-white text-xs font-bold mr-1">
                  Start with this topic
                </StyledText>
                <Ionicons name="arrow-forward" size={14} color="white" />
              </StyledTouchableOpacity>

              <StyledView className="space-y-2.5">
                {currentTopic.pathways.map((act, idx) => (
                  <StyledTouchableOpacity
                    key={idx}
                    activeOpacity={0.7}
                    className="bg-white rounded-[20px] p-4 border border-[#CBD5E1]/30 shadow-xs"
                  >
                    <StyledText className="text-[#002B49] text-[14px] font-bold">
                      {act.title}
                    </StyledText>
                    <StyledText className="text-[#64748B] text-[11px] font-semibold mt-1 leading-4">
                      {act.desc}
                    </StyledText>
                  </StyledTouchableOpacity>
                ))}
              </StyledView>
            </StyledView>

            <StyledView className="w-full bg-[#F4F9FD] border border-[#C5DFF8] rounded-[24px] p-5 shadow-xs">
              <StyledText className="text-[11px] font-extrabold uppercase tracking-wider text-[#3B82F6]">
                {currentTopic.legalTitle}
              </StyledText>
              <StyledText className="text-[#64748B] text-[11px] font-semibold mt-1 mb-4 leading-4">
                {currentTopic.legalDesc}
              </StyledText>

              <StyledView className="bg-white border border-[#CBD5E1] rounded-full px-4 py-1.5 self-center mb-4">
                <StyledText className="text-[#64748B] text-[10px] font-bold text-center uppercase tracking-wide">
                  Sources pending approval
                </StyledText>
              </StyledView>

              <StyledView className="mb-4">
                {currentTopic.nswPoints.map((pt, idx) => (
                  <StyledView key={idx} className="flex-row items-start mb-3 px-1">
                    <StyledView className="w-1.5 h-1.5 bg-[#82AEE8] rounded-full mt-1.5 mr-2.5 shrink-0" />
                    <StyledText className="flex-1 text-[#64748B] text-[12px] leading-5 font-semibold">
                      {pt}
                    </StyledText>
                  </StyledView>
                ))}
              </StyledView>

              <StyledView className="space-y-3">
                {currentTopic.nswPathways.map((path, idx) => (
                  <StyledView
                    key={idx}
                    className="bg-white rounded-[20px] p-4 border border-[#CBD5E1]/30 shadow-xs"
                  >
                    <StyledText className="text-[#002B49] text-[13px] font-bold">
                      {path.title}
                    </StyledText>
                    <StyledText className="text-[#64748B] text-[11px] leading-4 mt-1 font-semibold">
                      {path.desc}
                    </StyledText>
                    <StyledText className="text-[#94A3B8] text-[9px] font-extrabold uppercase tracking-wider mt-2.5">
                      {path.req}
                    </StyledText>
                  </StyledView>
                ))}
              </StyledView>
            </StyledView>
          </StyledView>
          )}
        </StyledScrollView>

        {/* Sticky Triage Button */}
        {showTriageButton && (
          <StyledView className="w-full bg-[#F0F4FA] items-center pt-2 pb-1">
            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => router.push("/home/report-submission")}
              className="bg-[#005B96] py-3.5 px-6 rounded-full flex-row items-center justify-center shadow-md"
            >
              <StyledText className="text-white text-xs font-bold mr-1.5">
                Continue to Triage
              </StyledText>
              <Ionicons name="arrow-forward" size={14} color="white" />
            </StyledTouchableOpacity>
          </StyledView>
        )}

        {/* Fixed bottom input and metadata capture area */}
        <StyledView className="w-full px-6 pb-3 pt-2 bg-[#F0F4FA] border-t border-[#E2E8F0]/30 shadow-xs">
          <StyledView className="w-full space-y-4">
            {isVoiceRecording ? (
              <StyledView className="w-full bg-white rounded-full flex-row items-center px-4 py-2 border border-[#E2E8F0] justify-between h-[48px]">
                <StyledText className="text-[#64748B] text-xs font-semibold">
                  Listening...
                </StyledText>

                <StyledView className="flex-1 flex-row justify-center items-center space-x-[2px] mx-2">
                  {barHeights.map((h, i) => (
                    <StyledView
                      key={i}
                      style={{ height: h }}
                      className="w-[2px] bg-[#3B82F6]/60 rounded-full"
                    />
                  ))}
                </StyledView>

                <StyledView className="flex-row items-center space-x-2">
                  <StyledTouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsVoiceRecording(false)}
                    className="w-8 h-8 rounded-full border border-[#CBD5E1] bg-white items-center justify-center"
                  >
                    <Ionicons name="close" size={16} color="#64748B" />
                  </StyledTouchableOpacity>

                  <StyledTouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleTranscribeConfirm}
                    className="w-8 h-8 rounded-full bg-[#005B96] items-center justify-center shadow-sm"
                  >
                    <Ionicons name="checkmark" size={16} color="white" />
                  </StyledTouchableOpacity>
                </StyledView>
              </StyledView>
            ) : (
              <StyledView className="w-full bg-white rounded-full flex-row items-center px-4 py-2 border border-[#E2E8F0] justify-between shadow-xs">
                <StyledTextInput
                  placeholder={t("typeResponse")}
                  value={response}
                  onChangeText={setResponse}
                  editable={true}
                  className="flex-1 text-[#1F2937] text-sm px-2 h-[40px]"
                  placeholderTextColor="#94A3B8"
                />
                
                <StyledView className="flex-row items-center">
                  <StyledTouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setIsVoiceRecording(true)}
                    className="p-2 mr-1"
                  >
                    <Ionicons name="mic-outline" size={20} color="#94A3B8" />
                  </StyledTouchableOpacity>

                  <StyledTouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      if (response.trim().length > 0) {
                        handleSendPress();
                      } else {
                        setIsVoiceModeActive(true);
                      }
                    }}
                    className="w-10 h-10 rounded-full items-center justify-center shadow-sm bg-[#005B96]"
                  >
                    {response.trim().length > 0 ? (
                      <Ionicons name="send" size={16} color="white" className="ml-[2px]" />
                    ) : (
                      <StyledView className="flex-row items-center justify-center space-x-[2px]">
                        <StyledView className="w-[3px] h-[8px] bg-white rounded-full" />
                        <StyledView className="w-[3px] h-[14px] bg-white rounded-full" />
                        <StyledView className="w-[3px] h-[8px] bg-white rounded-full" />
                      </StyledView>
                    )}
                  </StyledTouchableOpacity>
                </StyledView>
              </StyledView>
            )}

            {!conversationStarted && (
              <StyledView className="w-full bg-white rounded-[24px] flex-row items-center py-2 px-3.5 border border-[#E2E8F0]">
                <StyledView className="w-8 h-8 bg-[#EFF6FF] rounded-full items-center justify-center">
                  <Ionicons name="location" size={16} color="#3B82F6" />
                </StyledView>
                <StyledView className="flex-1 ml-3">
                  <StyledText className="text-[#002B49] text-xs font-bold">
                    {t("metadataCapture")}
                  </StyledText>
                  <StyledText className="text-[#94A3B8] text-[9px] font-bold uppercase tracking-wider">
                    {t("gpsIntelligence")}
                  </StyledText>
                </StyledView>
                <Switch
                  trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                  thumbColor={"#FFFFFF"}
                  ios_backgroundColor="#E2E8F0"
                  onValueChange={setMetadataEnabled}
                  value={metadataEnabled}
                  style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
                />
              </StyledView>
            )}
          </StyledView>
        </StyledView>
      </KeyboardAvoidingViewWrapper>
    </StyledView>
  );
}
