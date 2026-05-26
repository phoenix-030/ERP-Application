export type TimetableLesson = {
  subject: string;
  section: string;
  time: string;
  students: number;
  room: string;
  type: "Theory" | "Lab";
  faculty: string;
};

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

export type DayName = (typeof DAYS)[number];

export const WEEKLY_SCHEDULE: Record<DayName, TimetableLesson[]> = {
  Monday: [
    {
      subject: "Data Structures",
      section: "CSE-3A",
      time: "09:00 AM",
      students: 60,
      room: "CS-101",
      type: "Theory",
      faculty: "Dr. Smith",
    },
    {
      subject: "Web Development",
      section: "CSE-3B",
      time: "10:00 AM",
      students: 58,
      room: "CS-203",
      type: "Lab",
      faculty: "Prof. Johnson",
    },
    {
      subject: "Mathematics",
      section: "CSE-3A",
      time: "11:15 AM",
      students: 60,
      room: "CS-104",
      type: "Theory",
      faculty: "Dr. Mehta",
    },
    {
      subject: "Communication Skills",
      section: "CSE-3C",
      time: "12:15 PM",
      students: 55,
      room: "LH-2",
      type: "Theory",
      faculty: "Ms. Verma",
    },
    {
      subject: "Database Systems",
      section: "CSE-3B",
      time: "02:00 PM",
      students: 58,
      room: "CS-105",
      type: "Theory",
      faculty: "Dr. Williams",
    },
  ],
  Tuesday: [
    {
      subject: "Database Systems",
      section: "CSE-3A",
      time: "09:00 AM",
      students: 60,
      room: "CS-105",
      type: "Theory",
      faculty: "Dr. Williams",
    },
    {
      subject: "Operating Systems",
      section: "CSE-3C",
      time: "10:00 AM",
      students: 55,
      room: "CS-110",
      type: "Theory",
      faculty: "Dr. Rao",
    },
    {
      subject: "Computer Networks",
      section: "CSE-3B",
      time: "11:15 AM",
      students: 58,
      room: "CS-203",
      type: "Theory",
      faculty: "Prof. Brown",
    },
    {
      subject: "Python Lab",
      section: "CSE-3A",
      time: "12:15 PM",
      students: 60,
      room: "Lab-1",
      type: "Lab",
      faculty: "Ms. Kapoor",
    },
    {
      subject: "Professional Ethics",
      section: "CSE-3C",
      time: "02:00 PM",
      students: 55,
      room: "LH-1",
      type: "Theory",
      faculty: "Dr. Nair",
    },
  ],
  Wednesday: [
    {
      subject: "Computer Networks",
      section: "CSE-3B",
      time: "09:00 AM",
      students: 58,
      room: "CS-203",
      type: "Theory",
      faculty: "Prof. Brown",
    },
    {
      subject: "Software Engineering",
      section: "CSE-3A",
      time: "10:00 AM",
      students: 60,
      room: "CS-106",
      type: "Lab",
      faculty: "Ms. Kapoor",
    },
    {
      subject: "Digital Logic",
      section: "CSE-3C",
      time: "11:15 AM",
      students: 55,
      room: "CS-109",
      type: "Theory",
      faculty: "Dr. Iyer",
    },
    {
      subject: "Data Structures",
      section: "CSE-3A",
      time: "12:15 PM",
      students: 60,
      room: "CS-101",
      type: "Theory",
      faculty: "Dr. Smith",
    },
    {
      subject: "Web Development",
      section: "CSE-3B",
      time: "02:00 PM",
      students: 58,
      room: "CS-203",
      type: "Theory",
      faculty: "Prof. Johnson",
    },
  ],
  Thursday: [
    {
      subject: "Database Systems",
      section: "CSE-3A",
      time: "09:00 AM",
      students: 60,
      room: "CS-105",
      type: "Theory",
      faculty: "Dr. Williams",
    },
    {
      subject: "Web Development",
      section: "CSE-3B",
      time: "10:00 AM",
      students: 58,
      room: "CS-203",
      type: "Theory",
      faculty: "Prof. Johnson",
    },
    {
      subject: "Operating Systems",
      section: "CSE-3C",
      time: "11:15 AM",
      students: 55,
      room: "CS-110",
      type: "Theory",
      faculty: "Dr. Rao",
    },
    {
      subject: "Java Programming",
      section: "CSE-3A",
      time: "12:15 PM",
      students: 60,
      room: "Lab-2",
      type: "Lab",
      faculty: "Ms. Sen",
    },
    {
      subject: "Research Methodology",
      section: "CSE-3B",
      time: "02:00 PM",
      students: 58,
      room: "LH-3",
      type: "Theory",
      faculty: "Dr. Menon",
    },
  ],
  Friday: [
    {
      subject: "Data Structures",
      section: "CSE-3A",
      time: "09:00 AM",
      students: 60,
      room: "CS-101",
      type: "Theory",
      faculty: "Dr. Smith",
    },
    {
      subject: "Computer Networks",
      section: "CSE-3B",
      time: "10:00 AM",
      students: 58,
      room: "CS-203",
      type: "Lab",
      faculty: "Prof. Brown",
    },
    {
      subject: "Software Engineering",
      section: "CSE-3A",
      time: "11:15 AM",
      students: 60,
      room: "CS-106",
      type: "Theory",
      faculty: "Ms. Kapoor",
    },
    {
      subject: "Logic Design",
      section: "CSE-3C",
      time: "12:15 PM",
      students: 55,
      room: "CS-108",
      type: "Theory",
      faculty: "Dr. Iyer",
    },
    {
      subject: "Project Review",
      section: "CSE-3B",
      time: "02:00 PM",
      students: 58,
      room: "Seminar Hall",
      type: "Theory",
      faculty: "Dr. Menon",
    },
  ],
};

export function getCurrentDayName(): DayName {
  const today = new Date().getDay();
  if (today >= 1 && today <= 5) {
    return DAYS[today - 1];
  }
  return "Monday";
}
