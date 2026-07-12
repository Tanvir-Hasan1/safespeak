import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import SafeSpeakScreen from "../../../../components/SafeSpeakScreen";
import { useLanguage } from "../../../../context/LanguageContext";
import api from "../../../../context/api";

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function Recommendations() {
  const router = useRouter();
  const { conversationSessionId } = useLocalSearchParams();
  const { t } = useLanguage();

  const [recommendations, setRecommendations] = useState([]);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!conversationSessionId) {
        setLoading(false);
        setFallbackUsed(true);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const res = await api.get(
          `/conversation-flow/sessions/${conversationSessionId}/recommendations`
        );
        const data = res.data?.data || res.data;
        if (data) {
          setRecommendations(data.recommendations || []);
          setFallbackUsed(Boolean(data.fallbackUsed));
        } else {
          setFallbackUsed(true);
        }
      } catch (err) {
        console.warn("Failed to fetch recommendations:", err);
        setError("Could not load recommendations.");
        setFallbackUsed(true);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, [conversationSessionId]);

  const toTelHref = (phone) => {
    const normalized = phone.replace(/[^\d+]/g, "");
    return normalized ? `tel:${normalized}` : `tel:${phone}`;
  };

  const toMailHref = (email, title) => {
    const subject = encodeURIComponent(`SafeSpeak support option: ${title}`);
    return `mailto:${email}?subject=${subject}`;
  };

  return (
    <SafeSpeakScreen
      title={t("recommendations")}
      rightIcon="time-outline"
      onRightPress={() => router.push("/home/report-submission/history")}
      contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}
    >
      {loading ? (
        <StyledView className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#005B96" />
        </StyledView>
      ) : recommendations.length === 0 || fallbackUsed ? (
        <StyledView className="w-full bg-white rounded-[32px] border border-[#BFDBFE] p-6 shadow-xs mb-8">
              {/* Box 1 */}
              <StyledView className="w-full bg-white border border-[#E2E8F0] rounded-[20px] p-5 mb-4">
                <StyledText className="text-[#4B5563] text-sm leading-5">
                  No admin-managed recommendation is available for this triage session yet.
                </StyledText>
              </StyledView>

              {/* Box 2 */}
              <StyledView className="w-full bg-white border border-[#E2E8F0] rounded-[20px] p-5">
                <StyledText className="text-[#4B5563] text-sm leading-5">
                  SafeSpeak is showing official fallback resources because no closer admin-managed match was available for this triage session.
                </StyledText>
              </StyledView>
            </StyledView>
          ) :
            recommendations.map((item) => (
              <StyledView
                key={item.id}
                className="bg-white rounded-[32px] p-6 border border-[#EBF3FC] shadow-xs mb-6"
              >
                <StyledView className="flex-row items-start justify-between mb-3">
                  <StyledView className="flex-1 mr-2">
                    <StyledText className="text-[#0A66A8] text-[10px] font-extrabold uppercase tracking-wider">
                      {item.resourceType ? item.resourceType.replace(/_/g, " ") : ""}
                    </StyledText>
                    <StyledText className="text-[#0B1F33] text-lg font-bold mt-1">
                      {item.title}
                    </StyledText>
                  </StyledView>
                  {item.phone && (
                    <StyledView className="w-10 h-10 bg-[#EEF6FF] rounded-full items-center justify-center">
                      <Ionicons name="call" size={16} color="#0A66A8" />
                    </StyledView>
                  )}
                </StyledView>

                <StyledText className="text-[#526B80] text-xs leading-5 mb-4">
                  {item.description}
                </StyledText>

                {/* Sub Metadata Notes */}
                {(item.safetyNotes || item.eligibilityNotes || item.languageSupportNotes) && (
                  <StyledView className="bg-[#F8FBFF] rounded-[20px] p-4 border border-[#EBF3FC] mb-4">
                    {item.safetyNotes && (
                      <StyledText className="text-[#607B90] text-[11px] leading-4 mb-1">
                        <StyledText className="font-bold">Safety: </StyledText>
                        {item.safetyNotes}
                      </StyledText>
                    )}
                    {item.eligibilityNotes && (
                      <StyledText className="text-[#607B90] text-[11px] leading-4 mb-1">
                        <StyledText className="font-bold">Eligibility: </StyledText>
                        {item.eligibilityNotes}
                      </StyledText>
                    )}
                    {item.languageSupportNotes && (
                      <StyledText className="text-[#607B90] text-[11px] leading-4">
                        <StyledText className="font-bold">Language: </StyledText>
                        {item.languageSupportNotes}
                      </StyledText>
                    )}
                  </StyledView>
                )}

                <StyledView className="flex-row flex-wrap gap-2 mb-4">
                  {item.phone && (
                    <StyledText className="text-[#607B90] text-[10px]">
                      Phone: {item.phone}
                    </StyledText>
                  )}
                  {item.email && (
                    <StyledText className="text-[#607B90] text-[10px]">
                      Email: {item.email}
                    </StyledText>
                  )}
                  {item.jurisdiction && (
                    <StyledText className="text-[#607B90] text-[10px]">
                      Jurisdiction: {item.jurisdiction}
                    </StyledText>
                  )}
                </StyledView>

                {/* Call-to-action buttons */}
                <StyledView className="flex-row items-center gap-3">
                  {item.phone && (
                    <StyledTouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => Linking.openURL(toTelHref(item.phone))}
                      className="bg-white border border-[#CFDCEB] py-2 px-4 rounded-full flex-row items-center"
                    >
                      <Ionicons name="call-outline" size={13} color="#244961" />
                      <StyledText className="text-[#244961] text-xs font-bold ml-1.5">
                        Call
                      </StyledText>
                    </StyledTouchableOpacity>
                  )}
                  {item.email && (
                    <StyledTouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => Linking.openURL(toMailHref(item.email, item.title))}
                      className="bg-white border border-[#CFDCEB] py-2 px-4 rounded-full flex-row items-center"
                    >
                      <Ionicons name="mail-outline" size={13} color="#244961" />
                      <StyledText className="text-[#244961] text-xs font-bold ml-1.5">
                        Email
                      </StyledText>
                    </StyledTouchableOpacity>
                  )}
                  {item.websiteUrl && (
                    <StyledTouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => Linking.openURL(item.websiteUrl)}
                      className="bg-[#0F5D9F] py-2.5 px-5 rounded-full"
                    >
                      <StyledText className="text-white text-xs font-bold">
                        {item.ctaLabel || "View option"}
                      </StyledText>
                    </StyledTouchableOpacity>
                  )}
                </StyledView>
              </StyledView>
            ))
      }
    </SafeSpeakScreen>
  );
}
