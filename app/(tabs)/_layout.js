import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Platform } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 20,
          height: 70,
          position: "absolute",
          bottom: 15,
          left: 25,
          right: 25,
          borderRadius: 40,
          paddingHorizontal: 10,
          paddingBottom: 0, // Ensure no safe-area padding shifts icons up
          paddingTop: 0,
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <StyledView className="items-center justify-center">
              <Ionicons
                name="home"
                size={26}
                color={focused ? "#FF8A00" : "#9CA3AF"}
              />
              {focused && (
                <StyledView className="w-1.5 h-1.5 bg-[#FF8A00] rounded-full mt-1" />
              )}
            </StyledView>
          ),
        }}
      />

      <Tabs.Screen
        name="reporting"
        options={{
          tabBarIcon: ({ focused }) => (
            <StyledView
              className="w-12 h-12 rounded-full bg-[#EF4444] items-center justify-center"
              style={{
                shadowColor: "#EF4444",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 10,
                elevation: 10,
                borderWidth: 3,
                borderColor: "white",
              }}
            >
              <Ionicons name="exit-outline" size={24} color="white" />
            </StyledView>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <StyledView className="items-center justify-center">
              <Ionicons
                name="person"
                size={26}
                color={focused ? "#FF8A00" : "#94A3B8"}
              />
              {focused && (
                <StyledView className="w-1.5 h-1.5 bg-[#FF8A00] rounded-full mt-1" />
              )}
            </StyledView>
          ),
        }}
      />
    </Tabs>
  );
}
