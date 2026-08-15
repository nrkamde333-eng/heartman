import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Brain, Calendar, ListChecks, Target, LineChart, Settings,
  Search, Bell, Moon, Sun, Sparkles, Plus, LogOut, User, Menu, RefreshCw, Zap
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import { CATEGORY_THEMES, type CategoryTheme } from "@/lib/category-styles";
import type { Category } from "@/lib/demo-data";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [
      { title: "Workspace — GoalPilot" },
      { name: "description", content: "Your AI-powered productivity workspace." },
    ],
  }),
  component: AppLayout,
});

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true, glow: "group-hover:text-purple-400" },
  { to: "/app/planner", label: "AI Planner", icon: Brain, badge: "AI", glow: "group-hover:text-primary" },
  { to: "/app/calendar", label: "Calendar", icon: Calendar, glow: "group-hover:text-blue-400" },
  { to: "/app/tasks", label: "Tasks", icon: ListChecks, glow: "group-hover:text-emerald-400" },
  { to: "/app/habits", label: "Habits", icon: Target, glow: "group-hover:text-amber-400" },
  { to: "/app/analytics", label: "Analytics", icon: LineChart, glow: "group-hover:text-pink-400" },
  { to: "/app/settings", label: "Settings", icon: Settings, glow: "group-hover:text-cyan-400" },
];

function AppLayout() {
  const { state, hydrated, toggleTheme, addTask, resetDemo } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickTitle, setQuickTitle] = useState("");
  const [quickCategory, setQuickCategory] = useState<Category>("work");
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <div className="size-12 rounded-2xl gradient-brand grid place-items-center shadow-xl shadow-primary/30 animate-pulse">
            <Sparkles className="size-6 text-white" />
          </div>
          <div className="text-sm font-medium text-muted-foreground animate-pulse">Initializing GoalPilot…</div>
        </div>
      </div>
    );
  }

  const isActive = (to: string, end?: boolean) =>
    end ? pathname === to : pathname === to || pathname.startsWith(to + "/");

  const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => (
    <>
      {nav.map((n) => {
        const active = isActive(n.to, n.end);
        return (
          <Link
            key={n.to}
            to={n.to}
            onClick={onNavigate}
            className={`group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-primary/15 text-foreground font-semibold shadow-[0_0_20px_rgba(168,85,247,0.18)] border border-primary/30"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground hover:translate-x-0.5"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-1 rounded-lg transition-colors ${active ? "bg-primary/20 text-primary" : "text-muted-foreground group-hover:text-foreground"}`}>
                <n.icon className={`size-4.5 ${active ? "text-primary" : n.glow}`} />
              </div>
              <span>{n.label}</span>
            </div>
            {n.badge ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 shadow-[0_0_8px_rgba(168,85,247,0.3)]">
                {n.badge}
              </span>
            ) : active ? (
              <span className="size-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(168,85,247,0.9)]" />
            ) : null}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/30">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-sidebar/95 backdrop-blur-md text-sidebar-foreground sticky top-0 h-screen z-30">
        <Link to="/" className="flex items-center gap-2.5 px-5 h-16 border-b border-border/50">
          <div className="size-9 rounded-xl gradient-brand grid place-items-center shadow-lg shadow-primary/30 ring-1 ring-white/20">
            <Sparkles className="size-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-lg tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">GoalPilot</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider -mt-1">Pro Workspace</span>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <NavItems />
        </nav>
        <div className="p-3 border-t border-border/50 space-y-3">
          {/* Active Goals with Category Colors */}
          <div className="rounded-2xl p-3.5 bg-muted/20 border border-border/60 shadow-xs">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-2.5">
              <span>Active Goals</span>
              <span className="text-primary font-bold">{state.goals.length}</span>
            </div>
            <div className="space-y-2.5">
              {state.goals.slice(0, 3).map((g) => {
                const catTheme = CATEGORY_THEMES[g.category] || CATEGORY_THEMES.study;
                return (
                  <div key={g.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="truncate max-w-[135px] font-medium text-foreground">{g.title}</span>
                      <span className={`font-bold text-[11px] ${catTheme.textColor}`}>{g.progress}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${catTheme.gradient} transition-all duration-500 rounded-full`}
                        style={{ width: `${g.progress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl bg-sidebar-accent/30 border border-border/40">
            <div className="size-8 rounded-full gradient-brand grid place-items-center font-bold text-white text-xs shadow-xs">
              {state.user?.name.split(" ").map((s) => s[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold truncate text-foreground">{state.user?.name}</div>
              <div className="text-[11px] text-muted-foreground truncate">{state.user?.email}</div>
            </div>
            <button
              onClick={() => { toast.success("Signed out"); navigate({ to: "/" }); }}
              className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/40 transition"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-40 h-16 border-b border-border/60 glass flex items-center justify-between px-4 md:px-6 gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button size="icon" variant="ghost" className="md:hidden shrink-0" aria-label="Open menu">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-sidebar text-sidebar-foreground p-0 border-r flex flex-col">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <div className="flex items-center justify-between px-5 h-16 border-b">
                  <Link to="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5">
                    <div className="size-8 rounded-lg gradient-brand grid place-items-center shadow-lg shadow-primary/30">
                      <Sparkles className="size-4 text-white" />
                    </div>
                    <span className="font-display font-extrabold text-lg tracking-tight">GoalPilot</span>
                  </Link>
                </div>
                <nav className="flex-1 p-3 space-y-1">
                  <NavItems onNavigate={() => setMobileOpen(false)} />
                </nav>
                <div className="p-3 border-t">
                  <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full gradient-brand grid place-items-center font-bold text-white text-xs">
                      {state.user?.name.split(" ").map((s) => s[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{state.user?.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{state.user?.email}</div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="relative w-full max-w-lg hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input placeholder="Search tasks, habits, roadmaps…" className="pl-9 rounded-full bg-muted/30 border-border/50 focus-visible:ring-primary/40" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <Dialog open={quickOpen} onOpenChange={setQuickOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="rounded-full gradient-brand text-white hidden sm:inline-flex shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 transition">
                  <Plus className="size-4 mr-1" /> Quick Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle className="font-display font-bold text-lg">Create Quick Task</DialogTitle></DialogHeader>
                <div className="space-y-3 pt-2">
                  <Input
                    autoFocus
                    placeholder="What do you want to accomplish?"
                    value={quickTitle}
                    onChange={(e) => setQuickTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && quickTitle.trim()) {
                        addTask({ title: quickTitle.trim(), priority: "medium", status: "todo", dueDate: new Date().toISOString().slice(0, 10), category: quickCategory });
                        setQuickTitle(""); setQuickOpen(false); toast.success("Task added to workspace");
                      }
                    }}
                  />
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">Category</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(["study", "work", "health", "personal", "meeting"] as Category[]).map((cat) => {
                        const theme = CATEGORY_THEMES[cat];
                        const selected = quickCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setQuickCategory(cat)}
                            className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition ${
                              selected ? `${theme.badgeClass} ring-2 ${theme.ringColor}` : "bg-muted/30 border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {theme.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <Button
                    className="w-full rounded-xl gradient-brand text-white font-semibold shadow-md shadow-primary/25"
                    onClick={() => {
                      if (!quickTitle.trim()) return;
                      addTask({ title: quickTitle.trim(), priority: "medium", status: "todo", dueDate: new Date().toISOString().slice(0, 10), category: quickCategory });
                      setQuickTitle(""); setQuickOpen(false); toast.success("Task added to workspace");
                    }}
                  >
                    Add to Today's Tasks
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button size="icon" variant="ghost" onClick={toggleTheme} aria-label="Toggle theme" className="rounded-full">
              {state.theme === "dark" ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-purple-600" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => { resetDemo(); toast.success("Refreshed with multi-domain demo state!"); }}
              aria-label="Refresh demo data"
              title="Reset Demo Data"
              className="rounded-full hover:text-primary transition"
            >
              <RefreshCw className="size-4" />
            </Button>
          </div>
        </header>
        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

