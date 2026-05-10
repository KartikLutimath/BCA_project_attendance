import { DayOfWeek } from "@prisma/client";

/**
 * Returns the current time formatted as "HH:MM" (24-hour).
 * Used for matching against timetable startTime/endTime strings.
 */
export function currentTimeHHMM(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Maps JS Date.getDay() (0=Sun) to Prisma DayOfWeek enum.
 */
const DAY_MAP: Record<number, DayOfWeek> = {
  1: DayOfWeek.MONDAY,
  2: DayOfWeek.TUESDAY,
  3: DayOfWeek.WEDNESDAY,
  4: DayOfWeek.THURSDAY,
  5: DayOfWeek.FRIDAY,
  6: DayOfWeek.SATURDAY,
};

export function todayAsDayOfWeek(): DayOfWeek | null {
  const day = new Date().getDay();
  return DAY_MAP[day] ?? null; // null on Sunday (no classes)
}

/**
 * Returns today's date as a Date object with time zeroed (for @db.Date fields).
 */
export function todayDate(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Adds days to a given date.
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
