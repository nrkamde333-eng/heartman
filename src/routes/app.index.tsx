import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Flame,
  TrendingUp,
  Target as TargetIcon,
  Sparkles,
  Clock,
  Quote,
  Check,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { getCategoryTheme } from "@/lib/category-styles";
import { toast } from "sonner";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — GoalPilot" },
      { name: "description", content: "Your daily focus hub: tasks, habits, upcoming events and goal progress." },
      { property: "og:title", content: "Dashboard — GoalPilot" },
      { property: "og:description", content: "Track today's tasks, habits and goals in your AI productivity workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const quotes = [
  "The secret of getting ahead is getting started. — Mark Twain",
  "Small steps every day. — Anonymous",
  "Discipline equals freedom. — Jocko Willink",
  "You do not rise to the level of your goals. You fall to the level of your systems. — James Clear",
];

function Dashboard() {
  const { state, toggleTask, toggleHabitToday } = useApp();
  const navigate = useNavigate();
  const todayTasks = state.tasks.filter((t) => isToday(parseISO(t.dueDate)));
  const done = todayTasks.filter((t) => t.status === "done").length;
  const upcoming = state.events
    .filter((e) => new Date(e.start).getTime() >= Date.now())
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, 5);
  const streak = Math.max(0, ...state.habits.map((h) => h.streak));
  const productivity = Math.min(100, Math.round((done / Math.max(1, todayTasks.length)) * 60 + streak * 3));
  const quote = quotes[new Date().getDate() % quotes.length];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Editorial Napoleon Bonaparte Quote Banner at the Top */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-r from-primary/10 via-card to-brand-2/10 p-5 sm:p-6 shadow-xs">
        <div className="absolute -top-10 -right-10 size-36 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
        <div className="relative flex items-start gap-3 sm:gap-4">
          <div className="rounded-xl bg-primary/15 p-2.5 text-primary shrink-0 mt-0.5 shadow-xs border border-primary/20">
            <Quote className="size-5 sm:size-6" />
          </div>
          <div className="space-y-1.5 flex-1 min-w-0">
            <blockquote className="font-serif italic text-base sm:text-lg md:text-xl text-foreground font-normal leading-snug sm:leading-relaxed tracking-wide">
              “A genius is the person who can do the average thing when everyone around him is going crazy.”
            </blockquote>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="font-sans font-semibold text-xs tracking-wider uppercase text-primary">
                — Napoleon Bonaparte
              </span>
              <span className="text-[11px] text-muted-foreground hidden sm:inline">· Daily Principle</span>
            </div>
          </div>
        </div>
      </div>

      {/* Header with Greeting and Interactive Analytics Badges */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">
            Good {greeting()}, {state.user?.name.split(" ")[0]}.
          </h1>
          <p className="mt-1.5 text-muted-foreground">Here's what today looks like.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/app/analytics"
            className="focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            title="View streak analytics"
          >
            <Stat label="Streak" value={`${streak}d`} icon={Flame} tone="warning" />
          </Link>
          <Link
            to="/app/analytics"
            className="focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            title="View productivity score analytics"
          >
            <Stat label="Score" value={String(productivity)} icon={TrendingUp} tone="success" />
          </Link>
        </div>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border overflow-hidden">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base">Today's tasks</CardTitle>
            <span className="text-xs text-muted-foreground">{done}/{todayTasks.length} done</span>
          </CardHeader>
          <CardContent className="space-y-2 p-3">
            {todayTasks.length === 0 && <Empty msg="Nothing scheduled today. Enjoy the calm." />}
            {todayTasks.map((t) => {
              const theme = getCategoryTheme(t.category);
              return (
                <button
                  key={t.id}
                  onClick={() => toggleTask(t.id)}
                  className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border-l-4 transition group ${
                    t.status === "done" ? "opacity-60 bg-muted/10" : theme.cardBg
                  } ${
                    t.category === "study"
                      ? "border-l-purple-500"
                      : t.category === "work"
                      ? "border-l-blue-500"
                      : t.category === "health"
                      ? "border-l-emerald-500"
                      : t.category === "personal"
                      ? "border-l-pink-500"
                      : "border-l-amber-500"
                  }`}
                >
                  {t.status === "done" ? (
                    <CheckCircle2 className="size-5 text-success shrink-0" />
                  ) : (
                    <Circle className="size-5 text-muted-foreground shrink-0 group-hover:text-primary transition" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium ${
                        t.status === "done" ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {t.title}
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 flex-wrap">
                      {t.startTime && (
                        <span className="flex items-center gap-1 font-mono text-[11px] bg-background/60 px-1.5 py-0.5 rounded border">
                          <Clock className="size-3 text-primary" />
                          {t.startTime}
                          {t.endTime ? ` - ${t.endTime}` : ""}
                        </span>
                      )}
                      <CategoryBadge cat={t.category} />
                    </div>
                  </div>
                  <PriorityDot p={t.priority} />
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base">Productivity</CardTitle>
            <Link to="/app/analytics" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              Analytics <ChevronRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <Link to="/app/analytics" className="block group">
              <div className="relative aspect-square w-40 mx-auto grid place-items-center cursor-pointer transition-transform group-hover:scale-105">
                <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                  <circle cx="50" cy="50" r="42" strokeWidth="10" fill="none" className="stroke-muted" />
                  <circle cx="50" cy="50" r="42" strokeWidth="10" fill="none" strokeLinecap="round" className="stroke-primary"
                    strokeDasharray={`${(productivity / 100) * 264} 264`} />
                </svg>
                <div className="relative text-center">
                  <div className="font-display font-extrabold text-4xl">{productivity}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-primary transition flex items-center justify-center gap-1">
                    Today <ArrowUpRight className="size-3" />
                  </div>
                </div>
              </div>
            </Link>
            <div className="grid grid-cols-3 mt-4 gap-2 text-center">
              <MiniStat label="Focus" value="3.2h" />
              <MiniStat label="Habits" value={`${state.habits.filter(h => h.log.includes(new Date().toISOString().slice(0,10))).length}/${state.habits.length}`} />
              <MiniStat label="Done" value={`${done}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="border">
          <CardHeader className="pb-3"><CardTitle className="text-base">Upcoming events</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {upcoming.map((e) => (
              <div key={e.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40">
                <div className="w-12 text-center shrink-0">
                  <div className="text-[10px] text-muted-foreground uppercase">{format(parseISO(e.start), "MMM")}</div>
                  <div className="font-bold text-lg leading-none">{format(parseISO(e.start), "d")}</div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{e.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {isToday(parseISO(e.start)) ? "Today" : isTomorrow(parseISO(e.start)) ? "Tomorrow" : format(parseISO(e.start), "EEE")} · {format(parseISO(e.start), "HH:mm")}
                  </div>
                </div>
                <CategoryBadge cat={e.category} />
              </div>
            ))}
            {!upcoming.length && <Empty msg="No upcoming events." />}
          </CardContent>
        </Card>

        <Card className="border">
          <CardHeader className="pb-3 flex-row items-center justify-between">
            <CardTitle className="text-base">Goal progress</CardTitle>
            <TargetIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {state.goals.slice(0, 3).map((g) => (
              <div key={g.id}>
                <div className="flex items-center justify-between text-sm mb-1.5 gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-medium truncate max-w-[150px]">{g.title}</span>
                    <CategoryBadge cat={g.category} />
                  </div>
                  <span className="text-primary font-semibold shrink-0">{g.progress}%</span>
                </div>
                <Progress value={g.progress} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border relative overflow-hidden gradient-brand text-white">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <CardHeader className="pb-3 relative"><CardTitle className="text-base flex items-center gap-2"><Sparkles className="size-4" /> AI Suggestion</CardTitle></CardHeader>
          <CardContent className="relative space-y-3">
            <p className="text-sm opacity-95">You're ahead of schedule on <b>Learn Python</b>. Perfect day for a stretch task — try tackling async patterns tonight.</p>
            <Link to="/app/planner">
              <Button size="sm" variant="secondary" className="rounded-full bg-white text-primary hover:bg-white/90">Open AI Planner</Button>
            </Link>
            <p className="text-xs italic opacity-80 pt-2 border-t border-white/20">"{quote}"</p>
          </CardContent>
        </Card>
      </div>

      {/* Habits row: Clickable cards to navigate to analytics & 1-click toggle on circle */}
      <Card className="border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base">Today's habits</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Click circle to complete for today · Click card to view habit analytics</p>
          </div>
          <Link
            to="/app/analytics"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0 group"
          >
            Analytics Tab
            <ChevronRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {state.habits.map((h) => {
            const today = new Date().toISOString().slice(0, 10);
            const done = h.log.includes(today);
            return (
              <div
                key={h.id}
                onClick={() => navigate({ to: "/app/analytics" })}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    navigate({ to: "/app/analytics" });
                  }
                }}
                className={`group rounded-xl border p-3 flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                  done
                    ? "bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-500/10"
                    : "hover:bg-muted/40 hover:border-primary/40 hover:shadow-xs"
                }`}
              >
                <div className="text-2xl group-hover:scale-110 transition-transform select-none">{h.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium truncate group-hover:text-primary transition ${done ? "text-foreground font-semibold" : ""}`}>
                    {h.name}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Flame className="size-3 text-warning" /> {h.streak}d streak
                  </div>
                </div>
                {/* 1-Click Habit Completion Toggle */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleHabitToday(h.id);
                    if (!done) {
                      toast.success(`Completed "${h.name}" for today! 🔥`);
                    } else {
                      toast.info(`Unmarked "${h.name}" for today`);
                    }
                  }}
                  className={`size-6 rounded-full border-2 flex items-center justify-center transition-all duration-150 shrink-0 ${
                    done
                      ? "bg-success border-success text-white scale-105 shadow-xs"
                      : "border-muted-foreground/40 hover:border-primary hover:bg-primary/10 hover:scale-110"
                  }`}
                  title={done ? "Completed! Click to undo" : "Click to mark as done today"}
                  aria-label={done ? `Mark ${h.name} as incomplete` : `Mark ${h.name} as done today`}
                >
                  {done ? (
                    <Check className="size-3.5 stroke-[3]" />
                  ) : (
                    <div className="size-2 rounded-full bg-transparent group-hover:bg-primary/30 transition" />
                  )}
                </button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

function Stat({ label, value, icon: Icon, tone }: { label: string; value: string; icon: any; tone: "success" | "warning" }) {
  return (
    <div className="glass rounded-xl border px-3 py-2 flex items-center gap-2 cursor-pointer hover:border-primary/50 hover:bg-muted/50 hover:scale-105 transition-all shadow-xs group">
      <Icon className={`size-4 ${tone === "warning" ? "text-warning" : "text-success"} group-hover:scale-110 transition-transform`} />
      <div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest flex items-center gap-1 group-hover:text-primary transition">
          {label}
          <ChevronRight className="size-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="text-sm font-bold">{value}</div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted/40 py-2">
      <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
      <div className="font-bold text-sm">{value}</div>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <div className="text-sm text-muted-foreground p-6 text-center">{msg}</div>;
}

export function CategoryBadge({ cat }: { cat: string }) {
  const theme = getCategoryTheme(cat);
  return (
    <Badge
      variant="outline"
      className={`text-[10px] px-1.5 py-0 h-4 uppercase font-semibold transition-colors ${theme.badgeClass}`}
    >
      {cat}
    </Badge>
  );
}

export function PriorityDot({ p }: { p: "low" | "medium" | "high" }) {
  const c = p === "high" ? "bg-destructive shadow-xs shadow-destructive/50" : p === "medium" ? "bg-warning shadow-xs shadow-warning/50" : "bg-muted-foreground";
  return <span title={p} className={`size-2 rounded-full shrink-0 ${c}`} />;
}
