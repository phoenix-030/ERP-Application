import { LinearGradient } from "expo-linear-gradient";
import { Clock, MapPin, User } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import { DAYS, getCurrentDayName, WEEKLY_SCHEDULE } from "@/lib/timetable";

export default function TimetableScreen() {
  const { user } = useAuth();
  const [activeDay, setActiveDay] = useState(getCurrentDayName());

  const selectedSubject = user?.subject?.trim().toLowerCase();

  const schedule = useMemo(() => {
    return WEEKLY_SCHEDULE[activeDay].map((lesson) => ({
      ...lesson,
      isSelected:
        selectedSubject !== undefined &&
        lesson.subject.toLowerCase() === selectedSubject,
    }));
  }, [activeDay, selectedSubject]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Clock color="#111827" size={28} />
            <Text style={styles.title}>Timetable</Text>
          </View>
          <Text style={styles.subtitle}>Daily class schedule</Text>
        </View>

        <View style={styles.daysWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.daysScroll}
            contentContainerStyle={styles.daysContainer}
          >
            {DAYS.map((day) => {
              const isActive = activeDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => setActiveDay(day)}
                  activeOpacity={0.8}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={["#6366f1", "#a855f7"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.dayTabActive}
                    >
                      <Text style={styles.dayTextActive}>{day}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.dayTabInactive}>
                      <Text style={styles.dayTextInactive}>{day}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.scheduleList}>
          {schedule.map((item) => (
            <View
              key={`${item.subject}-${item.time}`}
              style={[
                styles.classCard,
                item.isSelected && styles.classCardSelected,
              ]}
            >
              <View style={styles.classHeader}>
                <Text
                  style={[
                    styles.className,
                    item.isSelected && styles.classNameSelected,
                  ]}
                >
                  {item.subject}
                </Text>
                <View
                  style={[
                    styles.badge,
                    item.isSelected
                      ? styles.badgeGreen
                      : item.type === "Theory"
                        ? styles.badgeBlue
                        : styles.badgePurple,
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {item.isSelected ? "Teaching" : item.type}
                  </Text>
                </View>
              </View>

              <View style={styles.timeRow}>
                <Clock
                  color={item.isSelected ? "#14532d" : "#6b7280"}
                  size={14}
                />
                <Text
                  style={[
                    styles.timeText,
                    item.isSelected && styles.timeTextSelected,
                  ]}
                >
                  {item.time}
                </Text>
              </View>

              <View style={styles.detailsGrid}>
                <View
                  style={[
                    styles.detailBox,
                    item.isSelected
                      ? styles.detailBoxGreen
                      : styles.detailBoxBlue,
                  ]}
                >
                  <User
                    color={item.isSelected ? "#166534" : "#3b82f6"}
                    size={16}
                  />
                  <View style={styles.detailInfo}>
                    <Text style={styles.detailLabel}>Faculty</Text>
                    <Text style={styles.detailValue}>{item.faculty}</Text>
                  </View>
                </View>

                <View
                  style={[
                    styles.detailBox,
                    item.isSelected
                      ? styles.detailBoxGreen
                      : styles.detailBoxPurple,
                  ]}
                >
                  <MapPin
                    color={item.isSelected ? "#166534" : "#a855f7"}
                    size={16}
                  />
                  <View style={styles.detailInfo}>
                    <Text style={styles.detailLabel}>Room</Text>
                    <Text style={styles.detailValue}>{item.room}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
  container: { paddingTop: 20, paddingBottom: 40 },
  header: { paddingHorizontal: 20, marginBottom: 24 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  title: { fontSize: 28, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280" },
  daysWrapper: { marginBottom: 24 },
  daysScroll: { flexGrow: 0 },
  daysContainer: { gap: 12, paddingHorizontal: 20 },
  dayTabActive: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  dayTabInactive: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  dayTextActive: { color: "#ffffff", fontWeight: "600", fontSize: 15 },
  dayTextInactive: { color: "#4b5563", fontWeight: "500", fontSize: 15 },
  scheduleList: { paddingHorizontal: 20, gap: 16 },
  classCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  classCardSelected: {
    backgroundColor: "#ecfdf3",
    borderWidth: 1,
    borderColor: "#86efac",
  },
  classHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  className: { fontSize: 18, fontWeight: "600", color: "#111827" },
  classNameSelected: { color: "#166534" },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeBlue: { backgroundColor: "#2563eb" },
  badgePurple: { backgroundColor: "#a855f7" },
  badgeGreen: { backgroundColor: "#16a34a" },
  badgeText: { color: "#ffffff", fontSize: 12, fontWeight: "600" },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  timeText: { color: "#6b7280", fontSize: 14 },
  timeTextSelected: { color: "#166534", fontWeight: "700" },
  detailsGrid: { flexDirection: "row", gap: 12 },
  detailBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  detailBoxBlue: { backgroundColor: "#eff6ff" },
  detailBoxPurple: { backgroundColor: "#faf5ff" },
  detailBoxGreen: { backgroundColor: "#dcfce7" },
  detailInfo: { flex: 1 },
  detailLabel: { fontSize: 11, color: "#64748b", marginBottom: 2 },
  detailValue: { fontSize: 14, fontWeight: "500", color: "#1e293b" },
});
