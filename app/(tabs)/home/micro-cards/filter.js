import React, { useState } from "react";
import { View, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import AppText from "../../../../components/AppText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLanguage } from "../../../../context/LanguageContext";
import CustomHeader from "../../../../components/CustomHeader";

export default function FilterScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const CATEGORIES = [
    { id: "bullying", label: t("bullying"), icon: "shield-outline" },
    {
      id: "discrimination",
      label: t("discrimination"),
      icon: "hand-left-outline",
    },
    { id: "migrant", label: t("filterMigrantRights"), icon: "walk-outline" },
    { id: "mental", label: t("mentalHealth"), icon: "heart-outline" },
    {
      id: "online",
      label: t("onlineSafety"),
      icon: "shield-checkmark-outline",
    },
  ];

  const DURATIONS = [
    {
      id: "quick",
      label: t("filterQuick"),
      sub: t("filterQuickSub"),
      icon: "flash-outline",
    },
    {
      id: "deep",
      label: t("filterDeepDive"),
      sub: t("filterDeepDiveSub"),
      icon: "school-outline",
    },
  ];

  const [selectedCategories, setSelectedCategories] = useState([
    "bullying",
    "mental",
  ]);
  const [selectedDuration, setSelectedDuration] = useState("quick");

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  return (
    <View style={styles.safe}>
      <CustomHeader title={t("filterLessons")} />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Section */}
        <AppText style={styles.sectionLabel}>{t("filterCategory")}</AppText>
        <View style={styles.card}>
          {CATEGORIES.map((cat, index) => {
            const isSelected = selectedCategories.includes(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                activeOpacity={0.7}
                onPress={() => toggleCategory(cat.id)}
                style={[
                  styles.categoryRow,
                  index < CATEGORIES.length - 1 && styles.categoryRowBorder,
                ]}
              >
                <Ionicons
                  name={cat.icon}
                  size={20}
                  color={isSelected ? "#005B96" : "#94A3B8"}
                  style={styles.categoryIcon}
                />
                <AppText
                  style={[
                    styles.categoryLabel,
                    isSelected && styles.categoryLabelActive,
                  ]}
                >
                  {cat.label}
                </AppText>
                {isSelected && <View style={styles.dot} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Duration Section */}
        <AppText style={styles.sectionLabel}>{t("filterDuration")}</AppText>
        <View style={styles.durationRow}>
          {DURATIONS.map((dur) => {
            const isSelected = selectedDuration === dur.id;
            return (
              <TouchableOpacity
                key={dur.id}
                activeOpacity={0.7}
                onPress={() => setSelectedDuration(dur.id)}
                style={[
                  styles.durationCard,
                  isSelected && styles.durationCardSelected,
                ]}
              >
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color="#005B96"
                    />
                  </View>
                )}
                <Ionicons
                  name={dur.icon}
                  size={26}
                  color={isSelected ? "#005B96" : "#94A3B8"}
                />
                <AppText
                  style={[
                    styles.durationLabel,
                    isSelected && styles.durationLabelActive,
                  ]}
                >
                  {dur.label}
                </AppText>
                <AppText style={styles.durationSub}>{dur.sub}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.applyBtn}
          onPress={() => router.back()}
        >
          <AppText style={styles.applyText}>{t("filterApply")}</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#EFF4FB",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Poppins_700Bold",
    color: "#94A3B8",
    letterSpacing: 1.2,
    marginTop: 24,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 16,
  },
  categoryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  categoryIcon: {
    marginRight: 14,
  },
  categoryLabel: {
    flex: 1,
    fontSize: 15,
    color: "#64748B",
    fontFamily: "Inter_400Regular",
  },
  categoryLabelActive: {
    color: "#005B96",
    fontFamily: "Poppins_600SemiBold",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#005B96",
  },
  durationRow: {
    flexDirection: "row",
    gap: 14,
  },
  durationCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    // elevation: 2,
    position: "relative",
  },
  durationCardSelected: {
    borderWidth: 1,
    borderColor: "#005B96",
  },
  checkBadge: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  durationLabel: {
    fontSize: 15,
    fontFamily: "Poppins_600SemiBold",
    color: "#64748B",
    marginTop: 10,
  },
  durationLabelActive: {
    color: "#1F2937",
    fontFamily: "Poppins_700Bold",
  },
  durationSub: {
    fontSize: 12,
    color: "#94A3B8",
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: "#EFF4FB",
  },
  applyBtn: {
    backgroundColor: "#003F6B",
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
  },
});
