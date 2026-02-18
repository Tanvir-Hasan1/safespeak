import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from "react-native";
import { styled } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import CustomHeader from "../../../components/CustomHeader";
import { useRouter } from "expo-router";

const StyledScrollView = styled(ScrollView);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledTextInput = styled(TextInput);

const RESOURCE_ITEMS = [
  {
    id: 1,
    title: "Legal Aid",
    subtitle: "Legal advice and rights information",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400&auto=format&fit=crop",
    icon: "hammer",
    size: "wide",
  },
  {
    id: 2,
    title: "Community Support",
    subtitle: "",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=400&auto=format&fit=crop",
    icon: "people",
    size: "medium",
  },
  {
    id: 3,
    title: "Counselling",
    subtitle: "Mental health support",
    image:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=400&auto=format&fit=crop",
    icon: "bulb",
    size: "large",
  },
  {
    id: 4,
    title: "Health Services",
    subtitle: "",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400&auto=format&fit=crop",
    icon: "medical",
    size: "medium",
  },
  {
    id: 5,
    title: "Elder Support",
    subtitle: "",
    image:
      "https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=400&auto=format&fit=crop",
    icon: "walk",
    size: "medium",
  },
  {
    id: 6,
    title: "Crisis Support",
    subtitle: "Immediate help",
    image:
      "https://images.unsplash.com/photo-1542884706-258e2501a4e1?q=80&w=400&auto=format&fit=crop",
    icon: "medical-outline",
    size: "medium",
  },
];

export default function Resources() {
  const router = useRouter();

  return (
    <StyledView className="flex-1 bg-[#F0F4FA]">
      <CustomHeader title="Safe Connections" />
      <StyledScrollView
        className="flex-1 px-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <StyledView className="mt-6 mb-8">
          <StyledText className="text-[#002B49] text-4xl font-extrabold">
            Find the support you need
          </StyledText>
          <StyledText className="text-[#1F2937]/70 text-base font-medium mt-2 leading-6">
            Find organisations and services that can help. You decide who to
            contact and how.
          </StyledText>
        </StyledView>

        {/* Search Bar */}
        <StyledView className="flex-row items-center bg-white rounded-3xl px-4 py-3 mb-8 border border-white shadow-sm">
          <Ionicons name="search" size={20} color="#94A3B8" />
          <StyledTextInput
            placeholder="Search by name, topic, or type..."
            className="flex-1 ml-3 text-base text-[#1F2937]"
            placeholderTextColor="#94A3B8"
          />
        </StyledView>

        {/* Filter Pills */}
        <StyledScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mb-8"
          contentContainerStyle={{ paddingRight: 24 }}
        >
          <StyledTouchableOpacity className="flex-row items-center bg-[#D1E9FF]/50 px-5 py-2.5 rounded-full mr-3 border border-[#3B82F6]/10">
            <StyledText className="text-[#3B82F6] font-bold text-sm">
              Language
            </StyledText>
            <Ionicons
              name="chevron-down"
              size={14}
              color="#3B82F6"
              className="ml-2"
            />
          </StyledTouchableOpacity>
          <StyledTouchableOpacity className="flex-row items-center bg-[#D1E9FF]/50 px-5 py-2.5 rounded-full mr-3 border border-[#3B82F6]/10">
            <StyledText className="text-[#3B82F6] font-bold text-sm">
              Region
            </StyledText>
            <Ionicons
              name="location"
              size={14}
              color="#3B82F6"
              className="ml-2"
            />
          </StyledTouchableOpacity>
          <StyledTouchableOpacity className="bg-[#D1E9FF]/50 px-5 py-2.5 rounded-full border border-[#3B82F6]/10">
            <StyledText className="text-[#3B82F6] font-bold text-sm">
              Service Type
            </StyledText>
          </StyledTouchableOpacity>
        </StyledScrollView>

        {/* Masonry-style Grid */}
        <StyledView className="flex-row flex-wrap justify-between">
          <StyledTouchableOpacity
            className="w-full mb-4"
            activeOpacity={0.7}
            onPress={() => router.push("/home/service-details")}
          >
            <ImageBackground
              source={{ uri: RESOURCE_ITEMS[0].image }}
              className="h-44 rounded-[40px] overflow-hidden"
              resizeMode="cover"
            >
              <StyledView className="flex-1 bg-black/30 p-6 justify-end">
                <StyledView className="bg-white/30 rounded-full w-10 h-10 items-center justify-center mb-2">
                  <Ionicons name="hammer" size={20} color="white" />
                </StyledView>
                <StyledText className="text-white text-2xl font-bold">
                  Legal Aid
                </StyledText>
                <StyledText className="text-white/80 text-[12px] font-medium">
                  Legal advice and rights information
                </StyledText>
              </StyledView>
            </ImageBackground>
          </StyledTouchableOpacity>

          {/* Staggered Column 1 */}
          <StyledView className="w-[48%]">
            <StyledTouchableOpacity
              className="mb-4"
              activeOpacity={0.7}
              onPress={() => router.push("/home/service-details")}
            >
              <ImageBackground
                source={{ uri: RESOURCE_ITEMS[2].image }}
                className="h-96 rounded-[40px] overflow-hidden"
                resizeMode="cover"
              >
                <StyledView className="flex-1 bg-black/40 p-6 justify-end">
                  <StyledView className="bg-white/30 rounded-full w-10 h-10 items-center justify-center mb-2">
                    <Ionicons name="bulb" size={20} color="white" />
                  </StyledView>
                  <StyledText className="text-white text-2xl font-bold">
                    Counselling
                  </StyledText>
                  <StyledText className="text-white/80 text-[12px] font-medium">
                    Mental health support
                  </StyledText>
                </StyledView>
              </ImageBackground>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              className="mb-4"
              activeOpacity={0.7}
              onPress={() => router.push("/home/service-details")}
            >
              <ImageBackground
                source={{ uri: RESOURCE_ITEMS[4].image }}
                className="h-48 rounded-[40px] overflow-hidden"
                resizeMode="cover"
              >
                <StyledView className="flex-1 bg-black/40 p-6 justify-end">
                  <StyledView className="bg-white/30 rounded-full w-10 h-10 items-center justify-center mb-2">
                    <Ionicons name="walk" size={20} color="white" />
                  </StyledView>
                  <StyledText className="text-white text-2xl font-bold leading-tight">
                    Elder{"\n"}Support
                  </StyledText>
                </StyledView>
              </ImageBackground>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Staggered Column 2 */}
          <StyledView className="w-[48%]">
            <StyledTouchableOpacity
              className="mb-4"
              activeOpacity={0.7}
              onPress={() => router.push("/home/service-details")}
            >
              <ImageBackground
                source={{ uri: RESOURCE_ITEMS[1].image }}
                className="h-48 rounded-[40px] overflow-hidden"
                resizeMode="cover"
              >
                <StyledView className="flex-1 bg-black/40 p-6 justify-end">
                  <StyledView className="bg-white/30 rounded-full w-10 h-10 items-center justify-center mb-2">
                    <Ionicons name="people" size={20} color="white" />
                  </StyledView>
                  <StyledText className="text-white text-[18px] font-extrabold leading-tight">
                    Community{"\n"}Support
                  </StyledText>
                </StyledView>
              </ImageBackground>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              className="mb-4"
              activeOpacity={0.7}
              onPress={() => router.push("/home/service-details")}
            >
              <ImageBackground
                source={{ uri: RESOURCE_ITEMS[3].image }}
                className="h-60 rounded-[40px] overflow-hidden"
                resizeMode="cover"
              >
                <StyledView className="flex-1 bg-black/40 p-6 justify-end">
                  <StyledView className="bg-white/30 rounded-full w-10 h-10 items-center justify-center mb-2">
                    <Ionicons name="medical" size={20} color="white" />
                  </StyledView>
                  <StyledText className="text-white text-2xl font-bold">
                    Health Services
                  </StyledText>
                </StyledView>
              </ImageBackground>
            </StyledTouchableOpacity>

            <StyledTouchableOpacity
              className="mb-4"
              activeOpacity={0.7}
              onPress={() => router.push("/home/service-details")}
            >
              <ImageBackground
                source={{ uri: RESOURCE_ITEMS[5].image }}
                className="h-48 rounded-[40px] overflow-hidden"
                resizeMode="cover"
              >
                <StyledView className="flex-1 bg-[#F87171] p-6 justify-end">
                  <StyledView className="bg-white/30 rounded-full w-10 h-10 items-center justify-center mb-2">
                    <Ionicons name="medical-outline" size={20} color="white" />
                  </StyledView>
                  <StyledText className="text-white text-2xl font-bold leading-tight">
                    Crisis{"\n"}Support
                  </StyledText>
                  <StyledText className="text-white/80 text-[10px] font-medium">
                    Immediate help
                  </StyledText>
                </StyledView>
              </ImageBackground>
            </StyledTouchableOpacity>
          </StyledView>

          {/* Online Safety Bottom Card */}
          <StyledView className="w-full mt-4">
            <StyledTouchableOpacity
              className="bg-[#6366F1] rounded-[40px] p-6 h-40 justify-center overflow-hidden"
              activeOpacity={0.7}
              onPress={() => router.push("/home/service-details")}
            >
              <StyledView className="flex-row items-center">
                <StyledView className="bg-white/20 p-4 rounded-[20px] mr-4">
                  <Ionicons name="shield-checkmark" size={28} color="white" />
                </StyledView>
                <StyledView className="flex-1">
                  <StyledText className="text-white text-2xl font-bold">
                    Online Safety
                  </StyledText>
                  <StyledText className="text-white/80 text-[12px] font-medium mt-1">
                    Protection against cyber threats and harassment
                  </StyledText>
                </StyledView>
              </StyledView>
              {/* Decorative background logo */}
              <StyledView className="absolute right-0 opacity-10">
                <Ionicons name="shield" size={150} color="white" />
              </StyledView>
            </StyledTouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledScrollView>
    </StyledView>
  );
}
