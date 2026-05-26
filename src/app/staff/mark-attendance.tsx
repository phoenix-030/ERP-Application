import { CalendarCheck, CheckCircle2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import {
  addAttendanceRecord,
  getAllStudentUsers,
} from "@/services/studentService";

type StudentAttendanceOption = {
  id: string;
  name: string;
  loginId: string;
  present: boolean;
};

export default function MarkAttendanceScreen() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentAttendanceOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadStudents() {
      try {
        const studentUsers = await getAllStudentUsers();
        if (!isMounted) {
          return;
        }

        setStudents(
          studentUsers.map((student) => ({
            id: student.id,
            name: student.name,
            loginId: student.loginId,
            present: false,
          })),
        );
      } catch (error) {
        if (!isMounted) {
          return;
        }

        Alert.alert("Failed to load students", "Please try again.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadStudents();

    return () => {
      isMounted = false;
    };
  }, []);

  const toggleAttendance = (index: number) => {
    setStudents((prev) =>
      prev.map((student, i) =>
        i === index ? { ...student, present: !student.present } : student,
      ),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const today = new Date().toISOString().slice(0, 10);

      await Promise.all(
        students.map((student) =>
          addAttendanceRecord(student.id, {
            date: today,
            subject: "Attendance",
            status: student.present ? "present" : "absent",
            markedBy: user?.loginId ?? user?.name ?? "staff",
          }),
        ),
      );

      Alert.alert("Attendance Saved", "Student attendance has been updated.");
    } catch (error) {
      Alert.alert("Save failed", "Unable to save attendance right now.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <CalendarCheck color="#111827" size={28} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Mark Attendance</Text>
            <Text style={styles.subtitle}>
              Record student presence by name and ID
            </Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#2563eb" />
            <Text style={styles.loadingText}>Loading students...</Text>
          </View>
        ) : (
          students.map((student, index) => (
            <View key={student.id} style={styles.studentRow}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentLogin}>ID: {student.loginId}</Text>
                <Text style={styles.studentStatus}>
                  {student.present ? "Present" : "Absent"}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.statusPill,
                  {
                    backgroundColor: student.present ? "#dcfce7" : "#fee2e2",
                  },
                ]}
                onPress={() => toggleAttendance(index)}
              >
                <CheckCircle2
                  color={student.present ? "#16a34a" : "#ef4444"}
                  size={18}
                />
                <Text
                  style={[
                    styles.pillText,
                    {
                      color: student.present ? "#166534" : "#991b1b",
                    },
                  ]}
                >
                  {student.present ? "Present" : "Absent"}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving || isLoading}
        >
          {isSaving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Attendance</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f3f4f6" },
  container: { padding: 20, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  headerText: { flex: 1 },
  title: { fontSize: 28, fontWeight: "700", color: "#111827" },
  subtitle: { fontSize: 14, color: "#6b7280" },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 12,
  },
  loadingText: { color: "#64748b", fontSize: 14 },
  studentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  studentInfo: { flex: 1, marginRight: 16 },
  studentName: { fontSize: 16, fontWeight: "600", color: "#111827" },
  studentLogin: { fontSize: 13, color: "#64748b", marginTop: 4 },
  studentStatus: { fontSize: 12, color: "#64748b", marginTop: 4 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#eef2ff",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  pillText: { fontSize: 12, fontWeight: "600", color: "#4338ca" },
  saveButton: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
});
