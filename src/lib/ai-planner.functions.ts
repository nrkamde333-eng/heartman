export async function generatePlan(options: { data: { goal: string } } | { goal: string }) {
  const goal = "data" in options ? options.data.goal : options.goal;

  try {
    const res = await fetch("/api/generate-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.goalTitle) {
        return data;
      }
    }
  } catch (err) {
    console.warn("API route failed, falling back to local generator:", err);
  }

  const cleanGoal = goal.trim();
  const lower = cleanGoal.toLowerCase();

  // 1. RUNNING / MARATHON FALLBACK
  if (lower.includes("marathon") || lower.includes("run") || lower.includes("running") || lower.includes("fitness")) {
    const isHalf = lower.includes("half") || lower.includes("16 weeks");
    return {
      goalTitle: isHalf ? "Run First Half-Marathon (16 Weeks)" : "Marathon Endurance Training Plan",
      summary: `Progressive endurance training roadmap designed to safely build aerobic stamina, running form, weekly mileage, and injury prevention with Sunday active recovery and rest days.`,
      difficulty: "hard",
      estimatedHours: 80,
      timeline: isHalf ? "16 weeks" : "12 weeks",
      totalDays: isHalf ? 112 : 84,
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
      ],
      weeklyTasks: ["Week 1: Baseline 3 km + Core stability", "Week 2: Cadence drills + 7.5 km long run"],
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
        "Run your easy runs truly easy — conversational pace builds mitochondria without injury.",
        "Protect your Sunday rest days for tendon repair and glycogen replenishment.",
      ],
    };
  }

  // 2. SAAS / STARTUP MVP FALLBACK
  if (lower.includes("saas") || lower.includes("startup") || lower.includes("mvp") || lower.includes("launch")) {
    return {
      goalTitle: "Launch a SaaS MVP (6 Weeks)",
      summary: `Fast-paced product roadmap from customer problem validation and Figma wireframes to full-stack code, Stripe payments, and public launch.`,
      difficulty: "hard",
      estimatedHours: 100,
      timeline: "6 weeks (42 days)",
      totalDays: 42,
      category: "work",
      dailyTime: "09:00 - 11:00",
      dailyDurationMinutes: 120,
      monthlyMilestones: [
        { month: 1, title: "Weeks 1-4: Problem Validation, Architecture, Auth & Core MVP Feature", outcome: "Working, deployed prototype with auth, database models, and primary user workflow." },
        { month: 2, title: "Weeks 5-6: Stripe Billing, Onboarding, Beta Testing & Launch", outcome: "Live production product with payment checkout, analytics, and active users." },
      ],
      milestones: [
        { title: "Week 1: Customer Validation & Clickable Prototype", week: 1, month: 1 },
        { title: "Week 2: Backend DB, Auth & API Architecture", week: 2, month: 1 },
        { title: "Week 3: Core Value Proposition Feature Sprint", week: 3, month: 1 },
        { title: "Week 4: Dashboard UI & Settings", week: 4, month: 1 },
      ],
      weeklyCurriculum: [
        {
          week: 1,
          month: 1,
          focusTheme: "Problem Validation & High-Fidelity UI",
          dailyTopics: [
            "Day 1: Conduct 5 target user interviews & define must-have MVP scope",
            "Day 2: Design user flow map and high-fidelity Figma mockups for core loop",
            "Day 3: Build landing page waitlist with headline, demo video & email capture",
            "Day 4: Setup repo, Tailwind UI theme & Vercel deployment pipeline",
            "Day 5: Configure database schema and auth models",
            "Day 6: Review waitlist conversion data & refine value proposition",
          ],
          restDayNote: "Sunday: Unplug, recharge, and review next week's tech specs.",
        },
      ],
      weeklyTasks: ["Week 1: Figma prototype + landing page waitlist"],
      dailyTasks: [
        "Day 1: Conduct 5 target user interviews & define must-have MVP",
        "Day 2: Design user flow map and high-fidelity Figma mockups",
        "Day 3: Build landing page waitlist with demo & email capture",
        "Day 4: Setup repo, Tailwind UI & Vercel deployment pipeline",
        "Day 5: Configure database schema & auth migrations",
        "Day 6: Review waitlist conversions & refine pitch",
      ],
      habits: [{ name: "Daily SaaS Build Sprint (2 hrs)", emoji: "🚀" }],
      tips: ["Cut any feature that isn't strictly necessary for the core user outcome."],
    };
  }

  // 3. PYTHON FALLBACK
  if (lower.includes("python")) {
    return {
      goalTitle: "Master Python Programming (3 Months)",
      summary: `Structured 12-week practical Python curriculum from syntax fundamentals to OOP, automated web scrapers, REST APIs with FastAPI, and production portfolio projects.`,
      difficulty: "medium",
      estimatedHours: 90,
      timeline: "12 weeks (90 days)",
      totalDays: 90,
      category: "study",
      dailyTime: "18:00 - 19:30",
      dailyDurationMinutes: 90,
      monthlyMilestones: [
        { month: 1, title: "Month 1: Syntax, Data Structures & Algorithmic Logic", outcome: "Master variables, control flow, lists, dicts, tuples, and clean functions." },
        { month: 2, title: "Month 2: Object-Oriented Design, File I/O & Web Scraping", outcome: "Build modular OOP applications, parse JSON/CSV, and scrape data with BeautifulSoup." },
        { month: 3, title: "Month 3: FastAPI Backend Services, SQL Databases & Capstone", outcome: "Develop, test, and deploy a complete production-grade Python web application." },
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
            "Day 1: Install Python 3.12, VS Code, virtual environments (venv) & run first script",
            "Day 2: Variables, primitive types (int, float, str, bool) & formatted f-strings",
            "Day 3: Conditional statements (if, elif, else), logical operators & comparison rules",
            "Day 4: Loops (for, while, range, enumerate) & loop control (break, continue)",
            "Day 5: Defining functions, arguments, default parameters & return values",
            "Day 6: Build CLI Project #1: Password Generator & Number Guessing Game",
          ],
          restDayNote: "Sunday: Complete rest and mental consolidation.",
        },
      ],
      weeklyTasks: ["Week 1: Setup + Syntax + Password Generator CLI"],
      dailyTasks: [
        "Day 1: Install Python, VS Code, virtual environment & run first script",
        "Day 2: Variables, primitive types & formatted f-strings",
        "Day 3: Conditional statements (if, elif, else) & operators",
        "Day 4: Loops (for, while, range, enumerate) & flow control",
        "Day 5: Functions, default parameters & return values",
        "Day 6: Build CLI Project: Number Guessing & Password Generator",
      ],
      habits: [{ name: "Daily Python Coding Class (90m)", emoji: "🐍" }],
      tips: ["Type out code manually rather than copy-pasting to build muscle memory."],
    };
  }

  // 4. GOOGLE / FAANG INTERVIEW PREP FALLBACK
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
      { month: 2, title: "Month 2: Advanced Data Structures, Trees, Graphs & Dynamic Programming", outcome: "Solve Tree traversals (BFS/DFS), BSTs, Graph algorithms, 1D/2D DP, and Backtracking." },
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
          "Day 1: Big-O diagnostics & solve Two Sum with HashMap",
          "Day 2: Valid Anagram & Group Anagrams using frequency maps",
          "Day 3: Top K Frequent Elements & Product of Array Except Self",
          "Day 4: Two Pointers: Valid Palindrome & Two Sum II",
          "Day 5: Two Pointers: 3Sum & Container With Most Water",
          "Day 6: Trapping Rain Water: Solve with Two-Pointer technique",
        ],
        restDayNote: "Sunday: Complete rest and mental consolidation.",
      },
    ],
    weeklyTasks: ["Week 1: Two Sum, 3Sum, Container with Water"],
    dailyTasks: [
      "Day 1: Big-O diagnostics & solve Two Sum with HashMap",
      "Day 2: Valid Anagram & Group Anagrams",
      "Day 3: Top K Frequent Elements & Product of Array",
      "Day 4: Two Pointers: Valid Palindrome & Two Sum II",
      "Day 5: Two Pointers: 3Sum & Container With Most Water",
      "Day 6: Trapping Rain Water with Two-Pointer technique",
    ],
    habits: [{ name: "Daily Google Interview Practice (90m)", emoji: "💻" }],
    tips: ["Always communicate your thought process aloud before writing code."],
  };
}

export async function chatAssistant(options: { data: { messages: Array<{ role: string; content: string }> } } | { messages: Array<{ role: string; content: string }> }) {
  const messages = "data" in options ? options.data.messages : options.messages;

  try {
    const res = await fetch("/api/chat-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.content) {
        return data;
      }
    }
  } catch (err) {
    console.warn("API route failed, falling back to assistant logic:", err);
  }

  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content.toLowerCase().trim() || "";

  // Natural greeting handling
  if (lastUserMsg === "hi" || lastUserMsg === "hello" || lastUserMsg === "hey" || lastUserMsg === "yo" || lastUserMsg.startsWith("hi ") || lastUserMsg.startsWith("hello ")) {
    return {
      content: `Hello! 👋 How can I help you today?

I can help you with:
- **Planning Goals:** e.g., *"Prepare for Google interviews in 90 days"*, *"Run my first half-marathon in 16 weeks"*, or *"Learn Python in 3 months"*
- **Productivity & Routines:** e.g., *"Plan my weekend"* or *"Make tomorrow easier"*
- **Next Steps:** e.g., *"What should I do next?"*

What are you looking to achieve?`,
    };
  }

  if (lastUserMsg.includes("weekend")) {
    return {
      content: `### 🌟 Your Weekend Plan

**Saturday (Recharge & Active):**
- 09:00 - 11:00: Outdoor walk or workout.
- 14:00 - 16:00: Creative hobby or downtime.

**Sunday (Reset & Prepare):**
- 10:00 - 11:30: Workspace & home organization.
- 19:00 - 19:30: Weekly review and top 3 priorities for next week.

Would you like me to add this to your calendar?`,
    };
  }

  if (lastUserMsg.includes("tomorrow easier") || lastUserMsg.includes("tomorrow")) {
    return {
      content: `### ⚡ 3 Ways to Make Tomorrow Easier

1. **Decide your 1 High-Impact Task** right now before ending today.
2. **Block 09:00 - 10:30 tomorrow** for distraction-free deep work.
3. **Stage your workspace** with tabs and tools open so you start immediately.

Shall I schedule tomorrow's morning focus block for you?`,
    };
  }

  if (lastUserMsg.includes("what should i do next") || lastUserMsg.includes("what next")) {
    return {
      content: `### 🎯 What To Do Next

1. **Pick the top uncompleted task** in your queue.
2. **Set a 25-minute timer** and execute without switching tabs.
3. **Mark it complete and log your habit** to maintain your streak.

What goal are you actively working on today?`,
    };
  }

  return {
    content: `I'm here to help! Whether you'd like to plan your schedule, build a multi-week progressive roadmap for a goal, or optimize your daily routine, just let me know what you have in mind.`,
  };
}
