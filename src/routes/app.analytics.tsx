import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend
} from "recharts";
import {
  CheckCircle2,
  Flame,
  Target as TargetIcon,
  TrendingUp,
  Clock,
  Zap,
  Calendar,
  Sparkles,
  Award,
  Activity,
  Layers,
  ArrowUpRight,
  Sun,
  Moon,
  ChevronRight
} from "lucide-react";
import { CATEGORY_THEMES } from "@/lib/category-styles";
import type { Category } from "@/lib/demo-data";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics & Insights — GoalPilot" },
      { name: "description", content: "Visualize productivity trends, category distributions, habit heatmaps, and goal milestone velocity." },
      { property: "og:title", content: "Analytics & Insights — GoalPilot" },
      { property: "og:description", content: "Insights and trends for your goals, tasks and habits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AnalyticsPage,
});

export default function AnalyticsPage() {
  const { state } = useApp();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "all">("7d");

  // Computed metrics
  const doneTasks = state.tasks.filter((t) => t.status === "done");
  const inProgressTasks = state.tasks.filter((t) => t.status === "in_progress");
  const todoTasks = state.tasks.filter((t) => t.status === "todo");
  const totalTasks = state.tasks.length;
  const completionRate = totalTasks ? Math.round((doneTasks.length / totalTasks) * 100) : 0;

  const maxStreak = Math.max(0, ...state.habits.map((h) => h.streak));
  const avgStreak = state.habits.length
    ? Math.round(state.habits.reduce((acc, h) => acc + h.streak, 0) / state.habits.length)
    : 0;

  const totalMilestones = state.goals.reduce((acc, g) => acc + g.milestones.length, 0);
  const doneMilestones = state.goals.reduce((acc, g) => acc + g.milestones.filter((m) => m.done).length, 0);
  const avgGoalProgress = state.goals.length
    ? Math.round(state.goals.reduce((acc, g) => acc + g.progress, 0) / state.goals.length)
    : 0;

  // Estimated focus hours logged
  const totalEstimatedMinutes = doneTasks.reduce((acc, t) => acc + (t.estimatedMinutes || 60), 0);
  const totalFocusHours = (totalEstimatedMinutes / 60).toFixed(1);

  // Category distribution data
  const categoryOrder: Category[] = ["study", "work", "health", "personal", "meeting"];
  const categoryData = categoryOrder.map((cat) => {
    const tasks = state.tasks.filter((t) => t.category === cat);
    const completed = tasks.filter((t) => t.status === "done").length;
    const hours = tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 60), 0) / 60;
    const theme = CATEGORY_THEMES[cat];
    return {
      id: cat,
      name: theme.name,
      shortName: cat.charAt(0).toUpperCase() + cat.slice(1),
      value: tasks.length,
      completed,
      hours: Number(hours.toFixed(1)),
      color: theme.hex,
      theme,
    };
  }).filter((x) => x.value > 0);

  // Weekly activity breakdown
  const weeklyData = [
    { day: "Mon", tasks: 5, hours: 3.5, score: 85 },
    { day: "Tue", tasks: 6, hours: 4.2, score: 92 },
    { day: "Wed", tasks: 4, hours: 3.0, score: 78 },
    { day: "Thu", tasks: 7, hours: 5.0, score: 96 },
    { day: "Fri", tasks: 6, hours: 4.5, score: 88 },
    { day: "Sat", tasks: 5, hours: 3.8, score: 82 },
    { day: "Sun", tasks: 2, hours: 1.5, score: 70 }, // Active Rest day
  ];

  // Monthly productivity & consistency velocity
  const monthlyTrend = [
    { month: "Jan", score: 62, focusHours: 42, goalsCompleted: 1 },
    { month: "Feb", score: 68, focusHours: 50, goalsCompleted: 1 },
    { month: "Mar", score: 74, focusHours: 58, goalsCompleted: 2 },
    { month: "Apr", score: 79, focusHours: 64, goalsCompleted: 2 },
    { month: "May", score: 85, focusHours: 72, goalsCompleted: 3 },
    { month: "Jun", score: 88, focusHours: 78, goalsCompleted: 3 },
    { month: "Jul", score: 92, focusHours: 85, goalsCompleted: 4 },
    { month: "Aug", score: 95, focusHours: 90, goalsCompleted: 4 },
  ];

  // Time-of-day focus distribution
  const timeOfDayData = [
    { period: "Morning (06:00 - 12:00)", percentage: 45, label: "Zone 2 Runs, SaaS Sprints & Deep Work", color: "#3b82f6" },
    { period: "Afternoon (12:00 - 18:00)", percentage: 25, label: "Architecture Syncs & Code Reviews", color: "#f59e0b" },
    { period: "Evening (18:00 - 22:00)", percentage: 30, label: "Google Prep, DSA & Breathwork", color: "#a855f7" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl gradient-brand text-white shadow-md shadow-primary/25">
              <Activity className="size-5" />
            </span>
            <span>Analytics & Intelligence</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time execution velocity, category distributions, habit heatmaps, and roadmap milestones.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border/60 w-fit">
          {(["7d", "30d", "all"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                timeRange === r
                  ? "bg-primary text-primary-foreground shadow-xs shadow-primary/30"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "7d" ? "This Week" : r === "30d" ? "Past 30 Days" : "All Time"}
            </button>
          ))}
        </div>
      </div>

      {/* Top Bento KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiCard
          icon={CheckCircle2}
          label="Tasks Completed"
          value={`${doneTasks.length} / ${totalTasks}`}
          sub={`${completionRate}% execution rate`}
          tone="emerald"
          badge="+14% this week"
        />
        <KpiCard
          icon={Flame}
          label="Longest Habit Streak"
          value={`${maxStreak} Days`}
          sub={`Avg streak: ${avgStreak} days across ${state.habits.length} habits`}
          tone="purple"
          badge="Top 5% Consistency"
        />
        <KpiCard
          icon={TargetIcon}
          label="Goal Milestones"
          value={`${doneMilestones} / ${totalMilestones}`}
          sub={`${avgGoalProgress}% average roadmap progress`}
          tone="blue"
          badge="4 Active Goals"
        />
        <KpiCard
          icon={Clock}
          label="Focus Hours Logged"
          value={`${totalFocusHours} hrs`}
          sub="Deep work & targeted practice"
          tone="amber"
          badge="Peak: 5.0h/day"
        />
      </div>

      {/* Primary Analytics Row: Weekly Activity + Category Neon Donut */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Weekly Activity (Grouped Bar Chart) */}
        <Card className="lg:col-span-7 border border-border/70 shadow-xs">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <span>Weekly Activity & Deep Work</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Comparison of daily completed tasks versus focused deep work hours.
              </CardDescription>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                <span className="text-muted-foreground font-medium">Tasks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-muted-foreground font-medium">Hours</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} barGap={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--border) 60%, transparent)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomBarTooltip />} />
                <Bar dataKey="tasks" name="Tasks Done" fill="#a855f7" radius={[6, 6, 0, 0]} maxBarSize={28} />
                <Bar dataKey="hours" name="Focus Hours" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Split with Neon Shadows and Metric Breakdown */}
        <Card className="lg:col-span-5 border border-border/70 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              <span>Category Distribution & Split</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Balanced allocation of life, study, career, and fitness domains.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-44 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={76}
                    paddingAngle={4}
                    stroke="var(--card)"
                    strokeWidth={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomPieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Centered Donut Summary */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-display font-extrabold">{totalTasks}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Total Tasks</span>
              </div>
            </div>

            {/* Category Breakdown Table with Neon Badges */}
            <div className="space-y-2 pt-1 border-t border-border/60">
              {categoryData.map((cat) => {
                const percent = totalTasks ? Math.round((cat.value / totalTasks) * 100) : 0;
                return (
                  <div key={cat.id} className="flex items-center justify-between text-xs py-0.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="size-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: cat.color, boxShadow: `0 0 8px ${cat.color}` }}
                      />
                      <span className="font-semibold truncate">{cat.theme.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 font-mono">
                      <span className="text-muted-foreground">{cat.value} tasks</span>
                      <span className="font-bold text-foreground w-8 text-right">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Habit 7-Day Consistency Matrix Heatmap */}
      <Card className="border border-border/70 shadow-xs overflow-hidden">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Zap className="size-4 text-primary" />
              <span>Habit Consistency & Streak Matrix</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Daily habit completion logs across all balanced life dimensions.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-[11px] font-semibold border-primary/30 text-primary">
            {state.habits.length} Active Habits
          </Badge>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[620px] space-y-2">
            {/* Days Header */}
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-muted-foreground pb-1 border-b border-border/50">
              <div className="col-span-5 pl-2">Habit Routine</div>
              <div className="col-span-2 text-center">Streak</div>
              <div className="col-span-5 grid grid-cols-7 text-center">
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
                <span>S</span>
              </div>
            </div>

            {/* Habit Rows */}
            {state.habits.map((habit) => {
              return (
                <div
                  key={habit.id}
                  className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-muted/20 hover:bg-muted/40 transition border border-border/40"
                >
                  <div className="col-span-5 flex items-center gap-2.5 min-w-0 pl-1">
                    <span className="text-lg shrink-0">{habit.emoji}</span>
                    <span className="font-semibold text-xs truncate text-foreground">{habit.name}</span>
                  </div>

                  <div className="col-span-2 flex items-center justify-center gap-1.5">
                    <Flame className="size-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-xs font-mono">{habit.streak}d</span>
                    <span className="text-[10px] text-muted-foreground">({habit.bestStreak}d best)</span>
                  </div>

                  <div className="col-span-5 grid grid-cols-7 gap-1.5 place-items-center">
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                      // Recent completion mock logic matching streak length
                      const isCompleted = dayIdx <= Math.min(6, habit.streak);
                      return (
                        <div
                          key={dayIdx}
                          className={`size-6 rounded-lg grid place-items-center text-[10px] font-bold transition-all ${
                            isCompleted
                              ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)] ring-1 ring-emerald-400/40"
                              : "bg-muted/60 text-muted-foreground/50 border border-border/60"
                          }`}
                          title={isCompleted ? "Completed" : "Scheduled"}
                        >
                          {isCompleted ? "✓" : "·"}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Productivity Trend (Area Chart) + Time-of-Day Allocation */}
      <div className="grid lg:grid-cols-12 gap-5">
        {/* Productivity Trend Area Chart */}
        <Card className="lg:col-span-8 border border-border/70 shadow-xs">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" />
                <span>Productivity & Consistency Velocity</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Monthly execution score compound trend (Target: 95+).
              </CardDescription>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
              <Sparkles className="size-3.5" /> 95 Current Score
            </div>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="color-mix(in oklab, var(--border) 60%, transparent)" vertical={false} />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[50, 100]} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomAreaTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#a855f7"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#scoreGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Time of Day Focus Distribution */}
        <Card className="lg:col-span-4 border border-border/70 shadow-xs flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Sun className="size-4 text-amber-500" />
              <span>Time-of-Day Distribution</span>
            </CardTitle>
            <CardDescription className="text-xs">
              When your deep work energy is most focused.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {timeOfDayData.map((item, i) => (
              <div key={i} className="space-y-1.5 p-2.5 rounded-xl bg-muted/20 border border-border/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{item.period}</span>
                  <span className="font-bold font-mono" style={{ color: item.color }}>{item.percentage}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.color,
                      boxShadow: `0 0 10px ${item.color}80`
                    }}
                  />
                </div>
                <div className="text-[11px] text-muted-foreground">{item.label}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Goal Milestones & Velocity Progress */}
      <Card className="border border-border/70 shadow-xs">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Award className="size-4 text-primary" />
              <span>Active Goal Roadmap Velocity</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Track progress against target deadlines and milestone deliverables.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs font-semibold">
            {state.goals.length} Goals Active
          </Badge>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          {state.goals.map((g) => {
            const catTheme = CATEGORY_THEMES[g.category] || CATEGORY_THEMES.study;
            const completedMilestones = g.milestones.filter((m) => m.done).length;
            return (
              <div
                key={g.id}
                className={`p-4 rounded-2xl border ${catTheme.neonBorder} bg-muted/20 space-y-3 transition-all hover:translate-y-[-2px]`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md mb-1.5 ${catTheme.badgeClass}`}>
                      {catTheme.name}
                    </span>
                    <h3 className="font-display font-bold text-sm text-foreground truncate">{g.title}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`font-display font-extrabold text-lg ${catTheme.textColor}`}>
                      {g.progress}%
                    </span>
                  </div>
                </div>

                <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${catTheme.gradient} rounded-full transition-all duration-500`}
                    style={{ width: `${g.progress}%` }}
                  />
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-medium">
                    <span>Milestones Completed</span>
                    <span className="font-mono text-foreground font-semibold">{completedMilestones} / {g.milestones.length}</span>
                  </div>
                  <div className="flex gap-1.5">
                    {g.milestones.map((m, idx) => (
                      <div
                        key={m.id || idx}
                        className={`flex-1 h-1.5 rounded-full transition ${
                          m.done
                            ? `bg-gradient-to-r ${catTheme.gradient} shadow-[0_0_6px_rgba(168,85,247,0.5)]`
                            : "bg-muted/80"
                        }`}
                        title={m.title}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                  <span>Target Finish</span>
                  <span className="font-semibold text-foreground">{new Date(g.targetDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

// KPI Bento Card Component
function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  tone,
  badge,
}: {
  icon: any;
  label: string;
  value: string;
  sub: string;
  tone: "purple" | "emerald" | "blue" | "amber";
  badge?: string;
}) {
  const toneMap = {
    purple: {
      border: "border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.12)]",
      iconBg: "bg-purple-500/15 text-purple-500 dark:text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)]",
      badge: "bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/25",
    },
    emerald: {
      border: "border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.12)]",
      iconBg: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]",
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/25",
    },
    blue: {
      border: "border-blue-500/30 hover:border-blue-500/60 shadow-[0_0_20px_rgba(59,130,246,0.12)]",
      iconBg: "bg-blue-500/15 text-blue-500 dark:text-blue-300 shadow-[0_0_12px_rgba(59,130,246,0.3)]",
      badge: "bg-blue-500/10 text-blue-600 dark:text-blue-300 border-blue-500/25",
    },
    amber: {
      border: "border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.12)]",
      iconBg: "bg-amber-500/15 text-amber-500 dark:text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]",
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/25",
    },
  };

  const style = toneMap[tone];

  return (
    <Card className={`border ${style.border} transition-all duration-300 hover:translate-y-[-2px]`}>
      <CardContent className="p-4 flex flex-col justify-between h-full space-y-3">
        <div className="flex items-center justify-between">
          <div className={`size-9 rounded-xl grid place-items-center ${style.iconBg}`}>
            <Icon className="size-4.5" />
          </div>
          {badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
              {badge}
            </span>
          )}
        </div>

        <div>
          <div className="font-display font-extrabold text-2xl md:text-3xl tracking-tight text-foreground">
            {value}
          </div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-0.5">
            {label}
          </div>
          <div className="text-[11px] text-muted-foreground mt-1 truncate">
            {sub}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Custom Tooltip Components
function CustomBarTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-card/95 backdrop-blur-md border border-border/80 shadow-xl space-y-1.5 text-xs">
        <div className="font-bold text-foreground border-b border-border/50 pb-1">{label}</div>
        <div className="flex items-center gap-2 text-purple-400 font-semibold">
          <span className="size-2 rounded-full bg-purple-500" />
          <span>Tasks: {payload[0]?.value} completed</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <span className="size-2 rounded-full bg-emerald-500" />
          <span>Focus Time: {payload[1]?.value} hrs</span>
        </div>
      </div>
    );
  }
  return null;
}

function CustomPieTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-3 rounded-xl bg-card/95 backdrop-blur-md border border-border/80 shadow-xl space-y-1 text-xs">
        <div className="font-bold text-foreground flex items-center gap-1.5">
          <span className="size-2 rounded-full" style={{ backgroundColor: data.color }} />
          <span>{data.name}</span>
        </div>
        <div className="text-muted-foreground font-medium">
          {data.value} tasks · {data.hours} hours logged
        </div>
      </div>
    );
  }
  return null;
}

function CustomAreaTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 rounded-xl bg-card/95 backdrop-blur-md border border-border/80 shadow-xl space-y-1 text-xs">
        <div className="font-bold text-foreground border-b border-border/50 pb-1">{label} Consistency</div>
        <div className="text-purple-400 font-semibold flex items-center gap-1.5">
          <Sparkles className="size-3.5" />
          <span>Score: {payload[0]?.value} / 100</span>
        </div>
      </div>
    );
  }
  return null;
}
