import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
const TopLeftCard = require("../../../assets/images/home/top-left-card.png");
const TopRightCard = require("../../../assets/images/home/top-right-card.png");
import BottomLeftCard from "../../../assets/images/home/bottom-left-card.svg";
import BottomRightCard from "../../../assets/images/home/bottom-right-card.svg";

const Sphere = require("../../../assets/images/home/Sphere.png");

import { useRouter } from "expo-router";
import { useLanguage } from "../../../context/LanguageContext";

const { width } = Dimensions.get("window");

// Constants for layout
const HUB_SIZE = Math.min(width * 0.95, 400); // Responsive max width
const GAP = HUB_SIZE * 0.04; // Responsive gap (4% of hub size)
const CARD_SIZE = (HUB_SIZE - GAP) / 2;
const SPHERE_SIZE = 150; // Precisely sized sphere

const ReportingHub = React.memo(() => {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <View style={styles.outerContainer}>
      <View style={styles.hubContainer}>
        {/* Top row */}
        <View style={styles.flexRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/home/incident-builder/assistant?topic=domestic_violence")}
          >
            <Image
              source={TopLeftCard}
              style={{ width: scale(145), height: scale(190) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/home/incident-builder/assistant?topic=racial_abuse")}
          >
            <Image
              source={TopRightCard}
              style={{ width: scale(145), height: scale(190) }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Bottom row */}
        <View style={styles.flexRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/home/incident-builder/assistant?topic=cyber_scam")}
          >
            <BottomLeftCard width={scale(145)} height={scale(190)} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/home/incident-builder/assistant?topic=migrant_challenges")}
          >
            <BottomRightCard width={scale(145)} height={scale(190)} />
          </TouchableOpacity>
        </View>

        {/* Central Sphere with centered text — overlaid via absolute */}
        <View style={styles.sphereWrapper}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.sphereContent}
            onPress={() => router.push("/home/incident-builder")}
          >
            <Image
              source={Sphere}
              style={{ width: scale(SPHERE_SIZE), height: scale(SPHERE_SIZE) }}
              resizeMode="contain"
            />
            <View style={styles.textOverlay}>
              <Text style={styles.sphereText}>{t("reportIncident")}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  outerContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 32,
  },
  hubContainer: {
    gap: scale(14),
    width: HUB_SIZE,
    flexDirection: "column",
  },
  flexRow: {
    gap: scale(12),
    justifyContent: "center",
    flexDirection: "row",
  },

  sphereWrapper: {
    position: "absolute",
    zIndex: 10,
    top: "50%",
    left: "50%",
    width: scale(SPHERE_SIZE),
    height: scale(SPHERE_SIZE),
    marginTop: -scale(SPHERE_SIZE) / 2,
    marginLeft: -scale(SPHERE_SIZE) / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  textOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  sphereText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default ReportingHub;
