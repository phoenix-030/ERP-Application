import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  appendAttendanceExportRow,
  normalizeAttendanceExportRow,
} from "@/services/attendanceExportService";
import { getUsers } from "@/services/authStorage";
import type {
  AssignmentRecord,
  AttendanceRecord,
  MarkRecord,
  StudentRecord,
  StudentUser,
} from "@/types/student";

const STUDENT_DATA_KEY = "educonnect_student_data";
const DEFAULT_TOTAL_MAX = 100;

const studentDataListeners = new Set<() => void>();
let cachedStudentDataMap: Record<string, StudentRecord> | null = null;
let studentDataLoadPromise: Promise<Record<string, StudentRecord>> | null =
  null;

function createDefaultRecord(): StudentRecord {
  return {
    attendance: [],
    marks: [],
    assignments: [],
  };
}

async function loadStudentDataMap(): Promise<Record<string, StudentRecord>> {
  if (cachedStudentDataMap) {
    return cachedStudentDataMap;
  }

  if (!studentDataLoadPromise) {
    studentDataLoadPromise = (async () => {
      const raw = await AsyncStorage.getItem(STUDENT_DATA_KEY);
      if (!raw) {
        cachedStudentDataMap = {};
        return cachedStudentDataMap;
      }

      try {
        cachedStudentDataMap = JSON.parse(raw) as Record<string, StudentRecord>;
      } catch {
        cachedStudentDataMap = {};
      }

      return cachedStudentDataMap;
    })().finally(() => {
      studentDataLoadPromise = null;
    });
  }

  return studentDataLoadPromise;
}

async function saveStudentDataMap(
  map: Record<string, StudentRecord>,
): Promise<void> {
  cachedStudentDataMap = map;
  await AsyncStorage.setItem(STUDENT_DATA_KEY, JSON.stringify(map));
  studentDataListeners.forEach((listener) => listener());
}

export function subscribeStudentData(listener: () => void): () => void {
  studentDataListeners.add(listener);
  return () => {
    studentDataListeners.delete(listener);
  };
}

export function calculateTotalMarks(
  internalMarks: number,
  externalMarks: number,
): number {
  const total = Math.round(internalMarks + externalMarks / 2);
  return Math.max(0, Math.min(DEFAULT_TOTAL_MAX, total));
}

export function calculateGrade(totalMarks: number): string {
  if (totalMarks >= 90) return "A+";
  if (totalMarks >= 80) return "A";
  if (totalMarks >= 70) return "B";
  if (totalMarks >= 60) return "C";
  if (totalMarks >= 50) return "D";
  return "F";
}

export function getMarkTotal(
  mark: Pick<
    MarkRecord,
    "totalMarks" | "score" | "internalMarks" | "externalMarks" | "maxScore"
  >,
): number {
  const computedTotal = calculateTotalMarks(
    mark.internalMarks ?? 0,
    mark.externalMarks ?? 0,
  );

  if (typeof mark.totalMarks === "number") {
    if (mark.maxScore === 150) {
      return computedTotal;
    }
    return Math.max(0, Math.min(DEFAULT_TOTAL_MAX, mark.totalMarks));
  }

  if (typeof mark.score === "number") {
    if (mark.maxScore === 150) {
      return computedTotal;
    }
    return Math.max(0, Math.min(DEFAULT_TOTAL_MAX, mark.score));
  }

  return computedTotal;
}

export function getMarkGrade(
  mark: Pick<
    MarkRecord,
    | "grade"
    | "totalMarks"
    | "score"
    | "internalMarks"
    | "externalMarks"
    | "maxScore"
  >,
): string {
  if (mark.grade) return mark.grade;
  return calculateGrade(getMarkTotal(mark));
}

export async function getAllStudentUsers(): Promise<StudentUser[]> {
  const users = await getUsers();
  return users
    .filter((user) => user.role === "student")
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      loginId: user.loginId,
      role: user.role,
    }));
}

export async function findStudentByLoginId(
  loginId: string,
): Promise<StudentUser | undefined> {
  const normalized = loginId.trim().toLowerCase();
  const students = await getAllStudentUsers();
  return students.find(
    (student) => student.loginId.trim().toLowerCase() === normalized,
  );
}

export async function getStudentRecordByUserId(
  userId: string,
): Promise<StudentRecord> {
  const map = await loadStudentDataMap();
  return map[userId] ?? createDefaultRecord();
}

export async function addAttendanceRecord(
  userId: string,
  record: Omit<AttendanceRecord, "id" | "createdAt">,
): Promise<StudentRecord> {
  const map = await loadStudentDataMap();
  const current = map[userId] ?? createDefaultRecord();
  const newRecord: AttendanceRecord = {
    ...record,
    date: record.date ?? new Date().toISOString().slice(0, 10),
    time:
      record.time ?? new Date().toLocaleTimeString("en-US", { hour12: false }),
    className: record.className ?? "General",
    studentId: record.studentId ?? userId,
    studentName: record.studentName ?? "Student",
    id: `${Date.now()}-${Math.random()}`,
    createdAt: Date.now(),
  };

  current.attendance.unshift(newRecord);
  map[userId] = current;
  await saveStudentDataMap(map);
  await appendAttendanceExportRow(normalizeAttendanceExportRow(newRecord));

  return current;
}

export async function addMarkRecord(
  userId: string,
  record: Omit<MarkRecord, "id" | "createdAt">,
): Promise<StudentRecord> {
  const map = await loadStudentDataMap();
  const current = map[userId] ?? createDefaultRecord();
  const internalMarks = record.internalMarks ?? 0;
  const externalMarks = record.externalMarks ?? 0;
  const totalMarks = calculateTotalMarks(internalMarks, externalMarks);
  const newRecord: MarkRecord = {
    ...record,
    internalMarks,
    externalMarks,
    totalMarks,
    score: totalMarks,
    maxScore: DEFAULT_TOTAL_MAX,
    grade: record.grade,
    id: `${Date.now()}-${Math.random()}`,
    createdAt: Date.now(),
  };
  current.marks.unshift(newRecord);
  map[userId] = current;
  await saveStudentDataMap(map);
  return current;
}

export async function addAssignmentRecord(
  userId: string,
  record: Omit<AssignmentRecord, "id" | "createdAt">,
): Promise<StudentRecord> {
  const map = await loadStudentDataMap();
  const current = map[userId] ?? createDefaultRecord();
  const newRecord: AssignmentRecord = {
    ...record,
    id: `${Date.now()}-${Math.random()}`,
    createdAt: Date.now(),
  };
  current.assignments.unshift(newRecord);
  map[userId] = current;
  await saveStudentDataMap(map);
  return current;
}

export async function getStudentRecordByLoginId(
  loginId: string,
): Promise<StudentRecord | null> {
  const student = await findStudentByLoginId(loginId);
  if (!student) return null;
  return getStudentRecordByUserId(student.id);
}

export async function getStudentById(
  userId: string,
): Promise<StudentUser | undefined> {
  const students = await getAllStudentUsers();
  return students.find((student) => student.id === userId);
}
