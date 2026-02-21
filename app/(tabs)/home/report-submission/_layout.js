import { Stack } from "expo-router";

export default function ReportSubmissionLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="recommendations" />
      <Stack.Screen name="attachments" />
      <Stack.Screen name="evidence-review" />
      <Stack.Screen name="detailed-explanations" />
    </Stack>
  );
}
