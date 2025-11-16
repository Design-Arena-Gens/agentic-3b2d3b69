export type ActivityType =
  | "Field Trip"
  | "Sports"
  | "Arts"
  | "Academics"
  | "Community"
  | "Administration";

export type ActivityStatus = "Scheduled" | "Completed" | "Cancelled";

export interface Activity {
  id: string;
  title: string;
  className: string;
  type: ActivityType;
  description: string;
  advisor: string;
  location: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  status: ActivityStatus;
  tags: string[];
  notes?: string;
}

export const classes = [
  "Grade 6A",
  "Grade 6B",
  "Grade 7A",
  "Grade 7B",
  "Grade 8A",
  "Grade 8B",
  "Faculty",
] as const;

export const activityTypes: ActivityType[] = [
  "Field Trip",
  "Sports",
  "Arts",
  "Academics",
  "Community",
  "Administration",
];

export const activities: Activity[] = [
  {
    id: "ACT-001",
    title: "Science Museum Exploration",
    className: "Grade 7A",
    type: "Field Trip",
    description:
      "Hands-on learning experience covering physics exhibits and robotics lab tour.",
    advisor: "Ms. Patel",
    location: "City Science Museum",
    startDate: "2024-04-18",
    endDate: "2024-04-18",
    startTime: "09:00",
    endTime: "14:00",
    status: "Scheduled",
    tags: ["STEM", "Experiential"],
    notes: "Permission slips due by April 12.",
  },
  {
    id: "ACT-002",
    title: "Inter-House Basketball Finals",
    className: "Grade 8B",
    type: "Sports",
    description:
      "Annual inter-house basketball finals with cheering squads and halftime performance.",
    advisor: "Coach Ramirez",
    location: "Main Gymnasium",
    startDate: "2024-04-20",
    endDate: "2024-04-20",
    startTime: "16:30",
    endTime: "18:00",
    status: "Scheduled",
    tags: ["Athletics", "Team Building"],
  },
  {
    id: "ACT-003",
    title: "Visual Arts Portfolio Review",
    className: "Grade 8A",
    type: "Arts",
    description:
      "Mid-term portfolio review focused on composition and color theory feedback.",
    advisor: "Mr. Nguyen",
    location: "Art Studio 2",
    startDate: "2024-04-19",
    endDate: "2024-04-19",
    startTime: "11:00",
    endTime: "12:30",
    status: "Scheduled",
    tags: ["Creative", "Assessment"],
  },
  {
    id: "ACT-004",
    title: "Math Olympiad Training Camp",
    className: "Grade 7B",
    type: "Academics",
    description:
      "Weekend intensive training covering problem-solving strategies and mock tests.",
    advisor: "Dr. Wallace",
    location: "Room 304",
    startDate: "2024-04-27",
    endDate: "2024-04-28",
    startTime: "08:30",
    endTime: "16:00",
    status: "Scheduled",
    tags: ["Competition", "Extension"],
  },
  {
    id: "ACT-005",
    title: "Community Garden Build Day",
    className: "Grade 6A",
    type: "Community",
    description:
      "Service project installing raised beds and planting spring vegetables.",
    advisor: "Ms. Hernandez",
    location: "South Courtyard",
    startDate: "2024-04-13",
    endDate: "2024-04-13",
    startTime: "10:00",
    endTime: "13:00",
    status: "Completed",
    tags: ["Service", "Sustainability"],
  },
  {
    id: "ACT-006",
    title: "Faculty PD: Differentiated Instruction",
    className: "Faculty",
    type: "Administration",
    description:
      "Professional development workshop sharing strategies for mixed-ability classrooms.",
    advisor: "Instructional Team",
    location: "Library Conference Room",
    startDate: "2024-04-05",
    endDate: "2024-04-05",
    startTime: "15:30",
    endTime: "17:00",
    status: "Completed",
    tags: ["PD", "Teaching"],
  },
  {
    id: "ACT-007",
    title: "Spring Musical Dress Rehearsal",
    className: "Grade 7A",
    type: "Arts",
    description:
      "Full run-through with costumes, lights, and audio checks before opening night.",
    advisor: "Mrs. Allen",
    location: "Auditorium",
    startDate: "2024-04-24",
    endDate: "2024-04-24",
    startTime: "18:00",
    endTime: "21:00",
    status: "Scheduled",
    tags: ["Performance", "Production"],
  },
  {
    id: "ACT-008",
    title: "Robotics Club Showcase",
    className: "Grade 8B",
    type: "Academics",
    description:
      "Demonstrations of autonomous robots and presentations on engineering process.",
    advisor: "Mr. Ibrahim",
    location: "Innovation Lab",
    startDate: "2024-04-22",
    endDate: "2024-04-22",
    startTime: "13:00",
    endTime: "15:00",
    status: "Scheduled",
    tags: ["STEM", "Showcase"],
  },
  {
    id: "ACT-009",
    title: "Eco Club Stream Cleanup",
    className: "Grade 6B",
    type: "Community",
    description:
      "Outdoor cleanup near Riverside Park with reflection session on conservation.",
    advisor: "Ms. Long",
    location: "Riverside Park",
    startDate: "2024-04-14",
    endDate: "2024-04-14",
    startTime: "09:30",
    endTime: "12:00",
    status: "Completed",
    tags: ["Environment", "Field Work"],
  },
  {
    id: "ACT-010",
    title: "Parent-Teacher Conferences",
    className: "Grade 6A",
    type: "Administration",
    description:
      "Quarterly conferences with families focusing on academic progress and goals.",
    advisor: "Administration",
    location: "Multipurpose Hall",
    startDate: "2024-04-16",
    endDate: "2024-04-17",
    startTime: "17:00",
    endTime: "20:00",
    status: "Scheduled",
    tags: ["Family Engagement"],
  },
];
