import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import * as XLSX from "xlsx";

import type { AttendanceRecord } from "@/types/student";

const ATTENDANCE_EXPORT_HISTORY_KEY = "educonnect_attendance_export_history";

export type AttendanceExportRow = {
  id: string;
  studentName: string;
  studentId: string;
  attendanceStatus: "Present" | "Absent";
  date: string;
  time: string;
  staffName: string;
  subject: string;
  className: string;
  createdAt: number;
};

export type AttendanceExportFilter = {
  date?: string;
  className?: string;
  subject?: string;
  staffName?: string;
};

function normalizeString(value?: string): string {
  return value?.trim() ?? "";
}

function getExportDirectory(): string {
  const rootDirectory =
    FileSystem.documentDirectory ?? FileSystem.cacheDirectory;

  if (!rootDirectory) {
    throw new Error("Unable to determine an export directory.");
  }

  return rootDirectory;
}

function buildWorkbookRows(rows: AttendanceExportRow[]): unknown[][] {
  const headers = [
    "Student Name",
    "Student ID",
    "Attendance Status",
    "Date",
    "Time",
    "Staff Name",
    "Subject",
    "Class",
  ];

  return [
    headers,
    ...rows.map((row) => [
      row.studentName,
      row.studentId,
      row.attendanceStatus,
      row.date,
      row.time,
      row.staffName,
      row.subject,
      row.className,
    ]),
  ];
}

async function writeWorkbookToPath(
  rows: AttendanceExportRow[],
  destinationPath: string,
): Promise<void> {
  const directory = `${getExportDirectory()}attendance_exports/`;
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(buildWorkbookRows(rows));

  XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
  const workbookBase64 = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "base64",
  });

  await FileSystem.writeAsStringAsync(destinationPath, workbookBase64, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

async function loadStoredRows(): Promise<AttendanceExportRow[]> {
  const raw = await AsyncStorage.getItem(ATTENDANCE_EXPORT_HISTORY_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as AttendanceExportRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getAttendanceExportRows(): Promise<
  AttendanceExportRow[]
> {
  return loadStoredRows();
}

export async function saveAttendanceExportRows(
  rows: AttendanceExportRow[],
): Promise<string> {
  const serializedRows = rows.slice().sort((a, b) => b.createdAt - a.createdAt);
  const destinationPath = `${getExportDirectory()}attendance_exports/attendance_export.xlsx`;

  await AsyncStorage.setItem(
    ATTENDANCE_EXPORT_HISTORY_KEY,
    JSON.stringify(serializedRows),
  );
  await writeWorkbookToPath(serializedRows, destinationPath);

  return destinationPath;
}

export async function appendAttendanceExportRow(
  row: AttendanceExportRow,
): Promise<string> {
  const rows = await loadStoredRows();
  rows.unshift(row);
  return saveAttendanceExportRows(rows);
}

export function normalizeAttendanceExportRow(
  record: AttendanceRecord,
): AttendanceExportRow {
  return {
    id: record.id,
    studentName: normalizeString(record.studentName),
    studentId: normalizeString(record.studentId),
    attendanceStatus: record.status === "present" ? "Present" : "Absent",
    date: normalizeString(record.date),
    time: normalizeString(record.time),
    staffName: normalizeString(record.markedBy),
    subject: normalizeString(record.subject),
    className: normalizeString(record.className),
    createdAt: record.createdAt,
  };
}

export async function getFilteredAttendanceExportRows(
  filter: AttendanceExportFilter,
): Promise<AttendanceExportRow[]> {
  const rows = await getAttendanceExportRows();
  const normalizedFilter = {
    date: normalizeString(filter.date),
    className: normalizeString(filter.className),
    subject: normalizeString(filter.subject),
    staffName: normalizeString(filter.staffName),
  };

  return rows.filter((row) => {
    const matchesDate =
      !normalizedFilter.date || row.date === normalizedFilter.date;
    const matchesClass =
      !normalizedFilter.className ||
      row.className.toLowerCase() === normalizedFilter.className.toLowerCase();
    const matchesSubject =
      !normalizedFilter.subject ||
      row.subject.toLowerCase() === normalizedFilter.subject.toLowerCase();
    const matchesStaff =
      !normalizedFilter.staffName ||
      row.staffName.toLowerCase() === normalizedFilter.staffName.toLowerCase();

    return matchesDate && matchesClass && matchesSubject && matchesStaff;
  });
}

export async function downloadAttendanceWorkbook(
  filter: AttendanceExportFilter = {},
): Promise<string> {
  const filteredRows = await getFilteredAttendanceExportRows(filter);

  if (!filteredRows.length) {
    throw new Error("No attendance records match the selected filters.");
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const destinationPath = `${getExportDirectory()}attendance_exports/attendance_export_${timestamp}.xlsx`;

  await writeWorkbookToPath(filteredRows, destinationPath);

  if (Platform.OS === "web") {
    const blob = await fetch(`file://${destinationPath}`).then((response) =>
      response.blob(),
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `attendance_export_${timestamp}.xlsx`;
    anchor.click();
    URL.revokeObjectURL(url);
    return destinationPath;
  }

  await Sharing.shareAsync(destinationPath, {
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    dialogTitle: "Download Attendance Export",
  });

  return destinationPath;
}
