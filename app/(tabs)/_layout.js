import { Tabs, useSegments, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Platform,
  TouchableOpacity,
  BackHandler,
  Alert,
} from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);

const ACTIVE = "#FF8A00";
const INACTIVE = "#9CA3AF";

const exitApp = () => {
  Alert.alert(
    "Exit App",
    "Are you sure you want to exit?",
    [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          if (Platform.OS === "android") {
            BackHandler.exitApp();
          }
        },
      },
    ],
    { cancelable: true },
  );
};

function HomeTabButton({ onPress }) {
  const pathname = usePathname();
  const focused = pathname === "/home" || pathname.startsWith("/home/");
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <StyledView className="items-center justify-center">
        <Ionicons name="home" size={26} color={focused ? ACTIVE : INACTIVE} />
        {focused && (
          <StyledView className="w-1.5 h-1.5 bg-[#FF8A00] rounded-full mt-1" />
        )}
      </StyledView>
    </TouchableOpacity>
  );
}

function ProfileTabButton({ onPress }) {
  const pathname = usePathname();
  const focused = pathname === "/profile" || pathname.startsWith("/profile/");
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <StyledView className="items-center justify-center">
        <Ionicons
          name="person"
          size={26}
          color={focused ? ACTIVE : "#94A3B8"}
        />
        {focused && (
          <StyledView className="w-1.5 h-1.5 bg-[#FF8A00] rounded-full mt-1" />
        )}
      </StyledView>
    </TouchableOpacity>
  );
}

export default function TabLayout() {
  const segments = useSegments();

  // Hide tab bar on sub-pages (e.g., /home/scam-shield)
  const hideTabBar = segments.length > 2;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true, // Useful for performance when typing
        tabBarStyle: {
          backgroundColor: "#F0F4FA", // Match background to prevent flickering
          borderTopWidth: 0,
          elevation: hideTabBar ? 0 : 10,
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
          paddingBottom: 0,
          paddingTop: 0,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ translateY: hideTabBar ? 200 : 0 }], // Move off-screen instead of just display:none
          opacity: hideTabBar ? 0 : 1,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarButton: ({ onPress }) => <HomeTabButton onPress={onPress} />,
        }}
      />

      <Tabs.Screen
        name="reporting"
        options={{
          tabBarButton: () => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={exitApp}
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
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
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarButton: ({ onPress }) => <ProfileTabButton onPress={onPress} />,
        }}
      />
    </Tabs>
  );
}
