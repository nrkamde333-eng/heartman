import { createContext, useContext, useEffect, useState, type ReactNode, type Dispatch, type SetStateAction } from "react";
import { makeDemoState, emptyState, SCHEMA_VERSION, type AppState, type Task, type Habit, type CalEvent, type Message, type Goal } from "./demo-data";

const KEY = "goalpilot-state-v3";

interface AppContextType {
  state: AppState;
  setState: Dispatch<SetStateAction<AppState>>;
  hydrated: boolean;
  addTask: (task: Omit<Task, "id">) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addGoal: (goal: Omit<Goal, "id">) => Goal;
  updateGoal: (id: string, patch: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  addHabit: (habit: Omit<Habit, "id" | "streak" | "bestStreak" | "log" | "createdAt">) => Habit;
  toggleHabitToday: (id: string, dateKey?: string) => void;
  logHabit: (id: string, dateKey?: string) => void;
  deleteHabit: (id: string) => void;
  addEvent: (event: Omit<CalEvent, "id">) => CalEvent;
  deleteEvent: (id: string) => void;
  addMessage: (message: Omit<Message, "id" | "createdAt">) => Message;
  setTheme: (theme: "light" | "dark") => void;
  toggleTheme: () => void;
  resetDemo: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadInitialState(): AppState {
  if (typeof window === "undefined") return makeDemoState();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return makeDemoState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || !parsed.schemaVersion || parsed.schemaVersion < SCHEMA_VERSION) {
      return makeDemoState();
    }
    return parsed;
  } catch {
    return makeDemoState();
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadInitialState);
  const [hydrated, setHydrated] = useState(true);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  }, [state.theme]);

  const addTask = (task: Omit<Task, "id">): Task => {
    const newTask: Task = { ...task, id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` };
    setState((s) => ({ ...s, tasks: [newTask, ...s.tasks] }));
    return newTask;
  };

  const updateTask = (id: string, patch: Partial<Task>) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  };

  const toggleTask = (id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.map((t) => {
        if (t.id !== id) return t;
        const nextStatus = t.status === "done" ? "todo" : "done";
        return {
          ...t,
          status: nextStatus,
          completedAt: nextStatus === "done" ? new Date().toISOString() : undefined,
        };
      }),
    }));
  };

  const deleteTask = (id: string) => {
    setState((s) => ({
      ...s,
      tasks: s.tasks.filter((t) => t.id !== id),
      events: s.events.filter((e) => e.taskId !== id),
    }));
  };

  const addGoal = (goal: Omit<Goal, "id">): Goal => {
    const newGoal: Goal = { ...goal, id: `g_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` };
    setState((s) => ({ ...s, goals: [...s.goals, newGoal] }));
    return newGoal;
  };

  const updateGoal = (id: string, patch: Partial<Goal>) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    }));
  };

  const deleteGoal = (id: string) => {
    setState((s) => ({
      ...s,
      goals: s.goals.filter((g) => g.id !== id),
      tasks: s.tasks.filter((t) => t.goalId !== id),
      events: s.events.filter((e) => e.goalId !== id),
    }));
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setState((s) => ({
      ...s,
      goals: s.goals.map((g) => {
        if (g.id !== goalId) return g;
        const milestones = g.milestones.map((m) => (m.id === milestoneId ? { ...m, done: !m.done } : m));
        const doneCount = milestones.filter((m) => m.done).length;
        const progress = milestones.length > 0 ? Math.round((doneCount / milestones.length) * 100) : g.progress;
        return { ...g, milestones, progress };
      }),
    }));
  };

  const addHabit = (habit: Omit<Habit, "id" | "streak" | "bestStreak" | "log" | "createdAt">): Habit => {
    const newHabit: Habit = {
      ...habit,
      id: `h_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      streak: 0,
      bestStreak: 0,
      log: [],
      createdAt: new Date().toISOString().slice(0, 10),
    };
    setState((s) => ({ ...s, habits: [...s.habits, newHabit] }));
    return newHabit;
  };

  const toggleHabitToday = (id: string, dateKey?: string) => {
    const targetKey = dateKey || new Date().toISOString().slice(0, 10);
    setState((s) => ({
      ...s,
      habits: s.habits.map((h) => {
        if (h.id !== id) return h;
        const exists = h.log.includes(targetKey);
        const nextLog = exists ? h.log.filter((k) => k !== targetKey) : [...h.log, targetKey];
        const streak = nextLog.length > 0 ? Math.min(nextLog.length, 7) : 0;
        const bestStreak = Math.max(h.bestStreak, streak);
        return { ...h, log: nextLog, streak, bestStreak };
      }),
    }));
  };

  const deleteHabit = (id: string) => {
    setState((s) => ({
      ...s,
      habits: s.habits.filter((h) => h.id !== id),
    }));
  };

  const addEvent = (event: Omit<CalEvent, "id">): CalEvent => {
    const newEvent: CalEvent = { ...event, id: `e_${Date.now()}_${Math.random().toString(36).slice(2, 6)}` };
    setState((s) => ({ ...s, events: [...s.events, newEvent] }));
    return newEvent;
  };

  const deleteEvent = (id: string) => {
    setState((s) => ({
      ...s,
      events: s.events.filter((e) => e.id !== id),
    }));
  };

  const addMessage = (message: Omit<Message, "id" | "createdAt">): Message => {
    const newMsg: Message = {
      ...message,
      id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, messages: [...s.messages, newMsg] }));
    return newMsg;
  };

  const setTheme = (theme: "light" | "dark") => {
    setState((s) => ({ ...s, theme }));
  };

  const toggleTheme = () => {
    setState((s) => ({ ...s, theme: s.theme === "dark" ? "light" : "dark" }));
  };

  const resetDemo = () => {
    const demo = makeDemoState();
    setState(demo);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        hydrated,
        addTask,
        updateTask,
        toggleTask,
        deleteTask,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleMilestone,
        addHabit,
        toggleHabitToday,
        logHabit: toggleHabitToday,
        deleteHabit,
        addEvent,
        deleteEvent,
        addMessage,
        setTheme,
        toggleTheme,
        resetDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
