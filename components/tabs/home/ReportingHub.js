import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import TopLeftCard from "../../../assets/images/home/top-left-card.svg";
import TopRightCard from "../../../assets/images/home/top-right-card.svg";
import BottomLeftCard from "../../../assets/images/home/bottom-left-card.svg";
import BottomRightCard from "../../../assets/images/home/bottom-right-card.svg";
import Sphere from "../../../assets/images/home/Sphere.svg";

import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

// Constants for layout
const HUB_SIZE = Math.min(width * 0.95, 400); // Responsive max width
const GAP = HUB_SIZE * 0.04; // Responsive gap (4% of hub size)
const CARD_SIZE = (HUB_SIZE - GAP) / 2;
const SPHERE_SIZE = HUB_SIZE * 0.42; // Precisely sized sphere

const ReportingHub = React.memo(() => {
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      <View style={styles.hubContainer}>
        {/* The 2x2 Grid using absolute positioning */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.cardContainer, styles.topLeft]}
          onPress={() => router.push("/home/incident-builder")}
        >
          <TopLeftCard width={CARD_SIZE} height={CARD_SIZE} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.cardContainer, styles.topRight]}
          onPress={() => router.push("/home/incident-builder")}
        >
          <TopRightCard width={CARD_SIZE} height={CARD_SIZE} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.cardContainer, styles.bottomLeft]}
          onPress={() => router.push("/home/incident-builder")}
        >
          <BottomLeftCard width={CARD_SIZE} height={CARD_SIZE} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.cardContainer, styles.bottomRight]}
          onPress={() => router.push("/home/incident-builder")}
        >
          <BottomRightCard width={CARD_SIZE} height={CARD_SIZE} />
        </TouchableOpacity>

        {/* Central Sphere with centered text */}
        <View style={styles.sphereWrapper}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.sphereContent}
            onPress={() => router.push("/home/incident-builder")}
          >
            <Sphere width={SPHERE_SIZE} height={SPHERE_SIZE} />
            <View style={styles.textOverlay}>
              <Text style={styles.sphereText}>Report{"\n"}an incident</Text>
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
    width: HUB_SIZE,
    height: HUB_SIZE,
    position: "relative",
  },
  cardContainer: {
    position: "absolute",
    width: CARD_SIZE,
    height: CARD_SIZE,
  },
  topLeft: {
    top: 0,
    left: 0,
  },
  topRight: {
    top: 0,
    right: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
  },
  sphereWrapper: {
    position: "absolute",
    zIndex: 10,
    top: "50%",
    left: "50%",
    width: SPHERE_SIZE,
    height: SPHERE_SIZE,
    marginTop: -(SPHERE_SIZE / 2),
    marginLeft: -(SPHERE_SIZE / 2),
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
