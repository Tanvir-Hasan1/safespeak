import { Stack } from "expo-router";

export default function MicroCardsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="micro-education" />
      <Stack.Screen name="lesson-detail" />
    </Stack>
  );
}
