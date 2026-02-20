import React, { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomHeader from "../../../../components/CustomHeader";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

const CATEGORIES = ["All Lessons", "Harassment", "Rights"];

const HUB_ITEMS = [
  {
    id: 1,
    title: "CYBER",
    subtitle: "BULLYING",
    color: "#005B96",
    icon: "shield-checkmark",
    size: "small",
  },
  {
    id: 2,
    title: "DIS-",
    subtitle: "CRIMINAT\nION",
    content:
      "Discrimination occurs when employees are treated unfairly for personal traits.",
    color: "#F97316",
    icon: "people",
    size: "large",
  },
  {
    id: 3,
    title: "LEGAL",
    subtitle: "Migrant &\nStudent\nRights",
    color: "#FBBF24",
    icon: "hammer",
    size: "small",
  },
  {
    id: 4,
    title: "PROTECTION",
    subtitle: "ONLINE SAFETY",
    content: "Protect your digital footprint & data.",
    color: "#10B981",
    icon: "shield-half",
    size: "wide",
  },
];

export default function MicroCards() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("All Lessons");

  // Helper to push to education with params
  const navigateToEducation = (name) => {
    router.push({
      pathname: "/home/micro-cards/micro-education",
      params: { name },
    });
  };

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title="MicroEducation" />
      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <StyledView className="mt-6 mb-8">
          <StyledText className="text-[#002B49] text-5xl font-extrabold">
            Learn. Protect. Thrive.
          </StyledText>
          <StyledText className="text-[#1F2937]/70 text-base font-medium mt-2 leading-6">
            Quick lessons on rights, online safety, mental health, and everyday
            hazards.
          </StyledText>
        </StyledView>

        {/* Search Bar */}
        <StyledView className="flex-row items-center bg-white rounded-3xl px-4 py-3 mb-8 border border-white shadow-sm">
          <Ionicons name="search" size={20} color="#94A3B8" />
          <StyledTextInput
            placeholder="Search topics, laws, tips..."
            className="flex-1 ml-3 text-base text-[#1F2937]"
            placeholderTextColor="#94A3B8"
          />
        </StyledView>

        {/* Filter Chips */}
        <StyledScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-6"
          contentContainerStyle={{ paddingRight: 24 }} // Add padding to the end of scroll
        >
          {CATEGORIES.map((cat) => (
            <StyledTouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full mr-3 shadow-sm ${
                activeCategory === cat ? "bg-[#3B82F6]" : "bg-white"
              }`}
            >
              <StyledText
                className={`font-bold ${
                  activeCategory === cat ? "text-white" : "text-[#64748B]"
                }`}
              >
                {cat}
              </StyledText>
            </StyledTouchableOpacity>
          ))}
        </StyledScrollView>

        {/* Grid of Lesson Cards */}
        <StyledView className="flex-row flex-wrap justify-between">
          {/* Row 1 */}
          <StyledView className="w-[48%] mb-4">
            <StyledTouchableOpacity
              className="bg-[#005B96] rounded-[30px] p-5 h-40 justify-between"
              activeOpacity={0.7}
              onPress={() => navigateToEducation("Cyber Bullying")}
            >
              <StyledView>
                <StyledText className="text-white/60 text-[10px] font-bold uppercase tracking-wider">
                  CYBER
                </StyledText>
                <StyledText className="text-white text-xl font-black mt-1">
                  BULLYING
                </StyledText>
              </StyledView>
            </StyledTouchableOpacity>
          </StyledView>

          <StyledView className="w-[48%] mb-4">
            <StyledTouchableOpacity
              className="bg-[#F97316] rounded-[30px] p-5 h-[320px] justify-between"
              activeOpacity={0.7}
              onPress={() => navigateToEducation("Discrimination")}
            >
              <StyledView>
                <StyledText className="text-white text-2xl font-black leading-tight">
                  DIS-{"\n"}CRIMINAT{"\n"}ION
                </StyledText>
              </StyledView>
              <StyledView className="bg-white/20 p-4 rounded-[20px] mt-auto">
                <StyledText className="text-white text-[11px] font-medium leading-4">
                  Discrimination occurs when employees are treated unfairly for
                  personal traits.
                </StyledText>
              </StyledView>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Row 2 - Legal Card */}
          <StyledView className="w-[48%] mt-[-160px] mb-4">
            <StyledTouchableOpacity
              className="bg-[#FBBF24] rounded-[30px] p-5 h-44 justify-between"
              activeOpacity={0.7}
              onPress={() => navigateToEducation("Legal Rights")}
            >
              <StyledView>
                <StyledText className="text-black/60 text-[10px] font-bold uppercase tracking-wider">
                  LEGAL
                </StyledText>
                <StyledText className="text-black text-[18px] font-black mt-1 leading-6">
                  Migrant &{"\n"}Student{"\n"}Rights
                </StyledText>
              </StyledView>
              <StyledView className="items-end">
                <Ionicons name="hammer" size={28} color="black" />
              </StyledView>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Online Safety Wide Card */}
          <StyledView className="w-full mt-2">
            <StyledTouchableOpacity
              className="bg-[#10B981] rounded-[40px] p-6 h-40 justify-between overflow-hidden"
              activeOpacity={0.7}
              onPress={() => navigateToEducation("Online Safety")}
            >
              <StyledView className="flex-row justify-between items-start">
                <StyledView className="flex-1 pr-4">
                  <StyledText className="text-white/60 text-[10px] font-bold uppercase tracking-wider">
                    PROTECTION
                  </StyledText>
                  <StyledText className="text-white text-3xl font-black mt-1">
                    ONLINE SAFETY
                  </StyledText>
                  <StyledText className="text-white/80 text-[12px] font-medium mt-2">
                    Protect your digital footprint & data.
                  </StyledText>
                </StyledView>
                <StyledView className="bg-white/20 p-4 rounded-[20px]">
                  <Ionicons name="shield-half" size={28} color="white" />
                </StyledView>
              </StyledView>
              {/* Decorative background logo */}
              <StyledView className="absolute bottom-[-20] right-[-10] opacity-10">
                <Ionicons name="shield" size={150} color="white" />
              </StyledView>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Row 4 - Mental Health & Legal Aid Basics */}
          <StyledView className="flex-row justify-between w-full mt-4">
            {/* Mental Health Card */}
            <StyledView className="w-[48%]">
              <StyledTouchableOpacity
                className="bg-[#8B5CF6] rounded-[40px] p-5 h-44 justify-between overflow-hidden"
                activeOpacity={0.7}
                onPress={() => navigateToEducation("Mental Health")}
              >
                <StyledText className="text-white text-2xl font-black leading-tight uppercase">
                  Mental{"\n"}Health
                </StyledText>

                <StyledView className="flex-row items-center justify-between">
                  {/* Decorative circles */}
                  <StyledView className="flex-row">
                    <StyledView className="w-8 h-8 rounded-full bg-white/30" />
                    <StyledView className="w-8 h-8 rounded-full bg-white/20 -ml-4" />
                  </StyledView>
                  <Ionicons
                    name="heart-outline"
                    size={32}
                    color="white"
                    className="opacity-60"
                  />
                </StyledView>

                {/* Background decorative heart */}
                <StyledView className="absolute -bottom-4 -right-4 opacity-5">
                  <Ionicons name="heart" size={100} color="white" />
                </StyledView>
              </StyledTouchableOpacity>
            </StyledView>

            {/* Legal Aid Basics Card */}
            <StyledView className="w-[48%]">
              <StyledTouchableOpacity
                className="bg-[#0D9488] rounded-[40px] p-5 h-44 justify-between"
                activeOpacity={0.7}
                onPress={() => navigateToEducation("Legal Aid Basics")}
              >
                <StyledView>
                  <StyledText className="text-white/60 text-[10px] font-bold uppercase tracking-wider">
                    FUNDAMENTALS
                  </StyledText>
                  <StyledText className="text-white text-[19px] font-black mt-1 leading-tight uppercase">
                    Legal Aid{"\n"}Basics
                  </StyledText>
                </StyledView>

                <StyledTouchableOpacity className="bg-black/20 self-start px-4 py-2 rounded-2xl">
                  <StyledText className="text-white text-[10px] font-bold uppercase tracking-widest">
                    Start Now
                  </StyledText>
                </StyledTouchableOpacity>
              </StyledTouchableOpacity>
            </StyledView>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
