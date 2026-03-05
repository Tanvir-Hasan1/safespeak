import React from "react";
import { Text, StyleSheet } from "react-native";

/**
 * A drop-in replacement for React Native's <Text> that automatically
 * applies Inter_400Regular as the base font. Explicit style props merge on top.
 *
 * Usage: import AppText from "@/components/AppText";
 *        <AppText style={{ fontSize: 16 }}>Hello</AppText>
 */
const AppText = ({ style, children, ...props }) => (
  <Text style={[styles.base, style]} {...props}>
    {children}
  </Text>
);

const styles = StyleSheet.create({
  base: {
    fontFamily: "Inter_400Regular",
  },
});

export default AppText;
