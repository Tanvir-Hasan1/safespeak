import { Stack } from "expo-router";

export default function ScamShieldLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="results" />
      <Stack.Screen name="submit-report" />
    </Stack>
  );
}
