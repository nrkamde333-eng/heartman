import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useApp } from "@/lib/store";
import { generatePlan, chatAssistant } from "@/lib/ai-planner.functions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, RotateCcw, Plus, Calendar as CalendarIcon, Zap, User, Clock, CheckCircle2, BedDouble } from "lucide-react";
import { toast } from "sonner";
import type { GeneratedPlan } from "@/lib/demo-data";
import { addDays, format, parseISO, isSameDay } from "date-fns";
import { getCategoryTheme, calculateNextAvailableSlot, timeToMinutes, type ExistingInterval } from "@/lib/category-styles";
import { CategoryBadge } from "./app.index";

export const Route = createFileRoute("/app/planner")({
  head: () => ({
    meta: [
      { title: "AI Planner — GoalPilot" },
      { name: "description", content: "Describe any goal and get an AI-generated progressive roadmap with monthly tiers, weekly sprints, and non-repeating daily tasks." },
      { property: "og:title", content: "AI Planner — GoalPilot" },
      { property: "og:description", content: "Generate a personalized goal roadmap and apply it to your workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Planner,
});

const suggestions = [
  { text: "Prepare for Google interviews in 90 days", category: "study", tag: "Career & Tech", icon: "💻" },
  { text: "Run my first half-marathon in 16 weeks", category: "health", tag: "Endurance & Fitness", icon: "🏃" },
  { text: "Launch a SaaS MVP in 6 weeks", category: "work", tag: "Startup & Product", icon: "🚀" },
  { text: "Build a daily mindfulness & breathwork routine", category: "personal", tag: "Mental Health", icon: "🧘" },
];

// Helper to determine if user message is requesting a full goal roadmap vs general conversation
function isGoalRoadmapRequest(text: string): boolean {
  const t = text.toLowerCase().trim();

  // Greetings, small talk, questions about concepts should go to chat assistant
  const greetings = ["hi", "hello", "hey", "hola", "yo", "good morning", "good evening", "good afternoon", "sup", "how are you"];
  if (greetings.includes(t)) return false;

  // Short phrases
  if (t.length < 6) return false;

  // Clear goal patterns
  const goalSignals = [
    "want to learn",
    "learn ",
    "prepare for",
    "preparation",
    "in 90 days",
    "in 3 months",
    "in 6 weeks",
    "in 12 weeks",
    "in 16 weeks",
    "build a",
    "launch a",
    "run a",
    "master ",
    "roadmap for",
    "plan for",
    "study plan",
    "curriculum",
  ];

  return goalSignals.some((sig) => t.includes(sig));
}

function Planner() {
  const { state, addMessage, addGoal, addTask, addHabit, addEvent, setState } = useApp();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [state.messages.length, loading]);

  const submitRoadmap = async (goal: string) => {
    if (!goal.trim() || loading) return;
    setInput("");
    addMessage({ role: "user", content: goal });
    setLoading(true);
    try {
      const plan = (await generatePlan({ data: { goal } })) as GeneratedPlan;
      const timeWindow = plan.dailyTime || "19:00 - 20:30";
      addMessage({
        role: "assistant",
        content: `### 🎯 Progressive Roadmap: ${plan.goalTitle}\n\n${plan.summary}\n\n**Duration:** ${plan.timeline} (${plan.estimatedHours || 120} hrs) • **Daily Time Window:** ${timeWindow} (with Sunday rest)\n\nReview the monthly milestones and weekly breakdown below. Ready to break this goal into progressive calendar tasks and track your habit?`,
        plan,
      });
    } catch (e: any) {
      toast.error(e?.message ?? "AI request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUserMessage = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || loading) return;

    // Check if the user is asking to build a full multi-month goal roadmap
    if (isGoalRoadmapRequest(trimmed)) {
      await submitRoadmap(trimmed);
    } else {
      await askAssistant(trimmed);
    }
  };

  const askAssistant = async (q: string) => {
    if (loading) return;
    setInput("");
    addMessage({ role: "user", content: q });
    setLoading(true);
    try {
      const res = await chatAssistant({
        data: {
          messages: [
            ...state.messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: q },
          ],
        },
      });
      addMessage({ role: "assistant", content: res.content });
    } catch (e: any) {
      toast.error(e?.message ?? "AI request failed");
    } finally {
      setLoading(false);
    }
  };

  const acceptPlan = (plan: GeneratedPlan) => {
    const totalDays = plan.totalDays || 90;
    const planCategory = plan.category || "study";

    const goalMilestones = (plan.monthlyMilestones && plan.monthlyMilestones.length > 0)
      ? plan.monthlyMilestones.map((m, i) => ({
          id: `m_mo_${Date.now()}_${i}`,
          title: m.title,
          month: m.month,
          done: false,
        }))
      : plan.milestones.map((m, i) => ({
          id: `m_${Date.now()}_${i}`,
          title: m.title,
          week: m.week,
          done: false,
        }));

    const goal = addGoal({
      title: plan.goalTitle,
      description: plan.summary,
      progress: 0,
      targetDate: addDays(new Date(), totalDays).toISOString().slice(0, 10),
      category: planCategory,
      milestones: goalMilestones,
    });

    // Determine baseline start time & duration based on plan or domain
    let preferredStartMins = 19 * 60; // default 19:00 (7 PM)
    let durationMins = plan.dailyDurationMinutes || 90;

    if (plan.dailyTime) {
      const match = plan.dailyTime.match(/(\d{1,2}):(\d{2})/);
      if (match) {
        preferredStartMins = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
      }
    } else if (planCategory === "health") {
      preferredStartMins = 6 * 60 + 30; // 06:30 for morning fitness/running
      durationMins = 60;
    } else if (planCategory === "work") {
      preferredStartMins = 9 * 60; // 09:00 for work / SaaS sprints
      durationMins = 120;
    }

    // Cache existing events by day key to compute buffer collisions efficiently
    const dayScheduleMap = new Map<string, ExistingInterval[]>();
    for (const evt of state.events) {
      const dayKey = evt.start.slice(0, 10);
      const startMatch = evt.start.slice(11, 16);
      const endMatch = evt.end.slice(11, 16);
      if (startMatch && endMatch) {
        const interval: ExistingInterval = {
          startMins: timeToMinutes(startMatch),
          endMins: timeToMinutes(endMatch),
        };
        const list = dayScheduleMap.get(dayKey) || [];
        list.push(interval);
        dayScheduleMap.set(dayKey, list);
      }
    }

    let taskCount = 0;
    const curriculum = plan.weeklyCurriculum || [];
    
    if (curriculum.length > 0) {
      let dayPointer = 0;
      curriculum.forEach((week) => {
        week.dailyTopics.forEach((topic) => {
          if (dayPointer < totalDays) {
            const targetDate = addDays(new Date(), dayPointer);
            const dayStr = format(targetDate, "yyyy-MM-dd");

            // Calculate next available non-overlapping time slot with 20m living buffer
            const existingForDay = dayScheduleMap.get(dayStr) || [];
            const slot = calculateNextAvailableSlot(
              preferredStartMins,
              durationMins,
              existingForDay,
              20 // 20-minute living buffer
            );

            // Record this scheduled interval to avoid overlapping subsequent tasks on the same day
            existingForDay.push({ startMins: slot.startMins, endMins: slot.endMins });
            dayScheduleMap.set(dayStr, existingForDay);

            const createdTask = addTask({
              title: topic,
              priority: dayPointer < 7 ? "high" : "medium",
              status: "todo",
              dueDate: dayStr,
              category: planCategory,
              goalId: goal.id,
              startTime: slot.startTime,
              endTime: slot.endTime,
              estimatedMinutes: durationMins,
            });

            addEvent({
              title: topic.length > 35 ? topic.slice(0, 32) + "..." : topic,
              start: `${dayStr}T${slot.startTime}:00`,
              end: `${dayStr}T${slot.endTime}:00`,
              category: planCategory,
              goalId: goal.id,
              taskId: createdTask.id,
            });

            taskCount++;
            dayPointer++;
          }
        });

        if (dayPointer < totalDays) {
          const restDate = addDays(new Date(), dayPointer);
          const restDayStr = format(restDate, "yyyy-MM-dd");

          const existingForDay = dayScheduleMap.get(restDayStr) || [];
          const slot = calculateNextAvailableSlot(
            19 * 60, // 19:00 rest/reflection slot
            30,
            existingForDay,
            15
          );
          existingForDay.push({ startMins: slot.startMins, endMins: slot.endMins });
          dayScheduleMap.set(restDayStr, existingForDay);

          addEvent({
            title: `🌿 Sunday Rest & Recharge (${week.focusTheme})`,
            start: `${restDayStr}T${slot.startTime}:00`,
            end: `${restDayStr}T${slot.endTime}:00`,
            category: "personal",
            goalId: goal.id,
          });

          dayPointer++;
        }
      });
    }

    if (plan.habits && plan.habits.length > 0) {
      const primaryHabit = plan.habits[0];
      addHabit({
        name: primaryHabit.name,
        emoji: primaryHabit.emoji || (planCategory === "health" ? "🏃" : planCategory === "work" ? "🚀" : "💻"),
        frequency: "daily",
        color: "brand",
      });
    }

    toast.success(`Complete roadmap scheduled! Created goal with category "${planCategory}", ${taskCount} dynamic buffered tasks, and habit tracking.`);
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display font-extrabold text-2xl tracking-tight flex items-center gap-2">
            <Sparkles className="size-6 text-primary" /> AI Goal Coach & Planner
          </h1>
          <p className="text-sm text-muted-foreground">Ask questions, plan routines, or generate complete progressive roadmaps.</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setState((s) => ({ ...s, messages: [] }))}>
          <RotateCcw className="size-4 mr-1" /> New chat
        </Button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {state.messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center gap-6">
              <div className="size-16 rounded-2xl gradient-brand grid place-items-center shadow-xl shadow-primary/30">
                <Sparkles className="size-8 text-white" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl">How can I assist you today?</h2>
                <p className="text-sm text-muted-foreground mt-1 max-w-md">Chat with me naturally, ask for advice, or describe a goal to build a complete progressive roadmap.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 max-w-2xl w-full">
                {suggestions.map((s) => {
                  const theme = getCategoryTheme(s.category);
                  return (
                    <button
                      key={s.text}
                      onClick={() => handleUserMessage(s.text)}
                      className={`text-left p-3.5 rounded-2xl border ${theme.neonBorder} bg-card/60 hover:bg-card/90 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between gap-2 group hover:translate-y-[-1px]`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${theme.badgeClass}`}>
                          {s.tag}
                        </span>
                        <span className="text-base">{s.icon}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-foreground group-hover:text-primary transition">{s.text}</span>
                        <Sparkles className="size-3.5 opacity-0 group-hover:opacity-100 text-primary transition shrink-0" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {state.messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "assistant" && (
                <div className="size-8 rounded-lg gradient-brand grid place-items-center shrink-0">
                  <Sparkles className="size-4 text-white" />
                </div>
              )}
              <div className={`max-w-[85%] ${m.role === "user" ? "order-2" : ""}`}>
                <div
                  className={`rounded-2xl px-4 py-3 text-sm ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted/40 border rounded-tl-sm prose prose-sm dark:prose-invert max-w-none"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
                {m.plan && (
                  <PlanCard
                    plan={m.plan}
                    onAccept={() => acceptPlan(m.plan!)}
                    onRegenerate={() => submitRoadmap(m.plan!.goalTitle)}
                  />
                )}
              </div>
              {m.role === "user" && (
                <div className="size-8 rounded-lg bg-muted grid place-items-center shrink-0 order-3">
                  <User className="size-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="size-8 rounded-lg gradient-brand grid place-items-center shrink-0">
                <Sparkles className="size-4 text-white animate-pulse" />
              </div>
              <div className="bg-muted/40 border rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                <Sparkles className="size-3.5 animate-spin text-primary" /> Thinking…
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-3 md:p-4">
          <div className="flex gap-2 mb-2 flex-wrap items-center">
            <span className="text-xs text-muted-foreground font-medium mr-1">Quick Prompts:</span>
            {[
              "Prepare for Google interviews in 90 days",
              "Plan my weekend",
              "Make tomorrow easier",
              "What should I do next?",
            ].map((s) => (
              <button
                key={s}
                onClick={() => handleUserMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full border hover:border-primary/50 hover:bg-muted/50 transition flex items-center gap-1.5"
              >
                <span>{s}</span>
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserMessage(input);
            }}
            className="flex gap-2"
          >
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleUserMessage(input);
                }
              }}
              placeholder="e.g. 'Hi there!', 'Plan my weekend', or 'Prepare for Google interview in 90 days'…"
              rows={2}
              className="resize-none rounded-2xl"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-2xl gradient-brand text-white self-end px-4 py-3 h-auto"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

function PlanCard({
  plan,
  onAccept,
  onRegenerate,
}: {
  plan: GeneratedPlan;
  onAccept: () => void;
  onRegenerate: () => void;
}) {
  const [accepted, setAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState<"months" | "weeks" | "daily">("months");
  const theme = getCategoryTheme(plan.category);

  const handleAccept = () => {
    onAccept();
    setAccepted(true);
  };

  const curriculum = plan.weeklyCurriculum || [];

  return (
    <Card className={`mt-3.5 border ${theme.neonBorder} overflow-hidden shadow-lg ${theme.glowShadow} bg-card/90 backdrop-blur-md`}>
      <CardHeader className="pb-3 bg-muted/20 border-b border-border/50">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base font-display font-bold flex items-center gap-2">
              <span className="text-foreground">{plan.goalTitle}</span>
            </CardTitle>
            <div className="mt-2 flex gap-1.5 flex-wrap">
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${theme.badgeClass}`}>
                {theme.name}
              </span>
              <Badge variant="outline" className={`uppercase text-[10px] ${theme.textColor} border-current/30`}>
                {plan.difficulty}
              </Badge>
              <Badge variant="outline" className="uppercase text-[10px]">
                {plan.timeline}
              </Badge>
              <Badge variant="outline" className="uppercase text-[10px]">
                <Zap className="size-3 mr-0.5 text-amber-500" /> {plan.estimatedHours}h total
              </Badge>
              <Badge variant="secondary" className="text-[10px] flex items-center gap-1 font-mono">
                <Clock className="size-3 text-primary" /> Daily: {plan.dailyTime || (plan.category === "health" ? "06:30 - 07:30" : plan.category === "work" ? "09:00 - 11:00" : "19:00 - 20:30")}
              </Badge>
              <Badge variant="outline" className="text-[10px] flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                <BedDouble className="size-3" /> Sunday: Rest & Recharge
              </Badge>
            </div>
          </div>
        </div>

        {/* Level Switcher */}
        <div className="flex gap-1 mt-3 p-1 rounded-xl bg-background/90 border border-border/60 w-fit">
          <button
            onClick={() => setActiveTab("months")}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
              activeTab === "months"
                ? `bg-gradient-to-r ${theme.gradient} text-white shadow-xs`
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            🏛️ Monthly Milestones
          </button>
          <button
            onClick={() => setActiveTab("weeks")}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
              activeTab === "weeks"
                ? `bg-gradient-to-r ${theme.gradient} text-white shadow-xs`
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            📅 Weekly Sprints
          </button>
          <button
            onClick={() => setActiveTab("daily")}
            className={`px-3 py-1 text-xs rounded-lg font-semibold transition-all ${
              activeTab === "daily"
                ? `bg-gradient-to-r ${theme.gradient} text-white shadow-xs`
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            ⚡ Sample Progressive Days
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-sm pt-4">
        {/* MONTHLY VIEW */}
        {activeTab === "months" && (
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              3-Tier Monthly Progression
            </div>
            {plan.monthlyMilestones && plan.monthlyMilestones.length > 0 ? (
              plan.monthlyMilestones.map((m, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/20 border border-border/50 space-y-1 hover:bg-muted/30 transition">
                  <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                    <span className={`size-5.5 rounded-full bg-gradient-to-r ${theme.gradient} grid place-items-center text-[10px] text-white font-bold shrink-0 shadow-xs`}>
                      M{m.month}
                    </span>
                    <span>{m.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-7">{m.outcome}</p>
                </div>
              ))
            ) : (
              plan.milestones.map((m, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-muted/20 border border-border/50 flex items-center gap-2 text-xs">
                  <span className={`size-5 rounded-full bg-gradient-to-r ${theme.gradient} grid place-items-center text-[10px] text-white font-bold shrink-0`}>
                    W{m.week}
                  </span>
                  <span>{m.title}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* WEEKLY VIEW */}
        {activeTab === "weeks" && (
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Weekly Thematic Sprints (Mon–Sat Practice + Sun Rest)
            </div>
            <div className="grid sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
              {curriculum.map((w) => (
                <div key={w.week} className="p-2.5 rounded-xl border border-border/50 bg-muted/20 text-xs hover:bg-muted/30 transition">
                  <div className="flex items-center justify-between font-semibold">
                    <span className={theme.textColor}>Week {w.week} (Month {w.month})</span>
                  </div>
                  <div className="font-medium text-foreground mt-0.5">{w.focusTheme}</div>
                  <div className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                    <BedDouble className="size-3 text-emerald-500" /> {w.restDayNote || "Sunday: Rest & consolidate"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DAILY VIEW */}
        {activeTab === "daily" && (
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Distinct, Non-Repeating Daily Practice (Week 1 & 2 Preview)
            </div>
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {(curriculum[0]?.dailyTopics || plan.dailyTasks).map((task, i) => (
                <div key={i} className="p-2 rounded-xl bg-muted/20 border border-border/50 text-xs flex items-center gap-2">
                  <span className={`size-5 rounded-full ${theme.badgeClass} font-bold grid place-items-center text-[10px] shrink-0`}>
                    {i + 1}
                  </span>
                  <span className="font-medium text-foreground">{task}</span>
                </div>
              ))}
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                <BedDouble className="size-4 shrink-0 text-emerald-500" />
                <span className="font-medium">Day 7 (Sunday): Scheduled Rest & Mental Recharge</span>
              </div>
            </div>
          </div>
        )}

        {/* HABIT & SCHEDULE SUMMARY */}
        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
              <CalendarIcon className="size-3.5 text-primary" /> Daily Calendar Schedule
            </div>
            <div className="text-xs text-foreground font-semibold font-mono">
              {plan.dailyTime || (plan.category === "health" ? "06:30 - 07:30 (60 mins)" : plan.category === "work" ? "09:00 - 11:00 (120 mins)" : "19:00 - 20:30 (90 mins)")} Mon–Sat
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Maps non-repeating progressive tasks with conflict avoidance buffer.
            </div>
          </div>

          <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 flex items-center gap-1.5">
              <Zap className="size-3.5 text-primary" /> Core Habit Tracked
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base">{plan.habits && plan.habits[0] ? plan.habits[0].emoji : "💻"}</span>
              <span className="text-xs font-semibold text-foreground">{plan.habits && plan.habits[0] ? plan.habits[0].name : "Daily Practice"}</span>
            </div>
            <div className="text-[11px] text-muted-foreground mt-0.5">
              Build your consistency streak with daily check-ins
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            Apply progressive syllabus to tasks & calendar?
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onRegenerate}
              className="rounded-full text-xs"
            >
              <RotateCcw className="size-3.5 mr-1" /> Refine
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              disabled={accepted}
              className={`rounded-full bg-gradient-to-r ${theme.gradient} text-white text-xs px-4 font-semibold shadow-md ${theme.glowShadow} hover:opacity-95 transition`}
            >
              {accepted ? (
                <>
                  <CheckCircle2 className="size-3.5 mr-1" /> Roadmap Active & Mapped
                </>
              ) : (
                <>
                  <Plus className="size-3.5 mr-1" /> Map Tasks to Calendar
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
