import { BookOpen, ClipboardList, Upload } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "@/context/AuthContext";
import {
  addMarkRecord,
  calculateTotalMarks,
  findStudentByLoginId,
} from "@/services/studentService";

const INTERNAL_MAX = 50;
const EXTERNAL_MAX = 100;
const TOTAL_MAX = INTERNAL_MAX + EXTERNAL_MAX;

export default function UploadMarksScreen() {
  const { user } = useAuth();
  const [studentId, setStudentId] = useState("");
  const [subject, setSubject] = useState("");
  const [internalMarks, setInternalMarks] = useState("40");
  const [externalMarks, setExternalMarks] = useState("80");
  const [grade, setGrade] = useState("A");
  const [remarks, setRemarks] = useState("Good performance");
  const [isUploading, setIsUploading] = useState(false);

  const totalMarks = useMemo(() => {
    const parsedInternal = Number(internalMarks);
    const parsedExternal = Number(externalMarks);

    if (!Number.isFinite(parsedInternal) || !Number.isFinite(parsedExternal)) {
      return 0;
    }

    return calculateTotalMarks(parsedInternal, parsedExternal);
  }, [externalMarks, internalMarks]);

  const handleUpload = async () => {
    const trimmedStudentId = studentId.trim();
    const trimmedSubject = subject.trim();
    const trimmedRemarks = remarks.trim();

    if (!trimmedStudentId) {
      Alert.alert(
        "Missing student ID",
        "Enter the student's ID to upload marks.",
      );
      return;
    }

    if (!trimmedSubject) {
      Alert.alert(
        "Missing subject",
        "Enter the subject name before uploading.",
      );
      return;
    }

    const parsedInternal = Number(internalMarks);
    const parsedExternal = Number(externalMarks);
    const trimmedGrade = grade.trim();

    if (
      !Number.isFinite(parsedInternal) ||
      parsedInternal < 0 ||
      parsedInternal > INTERNAL_MAX
    ) {
      Alert.alert(
        "Invalid internal marks",
        `Enter an internal marks value between 0 and ${INTERNAL_MAX}.`,
      );
      return;
    }

    if (
      !Number.isFinite(parsedExternal) ||
      parsedExternal < 0 ||
      parsedExternal > EXTERNAL_MAX
    ) {
      Alert.alert(
        "Invalid external marks",
        `Enter an external marks value between 0 and ${EXTERNAL_MAX}.`,
      );
      return;
    }

    if (!trimmedGrade) {
      Alert.alert("Missing grade", "Enter a grade before uploading marks.");
      return;
    }

    setIsUploading(true);

    try {
      const student = await findStudentByLoginId(trimmedStudentId);

      if (!student) {
        Alert.alert("Student not found", "No student matches that ID.");
        return;
      }

      await addMarkRecord(student.id, {
        subject: trimmedSubject,
        internalMarks: parsedInternal,
        externalMarks: parsedExternal,
        totalMarks: calculateTotalMarks(parsedInternal, parsedExternal),
        maxScore: TOTAL_MAX,
        grade: trimmedGrade,
        remarks: trimmedRemarks || undefined,
        uploadedBy: user?.loginId ?? user?.name ?? "staff",
      });

      Alert.alert("Success", `Marks uploaded for ${student.loginId}.`);
      setStudentId("");
      setSubject("");
      setInternalMarks("40");
      setExternalMarks("80");
      setGrade("A");
      setRemarks("Good performance");
    } catch (error) {
      Alert.alert("Upload failed", "Unable to upload marks right now.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Upload color="#111827" size={28} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Upload Marks</Text>
            <Text style={styles.subtitle}>Enter internals and externals</Text>
          </View>
        </View>

        <View style={styles.fieldCard}>
          <View style={styles.fieldRow}>
            <ClipboardList color="#2563eb" size={20} />
            <Text style={styles.fieldLabel}>Student ID</Text>
          </View>
          <TextInput
            value={studentId}
            onChangeText={setStudentId}
            style={styles.input}
            placeholder="Enter student ID"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldCard}>
          <View style={styles.fieldRow}>
            <BookOpen color="#16a34a" size={20} />
            <Text style={styles.fieldLabel}>Subject</Text>
          </View>
          <TextInput
            value={subject}
            onChangeText={setSubject}
            style={styles.input}
            placeholder="Subject"
          />
        </View>

        <View style={styles.fieldCard}>
          <View style={styles.fieldRow}>
            <ClipboardList color="#7c3aed" size={20} />
            <Text style={styles.fieldLabel}>Internal Marks</Text>
          </View>
          <TextInput
            value={internalMarks}
            onChangeText={setInternalMarks}
            style={styles.input}
            placeholder={`Enter internal marks (0 - ${INTERNAL_MAX})`}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.fieldCard}>
          <View style={styles.fieldRow}>
            <ClipboardList color="#0f172a" size={20} />
            <Text style={styles.fieldLabel}>External Marks</Text>
          </View>
          <TextInput
            value={externalMarks}
            onChangeText={setExternalMarks}
            style={styles.input}
            placeholder={`Enter external marks (0 - ${EXTERNAL_MAX})`}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Auto Total</Text>
          <Text style={styles.totalValue}>{totalMarks}/100</Text>
          <Text style={styles.totalHint}>
            Calculated from internal and external marks
          </Text>
        </View>

        <View style={styles.fieldCard}>
          <View style={styles.fieldRow}>
            <ClipboardList color="#0f172a" size={20} />
            <Text style={styles.fieldLabel}>Grade</Text>
          </View>
          <TextInput
            value={grade}
            onChangeText={setGrade}
            style={styles.input}
            placeholder="Enter grade (A+, A, B, C, D, F)"
            autoCapitalize="characters"
          />
        </View>

        <View style={styles.fieldCard}>
          <View style={styles.fieldRow}>
            <ClipboardList color="#0f172a" size={20} />
            <Text style={styles.fieldLabel}>Remarks</Text>
          </View>
          <TextInput
            value={remarks}
            onChangeText={setRemarks}
            style={[styles.input, styles.textArea]}
            placeholder="Enter remarks"
            multiline
          />
        </View>

        <TouchableOpacity
          style={[
            styles.uploadButton,
            isUploading && styles.uploadButtonDisabled,
          ]}
          onPress={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.uploadButtonText}>Upload Marks</Text>
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
  fieldCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  fieldLabel: { fontSize: 14, fontWeight: "600", color: "#111827" },
  input: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  totalCard: {
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#166534",
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#14532d",
  },
  totalHint: {
    fontSize: 12,
    color: "#166534",
    marginTop: 4,
  },
  uploadButton: {
    backgroundColor: "#2563eb",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
  },
  uploadButtonDisabled: { opacity: 0.7 },
  uploadButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
});
