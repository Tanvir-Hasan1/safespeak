import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../../../components/CustomHeader";
import { useRouter } from "expo-router";
import { useLanguage } from "../../../../context/LanguageContext";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);

export default function SubmitReport() {
  const router = useRouter();
  const { t } = useLanguage();
  const [headerVisible, setHeaderVisible] = useState(true);

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y <= 10) {
      setHeaderVisible(true);
    } else if (y > 50) {
      setHeaderVisible(false);
    }
  };

  const steps = [
    {
      id: 1,
      title: t("contactBank") || "Contact Your Bank",
      icon: "business",
      desc1: t("contactBankDesc") || "If you have lost money, shared your card details, or think someone can access your account, contact your bank immediately to freeze your accounts.",
      desc2: t("highRiskDesc") || "Likely phishing/scam message using an urgent \"final notice\" and \"protection expires today\" payment-declined claim to pressure you into updating payment details, potentially to steal card info or credentials.",
      buttonText: t("callFraudDept") || "Call Fraud Department",
      action: () => Linking.openURL("tel:1300000000"),
    },
    {
      id: 2,
      title: "Report to ACCC Scamwatch",
      icon: "hammer",
      hasTag: true,
      tagText: "COMMUNITY PREVENTION",
      desc1: t("reportScamwatchDesc") || "Choose this if you have not lost money, but want the government to be aware of a scam.",
      desc2: "Do not click any links or enter payment details from this message.",
      buttonText: t("launchReportTool") || "Launch Report Tool",
      action: () => Linking.openURL("https://www.scamwatch.gov.au/"),
    },
    {
      id: 3,
      title: "Report to ReportCyber",
      icon: "shield",
      desc1: t("reportCyberDesc") || "Report here if you clicked a link, shared personal details, lost money, or believe your identity or accounts are at risk.",
      desc2: "Verify the subscription by going directly to the company's official website/app (type the address yourself) or checking your bank/credit card statements.",
      buttonText: t("launchReportTool") || "Launch Report Tool",
      action: () => Linking.openURL("https://www.cyber.gov.au/report-and-recover/report"),
    },
  ];

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader
        title=""
        backText="Next Steps"
        rightText="Cancel"
        headerVisible={headerVisible}
      />

      <StyledScrollView
        className="flex-1 px-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Secure Assets Main Card */}
        <StyledView className="bg-white rounded-[32px] p-6 border border-[#E2E8F0] mb-5 shadow-xs">
          <StyledText className="text-[#002B49] text-2xl font-black text-center mb-2 leading-8">
            Secure your assets & report the incident
          </StyledText>
          <StyledText className="text-[#64748B] text-xs text-center leading-5 mb-5 px-1">
            Likely phishing/scam message using an urgent "final notice" and "protection expires today" payment-declined claim to pressure you into updating payment details, potentially to steal card info or credentials.
          </StyledText>

          {/* Recommended Next Steps Inner Box */}
          <StyledView className="w-full border border-[#E2E8F0] rounded-2xl p-5 bg-[#F8FAFC]">
            <StyledText className="text-[#64748B] text-[10px] font-black uppercase tracking-wider mb-3">
              RECOMMENDED NEXT STEPS
            </StyledText>
            
            <StyledView className="space-y-3">
              <StyledText className="text-[#334155] text-xs leading-5">
                • Do not click any links or enter payment details from this message.
              </StyledText>
              <StyledText className="text-[#334155] text-xs leading-5">
                • Verify the subscription by going directly to the company's official website/app (type the address yourself) or checking your bank/credit card statements.
              </StyledText>
              <StyledText className="text-[#334155] text-xs leading-5">
                • If you already interacted or entered payment info, contact your card issuer to secure the account and monitor for fraudulent charges.
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Steps List */}
        <StyledView className="space-y-5">
          {steps.map((step) => (
            <StyledView
              key={step.id}
              className="bg-white rounded-[24px] p-5 border border-[#E2E8F0] shadow-xs"
            >
              {/* Step Header */}
              <StyledView className="flex-row items-center mb-3">
                <StyledView className="w-9 h-9 bg-[#FFF7ED] rounded-full items-center justify-center mr-3 shrink-0">
                  <Ionicons name={step.icon} size={18} color="#F97316" />
                </StyledView>
                <StyledView className="flex-1">
                  <StyledText className="text-[#002B49] text-[17px] font-black leading-6">
                    {step.title}
                  </StyledText>
                  
                  {step.hasTag && (
                    <StyledView className="bg-[#EFF6FF] px-2 py-0.5 rounded-full border border-[#DBEAFE] self-start mt-1">
                      <StyledText className="text-[#005B96] text-[8px] font-black uppercase tracking-wider">
                        {step.tagText}
                      </StyledText>
                    </StyledView>
                  )}
                </StyledView>
              </StyledView>

              {/* Step Body */}
              <StyledText className="text-[#475569] text-xs leading-5 mb-2 font-medium">
                {step.desc1}
              </StyledText>
              
              <StyledText className="text-[#475569] text-xs leading-5 mb-4 font-medium">
                {step.desc2}
              </StyledText>

              {/* Action Button */}
              <StyledTouchableOpacity
                activeOpacity={0.8}
                onPress={step.action}
                className="bg-[#F59E0B] py-3 rounded-xl flex-row items-center justify-center"
              >
                <StyledText className="text-white text-xs font-bold mr-1">
                  {step.buttonText}
                </StyledText>
                <Ionicons name="open-outline" size={13} color="white" />
              </StyledTouchableOpacity>
            </StyledView>
          ))}
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
