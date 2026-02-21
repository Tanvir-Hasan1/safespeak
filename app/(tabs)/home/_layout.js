import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="scam-shield" />
      <Stack.Screen name="micro-cards" />
      <Stack.Screen name="resources" />
      <Stack.Screen name="report-submission" />
    </Stack>
  );
}
