import { ClipboardList, FileText } from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const initialAssignments = [
  { title: "Data Structures Homework", due: "May 28", status: "Open" },
  { title: "Web Dev Project", due: "Jun 3", status: "Pending" },
  { title: "Database Systems Quiz", due: "May 30", status: "Closed" },
];

export default function StaffAssignmentsScreen() {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [title, setTitle] = useState("");
  const [due, setDue] = useState("");
  const [status, setStatus] = useState("Open");

  const handleAddAssignment = () => {
    if (!title.trim() || !due.trim()) {
      Alert.alert(
        "Missing information",
        "Enter assignment title and due date.",
      );
      return;
    }

    setAssignments((prev) => [
      { title: title.trim(), due: due.trim(), status },
      ...prev,
    ]);
    setTitle("");
    setDue("");
    setStatus("Open");
    Alert.alert("Saved", "Assignment has been added successfully.");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <ClipboardList color="#111827" size={28} />
          <View style={styles.headerText}>
            <Text style={styles.title}>Assignments</Text>
            <Text style={styles.subtitle}>Manage teaching tasks</Text>
          </View>
        </View>

        <View style={styles.fieldCard}>
          <View style={styles.fieldRow}>
            <FileText color="#2563eb" size={20} />
            <Text style={styles.fieldLabel}>Title</Text>
          </View>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholder="Assignment title"
          />
        </View>

        <View style={styles.fieldCard}>
          <View style={styles.fieldRow}>
            <FileText color="#16a34a" size={20} />
            <Text style={styles.fieldLabel}>Due Date</Text>
          </View>
          <TextInput
            value={due}
            onChangeText={setDue}
            style={styles.input}
            placeholder="Due date (e.g. Jun 10)"
          />
        </View>

        <View style={styles.fieldCard}>
          <View style={styles.fieldRow}>
            <FileText color="#7c3aed" size={20} />
            <Text style={styles.fieldLabel}>Status</Text>
          </View>
          <TextInput
            value={status}
            onChangeText={setStatus}
            style={styles.input}
            placeholder="Open / Pending / Closed"
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleAddAssignment}
        >
          <Text style={styles.saveButtonText}>Save Assignment</Text>
        </TouchableOpacity>

        {assignments.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardHeader}>
              <FileText color="#2563eb" size={20} />
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
            <Text style={styles.cardDetail}>Due: {item.due}</Text>
            <Text style={styles.cardStatus}>{item.status}</Text>
          </View>
        ))}
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
    marginBottom: 24,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  // it is upadate the assigment titlecard
  fieldCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  fieldRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d1d5db",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 10,
    fontSize: 16,
    color: "#111827",
  },
  card: {
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
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  cardDetail: { fontSize: 14, color: "#4b5563", marginBottom: 8 },
  cardStatus: { fontSize: 13, fontWeight: "600", color: "#2563eb" },

  // Button desing
  saveButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 24,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
