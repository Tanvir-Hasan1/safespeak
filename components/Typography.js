import React from "react";
import { StyleSheet } from "react-native";
import AppText from "./AppText";

/**
 * Title — Poppins Bold, used for large screen headings.
 */
export const Title = ({ style, children, ...props }) => (
  <AppText style={[styles.title, style]} {...props}>
    {children}
  </AppText>
);

/**
 * Heading — Poppins SemiBold, used for section or card headings.
 */
export const Heading = ({ style, children, ...props }) => (
  <AppText style={[styles.heading, style]} {...props}>
    {children}
  </AppText>
);

/**
 * Body — Inter Regular, used for paragraphs and descriptions.
 */
export const Body = ({ style, children, ...props }) => (
  <AppText style={[styles.body, style]} {...props}>
    {children}
  </AppText>
);

/**
 * Caption — Inter Regular, smaller body text.
 */
export const Caption = ({ style, children, ...props }) => (
  <AppText style={[styles.caption, style]} {...props}>
    {children}
  </AppText>
);

const styles = StyleSheet.create({
  title: {
    fontFamily: "Poppins_700Bold",
    color: "#1F2937",
  },
  heading: {
    fontFamily: "Poppins_600SemiBold",
    color: "#1F2937",
  },
  body: {
    fontFamily: "Inter_400Regular",
    color: "#1F2937",
  },
  caption: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "#64748B",
  },
});
