import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Switch, Linking, Alert, ActivityIndicator } from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useLanguage } from "../../../context/LanguageContext";
import SafeSpeakScreen from "../../../components/SafeSpeakScreen";
import api from "../../../context/api";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function ServiceDetails() {
  const router = useRouter();
  const { serviceId } = useLocalSearchParams();
  const { t } = useLanguage();

  const [includeSummary, setIncludeSummary] = useState(true);
  const [isResourcesOpen, setIsResourcesOpen] = useState(true);
  const [isReferralPreviewExpanded, setIsReferralPreviewExpanded] = useState(false);
  const [showReferralPrepared, setShowReferralPrepared] = useState(false);
  const [showConsentRequired, setShowConsentRequired] = useState(false);

  // API states
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadServiceDetails = async () => {
    if (!serviceId) {
      setLoading(false);
      setError("No support service was specified.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.get(`/support/services/${serviceId}`);
      const fetched = res.data?.data?.service || res.data?.service || res.data;
      setService(fetched);
    } catch (err) {
      console.warn("Failed to load support service details:", err);
      setError("Could not load support service details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServiceDetails();
  }, [serviceId]);

  const handleSendReferral = async () => {
    if (!isReferralPreviewExpanded) {
      setIsReferralPreviewExpanded(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const consentRes = await api.get("/consents/current");
      const consents = consentRes.data?.data?.consent || consentRes.data?.consent || {};

      if (!consents.warm_referral) {
        setShowConsentRequired(true);
        return;
      }

      await submitReferral();
    } catch (err) {
      console.warn("Failed consent check:", err);
      Alert.alert("Error", "Could not check consent status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAllowConsent = async () => {
    try {
      setIsSubmitting(true);
      await api.post("/consents/update", {
        flags: { warm_referral: true },
        source: "support_warm_referral",
      });
      setShowConsentRequired(false);
      await submitReferral();
    } catch (err) {
      console.warn("Failed to update consent:", err);
      Alert.alert("Error", "Could not update consent settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineConsent = () => {
    setShowConsentRequired(false);
    setIsReferralPreviewExpanded(false);
    Alert.alert("Referral Cancelled", "Service discovery remains available and no warm referral was created.");
  };

  const submitReferral = async () => {
    try {
      setIsSubmitting(true);
      const payload = {
        serviceId: service.id || service._id,
        contactPreference: "in_app",
        safeContact: "hasantanvir529@gmail.com",
        notes: "Referral created via SafeSpeak mobile app.",
        minimalSummary: {
          incidentSummary: includeSummary ? "Concise incident summary based on recent report." : undefined,
          interpreterPreference: "English",
          preferredContactMethod: "in_app",
        },
        shareProfileContext: false,
      };

      await api.post("/support/warm-referral", payload);
      setShowReferralPrepared(true);
      Alert.alert("Success", "Warm referral intake handoff is prepared.");
    } catch (err) {
      console.warn("Failed to create warm referral:", err);
      Alert.alert("Error", err.response?.data?.message || "Could not submit warm referral.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeSpeakScreen
        backText="Service Details"
        rightText="Cancel"
        onRightPress={() => router.back()}
        contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#005B96" />
      </SafeSpeakScreen>
    );
  }

  if (error || !service) {
    return (
      <SafeSpeakScreen
        backText="Service Details"
        rightText="Cancel"
        onRightPress={() => router.back()}
        contentContainerStyle={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 24 }}
      >
        <Ionicons name="alert-circle-outline" size={48} color="#B45353" />
        <StyledText className="text-[#B45353] text-sm text-center mt-3 font-semibold">
          {error || "Support service could not be found."}
        </StyledText>
        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={loadServiceDetails}
          className="bg-[#005B96] px-6 py-2.5 rounded-full mt-5"
        >
          <StyledText className="text-white text-xs font-bold">Retry</StyledText>
        </StyledTouchableOpacity>
      </SafeSpeakScreen>
    );
  }

  // Determine icon
  let iconName = "shield-half";
  if (service.cardIcon === "scale") iconName = "briefcase";
  else if (service.cardIcon === "phone") iconName = "call";
  else if (service.cardIcon === "community") iconName = "compass";
  else if (service.cardIcon === "counselling") iconName = "mic";
  else if (service.cardIcon === "home") iconName = "home";
  else if (service.cardIcon === "bell") iconName = "notifications";
  else if (service.cardIcon === "sparkles") iconName = "sparkles";

  return (
    <SafeSpeakScreen
      backText="Service Details"
      rightText="Cancel"
      onRightPress={() => router.back()}
      contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
      className="flex-1 px-6"
    >
      {/* Service Header Card */}
      <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-6 items-center shadow-xs mb-6 mt-4">
        <StyledView className="w-16 h-16 bg-[#EFF6FF] rounded-2xl items-center justify-center relative mb-4">
          <Ionicons name={iconName} size={32} color="#005B96" />
          <StyledView className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#22C55E] rounded-full border-2 border-white" />
        </StyledView>

        <StyledText className="text-[#002B49] text-[22px] font-black text-center mb-1">
          {service.name}
        </StyledText>
        <StyledText className="text-[#64748B] text-xs text-center leading-5 px-2 mb-4">
          {service.description || "Support service"}
        </StyledText>

        {/* Available Pill */}
        <StyledView className="flex-row items-center bg-[#E2F0D9] px-4 py-1.5 rounded-full border border-[#D0E4C5]">
          <StyledView className="w-2 h-2 bg-[#385723] rounded-full mr-2" />
          <StyledText className="text-[#385723] text-[10px] font-extrabold uppercase tracking-wider">
            {service.availabilityLabel || "Available Now"}
          </StyledText>
        </StyledView>
      </StyledView>

      {/* Contact Information Section */}
      <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-5 shadow-xs mb-6">
        <StyledText className="text-[#002B49] text-[15px] font-black mb-4">
          Contact Information
        </StyledText>

        <StyledView className="space-y-3.5 mb-4">
          {/* Phone Option */}
          {service.phone && (
            <StyledTouchableOpacity
              activeOpacity={0.7}
              onPress={() => Linking.openURL(`tel:${service.phone.replace(/ /g, "")}`)}
              className="flex-row items-center bg-[#F8FAFC] border border-[#CBD5E1]/30 p-4 rounded-[20px]"
            >
              <StyledView className="w-10 h-10 bg-[#EFF6FF] rounded-xl items-center justify-center mr-4">
                <Ionicons name="call" size={18} color="#005B96" />
              </StyledView>
              <StyledView className="flex-1">
                <StyledText className="text-[#94A3B8] text-[8px] font-bold uppercase tracking-wider">
                  PHONE
                </StyledText>
                <StyledText className="text-[#002B49] text-base font-black">
                  {service.phone}
                </StyledText>
              </StyledView>
            </StyledTouchableOpacity>
          )}

          {/* Email Option */}
          {service.email && (
            <StyledTouchableOpacity
              activeOpacity={0.7}
              onPress={() => Linking.openURL(`mailto:${service.email}`)}
              className="flex-row items-center bg-[#F8FAFC] border border-[#CBD5E1]/30 p-4 rounded-[20px]"
            >
              <StyledView className="w-10 h-10 bg-[#EFF6FF] rounded-xl items-center justify-center mr-4">
                <Ionicons name="mail" size={18} color="#005B96" />
              </StyledView>
              <StyledView className="flex-1">
                <StyledText className="text-[#94A3B8] text-[8px] font-bold uppercase tracking-wider">
                  EMAIL
                </StyledText>
                <StyledText className="text-[#002B49] text-[14px] font-black">
                  {service.email}
                </StyledText>
              </StyledView>
            </StyledTouchableOpacity>
          )}

          {/* Languages Option */}
          {service.languages && service.languages.length > 0 && (
            <StyledView
              className="flex-row items-center bg-[#F8FAFC] border border-[#CBD5E1]/30 p-4 rounded-[20px]"
            >
              <StyledView className="w-10 h-10 bg-[#EFF6FF] rounded-xl items-center justify-center mr-4">
                <Ionicons name="language" size={18} color="#005B96" />
              </StyledView>
              <StyledView className="flex-1">
                <StyledText className="text-[#94A3B8] text-[8px] font-bold uppercase tracking-wider">
                  LANGUAGES
                </StyledText>
                <StyledText className="text-[#002B49] text-xs font-bold leading-5">
                  {service.languages.join(", ")}
                </StyledText>
              </StyledView>
            </StyledView>
          )}
        </StyledView>

        {/* Eligibility Box & Visit Website Link */}
        <StyledView className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl p-3 mb-1">
          <StyledText className="text-[#64748B] text-[10px] font-semibold leading-4">
            <StyledText className="font-bold text-[#002B49]">Eligibility: </StyledText>
            {service.eligibility ? service.eligibility.join(", ") : "General Support"}
          </StyledText>
          {(service.websiteUrl || service.url) && (
            <StyledTouchableOpacity
              activeOpacity={0.7}
              onPress={() => Linking.openURL(service.websiteUrl || service.url)}
              className="mt-2"
            >
              <StyledText className="text-[#005B96] text-[11px] font-bold">
                Visit website
              </StyledText>
            </StyledTouchableOpacity>
          )}
        </StyledView>
      </StyledView>

      {/* Consent required card */}
      {showConsentRequired && (
        <StyledView className="w-full bg-white border border-[#CBD5E1]/60 rounded-[24px] p-5 mb-6 shadow-xs flex-row items-start">
          <StyledView className="w-10 h-10 bg-[#EFF6FF] rounded-full items-center justify-center mr-3.5 shrink-0">
            <Ionicons name="shield-checkmark" size={18} color="#005B96" />
          </StyledView>

          <StyledView className="flex-1">
            <StyledText className="text-[#002B49] text-xs font-black mb-1">
              Warm referral consent required
            </StyledText>
            <StyledText className="text-[#64748B] text-[11px] leading-4 font-semibold mb-3">
              SafeSpeak needs your permission before it can share details with a support service for a warm referral.
            </StyledText>

            <StyledView className="flex-row flex-wrap items-center">
              <StyledTouchableOpacity
                activeOpacity={0.8}
                onPress={handleAllowConsent}
                className="bg-[#005B96] px-4 py-2 rounded-full mr-2 mb-2"
              >
                <StyledText className="text-white text-[10px] font-bold">
                  Allow warm referral
                </StyledText>
              </StyledTouchableOpacity>

              <StyledTouchableOpacity
                activeOpacity={0.8}
                onPress={handleDeclineConsent}
                className="bg-white border border-[#E2E8F0] px-4 py-2 rounded-full mr-2 mb-2"
              >
                <StyledText className="text-[#475569] text-[10px] font-bold">
                  Not now
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
      )}

      {/* Warm Referral Prepared Card OR Warm Referral Section */}
      {showReferralPrepared ? (
        <StyledView className="w-full bg-[#F3FAF0] border border-[#D0E4C5] rounded-[24px] p-5 mb-6 shadow-xs">
          <StyledText className="text-[#385723] text-[10px] font-extrabold uppercase tracking-wider mb-2">
            WARM REFERRAL PREPARED
          </StyledText>
          <StyledText className="text-[#002B49] text-[20px] font-black mb-2">
            {service.name} intake handoff is ready.
          </StyledText>
          <StyledText className="text-[#64748B] text-[11px] leading-[17px] font-semibold mb-2">
            The referral includes a concise incident summary, immediate safety needs, and your preferred contact method.
          </StyledText>

          {/* Referral Preview Inset Box */}
          <StyledView className="bg-white border border-[#E2E8F0] rounded-2xl p-4 mb-5">
            <StyledText className="text-[#94A3B8] text-[9px] font-extrabold uppercase tracking-wider mb-2">
              REFERRAL PREVIEW
            </StyledText>
            <StyledText className="text-[#64748B] text-[11px] leading-[17px] font-semibold">
              Warm referral request for {service.name}. Prepared to include: incident summary, immediate safety concerns, and preferred contact method. Interpreter preference: English. SafeSpeak is acting as a connection layer, not a provider.
            </StyledText>
          </StyledView>

          {/* Buttons Stack */}
          <StyledView className="space-y-2.5">
            {service.phone && (
              <StyledTouchableOpacity
                activeOpacity={0.8}
                onPress={() => Linking.openURL(`tel:${service.phone.replace(/ /g, "")}`)}
                className="bg-[#005B96] py-3 rounded-full items-center justify-center"
              >
                <StyledText className="text-white text-xs font-bold">
                  Call service
                </StyledText>
              </StyledTouchableOpacity>
            )}

            {service.email && (
              <StyledTouchableOpacity
                activeOpacity={0.8}
                onPress={() => Linking.openURL(`mailto:${service.email}?subject=SafeSpeak Support referral`)}
                className="bg-white border border-[#005B96] py-3 rounded-full items-center justify-center"
              >
                <StyledText className="text-[#005B96] text-xs font-bold">
                  Email intro
                </StyledText>
              </StyledTouchableOpacity>
            )}

            <StyledTouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                Alert.alert("Summary Copied", "Warm Referral summary copied to clipboard.");
              }}
              className="bg-white border border-[#CBD5E1] py-3 rounded-full items-center justify-center"
            >
              <StyledText className="text-[#002B49] text-xs font-bold">
                Copy summary
              </StyledText>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      ) : (
        /* Warm Referral Section */
        <StyledView className="w-full bg-[#EBF3FC] border border-[#C5DFF8] rounded-[24px] p-5 shadow-xs mb-6">
          <StyledView className="flex-row items-center mb-3">
            <StyledView className="w-8 h-8 bg-[#EFF6FF] rounded-lg items-center justify-center mr-3">
              <Ionicons name="shuffle" size={16} color="#005B96" />
            </StyledView>
            <StyledText className="text-[#002B49] text-[18px] font-black">
              Warm Referral
            </StyledText>
          </StyledView>

          <StyledText className="text-[#64748B] text-[11px] leading-[17px] font-semibold mb-4">
            A warm referral ensures the provider has the context they need to help you immediately without repeating your story. This secure transfer of information helps build trust and accelerates support.
          </StyledText>

          {/* Profile Context Card */}
          <StyledView className="bg-white border border-[#CBD5E1]/30 rounded-2xl p-4 mb-4">
            <StyledText className="text-[#002B49] text-xs font-bold">
              Profile Context
            </StyledText>
            <StyledText className="text-[#94A3B8] text-[9px] font-semibold mt-1">
              Warm referral will exclude profile context until you choose to share it.
            </StyledText>
          </StyledView>

          {/* Include Incident Summary Card */}
          <StyledView className="bg-white border border-[#CBD5E1]/30 rounded-2xl p-4 flex-row items-center justify-between mb-5">
            <StyledView className="flex-1 pr-3">
              <StyledText className="text-[#002B49] text-xs font-bold">
                Include Incident Summary
              </StyledText>
              <StyledText className="text-[#94A3B8] text-[9px] font-semibold mt-0.5">
                Shares your recent report securely.
              </StyledText>
            </StyledView>
            <Switch
              trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
              thumbColor={"#FFFFFF"}
              ios_backgroundColor="#E2E8F0"
              onValueChange={setIncludeSummary}
              value={includeSummary}
              style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
            />
          </StyledView>

          {/* Sharing Preview (Expanded Section) */}
          {isReferralPreviewExpanded && (
            <StyledView className="w-full bg-white border border-[#DBEAFE] rounded-2xl p-4 mb-4">
              <StyledText className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider mb-3">
                SHARING PREVIEW
              </StyledText>
              
              <StyledText className="text-[#64748B] text-xs leading-5">
                <StyledText className="font-bold text-[#002B49]">Service:</StyledText> {service.name}
              </StyledText>

              <StyledText className="text-[#64748B] text-xs leading-5 mt-1">
                <StyledText className="font-bold text-[#002B49]">Safe contact:</StyledText> hasantanvir529@gmail.com
              </StyledText>

              <StyledText className="text-[#64748B] text-xs leading-5 mt-1">
                <StyledText className="font-bold text-[#002B49]">Summary:</StyledText> {includeSummary ? "Concise incident summary based on recent report." : "General inquiry from SafeSpeak user."}
              </StyledText>

              <StyledText className="text-[#64748B] text-xs leading-5 mt-1">
                <StyledText className="font-bold text-[#002B49]">Interpreter:</StyledText> English
              </StyledText>

              <StyledText className="text-[#94A3B8] text-[9.5px] font-semibold mt-3.5 leading-4">
                No evidence files, full report payload, or hidden profile data will be shared by this request.
              </StyledText>

              <StyledTouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsReferralPreviewExpanded(false)}
                className="mt-3.5"
              >
                <StyledText className="text-[#005B96] text-xs font-bold">
                  Edit before sending
                </StyledText>
              </StyledTouchableOpacity>
            </StyledView>
          )}

          {/* Send Referral Button */}
          <StyledTouchableOpacity
            activeOpacity={0.8}
            onPress={handleSendReferral}
            disabled={isSubmitting}
            className="bg-[#FF9000] py-3.5 rounded-full flex-row items-center justify-center shadow-xs"
          >
            {isSubmitting && <ActivityIndicator size="small" color="white" className="mr-2" />}
            <StyledText className="text-white text-xs font-bold mr-1.5">
              {isReferralPreviewExpanded ? "Confirm and send referral" : "Send Referral"}
            </StyledText>
            <Ionicons name="arrow-forward" size={14} color="white" />
          </StyledTouchableOpacity>
        </StyledView>
      )}

      {/* Relevant Resources Accordion */}
      <StyledView className="w-full bg-white rounded-[24px] border border-[#E2E8F0] p-5 shadow-xs mb-4">
        <StyledTouchableOpacity
          activeOpacity={0.8}
          onPress={() => setIsResourcesOpen(!isResourcesOpen)}
          className="flex-row items-center justify-between"
        >
          <StyledText className="text-[#002B49] text-[15px] font-black">
            Relevant Resources
          </StyledText>
          <Ionicons
            name={isResourcesOpen ? "chevron-down" : "chevron-forward"}
            size={18}
            color="#94A3B8"
          />
        </StyledTouchableOpacity>

        {isResourcesOpen && (
          <StyledView className="mt-4 border-t border-[#E2E8F0] pt-4 space-y-2.5">
            {(service.websiteUrl || service.url) && (
              <StyledTouchableOpacity
                activeOpacity={0.7}
                onPress={() => Linking.openURL(service.websiteUrl || service.url)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 p-4 rounded-[20px] flex-row justify-between items-center"
              >
                <StyledText className="text-[#005B96] text-xs font-bold">
                  {service.name} website
                </StyledText>
                <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
              </StyledTouchableOpacity>
            )}
            {service.resourceLinks && service.resourceLinks.map((link, idx) => (
              <StyledTouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => Linking.openURL(link.url)}
                className="w-full bg-[#F8FAFC] border border-[#CBD5E1]/30 p-4 rounded-[20px] flex-row justify-between items-center"
              >
                <StyledText className="text-[#005B96] text-xs font-bold font-semibold">
                  {link.label}
                </StyledText>
                <Ionicons name="chevron-forward" size={14} color="#CBD5E1" />
              </StyledTouchableOpacity>
            ))}
          </StyledView>
        )}
      </StyledView>
    </SafeSpeakScreen>
  );
}

