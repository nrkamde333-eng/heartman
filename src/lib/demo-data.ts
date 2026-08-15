import { addDaysKey, dayKey, localStamp, todayKey } from "./date-utils";

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "done";
export type Category = "work" | "study" | "personal" | "health" | "meeting";

export const CATEGORIES: Category[] = ["work", "study", "personal", "health", "meeting"];
export const PRIORITIES: Priority[] = ["low", "medium", "high"];

export type Task = {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  /** Local day key: "yyyy-MM-dd". */
  dueDate: string;
  startTime?: string;
  endTime?: string;
  estimatedMinutes?: number;
  category: Category;
  goalId?: string;
  planId?: string;
  tags?: string[];
  completedAt?: string;
};

export type Milestone = {
  id: string;
  title: string;
  week?: number;
  month?: number;
  done: boolean;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
  progress: number;
  targetDate: string;
  category: Category;
  planId?: string;
  milestones: Milestone[];
};

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  frequency: "daily" | "weekly";
  streak: number;
  bestStreak: number;
  /** Local day keys the habit was completed. */
  log: string[];
  color: string;
  createdAt: string;
};

export type CalEvent = {
  id: string;
  title: string;
  /** Local stamp: "yyyy-MM-ddTHH:mm:00". */
  start: string;
  end: string;
  category: Category;
  goalId?: string;
  /** Set when this event mirrors a task, so the two stay in sync. */
  taskId?: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  plan?: GeneratedPlan;
  /** Stable id for the plan so it can only be applied once. */
  planId?: string;
};

export type WeeklyCurriculum = {
  week: number;
  month: number;
  focusTheme: string;
  dailyTopics: string[]; // 6 daily progressive tasks for Mon-Sat
  restDayNote?: string; // Sunday rest / recharge note
};

export type MonthlyMilestone = {
  month: number;
  title: string;
  outcome: string;
};

export type GeneratedPlan = {
  goalTitle: string;
  summary: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedHours: number;
  timeline: string;
  totalDays: number;
  category: Category;
  monthlyMilestones?: MonthlyMilestone[];
  milestones: { title: string; week: number; month?: number }[];
  weeklyCurriculum?: WeeklyCurriculum[];
  weeklyTasks: string[];
  dailyTasks: string[];
  dailyTime?: string;
  dailyDurationMinutes?: number;
  habits: { name: string; emoji: string }[];
  tips: string[];
};

export type Settings = {
  dailyCapacityHours: number;
  aiSuggestions: boolean;
  reminders: boolean;
  weekStartsMonday: boolean;
};

export type AppState = {
  schemaVersion: number;
  user: { name: string; email: string; avatar?: string } | null;
  tasks: Task[];
  goals: Goal[];
  habits: Habit[];
  events: CalEvent[];
  messages: Message[];
  appliedPlanIds: string[];
  dismissedAlerts: string[];
  settings: Settings;
  theme: "dark" | "light";
};

export const SCHEMA_VERSION = 3;

export const DEFAULT_SETTINGS: Settings = {
  dailyCapacityHours: 6,
  aiSuggestions: true,
  reminders: true,
  weekStartsMonday: true,
};

export function emptyState(): AppState {
  return {
    schemaVersion: SCHEMA_VERSION,
    user: { name: "Alex Rivera", email: "alex@goalpilot.ai" },
    tasks: [],
    goals: [],
    habits: [],
    events: [],
    messages: [],
    appliedPlanIds: [],
    dismissedAlerts: [],
    settings: { ...DEFAULT_SETTINGS },
    theme: "dark",
  };
}

export function makeDemoState(): AppState {
  const T = todayKey();
  const d = (n: number) => addDaysKey(T, n);

  const goals: Goal[] = [
    {
      id: "g1",
      title: "Prepare for Google Interview (90 Days)",
      description: "Master Algorithms, Data Structures, System Design & Google Behavioral STAR Questions with structured weekly sprints and Sunday active rest.",
      progress: 45,
      targetDate: d(65),
      category: "study",
      milestones: [
        { id: "m1", title: "Month 1: Core DSA Fundamentals (Arrays, Sliding Window, Two Pointers, HashMaps)", done: true },
        { id: "m2", title: "Month 2: Advanced Data Structures & Dynamic Programming (Trees, Graphs, Backtracking)", done: true },
        { id: "m3", title: "Month 3: Distributed System Design, Mock Interviews & Google Leadership Principles", done: false },
      ],
    },
    {
      id: "g2",
      title: "Run First Half-Marathon (16 Weeks)",
      description: "Progressive endurance training building aerobic zone 2 stamina, cadence drills, and weekly long runs for 21.1 km race day.",
      progress: 35,
      targetDate: d(75),
      category: "health",
      milestones: [
        { id: "m21", title: "Month 1: 5K Aerobic Base, 175 SPM Cadence & Ankle Stability", done: true },
        { id: "m22", title: "Month 2: 10K Benchmark, Tempo Intervals & Leg Strength", done: false },
        { id: "m23", title: "Month 3: Peak 18km Long Run & Electrolyte Hydration Strategy", done: false },
        { id: "m24", title: "Month 4: Tapering, Carb Loading & Race Day Finish", done: false },
      ],
    },
    {
      id: "g3",
      title: "Launch SaaS MVP & Product Hunt Debut (6 Weeks)",
      description: "Fast-paced product roadmap from customer interviews to full-stack MVP, Stripe checkout, onboarding tour, and public launch.",
      progress: 65,
      targetDate: d(18),
      category: "work",
      milestones: [
        { id: "m31", title: "Validation, Figma Wireframes & Customer Discovery Interviews", done: true },
        { id: "m32", title: "Full-Stack MVP Architecture, Auth & Stripe Payments", done: true },
        { id: "m33", title: "Beta Testing with 50 Users, Analytics & Product Hunt Launch", done: false },
      ],
    },
    {
      id: "g4",
      title: "Mindfulness & Morning Energy Architecture",
      description: "Cultivate mental clarity, daily meditation, zero-screen morning routines, and evening digital sunsets for peak sustained energy.",
      progress: 80,
      targetDate: d(14),
      category: "personal",
      milestones: [
        { id: "m41", title: "Establish 06:30 Sunrise Routine & 10m Diaphragmatic Breathwork", done: true },
        { id: "m42", title: "Zero Screen Time Before 08:00 & 3L Daily Hydration", done: true },
        { id: "m43", title: "Evening Digital Sunsets & Weekly Mindful Retrospectives", done: false },
      ],
    },
  ];

  const tasks: Task[] = [
    // Completed recently
    {
      id: "t1",
      title: "Google Prep: Solve Two Sum & 3Sum (Two Pointers)",
      priority: "high",
      status: "done",
      dueDate: d(-1),
      category: "study",
      goalId: "g1",
      startTime: "19:00",
      endTime: "20:30",
      estimatedMinutes: 90,
      completedAt: d(-1),
    },
    {
      id: "t2",
      title: "Aerobic Base Run: 5 km Zone 2 + Mobility Stretches",
      priority: "high",
      status: "done",
      dueDate: d(-1),
      category: "health",
      goalId: "g2",
      startTime: "06:30",
      endTime: "07:30",
      estimatedMinutes: 60,
      completedAt: d(-1),
    },
    {
      id: "t3",
      title: "SaaS: Review Stripe Webhook Idempotency & Pricing Tiers",
      priority: "medium",
      status: "done",
      dueDate: d(-1),
      category: "work",
      goalId: "g3",
      startTime: "10:00",
      endTime: "11:30",
      estimatedMinutes: 90,
      completedAt: d(-1),
    },
    // Today
    {
      id: "t4",
      title: "Core Stability & Glute Activation Circuit",
      priority: "medium",
      status: "done",
      dueDate: T,
      category: "health",
      goalId: "g2",
      startTime: "06:30",
      endTime: "07:15",
      estimatedMinutes: 45,
      completedAt: T,
    },
    {
      id: "t5",
      title: "SaaS Sprint: Implement User Onboarding & PostHog Telemetry",
      priority: "high",
      status: "in_progress",
      dueDate: T,
      category: "work",
      goalId: "g3",
      startTime: "09:30",
      endTime: "11:30",
      estimatedMinutes: 120,
    },
    {
      id: "t6",
      title: "Product Sync: MVP Architecture & Launch Roadmap",
      priority: "medium",
      status: "done",
      dueDate: T,
      category: "meeting",
      goalId: "g3",
      startTime: "14:00",
      endTime: "14:45",
      estimatedMinutes: 45,
      completedAt: T,
    },
    {
      id: "t7",
      title: "Google Prep: Binary Tree Level Order Traversal (BFS & Zigzag)",
      priority: "high",
      status: "in_progress",
      dueDate: T,
      category: "study",
      goalId: "g1",
      startTime: "19:00",
      endTime: "20:30",
      estimatedMinutes: 90,
    },
    {
      id: "t8",
      title: "Evening Guided Breathwork & Day Reflection Journal",
      priority: "low",
      status: "todo",
      dueDate: T,
      category: "personal",
      goalId: "g4",
      startTime: "21:30",
      endTime: "21:50",
      estimatedMinutes: 20,
    },
    // Tomorrow
    {
      id: "t9",
      title: "Tempo Run: 6 km at Half-Marathon Target Race Pace",
      priority: "high",
      status: "todo",
      dueDate: d(1),
      category: "health",
      goalId: "g2",
      startTime: "06:30",
      endTime: "07:30",
      estimatedMinutes: 60,
    },
    {
      id: "t10",
      title: "SaaS: Configure Sentry Error Alerts & Supabase RLS Rules",
      priority: "medium",
      status: "todo",
      dueDate: d(1),
      category: "work",
      goalId: "g3",
      startTime: "10:00",
      endTime: "11:30",
      estimatedMinutes: 90,
    },
    {
      id: "t11",
      title: "Design Review: Feedback on Marketing Landing Page",
      priority: "medium",
      status: "todo",
      dueDate: d(1),
      category: "meeting",
      goalId: "g3",
      startTime: "15:00",
      endTime: "15:45",
      estimatedMinutes: 45,
    },
    {
      id: "t12",
      title: "Google Prep: Implement LRU Cache with HashMap & Doubly Linked List",
      priority: "high",
      status: "todo",
      dueDate: d(1),
      category: "study",
      goalId: "g1",
      startTime: "19:00",
      endTime: "20:30",
      estimatedMinutes: 90,
    },
    // Day +2
    {
      id: "t13",
      title: "Google Prep: Monotonic Stack (Daily Temperatures & Largest Rectangle)",
      priority: "high",
      status: "todo",
      dueDate: d(2),
      category: "study",
      goalId: "g1",
      startTime: "19:00",
      endTime: "20:30",
      estimatedMinutes: 90,
    },
    {
      id: "t14",
      title: "Draft Product Hunt Launch Story & Maker Comment",
      priority: "medium",
      status: "todo",
      dueDate: d(2),
      category: "work",
      goalId: "g3",
      startTime: "11:00",
      endTime: "12:00",
      estimatedMinutes: 60,
    },
    // Day +3
    {
      id: "t15",
      title: "Long Run: 10 km Steady Aerobic Pace with Hydration Pack",
      priority: "high",
      status: "todo",
      dueDate: d(3),
      category: "health",
      goalId: "g2",
      startTime: "06:30",
      endTime: "07:45",
      estimatedMinutes: 75,
    },
    {
      id: "t16",
      title: "Google Prep: Graph BFS & DFS (Number of Islands & Clone Graph)",
      priority: "high",
      status: "todo",
      dueDate: d(3),
      category: "study",
      goalId: "g1",
      startTime: "19:00",
      endTime: "20:30",
      estimatedMinutes: 90,
    },
  ];

  const habits: Habit[] = [
    {
      id: "h1",
      name: "Daily Tech & Interview Practice (90m)",
      emoji: "💻",
      frequency: "daily",
      streak: 8,
      bestStreak: 15,
      log: [d(-6), d(-5), d(-4), d(-3), d(-2), d(-1), T],
      color: "brand",
      createdAt: d(-30),
    },
    {
      id: "h2",
      name: "Morning Run / Mobility Flow (45m)",
      emoji: "🏃",
      frequency: "daily",
      streak: 12,
      bestStreak: 18,
      log: [d(-6), d(-5), d(-4), d(-3), d(-2), d(-1), T],
      color: "brand",
      createdAt: d(-25),
    },
    {
      id: "h3",
      name: "10-Min Guided Breathwork & Meditation",
      emoji: "🧘",
      frequency: "daily",
      streak: 21,
      bestStreak: 21,
      log: [d(-6), d(-5), d(-4), d(-3), d(-2), d(-1), T],
      color: "brand",
      createdAt: d(-30),
    },
    {
      id: "h4",
      name: "Uninterrupted Deep Work Sprint (90m)",
      emoji: "🚀",
      frequency: "daily",
      streak: 6,
      bestStreak: 14,
      log: [d(-5), d(-4), d(-3), d(-2), d(-1), T],
      color: "brand",
      createdAt: d(-20),
    },
    {
      id: "h5",
      name: "Hydrate 3 Liters Daily",
      emoji: "💧",
      frequency: "daily",
      streak: 16,
      bestStreak: 24,
      log: [d(-6), d(-5), d(-4), d(-3), d(-2), d(-1), T],
      color: "brand",
      createdAt: d(-30),
    },
    {
      id: "h6",
      name: "Read 20 Pages Non-Fiction",
      emoji: "📚",
      frequency: "daily",
      streak: 9,
      bestStreak: 14,
      log: [d(-6), d(-5), d(-4), d(-3), d(-2), d(-1), T],
      color: "brand",
      createdAt: d(-20),
    },
  ];

  const events: CalEvent[] = [
    // Today
    {
      id: "e1",
      title: "Core Stability & Glute Circuit",
      start: `${T}T06:30:00`,
      end: `${T}T07:15:00`,
      category: "health",
      goalId: "g2",
      taskId: "t4",
    },
    {
      id: "e2",
      title: "SaaS Onboarding & Telemetry Sprint",
      start: `${T}T09:30:00`,
      end: `${T}T11:30:00`,
      category: "work",
      goalId: "g3",
      taskId: "t5",
    },
    {
      id: "e3",
      title: "Product Sync: MVP Architecture",
      start: `${T}T14:00:00`,
      end: `${T}T14:45:00`,
      category: "meeting",
      goalId: "g3",
      taskId: "t6",
    },
    {
      id: "e4",
      title: "Google Prep: Binary Tree Level Order BFS",
      start: `${T}T19:00:00`,
      end: `${T}T20:30:00`,
      category: "study",
      goalId: "g1",
      taskId: "t7",
    },
    {
      id: "e5",
      title: "Evening Guided Breathwork",
      start: `${T}T21:30:00`,
      end: `${T}T21:50:00`,
      category: "personal",
      goalId: "g4",
      taskId: "t8",
    },
    // Tomorrow
    {
      id: "e6",
      title: "Tempo Run: 6 km Race Pace",
      start: `${d(1)}T06:30:00`,
      end: `${d(1)}T07:30:00`,
      category: "health",
      goalId: "g2",
      taskId: "t9",
    },
    {
      id: "e7",
      title: "SaaS: Sentry & Supabase RLS",
      start: `${d(1)}T10:00:00`,
      end: `${d(1)}T11:30:00`,
      category: "work",
      goalId: "g3",
      taskId: "t10",
    },
    {
      id: "e8",
      title: "Design Review: Landing Page",
      start: `${d(1)}T15:00:00`,
      end: `${d(1)}T15:45:00`,
      category: "meeting",
      goalId: "g3",
      taskId: "t11",
    },
    {
      id: "e9",
      title: "Google Prep: LRU Cache Implementation",
      start: `${d(1)}T19:00:00`,
      end: `${d(1)}T20:30:00`,
      category: "study",
      goalId: "g1",
      taskId: "t12",
    },
    // Day +2
    {
      id: "e10",
      title: "Product Hunt Launch Story Draft",
      start: `${d(2)}T11:00:00`,
      end: `${d(2)}T12:00:00`,
      category: "work",
      goalId: "g3",
      taskId: "t14",
    },
    {
      id: "e11",
      title: "Google Prep: Monotonic Stack",
      start: `${d(2)}T19:00:00`,
      end: `${d(2)}T20:30:00`,
      category: "study",
      goalId: "g1",
      taskId: "t13",
    },
  ];

  return {
    schemaVersion: SCHEMA_VERSION,
    user: { name: "Alex Rivera", email: "alex@goalpilot.ai" },
    tasks,
    goals,
    habits,
    events,
    messages: [],
    appliedPlanIds: [],
    dismissedAlerts: [],
    settings: { ...DEFAULT_SETTINGS },
    theme: "dark",
  };
}
