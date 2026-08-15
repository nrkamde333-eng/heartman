import type { Category } from "./demo-data";

export interface CategoryTheme {
  name: string;
  badgeClass: string;
  cardBorder: string;
  cardBg: string;
  leftAccent: string;
  calendarBadge: string;
  dotColor: string;
  ringColor: string;
  glowShadow: string;
  neonBorder: string;
  hex: string;
  lightHex: string;
  gradient: string;
  textColor: string;
}

export const CATEGORY_THEMES: Record<Category, CategoryTheme> = {
  study: {
    name: "Study & Learning",
    badgeClass: "bg-purple-500/15 text-purple-600 dark:text-purple-300 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]",
    cardBorder: "border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_15px_rgba(168,85,247,0.08)]",
    cardBg: "bg-purple-500/5 hover:bg-purple-500/10",
    leftAccent: "border-l-4 border-l-purple-500 shadow-[-2px_0_10px_rgba(168,85,247,0.4)]",
    calendarBadge: "bg-purple-600 text-white shadow-xs shadow-purple-500/40",
    dotColor: "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]",
    ringColor: "ring-purple-500",
    glowShadow: "shadow-[0_0_20px_rgba(168,85,247,0.25)]",
    neonBorder: "border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
    hex: "#a855f7",
    lightHex: "#c084fc",
    gradient: "from-purple-500 to-indigo-600",
    textColor: "text-purple-500 dark:text-purple-400",
  },
  work: {
    name: "Work & Projects",
    badgeClass: "bg-blue-500/15 text-blue-600 dark:text-blue-300 border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]",
    cardBorder: "border-blue-500/30 hover:border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.08)]",
    cardBg: "bg-blue-500/5 hover:bg-blue-500/10",
    leftAccent: "border-l-4 border-l-blue-500 shadow-[-2px_0_10px_rgba(59,130,246,0.4)]",
    calendarBadge: "bg-blue-600 text-white shadow-xs shadow-blue-500/40",
    dotColor: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]",
    ringColor: "ring-blue-500",
    glowShadow: "shadow-[0_0_20px_rgba(59,130,246,0.25)]",
    neonBorder: "border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    hex: "#3b82f6",
    lightHex: "#60a5fa",
    gradient: "from-blue-500 to-cyan-500",
    textColor: "text-blue-500 dark:text-blue-400",
  },
  health: {
    name: "Health & Fitness",
    badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]",
    cardBorder: "border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.08)]",
    cardBg: "bg-emerald-500/5 hover:bg-emerald-500/10",
    leftAccent: "border-l-4 border-l-emerald-500 shadow-[-2px_0_10px_rgba(16,185,129,0.4)]",
    calendarBadge: "bg-emerald-600 text-white shadow-xs shadow-emerald-500/40",
    dotColor: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]",
    ringColor: "ring-emerald-500",
    glowShadow: "shadow-[0_0_20px_rgba(16,185,129,0.25)]",
    neonBorder: "border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    hex: "#10b981",
    lightHex: "#34d399",
    gradient: "from-emerald-500 to-teal-500",
    textColor: "text-emerald-500 dark:text-emerald-400",
  },
  personal: {
    name: "Personal & Life",
    badgeClass: "bg-pink-500/15 text-pink-600 dark:text-pink-300 border-pink-500/30 shadow-[0_0_12px_rgba(236,72,153,0.15)]",
    cardBorder: "border-pink-500/30 hover:border-pink-500/60 shadow-[0_0_15px_rgba(236,72,153,0.08)]",
    cardBg: "bg-pink-500/5 hover:bg-pink-500/10",
    leftAccent: "border-l-4 border-l-pink-500 shadow-[-2px_0_10px_rgba(236,72,153,0.4)]",
    calendarBadge: "bg-pink-600 text-white shadow-xs shadow-pink-500/40",
    dotColor: "bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.8)]",
    ringColor: "ring-pink-500",
    glowShadow: "shadow-[0_0_20px_rgba(236,72,153,0.25)]",
    neonBorder: "border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.2)]",
    hex: "#ec4899",
    lightHex: "#f472b6",
    gradient: "from-pink-500 to-rose-500",
    textColor: "text-pink-500 dark:text-pink-400",
  },
  meeting: {
    name: "Meeting & Calls",
    badgeClass: "bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]",
    cardBorder: "border-amber-500/30 hover:border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.08)]",
    cardBg: "bg-amber-500/5 hover:bg-amber-500/10",
    leftAccent: "border-l-4 border-l-amber-500 shadow-[-2px_0_10px_rgba(245,158,11,0.4)]",
    calendarBadge: "bg-amber-600 text-white shadow-xs shadow-amber-500/40",
    dotColor: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]",
    ringColor: "ring-amber-500",
    glowShadow: "shadow-[0_0_20px_rgba(245,158,11,0.25)]",
    neonBorder: "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
    hex: "#f59e0b",
    lightHex: "#fbbf24",
    gradient: "from-amber-500 to-orange-500",
    textColor: "text-amber-500 dark:text-amber-400",
  },
};

export function getCategoryTheme(cat?: string): CategoryTheme {
  if (cat && cat in CATEGORY_THEMES) {
    return CATEGORY_THEMES[cat as Category];
  }
  return CATEGORY_THEMES.study;
}

/**
 * Parses "HH:mm" to minutes from midnight
 */
export function timeToMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/**
 * Formats minutes from midnight to "HH:mm"
 */
export function minutesToTime(mins: number): string {
  const normalized = Math.max(0, Math.min(23 * 60 + 59, Math.round(mins)));
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export interface ExistingInterval {
  startMins: number;
  endMins: number;
}

/**
 * Finds next non-conflicting time slot on a given day with living buffer.
 * If base slot has a conflict, shifts forward after the conflicting interval plus buffer.
 */
export function calculateNextAvailableSlot(
  preferredStartMins: number,
  durationMinutes: number,
  existingEventsOnDay: ExistingInterval[],
  bufferMinutes: number = 20
): { startTime: string; endTime: string; startMins: number; endMins: number } {
  let candidateStart = preferredStartMins;
  let candidateEnd = candidateStart + durationMinutes;

  // Sort existing intervals chronologically
  const sorted = [...existingEventsOnDay].sort((a, b) => a.startMins - b.startMins);

  let collision = true;
  let attempts = 0;
  const maxAttempts = 20;

  while (collision && attempts < maxAttempts) {
    collision = false;
    attempts++;

    for (const evt of sorted) {
      // Overlap occurs if candidate starts before event end + buffer AND candidate ends after event start - buffer
      const bufferedEvtStart = Math.max(0, evt.startMins - bufferMinutes);
      const bufferedEvtEnd = evt.endMins + bufferMinutes;

      if (candidateStart < bufferedEvtEnd && candidateEnd > bufferedEvtStart) {
        // Collision detected: push candidate start to after this event + buffer
        candidateStart = evt.endMins + bufferMinutes;
        candidateEnd = candidateStart + durationMinutes;
        collision = true;
        break; // restart check with new candidate
      }
    }

    // If pushed too late in the evening (past 22:00 / 1320 mins), wrap to an earlier available daytime window
    if (candidateEnd > 22 * 60) {
      // Try earlier window starting from 07:30
      candidateStart = 7 * 60 + 30;
      candidateEnd = candidateStart + durationMinutes;
      // Re-verify without wrapping again
      if (attempts >= 10) break;
    }
  }

  return {
    startTime: minutesToTime(candidateStart),
    endTime: minutesToTime(candidateEnd),
    startMins: candidateStart,
    endMins: candidateEnd,
  };
}
