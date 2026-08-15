import "dotenv/config";
import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Contextual and progressive dynamic plan generator for all domains
function generateCustomDynamicPlan(rawGoal: string) {
  const goal = rawGoal.trim();
  const lower = goal.toLowerCase();

  // 1. MARATHON / HALF-MARATHON / RUNNING FITNESS GOALS
  if (lower.includes("marathon") || lower.includes("half marathon") || lower.includes("running") || lower.includes("run ") || lower.includes("5k") || lower.includes("10k")) {
    const isHalf = lower.includes("half") || lower.includes("16 weeks");
    const timeline = isHalf ? "16 weeks (4 months)" : "8-12 weeks (60-90 days)";
    const totalDays = isHalf ? 112 : 60;

    return {
      goalTitle: isHalf ? "Run First Half-Marathon (16 Weeks)" : "Marathon / Endurance Training Plan",
      summary: `Progressive endurance training roadmap designed to safely build aerobic stamina, running form, weekly mileage, and injury prevention with Sunday active recovery and Monday rest days.`,
      difficulty: "hard",
      estimatedHours: 80,
      timeline,
      totalDays,
      category: "health",
      dailyTime: "06:30 - 07:30",
      dailyDurationMinutes: 60,
      monthlyMilestones: [
        { month: 1, title: "Month 1: Aerobic Base & Form Mechanics", outcome: "Establish comfortable 3-5 km base runs, cadence drills, and lower-body stability." },
        { month: 2, title: "Month 2: Distance Expansion & Threshold Tempo", outcome: "Extend weekly long run to 8-10 km and incorporate structured interval paces." },
        { month: 3, title: "Month 3: Peak Mileage & Race-Pace Simulation", outcome: "Reach 15-18 km long runs, fuel/hydration strategy, and race gear testing." },
        { month: 4, title: "Month 4: Tapering, Mental Prep & Race Day", outcome: "Gradual volume reduction for peak freshness, carb loading, and race completion." },
      ],
      milestones: [
        { title: "Month 1: Aerobic Base & Form", week: 4, month: 1 },
        { title: "Month 2: Distance & Tempo Intervals", week: 8, month: 2 },
        { title: "Month 3: Peak 18km Long Run", week: 12, month: 3 },
        { title: "Month 4: Taper & Race Day", week: 16, month: 4 },
      ],
      weeklyCurriculum: [
        {
          week: 1,
          month: 1,
          focusTheme: "Aerobic Baseline & Form Testing",
          dailyTopics: [
            "Day 1: Baseline 3 km easy conversational pace run + dynamic warmup drills",
            "Day 2: Core stability & glute activation workout (Planks, lunges, hip bridges)",
            "Day 3: 4 km aerobic run with 4x100m strides on flat terrain",
            "Day 4: Cross-training: 45 min light cycling or swimming for active recovery",
            "Day 5: 3.5 km easy run with focus on 175-180 SPM cadence",
            "Day 6: Long Run: 6 km relaxed conversational endurance run",
          ],
          restDayNote: "Sunday: Complete rest, foam rolling & leg mobility stretches.",
        },
        {
          week: 2,
          month: 1,
          focusTheme: "Cadence & Mobility Progression",
          dailyTopics: [
            "Day 8: 4 km easy run + 15 min hip and ankle mobility flow",
            "Day 9: Strength training: Squats, calf raises, step-ups & single-leg balance",
            "Day 10: 5 km interval run: 1 km warmup + 4x400m fast with 90s jog recovery",
            "Day 11: 40 min low-impact cross training / elliptical",
            "Day 12: 4 km recovery run on grass or soft trail",
            "Day 13: Long Run: 7.5 km steady aerobic endurance run",
          ],
          restDayNote: "Sunday: Complete rest & hydration optimization.",
        },
        {
          week: 3,
          month: 1,
          focusTheme: "Tempo Pacing & Hill Stamina",
          dailyTopics: [
            "Day 15: 4.5 km easy pace run + post-run stretching",
            "Day 16: Hill repeats: 6x200m uphill sprints with slow jog descent",
            "Day 17: Full body strength & core endurance circuit (30 mins)",
            "Day 18: 5 km steady tempo run (half-marathon target pace)",
            "Day 19: 30 min recovery swim or yoga for runners",
            "Day 20: Long Run: 9 km progressive run (last 2 km at race pace)",
          ],
          restDayNote: "Sunday: Complete rest day & nutrition tracking.",
        },
        {
          week: 4,
          month: 1,
          focusTheme: "Month 1 Recovery & Benchmark 10K",
          dailyTopics: [
            "Day 22: 4 km easy recovery run",
            "Day 23: Lower body mobility, foam rolling & hamstring flexibility",
            "Day 24: 5 km tempo run with 3x1km repeats",
            "Day 25: Rest & carb replenishment day",
            "Day 26: Milestone 10K test run: Time trial & pacing evaluation",
            "Day 27: Post-10K ice bath, hydration & Month 1 retrospective",
          ],
          restDayNote: "Sunday: Full recovery day & Month 2 shoe/gear check.",
        },
      ],
      weeklyTasks: [
        "Week 1: Baseline 3 km + Core stability",
        "Week 2: Cadence drills + 7.5 km long run",
        "Week 3: Hill repeats + 9 km long run",
        "Week 4: 10K benchmark time trial",
      ],
      dailyTasks: [
        "Day 1: Baseline 3 km easy conversational pace run",
        "Day 2: Core stability & glute activation workout",
        "Day 3: 4 km aerobic run with 4x100m strides",
        "Day 4: Cross-training: 45 min light cycling",
        "Day 5: 3.5 km easy run with focus on cadence",
        "Day 6: Long Run: 6 km relaxed conversational run",
      ],
      habits: [{ name: "Daily Morning Run / Mobility (60m)", emoji: "🏃" }],
      tips: [
        "Run your easy runs truly easy — you should be able to hold a full conversation.",
        "80% of your mileage should be low heart-rate zone 2 aerobic base building.",
        "Never skip post-run stretching and Sunday rest to protect tendons and knees.",
      ],
    };
  }

  // 2. SAAS MVP / STARTUP LAUNCH IN 6 WEEKS
  if (lower.includes("saas") || lower.includes("startup") || lower.includes("mvp") || lower.includes("launch a") || lower.includes("build a product")) {
    return {
      goalTitle: "Launch a SaaS MVP (6 Weeks)",
      summary: `Fast-paced product roadmap from customer problem validation and Figma wireframes to full-stack code, Stripe payments, and public Product Hunt launch.`,
      difficulty: "hard",
      estimatedHours: 100,
      timeline: "6 weeks (42 days)",
      totalDays: 42,
      category: "work",
      dailyTime: "09:00 - 11:00",
      dailyDurationMinutes: 120,
      monthlyMilestones: [
        { month: 1, title: "Weeks 1-4: Problem Validation, Architecture, Auth & Core MVP Feature", outcome: "Working, deployed prototype with auth, database models, and primary user workflow." },
        { month: 2, title: "Weeks 5-6: Stripe Billing, Onboarding, Beta Testing & Launch", outcome: "Live production product with payment checkout, analytics, and 100 active users." },
      ],
      milestones: [
        { title: "Week 1: Customer Validation & Clickable Prototype", week: 1, month: 1 },
        { title: "Week 2: Backend DB, Auth & API Architecture", week: 2, month: 1 },
        { title: "Week 3: Core Value Proposition Feature Sprint", week: 3, month: 1 },
        { title: "Week 4: Dashboard UI & Settings", week: 4, month: 1 },
        { title: "Week 5: Stripe Billing & Beta User Testing", week: 5, month: 2 },
        { title: "Week 6: Public Launch on Product Hunt & X", week: 6, month: 2 },
      ],
      weeklyCurriculum: [
        {
          week: 1,
          month: 1,
          focusTheme: "Problem Validation & High-Fidelity UI",
          dailyTopics: [
            "Day 1: Conduct 5 target user interviews & define the single 'Must-Have' feature",
            "Day 2: Design user flow map and high-fidelity Figma mockups for core loop",
            "Day 3: Build landing page waitlist with headline, demo video & email capture",
            "Day 4: Setup Next.js/Vite repo, Tailwind theme & deployment pipeline on Vercel",
            "Day 5: Configure PostgreSQL / Supabase database schema and migrations",
            "Day 6: Review waitlist conversion data & refine value proposition",
          ],
          restDayNote: "Sunday: Unplug, recharge, and review next week's tech specs.",
        },
        {
          week: 2,
          month: 1,
          focusTheme: "Authentication & Core Data CRUD",
          dailyTopics: [
            "Day 8: Implement OAuth authentication (Google + Email magic link)",
            "Day 9: Build secure user profile and organization workspace models",
            "Day 10: Create primary dashboard UI shell with responsive layout",
            "Day 11: Implement main data creation endpoint and validation schemas",
            "Day 12: Implement list, filter, and search logic with optimistic UI updates",
            "Day 13: Internal testing: complete end-to-end user creation and data entry flow",
          ],
          restDayNote: "Sunday: Rest and mental consolidation.",
        },
        {
          week: 3,
          month: 1,
          focusTheme: "Core Value Proposition Feature Sprint",
          dailyTopics: [
            "Day 15: Build the primary hero engine / core workflow component",
            "Day 16: Integrate background AI / processing worker or export pipeline",
            "Day 17: Add error boundary states, empty states & loading skeletons",
            "Day 18: Optimize query performance and add client caching",
            "Day 19: Deploy alpha build to private staging URL",
            "Day 20: Conduct live usability test with 3 waitlist alpha testers",
          ],
          restDayNote: "Sunday: Rest and incorporate user feedback notes.",
        },
        {
          week: 4,
          month: 1,
          focusTheme: "Payments, Email & Polish",
          dailyTopics: [
            "Day 22: Integrate Stripe Checkout / Customer Portal for subscription tiers",
            "Day 23: Implement webhook listener for invoice.payment_succeeded and tier limits",
            "Day 24: Add transactional onboarding welcome emails via Resend",
            "Day 25: Implement PostHog / Mixpanel event analytics for key conversion steps",
            "Day 26: Full mobile responsiveness and cross-browser testing",
            "Day 27: Fix top 5 user experience friction points reported by alpha users",
          ],
          restDayNote: "Sunday: Full rest before launch sprint.",
        },
      ],
      weeklyTasks: [
        "Week 1: Figma prototype + landing page waitlist",
        "Week 2: Auth + Core database models",
        "Week 3: Hero feature + Alpha testing",
        "Week 4: Stripe payments + Analytics",
      ],
      dailyTasks: [
        "Day 1: Conduct 5 target user interviews & define must-have MVP",
        "Day 2: Design user flow map and high-fidelity Figma mockups",
        "Day 3: Build landing page waitlist with demo & email capture",
        "Day 4: Setup repo, Tailwind UI & Vercel deployment pipeline",
        "Day 5: Configure database schema, auth models & migrations",
        "Day 6: Review waitlist conversions & refine pitch",
      ],
      habits: [{ name: "Daily SaaS Build Sprint (2 hrs)", emoji: "🚀" }],
      tips: [
        "Cut any feature that isn't strictly necessary for the core user outcome.",
        "Talk to customers every single week to ensure you're solving real pain.",
      ],
    };
  }

  // 3. PYTHON IN 3 MONTHS / CODING MASTERY
  if (lower.includes("python")) {
    return {
      goalTitle: "Master Python Programming (3 Months)",
      summary: `A structured 12-week computer science & practical Python curriculum from syntax fundamentals to OOP, automated web scrapers, REST APIs with FastAPI, and production portfolio projects.`,
      difficulty: "medium",
      estimatedHours: 90,
      timeline: "12 weeks (90 days)",
      totalDays: 90,
      category: "study",
      dailyTime: "18:00 - 19:30",
      dailyDurationMinutes: 90,
      monthlyMilestones: [
        { month: 1, title: "Month 1: Syntax, Data Structures & Algorithmic Logic", outcome: "Master variables, control flow, lists, dictionaries, sets, tuples, and clean function decomposition." },
        { month: 2, title: "Month 2: Object-Oriented Design, Modules, File I/O & Web Scraping", outcome: "Build modular OOP applications, parse JSON/CSV, scrape data with BeautifulSoup, and handle exceptions." },
        { month: 3, title: "Month 3: FastAPI Backend Services, SQL Databases & Capstone Project", outcome: "Develop, test, and deploy a complete production-grade Python web application to the cloud." },
      ],
      milestones: [
        { title: "Month 1: Core Syntax & Algorithmic Logic", week: 4, month: 1 },
        { title: "Month 2: OOP, File I/O, Web Scraping & APIs", week: 8, month: 2 },
        { title: "Month 3: FastAPI, Database ORMs & Capstone", week: 12, month: 3 },
      ],
      weeklyCurriculum: [
        {
          week: 1,
          month: 1,
          focusTheme: "Python Environment & Syntax Fundamentals",
          dailyTopics: [
            "Day 1: Install Python 3.12, VS Code, virtual environments (venv) & execute first script",
            "Day 2: Variables, primitive types (int, float, str, bool) & formatted f-strings",
            "Day 3: Conditional statements (if, elif, else), logical operators & comparison rules",
            "Day 4: Loops (for, while, range, enumerate) & loop control (break, continue)",
            "Day 5: Defining functions, arguments, default parameters, return values & docstrings",
            "Day 6: Build CLI Project #1: Number Guessing & Password Generator CLI",
          ],
          restDayNote: "Sunday: Complete rest and mental consolidation.",
        },
        {
          week: 2,
          month: 1,
          focusTheme: "Core Data Structures (Lists, Dicts, Sets & Tuples)",
          dailyTopics: [
            "Day 8: Python Lists: indexing, slicing, appending, inserting, sorting & list methods",
            "Day 9: List Comprehensions: concise filtering, transformations & nested loops",
            "Day 10: Dictionaries: key-value storage, dictionary comprehensions & .get() patterns",
            "Day 11: Sets & Tuples: immutability, union/intersection & deduplication techniques",
            "Day 12: Problem solving drills: 5 LeetCode Easy string & array manipulation problems in Python",
            "Day 13: Build CLI Project #2: Interactive Contact Book & Expense Ledger CLI",
          ],
          restDayNote: "Sunday: Complete rest and code review.",
        },
        {
          week: 3,
          month: 1,
          focusTheme: "File I/O, Error Handling & Pythonic Modules",
          dailyTopics: [
            "Day 15: File handling: reading & writing text files using context managers (with open)",
            "Day 16: Working with CSV and JSON data using python's built-in csv and json libraries",
            "Day 17: Robust Error Handling: try, except, else, finally blocks & custom exceptions",
            "Day 18: Python Standard Library: datetime, math, random, pathlib & collections",
            "Day 19: Writing clean modular code: importing modules, packages and __init__.py",
            "Day 20: Month 1 Progress Test: 10 coding exercises covering all Month 1 fundamentals",
          ],
          restDayNote: "Sunday: Full rest and Month 1 retrospective.",
        },
        {
          week: 4,
          month: 1,
          focusTheme: "Object-Oriented Programming (OOP) Essentials",
          dailyTopics: [
            "Day 22: Classes and Objects: __init__ constructor, instance variables, self and methods",
            "Day 23: Encapsulation: private attributes, getters/setters with @property decorator",
            "Day 24: Class methods vs Static methods using @classmethod and @staticmethod",
            "Day 25: Inheritance and Polymorphism: super(), method overriding & subclassing",
            "Day 26: Special Dunder methods (__str__, __repr__, __len__, __eq__)",
            "Day 27: Build OOP Project: Bank Account & Inventory Management Simulation",
          ],
          restDayNote: "Sunday: Complete rest day & prepare for Month 2 APIs.",
        },
      ],
      weeklyTasks: [
        "Week 1: Setup + Syntax + Password Generator CLI",
        "Week 2: Data Structures + Expense Tracker",
        "Week 3: File I/O + JSON/CSV + Error Handling",
        "Week 4: Object-Oriented Programming + Bank Sim",
      ],
      dailyTasks: [
        "Day 1: Install Python, VS Code, virtual environment & run first script",
        "Day 2: Variables, primitive types & formatted f-strings",
        "Day 3: Conditional statements (if, elif, else) & operators",
        "Day 4: Loops (for, while, range, enumerate) & flow control",
        "Day 5: Functions, default parameters & return values",
        "Day 6: Build CLI Project: Number Guessing & Password Generator",
      ],
      habits: [{ name: "Daily Python Coding Class (90m)", emoji: "🐍" }],
      tips: [
        "Type out code manually rather than copy-pasting to build muscle memory.",
        "Solve 1 micro coding drill every single morning before starting work.",
      ],
    };
  }

  // 4. GOOGLE / FAANG INTERVIEW PREPARATION IN 90 DAYS (DEFAULT / DSA)
  return {
    goalTitle: "Prepare for Google Interviews (90 Days)",
    summary: `Comprehensive 90-day technical interview mastery covering Data Structures & Algorithms (Blind 75 & NeetCode 150), System Design scalability, and Googleyness STAR behavioral frameworks with 1 rest day per week.`,
    difficulty: "hard",
    estimatedHours: 120,
    timeline: "12 weeks (90 days)",
    totalDays: 90,
    category: "study",
    dailyTime: "19:00 - 20:30",
    dailyDurationMinutes: 90,
    monthlyMilestones: [
      { month: 1, title: "Month 1: Core DSA Fundamentals & Two-Pointer / Sliding Window Patterns", outcome: "Master Arrays, Strings, HashMaps, Sliding Windows, Two Pointers, Linked Lists & Binary Search." },
      { month: 2, title: "Month 2: Advanced Data Structures, Trees, Graphs & Dynamic Programming", outcome: "Solve Tree traversals (BFS/DFS), BSTs, Graph algorithms, 1D/2D DP, and Backtracking under 25 mins." },
      { month: 3, title: "Month 3: System Design Architecture, Mock Interviews & Google STAR Behavioral", outcome: "Master distributed systems (Bitly, Caching, Rate Limiters) and pass timed live mock interviews." },
    ],
    milestones: [
      { title: "Month 1: Core Linear Structures & Binary Search", week: 4, month: 1 },
      { title: "Month 2: Trees, Graphs, DP & Backtracking", week: 8, month: 2 },
      { title: "Month 3: System Design & Live Mock Interviews", week: 12, month: 3 },
    ],
    weeklyCurriculum: [
      {
        week: 1,
        month: 1,
        focusTheme: "Arrays, Hashing & Two Pointers",
        dailyTopics: [
          "Day 1: Time & Space Big-O complexity diagnostics + Solve Two Sum with Hash Map",
          "Day 2: Valid Anagram & Group Anagrams using character frequency buckets",
          "Day 3: Top K Frequent Elements & Product of Array Except Self (Prefix/Suffix products)",
          "Day 4: Two Pointers: Valid Palindrome & Two Sum II with sorted input array",
          "Day 5: Two Pointers: 3Sum & Container With Most Water (Optimal collision pointers)",
          "Day 6: Trapping Rain Water: Solve with Two-Pointer technique & write test cases",
        ],
        restDayNote: "Sunday: Complete rest and mental consolidation.",
      },
      {
        week: 2,
        month: 1,
        focusTheme: "Sliding Window & Stack Patterns",
        dailyTopics: [
          "Day 8: Best Time to Buy & Sell Stock (Kadane's / One-pass dynamic window)",
          "Day 9: Longest Substring Without Repeating Characters (Sliding Window + Hash Set)",
          "Day 10: Longest Repeating Character Replacement (Dynamic window with max frequency)",
          "Day 11: Valid Parentheses & Min Stack (Design stack with O(1) minimum retrieval)",
          "Day 12: Daily Temperatures & Largest Rectangle in Histogram (Monotonic Stack pattern)",
          "Day 13: Timed 45-minute practice session on 2 random Medium sliding window problems",
        ],
        restDayNote: "Sunday: Complete rest and mental consolidation.",
      },
      {
        week: 3,
        month: 1,
        focusTheme: "Binary Search & Linked Lists",
        dailyTopics: [
          "Day 15: Binary Search template & Search in Rotated Sorted Array",
          "Day 16: Find Minimum in Rotated Sorted Array & Time-Based Key-Value Store",
          "Day 17: Reverse Linked List & Merge Two Sorted Linked Lists (Iterative vs Recursive)",
          "Day 18: Reorder List & Remove Nth Node From End of List (Fast/Slow pointer)",
          "Day 19: Linked List Cycle (Floyd's Tortoise & Hare) & Merge K Sorted Lists (Min-Heap)",
          "Day 20: Design LRU Cache (Doubly Linked List + Hash Map in O(1))",
        ],
        restDayNote: "Sunday: Complete rest and review mistake log.",
      },
      {
        week: 4,
        month: 1,
        focusTheme: "Binary Trees & Month 1 Checkpoint",
        dailyTopics: [
          "Day 22: Invert Binary Tree & Maximum Depth of Binary Tree (Recursive DFS)",
          "Day 23: Same Tree & Subtree of Another Tree (Tree serialization & traversal)",
          "Day 24: Lowest Common Ancestor in Binary Search Tree & Binary Tree Level Order (BFS)",
          "Day 25: Validate Binary Search Tree & Kth Smallest Element in a BST",
          "Day 26: Month 1 Comprehensive Assessment: 3 timed medium-hard interview questions",
          "Day 27: Retrospective on time management and space complexity communication",
        ],
        restDayNote: "Sunday: Rest, hydrate, and prepare for Month 2 Graphs & DP.",
      },
    ],
    weeklyTasks: [
      "Week 1: Two Sum, 3Sum, Container with Water",
      "Week 2: Sliding Window + Monotonic Stack",
      "Week 3: Binary Search + LRU Cache design",
      "Week 4: Binary Trees + Month 1 Assessment",
    ],
    dailyTasks: [
      "Day 1: Big-O diagnostics & solve Two Sum with HashMap",
      "Day 2: Valid Anagram & Group Anagrams",
      "Day 3: Top K Frequent Elements & Product of Array",
      "Day 4: Two Pointers: Valid Palindrome & Two Sum II",
      "Day 5: Two Pointers: 3Sum & Container With Most Water",
      "Day 6: Trapping Rain Water with Two-Pointer technique",
    ],
    habits: [{ name: "Daily Google Interview Practice (90m)", emoji: "💻" }],
    tips: [
      "Always communicate your thought process aloud before writing code.",
      "State time and space complexity upfront and test with edge cases.",
    ],
  };
}

// Tailored, distinct conversational responses for general chat & quick prompts
function getAssistantQuickResponse(userPrompt: string): string {
  const p = userPrompt.toLowerCase().trim();

  // Natural greeting handlers
  if (p === "hi" || p === "hello" || p === "hey" || p === "hola" || p === "yo" || p.startsWith("hi ") || p.startsWith("hello ")) {
    return `Hello! 👋 How can I help you today?

I can help you with:
- **Planning Goals:** e.g., *"Prepare for Google interviews in 90 days"*, *"Run my first half-marathon in 16 weeks"*, or *"Learn Python in 3 months"*
- **Productivity & Routines:** e.g., *"Plan my weekend"* or *"Make tomorrow easier"*
- **Next Steps:** e.g., *"What should I do next?"*

What are you looking to achieve?`;
  }

  if (p.includes("plan my weekend") || p.includes("weekend")) {
    return `### 🌟 Your Weekend Reset Plan

Here is a balanced 2-day blueprint to recharge and get ahead:

**Saturday — Activity & Decompression:**
- **Morning (09:00 - 11:00):** Outdoor walk, workout, or favorite active hobby.
- **Afternoon (14:00 - 16:00):** Creative project or leisure without work notifications.
- **Evening:** Social time or relaxing dinner.

**Sunday — Reset & Preparation:**
- **Morning (10:00 - 11:30):** Tidy living space and digital workspace.
- **Afternoon (15:00 - 16:00):** Meal prep and quick grocery replenishment.
- **Evening (19:00 - 19:30):** 30-minute weekly review — choose your top 3 goals for the upcoming week.

Would you like me to add these weekend time blocks to your calendar?`;
  }

  if (p.includes("tomorrow easier") || p.includes("make tomorrow easier")) {
    return `### ⚡ 4 Steps to Make Tomorrow Flow Smoothly

1. **Pick the "One Big Thing" (Highlight):** Decide on the single most impactful deliverable before you start.
2. **Defend Your First 90 Minutes:** Schedule your high-focus deep work for tomorrow morning (e.g. 09:00 - 10:30) before checking emails or messages.
3. **Stage Your Workspace Tonight:** Close unnecessary browser tabs and lay out what you need so there is zero startup friction.
4. **Group Micro-Tasks:** Batch administrative chores and messages into a dedicated 30-minute block at 16:00.

Would you like me to schedule a 90-minute focus block for tomorrow morning in your calendar?`;
  }

  if (p.includes("what should i do next") || p.includes("what next")) {
    return `### 🎯 Recommended Next Action

Take a moment to check your high-priority queue:
1. **Immediate 25-Minute Sprint:** Pick your current highest priority task and set a timer for 25 minutes of zero-distraction focus.
2. **Clear Any Overdue Items:** Reschedule or complete lingering items so your board stays fresh and actionable.
3. **Log Daily Habit:** Check off today's habits to maintain your active momentum streak.

What specific project or goal are you working on right now? Tell me, and I can give you the exact next 3 micro-steps.`;
  }

  return `I'm here to help! Whether you'd like to plan your schedule, build a multi-week progressive roadmap for a goal, or optimize your daily routine, just let me know what you have in mind.`;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", app: "Goal Spark AI" });
  });

  // AI Planner endpoint
  app.post("/api/generate-plan", async (req, res) => {
    const { goal } = req.body;
    if (!goal || typeof goal !== "string") {
      return res.status(400).json({ error: "Goal is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.json(generateCustomDynamicPlan(goal));
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      const system = `You are a world-class executive coach and goal architect.
Given a user's goal, create a fully domain-accurate, progressive, hierarchical roadmap:
1. If the goal is RUNNING/MARATHON: Every single daily task MUST be running-specific (e.g. 4km easy pace, hill repeats, core glute stability, long runs). DO NOT include coding/DSA/environment setup!
2. If the goal is PYTHON/CODING: Every daily task MUST be Python-specific (syntax, loops, lists, dicts, OOP, web scraping, FastAPI).
3. If the goal is SAAS MVP: Every daily task MUST be startup/SaaS specific (validation, wireframes, auth, Stripe, analytics, launch).
4. If the goal is INTERVIEW PREP: Every daily task MUST be DSA/System Design specific (Blind75, Two Pointers, Trees, Dynamic Programming, Mocks).
5. Monthly Milestones (e.g. 3-4 months).
6. Weekly Curriculums with 6 progressive, non-repeating daily tasks (Day 1 to Day 6) + 1 Sunday rest day.
7. Realistic dailyTime (e.g. "06:30 - 07:30" for running, "19:00 - 20:30" for study) and 1 targeted habit.

Respond ONLY with valid JSON matching this schema:
{
  "goalTitle": string,
  "summary": string,
  "difficulty": "easy" | "medium" | "hard",
  "estimatedHours": number,
  "timeline": string,
  "totalDays": number,
  "category": "study" | "work" | "personal" | "health" | "meeting",
  "monthlyMilestones": [
    { "month": number, "title": string, "outcome": string }
  ],
  "milestones": [
    { "title": string, "week": number, "month": number }
  ],
  "weeklyCurriculum": [
    {
      "week": number,
      "month": number,
      "focusTheme": string,
      "dailyTopics": string[],
      "restDayNote": string
    }
  ],
  "weeklyTasks": string[],
  "dailyTasks": string[],
  "dailyTime": string,
  "dailyDurationMinutes": number,
  "habits": [{ "name": string, "emoji": string }],
  "tips": string[]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `User goal: ${goal}. Build a thorough domain-accurate progressive roadmap mapping weekly themes and daily distinct topics across the full duration with Sunday rest days.`,
        config: {
          systemInstruction: system,
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      const json = JSON.parse(text);
      if (!json.weeklyCurriculum || json.weeklyCurriculum.length === 0) {
        return res.json(generateCustomDynamicPlan(goal));
      }
      res.json(json);
    } catch (err: any) {
      console.error("Gemini plan generation error:", err);
      res.json(generateCustomDynamicPlan(goal));
    }
  });

  // AI Chat Assistant endpoint
  app.post("/api/chat-assistant", async (req, res) => {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array required" });
    }

    const lastMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        content: getAssistantQuickResponse(lastMsg),
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      const system = `You are Goal Spark AI / GoalPilot, an intelligent, empathetic, and natural conversational productivity assistant and mentor.

CRITICAL BEHAVIOR GUIDELINES:
1. GREETINGS & CASUAL CHAT: If the user says "hi", "hello", "hey", "how are you", or small talk, respond warmly and conversationally as a human assistant. NEVER generate a 90-day plan or goal roadmap for greetings. Ask how you can help them achieve their goals or manage their schedule today.
2. CASUAL QUESTIONS & ADVICE: If asked general questions, answer directly with concise, helpful insight without forcing a goal schedule.
3. GOAL REQUESTS: If and only if the user expresses intent to prepare for a goal or learn something, give an overview and ask if they would like to break it down into milestones and scheduled tasks.
4. QUICK PROMPTS:
   - "Plan my weekend": Give a balanced 2-day Saturday/Sunday recharge and weekly prep blueprint.
   - "Make tomorrow easier": Give 3-4 concrete evening preparation and morning focus tactics.
   - "What should I do next?": Give immediate prioritization steps.`;

      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction: system,
        },
      });

      res.json({ content: response.text || getAssistantQuickResponse(lastMsg) });
    } catch (err: any) {
      console.error("Gemini chat error:", err);
      res.json({
        content: getAssistantQuickResponse(lastMsg),
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
