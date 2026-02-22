import React, { useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../../../components/CustomHeader";
import { useLanguage } from "../../../../context/LanguageContext";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);

const getLessonSteps = (t) => [
  {
    title: t("lessonHarassmentTitle"),
    mainText: t("lessonHarassmentMain"),
    subText: t("lessonHarassmentSub"),
  },
  {
    title: t("lessonSecurityTitle"),
    mainText: t("lessonSecurityMain"),
    subText: t("lessonSecuritySub"),
  },
  {
    title: t("lessonEvidenceTitle"),
    mainText: t("lessonEvidenceMain"),
    subText: t("lessonEvidenceSub"),
  },
  {
    title: t("lessonWellbeingTitle"),
    mainText: t("lessonWellbeingMain"),
    subText: t("lessonWellbeingSub"),
  },
];

export default function LessonDetail() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const lessonSteps = getLessonSteps(t);
  const totalSteps = lessonSteps.length;

  const animateTransition = (nextStep) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentStep(nextStep);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      animateTransition(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      animateTransition(currentStep - 1);
    }
  };

  return (
    <StyledView className="flex-1 bg-white">
      <CustomHeader title={t("safeSpeakEducation")} />

      <StyledScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Hero Image Section */}
        <StyledView className="px-6 mt-4">
          <StyledView className="w-full h-80 rounded-[40px] overflow-hidden bg-[#F0F4FA] items-center justify-center">
            {/* Placeholder for the "Internet Hoax" image */}
            <StyledView className="items-center">
              <Ionicons
                name="desktop-outline"
                size={80}
                color="#3B82F6"
                opacity={0.3}
              />
              <StyledView className="bg-white p-6 rounded-2xl shadow-xl mt-[-40] border border-gray-100 rotate-[-5deg]">
                <StyledView className="flex-row items-center">
                  <Ionicons name="alert-circle" size={40} color="#EF4444" />
                  <StyledView className="ml-3">
                    <StyledText className="text-[#002B49] text-2xl font-black">
                      {t("internet")}
                    </StyledText>
                    <StyledText className="text-[#3B82F6] text-3xl font-black mt-[-5]">
                      {t("hoax")}
                    </StyledText>
                  </StyledView>
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>
        </StyledView>

        {/* Content Section */}
        <StyledView className="px-8 mt-10 items-center">
          <StyledText className="text-[#3B82F6] text-[10px] font-bold uppercase tracking-[3px] mb-2">
            {t("securityEssentials")}
          </StyledText>
          <StyledText className="text-[#002B49] text-[36px] font-black leading-[44px] text-center">
            {t("stayingSafeOnline")}
          </StyledText>

          <AnimatedView
            style={{ opacity: fadeAnim }}
            className="flex-row items-center justify-between w-full mt-10"
          >
            <StyledTouchableOpacity
              className="p-2"
              onPress={handlePrev}
              disabled={currentStep === 0}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={currentStep === 0 ? "#E5E7EB" : "#3B82F6"}
              />
            </StyledTouchableOpacity>

            <StyledView className="flex-1 px-4">
              <StyledText className="text-[#4B5563] text-lg font-medium text-center leading-7">
                {lessonSteps[currentStep].mainText}
              </StyledText>

              <StyledText className="text-[#4B5563] text-base font-medium text-center leading-6 mt-6">
                {lessonSteps[currentStep].subText}
              </StyledText>
            </StyledView>

            <StyledTouchableOpacity
              className="p-2"
              onPress={handleNext}
              disabled={currentStep === totalSteps - 1}
            >
              <Ionicons
                name="chevron-forward"
                size={24}
                color={currentStep === totalSteps - 1 ? "#E5E7EB" : "#3B82F6"}
              />
            </StyledTouchableOpacity>
          </AnimatedView>

          {/* Pagination Dots */}
          <StyledView className="flex-row items-center space-x-2 mt-10">
            {[...Array(totalSteps)].map((_, i) => (
              <StyledView
                key={i}
                className={`rounded-full ${i === currentStep ? "w-2.5 h-2.5 bg-[#1E40AF]" : "w-2 h-2 bg-[#E5E7EB]"}`}
              />
            ))}
          </StyledView>

          <StyledText className="text-[#9CA3AF] text-[10px] font-medium italic text-center mt-12 px-4 leading-4">
            {t("lessonDisclaimer")}
          </StyledText>

          {/* Action Button */}
          <StyledTouchableOpacity
            className={`w-full py-3 rounded-[35px] mt-10 shadow-lg ${currentStep === totalSteps - 1 ? "bg-gray-400 shadow-gray-200" : "bg-[#FF8A00] shadow-orange-300"}`}
            activeOpacity={0.8}
            onPress={handleNext}
            disabled={currentStep === totalSteps - 1}
          >
            <StyledText className="text-white text-lg font-bold text-center">
              {currentStep === totalSteps - 1
                ? t("lessonCompleted")
                : t("seeNextCard")}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
