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
  ActivityIndicator,
  Alert,
  NativeModules,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Audio } from "expo-av";
import CustomHeader from "../../../../components/CustomHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLanguage } from "../../../../context/LanguageContext";
import api from "../../../../context/api";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import * as FileSystem from "expo-file-system/legacy";

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

const TypingIndicator = () => {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === ".") return "..";
        if (prev === "..") return "...";
        return ".";
      });
    }, 450);
    return () => clearInterval(interval);
  }, []);
  return <StyledText className="text-[#002B49] text-base font-bold">{dots}</StyledText>;
};

export default function VoiceAssistant() {
  const router = useRouter();
  const { topic, voice } = useLocalSearchParams();
  const { t, language } = useLanguage();
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
  const activeSoundRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const recordingRef = useRef(null);
  const liveFinalTranscriptRef = useRef("");
  const [isLocalSpeechAvailable, setIsLocalSpeechAvailable] = useState(false);

  const isVoiceModeActiveRef = useRef(false);
  const isVoiceMutedRef = useRef(false);

  const [conversationSessionId, setConversationSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [continuousTranscript, setContinuousTranscript] = useState("");

  // voiceState: null | 'listening' | 'generating' | 'speaking'
  const [voiceState, setVoiceState] = useState(null);
  
  // Messages log
  const [messages, setMessages] = useState([]);

  // Dynamic sound wave visualizer bars
  const [barHeights, setBarHeights] = useState([12, 18, 8, 24, 14, 18, 10, 22, 16, 26, 12, 18, 8, 20]);



  // Handle auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  // Check speech recognition service availability on mount
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const isAvail = await ExpoSpeechRecognitionModule.isRecognitionAvailable();
        setIsLocalSpeechAvailable(isAvail);
        console.log("[VoiceAssistant] Local Speech Recognition service available:", isAvail);
      } catch (err) {
        setIsLocalSpeechAvailable(false);
      }
    };
    checkAvailability();
  }, []);

  // Sync state to refs for sound callback scoping
  useEffect(() => {
    isVoiceModeActiveRef.current = isVoiceModeActive;
  }, [isVoiceModeActive]);

  useEffect(() => {
    isVoiceMutedRef.current = isVoiceMuted;
  }, [isVoiceMuted]);

  // Auto-activate voice mode on mount if voice=1 is passed
  useEffect(() => {
    if (voice === "1") {
      setIsVoiceModeActive(true);
      startRecording();
    }
  }, [voice]);

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

  // Set up expo-speech-recognition listeners
  useSpeechRecognitionEvent("start", () => {
    console.log("[VoiceAssistant] Speech recognition started");
  });

  useSpeechRecognitionEvent("end", () => {
    console.log("[VoiceAssistant] Speech recognition ended");
  });

  useSpeechRecognitionEvent("result", (event) => {
    let finalChunk = "";
    let interimChunk = "";

    // Iterate through all incoming speech segments to construct the preview
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      const transcript = result?.transcript?.trim();

      if (!transcript) {
        continue;
      }

      if (result.isFinal) {
        finalChunk = `${finalChunk} ${transcript}`.trim();
      } else {
        interimChunk = `${interimChunk} ${transcript}`.trim();
      }
    }

    if (finalChunk) {
      liveFinalTranscriptRef.current = `${liveFinalTranscriptRef.current} ${finalChunk}`.trim();
    }

    const fullPreviewText = [liveFinalTranscriptRef.current, interimChunk].filter(Boolean).join(" ");
    
    if (fullPreviewText && fullPreviewText.trim().length > 0) {
      setContinuousTranscript(fullPreviewText);

      // Reset silence timeout on speech results to detect when user stops speaking
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = setTimeout(() => {
        console.log("[VoiceAssistant] Silence detected, automatically stopping recording");
        stopRecording();
      }, 1800);
    }
  });

  useSpeechRecognitionEvent("error", (event) => {
    console.warn("[VoiceAssistant] Speech recognition error:", event.error);
  });

  // Clean up silence timer and speech on unmount
  useEffect(() => {
    return () => {
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      if (ExpoSpeechRecognitionModule && typeof ExpoSpeechRecognitionModule.destroy === "function") {
        ExpoSpeechRecognitionModule.destroy();
      }
    };
  }, []);

  // Clean up sounds on unmount
  useEffect(() => {
    return () => {
      if (activeSoundRef.current) {
        activeSoundRef.current.unloadAsync().catch(() => {});
      }
    };
  }, []);

  // Voice speech recording and recognition triggers
  const startRecording = async () => {
    try {
      // 1. Request microphone permission
      const recPermission = await Audio.requestPermissionsAsync();
      if (recPermission.status !== "granted") {
        Alert.alert("Permission Required", "Microphone access is needed to use voice chat.");
        return;
      }

      // Check recognition availability dynamically after mic access is verified
      let isAvail = false;
      try {
        isAvail = ExpoSpeechRecognitionModule.isRecognitionAvailable();
      } catch (availErr) {
        isAvail = false;
      }
      setIsLocalSpeechAvailable(isAvail);

      // If local speech recognition is available, request its permissions too
      if (isAvail) {
        await ExpoSpeechRecognitionModule.requestPermissionsAsync().catch(() => {});
      }

      // Stop any playing sound
      if (activeSoundRef.current) {
        await activeSoundRef.current.stopAsync().catch(() => {});
        await activeSoundRef.current.unloadAsync().catch(() => {});
        activeSoundRef.current = null;
      }

      // Ensure clean recording audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldRouteThroughEarpieceIOS: false,
      });

      // Stop and clear any existing recording
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync().catch(() => {});
        recordingRef.current = null;
      }

      // 2. Start hardware audio recording (Always recorded for backend transcription)
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;

      setIsVoiceRecording(true);
      setVoiceState("listening");
      setContinuousTranscript("");
      liveFinalTranscriptRef.current = "";

      // 3. Start local speech recognition if available (Used only for live preview and silence detection)
      if (isAvail) {
        try {
          const speechLang = language === "bn" ? "bn-BD" : language === "es" ? "es-ES" : "en-US";
          await ExpoSpeechRecognitionModule.start({
            lang: speechLang,
            interimResults: true,
            continuous: true,
          });
        } catch (voiceErr) {
          console.warn("[VoiceAssistant] Failed to start native speech preview:", voiceErr);
        }
      } else {
        // Fallback: Simulate speech indicator movement on emulator/offline device
        if (isVoiceModeActive) {
          let index = 0;
          const simulatedWords = ["Listening", "for", "your", "voice", "input..."];
          const previewInterval = setInterval(() => {
            if (recordingRef.current) {
              setContinuousTranscript((prev) => {
                const nextWord = simulatedWords[index] || "";
                index++;
                return prev ? `${prev} ${nextWord}` : nextWord;
              });
            } else {
              clearInterval(previewInterval);
            }
          }, 1200);
        }
      }

      // 4. Maximum recording safety timeout (e.g. 10 seconds)
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      silenceTimeoutRef.current = setTimeout(() => {
        console.log("[VoiceAssistant] Maximum recording duration reached, stopping");
        stopRecording();
      }, 10000);

    } catch (err) {
      console.warn("Failed to start speech recording:", err);
      recordingRef.current = null;
      setIsVoiceRecording(false);
      setVoiceState(null);
      Alert.alert("Speech Error", "Could not access microphone. Try reloading the app.");
    }
  };

  const stopRecording = async (shouldCancel = false) => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    setIsVoiceRecording(false);

    try {
      // Stop native local recognition if running
      if (isLocalSpeechAvailable) {
        await ExpoSpeechRecognitionModule.stop().catch(() => {});
      }

      // Stop hardware audio recording
      if (!recordingRef.current) {
        setVoiceState(null);
        return;
      }
      const currentRecording = recordingRef.current;
      recordingRef.current = null; // reset reference immediately to avoid duplicate stop calls

      await currentRecording.stopAndUnloadAsync().catch(() => {});
      const uri = currentRecording.getURI();

      // Reset audio mode to playback-friendly mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldRouteThroughEarpieceIOS: false,
      }).catch(() => {});

      if (shouldCancel || !uri) {
        setVoiceState(null);
        return;
      }

      setVoiceState("generating");
      await handleAudioTranscribe(uri);
    } catch (err) {
      console.warn("Failed to stop speech recording:", err);
      setVoiceState(null);
    }
  };

  const handleAudioTranscribe = async (fileUri) => {
    setIsLoading(true);
    setVoiceState("generating");
    try {
      const formData = new FormData();
      formData.append("audio", {
        uri: Platform.OS === "android" ? fileUri : fileUri.replace("file://", ""),
        name: `audio_${Date.now()}.m4a`,
        type: "audio/m4a",
      });
      formData.append("saveTranscript", "false");
      if (language) {
        formData.append("language", language === "bn" ? "bn" : language === "es" ? "es" : "en");
      }

      const res = await api.post("/ai/transcribe-audio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const transcriptText = res.data?.data?.transcript || res.data?.transcript;
      if (transcriptText && transcriptText.trim().length > 0) {
        setContinuousTranscript(transcriptText);
        if (isVoiceModeActiveRef.current) {
          sendMessage(transcriptText);
        } else {
          setResponse(transcriptText);
          setVoiceState(null);
        }
      } else {
        setVoiceState(null);
        Alert.alert("Transcription Empty", "No speech detected in audio.");
      }
    } catch (err) {
      console.warn("Failed to transcribe audio:", err);
      setVoiceState(null);
      Alert.alert("Transcription Error", "Could not transcribe audio. Please try typing your message.");
    } finally {
      setIsLoading(false);
    }
  };

  const playSynthesizedVoice = async (text) => {
    setVoiceState("speaking");
    let tempUri = null;
    try {
      const res = await api.post("/ai/synthesize-speech", {
        text,
        language: language || "en",
      });
      const audioBase64 = res.data?.data?.audioBase64 || res.data?.audioBase64;
      if (audioBase64) {
        // Write base64 audio to a temporary file to guarantee Android MediaPlayer compatibility
        tempUri = `${FileSystem.cacheDirectory}speech_${Date.now()}.mp3`;
        await FileSystem.writeAsStringAsync(tempUri, audioBase64, {
          encoding: "base64",
        });

        const { sound } = await Audio.Sound.createAsync(
          { uri: tempUri },
          { shouldPlay: true }
        );
        activeSoundRef.current = sound;

        // Listen for playback finished to restart the listening loop
        sound.setOnPlaybackStatusUpdate(async (status) => {
          if (status.didJustFinish) {
            await sound.unloadAsync().catch(() => {});
            activeSoundRef.current = null;
            setVoiceState(null);
            
            // Delete temp audio file to free up cache
            if (tempUri) {
              await FileSystem.deleteAsync(tempUri, { idempotent: true }).catch(() => {});
            }

            // Loop back to start recording if voice mode is still active and not muted
            if (isVoiceModeActiveRef.current && !isVoiceMutedRef.current) {
              startRecording();
            }
          }
        });
      } else {
        setVoiceState(null);
        if (isVoiceModeActiveRef.current && !isVoiceMutedRef.current) startRecording();
      }
    } catch (err) {
      console.warn("Failed to synthesize speech:", err);
      setVoiceState(null);
      if (tempUri) {
        await FileSystem.deleteAsync(tempUri, { idempotent: true }).catch(() => {});
      }
      if (isVoiceModeActiveRef.current && !isVoiceMutedRef.current) startRecording();
    }
  };

  const stopSpeaking = async () => {
    if (activeSoundRef.current) {
      await activeSoundRef.current.stopAsync().catch(() => {});
      await activeSoundRef.current.unloadAsync().catch(() => {});
      activeSoundRef.current = null;
    }
    setVoiceState(null);
    if (isVoiceModeActiveRef.current && !isVoiceMutedRef.current) {
      startRecording();
    }
  };

  // Helper to send a message using real APIs
  const sendMessage = async (textVal) => {
    if (!textVal || textVal.trim().length === 0) return;

    setConversationStarted(true);
    setIsLoading(true);

    // Append user message locally
    const userMsg = {
      id: Date.now(),
      type: "user",
      text: textVal,
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      let currentSessionId = conversationSessionId;

      // 1. Initialize session if not exists
      if (!currentSessionId) {
        const sessionRes = await api.post("/conversation-flow/sessions", {
          selectedTopic: topic || currentTopicKey,
        });
        const session = sessionRes.data?.data?.session || sessionRes.data?.session;
        if (session && session.id) {
          currentSessionId = session.id;
          setConversationSessionId(session.id);
        } else if (session && session._id) {
          currentSessionId = session._id;
          setConversationSessionId(session._id);
        }
      }

      // 2. Send message
      if (currentSessionId) {
        if (isVoiceModeActiveRef.current) {
          setVoiceState("generating");
        }
        const messageRes = await api.post(
          `/conversation-flow/sessions/${currentSessionId}/messages`,
          {
            content: textVal,
            language: "en",
          }
        );
        
        const turnData = messageRes.data?.data || messageRes.data;
        const aiResponseText = turnData?.assistantMessage?.content;
 
        if (aiResponseText) {
          const aiMsg = {
            id: Date.now() + 1,
            type: "ai",
            text: aiResponseText,
          };
          setMessages((prev) => [...prev, aiMsg]);
 
          // Play voice synthesis if voice mode is enabled
          if (isVoiceModeActiveRef.current && !isVoiceMutedRef.current) {
            playSynthesizedVoice(aiResponseText);
          } else {
            setVoiceState(null);
          }

          // Check for triage transition
          if (turnData?.transition?.offerTriage) {
            setShowTriageButton(true);
          }
        }
      }
    } catch (err) {
      console.warn("AI Assistant message failed:", err);
      const aiErrorMsg = {
        id: Date.now() + 1,
        type: "ai",
        text: "Sorry, I am having trouble connecting to the SafeSpeak server. Please try again.",
      };
      setMessages((prev) => [...prev, aiErrorMsg]);
      setVoiceState(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (event) => {
    if (!isDraggingRef.current) return;
    const currentOffsetY = event.nativeEvent.contentOffset.y;
    if (currentOffsetY <= 10) {
      setHeaderVisible(true);
    } else if (currentOffsetY > 50) {
      setHeaderVisible(false);
    }
  };

  const handleSendPress = () => {
    sendMessage(response);
    setResponse("");
  };

  const handleTranscribeConfirm = () => {
    stopRecording();
  };

  // Toggle full voice mode
  const toggleVoiceMode = async () => {
    if (!isVoiceModeActive) {
      setIsVoiceModeActive(true);
      // Automatically start recording when voice mode opens
      startRecording();
    } else {
      setIsVoiceModeActive(false);
      setIsVoiceMuted(false);
      setContinuousTranscript("");
      setVoiceState(null);
      if (recordingRef.current) {
        stopRecording(true);
      }
      if (activeSoundRef.current) {
        await activeSoundRef.current.stopAsync().catch(() => {});
        await activeSoundRef.current.unloadAsync().catch(() => {});
        activeSoundRef.current = null;
      }
    }
  };

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

              {isVoiceModeActive && (
                <StyledView className="w-full space-y-4">
                  {voiceState === "listening" && (
                    <StyledView className="self-start max-w-[80%] mb-4">
                      <StyledView 
                        className="bg-white border border-[#D0E2FF] p-4 rounded-[24px]"
                        style={{ borderTopLeftRadius: 4 }}
                      >
                        <StyledView className="flex-col">
                          {continuousTranscript ? (
                            <StyledText className="text-[#002B49] text-[15px] mb-2 font-medium">
                              "{continuousTranscript}"
                            </StyledText>
                          ) : null}
                          <StyledView className="flex-row items-center mt-1">
                            <Ionicons name={isVoiceMuted ? "mic-off" : "mic"} size={14} color={isVoiceMuted ? "#64748B" : "#005B96"} style={{ marginRight: 6 }} />
                            <StyledText className="text-[#64748B] text-[13px] font-semibold">
                              {isVoiceMuted ? "Muted" : "Listening..."}
                            </StyledText>
                          </StyledView>
                        </StyledView>
                      </StyledView>
                    </StyledView>
                  )}

                  {voiceState === "generating" && (
                    <StyledView className="self-start max-w-[80%] mb-4">
                      <StyledView 
                        className="bg-white border border-[#FFE0B2] p-4 rounded-[24px]"
                        style={{ borderTopLeftRadius: 4 }}
                      >
                        <StyledView className="flex-row items-center">
                          <ActivityIndicator size="small" color="#E65100" style={{ marginRight: 8 }} />
                          <StyledText className="text-[#E65100] text-[15px] font-semibold">
                            Transcribing...
                          </StyledText>
                        </StyledView>
                      </StyledView>
                    </StyledView>
                  )}

                  {voiceState === "speaking" && (
                    <StyledView className="self-start max-w-[80%] mb-4">
                      <StyledView 
                        className="bg-white border border-[#C8E6C9] p-4 rounded-[24px]"
                        style={{ borderTopLeftRadius: 4 }}
                      >
                        <StyledView className="flex-row items-center flex-wrap">
                          <Ionicons name="volume-medium" size={16} color="#2E7D32" style={{ marginRight: 8 }} />
                          <StyledText className="text-[#2E7D32] text-[15px] font-semibold mr-3">
                            Speaking response...
                          </StyledText>
                          <TouchableOpacity onPress={stopSpeaking} className="bg-[#E8F5E9] px-2.5 py-1 rounded-full border border-[#C8E6C9]">
                            <StyledText className="text-[#2E7D32] text-xs font-bold">
                              Stop voice
                            </StyledText>
                          </TouchableOpacity>
                        </StyledView>
                      </StyledView>
                    </StyledView>
                  )}
                </StyledView>
              )}
            </StyledView>
          )}

          {isLoading && conversationStarted && (
            <StyledView className="self-start max-w-[80%] mb-4 ml-6">
              <StyledView 
                className="bg-white/60 border border-white p-3.5 rounded-[24px] px-5"
                style={{ borderTopLeftRadius: 4 }}
              >
                <TypingIndicator />
              </StyledView>
            </StyledView>
          )}

          {!conversationStarted && topic && (
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
                    setConversationStarted(true);
                    sendMessage(currentTopic.startText);
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

        {/* Inline Voice Sphere */}
        {isVoiceModeActive && (
          <StyledView className="w-full items-center justify-center pt-1 pb-2 bg-[#F0F4FA]">
            <Image
              source={Sphere}
              style={{ width: 64, height: 64, opacity: isVoiceMuted ? 0.75 : 1 }}
              resizeMode="contain"
            />
          </StyledView>
        )}

        {/* Fixed bottom input and metadata capture area */}
        <StyledView className="w-full px-6 pb-3 pt-2 bg-[#F0F4FA] border-t border-[#E2E8F0]/30 shadow-xs">
          <StyledView className="w-full space-y-4">
            {isVoiceRecording && !isVoiceModeActive ? (
              <StyledView className="w-full flex-col">
                {continuousTranscript ? (
                  <StyledView className="bg-white border border-[#E2E8F0] p-3 rounded-[18px] mb-2 shadow-xs px-4">
                    <StyledText className="text-[#002B49] text-[14px] font-medium leading-5">
                      "{continuousTranscript}"
                    </StyledText>
                  </StyledView>
                ) : null}
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
                      onPress={() => stopRecording(true)}
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
              </StyledView>
            ) : (
              <StyledView className="w-full bg-white rounded-full flex-row items-center px-4 py-2 border border-[#E2E8F0] justify-between h-[54px] shadow-xs">
                <StyledTextInput
                  placeholder="Type your response."
                  value={response}
                  onChangeText={setResponse}
                  editable={!isVoiceModeActive}
                  className="flex-1 text-[#1F2937] text-sm px-2 font-medium h-[40px]"
                  placeholderTextColor="#94A3B8"
                />
                
                <StyledView className="flex-row items-center">
                  {!isVoiceModeActive && (
                    <StyledTouchableOpacity
                      activeOpacity={0.7}
                      onPress={startRecording}
                      className="p-2 mr-1"
                    >
                      <Ionicons name="mic-outline" size={20} color="#94A3B8" />
                    </StyledTouchableOpacity>
                  )}

                  <StyledTouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      if (response.trim().length > 0) {
                        handleSendPress();
                      } else {
                        toggleVoiceMode();
                      }
                    }}
                    className={`rounded-full items-center justify-center shadow-sm bg-[#005B96] ${
                      isVoiceModeActive ? "px-5 py-2.5 h-[38px] flex-row" : "w-10 h-10"
                    }`}
                  >
                    {response.trim().length > 0 ? (
                      <Ionicons name="send" size={16} color="white" className="ml-[2px]" />
                    ) : isVoiceModeActive ? (
                      <StyledText className="text-white text-xs font-bold">
                        ••• End
                      </StyledText>
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

            {!conversationStarted && !isVoiceModeActive && (
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
