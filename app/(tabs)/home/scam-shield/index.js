import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";
import { useLanguage } from "../../../../context/LanguageContext";
import api from "../../../../context/api";
import { useScamShieldStore } from "../../../../store/useScamShieldStore";
import CustomAlert from "../../../../components/ui/CustomAlert";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);
const StyledImage = styled(Image);

const TABS = [
  { id: "paste", label: "Paste text" },
  { id: "url", label: "Check URL" },
  { id: "email", label: "Analyze email" },
  { id: "file", label: "File upload" },
];

const isImageFile = (file) => {
  if (file.mimeType && file.mimeType.startsWith("image/")) return true;
  if (file.name) {
    const ext = file.name.split(".").pop().toLowerCase();
    return ["png", "jpg", "jpeg", "webp", "gif"].includes(ext);
  }
  return false;
};

export default function AnalyzeMessage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { setAnalysis } = useScamShieldStore();
  const [activeTab, setActiveTab] = useState("paste");
  const [analyzing, setAnalyzing] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);

  // Form States
  const [pasteText, setPasteText] = useState("");
  const [urlText, setUrlText] = useState("");
  const [emailSender, setEmailSender] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailHeaders, setEmailHeaders] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [fileText, setFileText] = useState("");

  // Evidence files/images/documents
  const [images, setImages] = useState([]);
  const [isPicking, setIsPicking] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y <= 10) {
      setHeaderVisible(true);
    } else if (y > 50) {
      setHeaderVisible(false);
    }
  };

  const pickDocument = async () => {
    if (isPicking) return;
    setIsPicking(true);

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"], // Restricts file selection to images and PDFs only
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const validAssets = [];
        let hasInvalidFile = false;

        result.assets.forEach((asset) => {
          const mime = asset.mimeType || "";
          const name = asset.name || "";
          const ext = name.split(".").pop().toLowerCase();

          const isImg = mime.startsWith("image/") || ["png", "jpg", "jpeg", "webp", "gif"].includes(ext);
          const isPdf = mime === "application/pdf" || ext === "pdf";

          if (isImg || isPdf) {
            validAssets.push(asset);
          } else {
            hasInvalidFile = true;
          }
        });

        if (hasInvalidFile) {
          setShowWarningModal(true);
        }

        if (validAssets.length > 0) {
          const newFiles = validAssets.map((asset) => ({
            id: Date.now() + Math.random(),
            uri: asset.uri,
            name: asset.name,
            mimeType: asset.mimeType,
            size: asset.size,
          }));
          setImages([...images, ...newFiles]);
        }
      }
    } catch (err) {
      const errorMsg = err?.message || String(err);
      // Suppress activity unavailable warnings or double picking logs so they don't break the UX
      if (
        errorMsg.includes("activity is no longer available") ||
        errorMsg.includes("Different document picking in progress")
      ) {
        console.log("Document picking cancelled or context swapped: " + errorMsg);
      } else {
        console.warn("Document picking failed: ", err);
      }
    } finally {
      setIsPicking(false);
    }
  };

  const removeImage = (id) => {
    setImages(images.filter((img) => img.id !== id));
  };

  // Determine if there is enough content to analyze
  // NOTE: each tab only validates its OWN input — images don't count on other tabs
  const hasContent = () => {
    if (activeTab === "paste") return pasteText.trim().length > 0;
    if (activeTab === "url") return urlText.trim().length > 0;
    if (activeTab === "email")
      return (
        emailSender.trim().length > 0 ||
        emailSubject.trim().length > 0 ||
        emailHeaders.trim().length > 0 ||
        emailBody.trim().length > 0
      );
    if (activeTab === "file")
      return images.length > 0 || fileText.trim().length > 0;
    return false;
  };

  const handleAnalyze = async () => {
    if (analyzing || !hasContent()) return;
    setAnalyzing(true);

    try {
      // Grant process_with_ai consent before analysis
      await api.post("/consents/update", {
        flags: { process_with_ai: true },
        source: "mobile_scamshield_intake",
      });

      let response;

      if (activeTab === "paste") {
        response = await api.post("/scamshield/analyze-text", {
          text: pasteText,
          language: "en",
        });
      } else if (activeTab === "url") {
        response = await api.post("/scamshield/check-url", {
          url: urlText,
        });
      } else if (activeTab === "email") {
        response = await api.post("/scamshield/analyze-email", {
          body: emailBody,
          subject: emailSubject,
          from: emailSender,
          headers: emailHeaders ? { raw: emailHeaders } : undefined,
        });
      } else if (activeTab === "file") {
        if (images.length > 0) {
          const formData = new FormData();
          images.forEach((img) => {
            formData.append("files", {
              uri: Platform.OS === "android" ? img.uri : img.uri.replace("file://", ""),
              name: img.name || "evidence.jpg",
              type: img.mimeType || "image/jpeg",
            });
          });
          if (fileText) formData.append("imageText", fileText);
          response = await api.post("/scamshield/analyze-screenshot", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          response = await api.post("/scamshield/analyze-screenshot", {
            imageText: fileText,
          });
        }
      }

      // Backend wraps response as { success, message, data: { analysis } }
      // Axios stores the HTTP body in response.data, so the path is response.data.data.analysis
      const analysis = response?.data?.data?.analysis;
      if (analysis) {
        setAnalysis(analysis);
      } else {
        console.warn("[ScamShield] No analysis in response:", JSON.stringify(response?.data));
      }

      router.push("/home/scam-shield/results");
    } catch (err) {
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        "Could not complete scam risk analysis. Please try again.";
      Alert.alert("Analysis Failed", msg);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText="Analyze Message"
        showCancel={true}
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Main Context Card */}
        <StyledView className="bg-white rounded-[24px] p-5 shadow-sm mb-4 border border-[#E2E8F0]">
          <StyledText className="text-[#005B96] text-xs font-bold uppercase tracking-wider mb-1">
            CYBER SCAM CONTEXT
          </StyledText>
          <StyledText className="text-[#64748B] text-xs leading-5 mb-4">
            Paste suspicious text, upload a screenshot, or continue to the next step to review scam risk indicators.
          </StyledText>

          {/* Wrapped Tabs list */}
          <StyledView className="flex-row flex-wrap mb-4">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <StyledTouchableOpacity
                  key={tab.id}
                  onPress={() => setActiveTab(tab.id)}
                  activeOpacity={0.8}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                    isActive ? "bg-[#005B96]" : "bg-[#F1F5F9]"
                  }`}
                >
                  <StyledText
                    className={`text-xs font-semibold ${
                      isActive ? "text-white" : "text-[#475569]"
                    }`}
                  >
                    {tab.label}
                  </StyledText>
                </StyledTouchableOpacity>
              );
            })}
          </StyledView>

          {/* Form Content Area */}
          <StyledText className="text-[#64748B] text-[10px] font-bold uppercase tracking-widest mb-2">
            {activeTab === "file" ? "VISIBLE TEXT OR FILE TEXT CORRECTION" : "MESSAGE CONTENT"}
          </StyledText>

          {/* Render inputs based on Tab */}
          {activeTab === "paste" && (
            <StyledView className="relative border border-[#E2E8F0] rounded-xl p-3 bg-[#F8FAFC]">
              <StyledTextInput
                multiline
                numberOfLines={6}
                value={pasteText}
                onChangeText={setPasteText}
                placeholder="Paste SMS, Email, or Web link text here..."
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
                className="text-[#334155] text-sm leading-5 min-h-[160px] pb-8"
              />
              <StyledView className="absolute bottom-3 right-3 flex-row space-x-2">
                <StyledTouchableOpacity onPress={pickDocument}>
                  <Ionicons name="folder-outline" size={18} color="#94A3B8" />
                </StyledTouchableOpacity>
                <StyledTouchableOpacity onPress={() => Alert.alert("History", "No history found.")}>
                  <Ionicons name="time-outline" size={18} color="#94A3B8" />
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          )}

          {activeTab === "url" && (
            <StyledView className="relative border border-[#E2E8F0] rounded-xl p-3 bg-[#F8FAFC]">
              <StyledTextInput
                multiline
                numberOfLines={4}
                value={urlText}
                onChangeText={setUrlText}
                placeholder="https://example.com/suspicious-link"
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
                className="text-[#334155] text-sm leading-5 min-h-[100px] pb-8"
              />
              <StyledView className="absolute bottom-3 right-3 flex-row space-x-2">
                <StyledTouchableOpacity onPress={pickDocument}>
                  <Ionicons name="folder-outline" size={18} color="#94A3B8" />
                </StyledTouchableOpacity>
                <StyledTouchableOpacity onPress={() => Alert.alert("History", "No history found.")}>
                  <Ionicons name="time-outline" size={18} color="#94A3B8" />
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          )}

          {activeTab === "email" && (
            <StyledView className="space-y-3">
              <StyledTextInput
                value={emailSender}
                onChangeText={setEmailSender}
                placeholder="Visible sender, for example alerts@bank.example"
                placeholderTextColor="#94A3B8"
                className="border border-[#E2E8F0] rounded-xl p-3 bg-[#F8FAFC] text-[#334155] text-sm"
              />
              <StyledTextInput
                value={emailSubject}
                onChangeText={setEmailSubject}
                placeholder="Email subject"
                placeholderTextColor="#94A3B8"
                className="border border-[#E2E8F0] rounded-xl p-3 bg-[#F8FAFC] text-[#334155] text-sm"
              />
              <StyledTextInput
                multiline
                numberOfLines={3}
                value={emailHeaders}
                onChangeText={setEmailHeaders}
                placeholder="Optional: paste Authentication-Results, Reply-To, Return-Path, or forwarded header lines you have permission to share."
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
                className="border border-[#E2E8F0] rounded-xl p-3 bg-[#F8FAFC] text-[#334155] text-sm min-h-[80px]"
              />
              <StyledView className="relative border border-[#E2E8F0] rounded-xl p-3 bg-[#F8FAFC]">
                <StyledTextInput
                  multiline
                  numberOfLines={4}
                  value={emailBody}
                  onChangeText={setEmailBody}
                  placeholder="Paste the email body and any sender details you want checked."
                  placeholderTextColor="#94A3B8"
                  textAlignVertical="top"
                  className="text-[#334155] text-sm leading-5 min-h-[100px] pb-8"
                />
                <StyledView className="absolute bottom-3 right-3 flex-row space-x-2">
                  <StyledTouchableOpacity onPress={pickDocument}>
                    <Ionicons name="folder-outline" size={18} color="#94A3B8" />
                  </StyledTouchableOpacity>
                  <StyledTouchableOpacity onPress={() => Alert.alert("History", "No history found.")}>
                    <Ionicons name="time-outline" size={18} color="#94A3B8" />
                  </StyledTouchableOpacity>
                </StyledView>
              </StyledView>
            </StyledView>
          )}

          {activeTab === "file" && (
            <StyledView className="relative border border-[#E2E8F0] rounded-xl p-3 bg-[#F8FAFC]">
              <StyledTextInput
                multiline
                numberOfLines={6}
                value={fileText}
                onChangeText={setFileText}
                placeholder="Optional: paste visible text if OCR or document extraction misses anything."
                placeholderTextColor="#94A3B8"
                textAlignVertical="top"
                className="text-[#334155] text-sm leading-5 min-h-[160px] pb-8"
              />
              <StyledView className="absolute bottom-3 right-3 flex-row space-x-2">
                <StyledTouchableOpacity onPress={pickDocument}>
                  <Ionicons name="folder-outline" size={18} color="#94A3B8" />
                </StyledTouchableOpacity>
                <StyledTouchableOpacity onPress={() => Alert.alert("History", "No history found.")}>
                  <Ionicons name="time-outline" size={18} color="#94A3B8" />
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          )}
        </StyledView>


        {activeTab === "file" && (
          <>
            {/* Upload Evidence Card */}
            <StyledView className="bg-white rounded-[24px] p-6 items-center shadow-sm mb-4 border border-[#E2E8F0]">
              <StyledView className="w-12 h-12 bg-[#EFF6FF] rounded-full items-center justify-center mb-3">
                <Ionicons name="image-outline" size={24} color="#005B96" />
              </StyledView>
              <StyledText className="text-[#1E293B] text-base font-bold mb-1">
                Upload Evidence
              </StyledText>
              <StyledText className="text-[#64748B] text-xs text-center px-4 mb-4 leading-5">
                Click to browse images, screenshots, PDFs, or Word documents.
              </StyledText>
              <StyledTouchableOpacity
                activeOpacity={0.8}
                onPress={pickDocument}
                className="bg-[#005B96] rounded-full px-6 py-3 flex-row items-center justify-center shadow-sm"
              >
                <Ionicons name="folder-open" size={18} color="white" />
                <StyledText className="text-white text-sm font-bold ml-2">
                  Select Files
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>

            {/* Attached Evidence Card */}
            <StyledView className="bg-white rounded-[24px] p-5 shadow-sm mb-6 border border-[#E2E8F0]">
              <StyledText className="text-[#64748B] text-[10px] font-bold uppercase tracking-widest mb-3">
                ATTACHED EVIDENCE
              </StyledText>
              <StyledView className="flex-row flex-wrap items-center">
                {images.map((img) => (
                  <StyledView key={img.id} className="relative mr-3 mb-3">
                    {isImageFile(img) ? (
                      <StyledImage
                        source={{ uri: img.uri }}
                        className="w-20 h-16 rounded-xl border border-[#E2E8F0]"
                        resizeMode="cover"
                      />
                    ) : (
                      <StyledView className="w-20 h-16 rounded-xl border border-[#E2E8F0] bg-[#F1F5F9] items-center justify-center p-1">
                        <Ionicons name="document-text" size={24} color="#005B96" />
                        <StyledText numberOfLines={1} className="text-[8px] text-[#475569] mt-0.5 text-center font-bold px-1">
                          {img.name || "Document"}
                        </StyledText>
                      </StyledView>
                    )}
                    <StyledTouchableOpacity
                      onPress={() => removeImage(img.id)}
                      className="absolute -top-1.5 -right-1.5 bg-[#EF4444] w-5 h-5 rounded-full items-center justify-center border-2 border-white z-10"
                    >
                      <Ionicons name="close" size={12} color="white" />
                    </StyledTouchableOpacity>
                  </StyledView>
                ))}

                {/* Dash Box to Add More */}
                <StyledTouchableOpacity
                  activeOpacity={0.7}
                  onPress={pickDocument}
                  className="w-20 h-16 rounded-xl border border-dashed border-[#CBD5E1] items-center justify-center bg-[#F8FAFC]"
                >
                  <Ionicons name="add" size={20} color="#94A3B8" />
                  <StyledText className="text-[10px] text-[#94A3B8] font-bold">
                    Add More
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledView>
            </StyledView>
          </>
        )}


        {/* Analyze actions */}
        <StyledText className="text-[#94A3B8] text-xs text-center mb-3">
          Add text or evidence files to start analysis
        </StyledText>

        <StyledTouchableOpacity
          activeOpacity={0.8}
          disabled={!hasContent() || analyzing}
          onPress={handleAnalyze}
          className={`rounded-full py-4 items-center justify-center flex-row shadow-sm ${
            hasContent() && !analyzing ? "bg-[#FB923C]" : "bg-[#FED7AA]"
          }`}
        >
          {analyzing ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="shield-checkmark" size={20} color="white" />
          )}
          <StyledText className="text-white text-base font-bold uppercase tracking-wider ml-2">
            {analyzing ? "ANALYZING..." : "ANALYZE NOW"}
          </StyledText>
        </StyledTouchableOpacity>
      </StyledScrollView>

      {/* Custom Warning Card Modal */}
      <CustomAlert
        visible={showWarningModal}
        onClose={() => setShowWarningModal(false)}
      />
    </StyledView>
  );
}
