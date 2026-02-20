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

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const AnimatedView = Animated.createAnimatedComponent(View);

const LESSON_STEPS = [
  {
    title: "Understanding Harassment",
    mainText:
      "Digital harassment is any behavior intended to threaten or harm. Recognizing these patterns is the first step toward regaining your peace.",
    subText:
      "Your safety is the highest priority. Whether blocking accounts or documenting incidents, small steps lead to significant protection.",
  },
  {
    title: "Securing Your Accounts",
    mainText:
      "Secure your accounts by using strong, unique passwords and enabling two-factor authentication (2FA). This dramatically reduces the risk of unauthorized access.",
    subText:
      "Be mindful of what you share publicly; setting your profiles to private can provide an extra layer of control over who sees your activity.",
  },
  {
    title: "Documenting Evidence",
    mainText:
      "If you experience harassment, document everything. Take screenshots of messages or posts, and keep a log of dates and times.",
    subText:
      "Most platforms have reporting tools—don't hesitate to use them. Your documentation will be vital if you need to take further action.",
  },
  {
    title: "Prioritizing Wellbeing",
    mainText:
      "Your mental wellbeing is just as important as your digital safety. If online interactions are causing distress, it's okay to take a break or disconnect.",
    subText:
      "Reach out to trusted friends or professional support services. Remember, you don't have to face digital threats alone.",
  },
];

export default function LessonDetail() {
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const totalSteps = LESSON_STEPS.length;

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
      <CustomHeader title="SafeSpeak Education" />

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
                      INTERNET
                    </StyledText>
                    <StyledText className="text-[#3B82F6] text-3xl font-black mt-[-5]">
                      HOAX
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
            Security Essentials
          </StyledText>
          <StyledText className="text-[#002B49] text-[36px] font-black leading-[44px] text-center">
            STAYING SAFE{"\n"}ONLINE
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
                {LESSON_STEPS[currentStep].mainText}
              </StyledText>

              <StyledText className="text-[#4B5563] text-base font-medium text-center leading-6 mt-6">
                {LESSON_STEPS[currentStep].subText}
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
            This is educational information only. In an emergency, always follow
            the instructions of the 000 operator.
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
                ? "Lesson Completed"
                : "See next Card"}
            </StyledText>
          </StyledTouchableOpacity>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
