import type { WeekdayDefault, MonthSettings, DayOverride } from "./supabase";

export const WEEKDAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];
// 月曜始まりの表示順（参考カレンダーに合わせる）
export const MON_FIRST = [1, 2, 3, 4, 5, 6, 0];

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function ymd(year: number, month: number, day: number): string {
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

/** その月の1日の曜日（0=日..6=土） */
export function firstWeekday(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

/** 30分刻みの時刻一覧 '00:00'..'23:30' */
export function timeSlots(): string[] {
  const out: string[] = [];
  for (let h = 0; h < 24; h++) {
    out.push(`${pad2(h)}:00`);
    out.push(`${pad2(h)}:30`);
  }
  return out;
}

export type DayStatus = {
  day: number;
  date: string;
  weekday: number;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  staffName: string | null;
  note: string | null;
  isHoliday: boolean;
  reason: "override" | "first-of-month" | "regular-closed" | "weekday-default";
};

/**
 * 1日分の営業状態を算出する。
 * 優先順位: 個別オーバーライド > 毎月1日(店休日) > 定休日(曜日) > 曜日既定
 * 祝日は「数字を赤」にするだけで、営業状態は変えない（日曜と同じ扱い）。
 */
export function computeDay(
  year: number,
  month: number,
  day: number,
  weekdayDefaults: Record<number, WeekdayDefault>,
  monthSettings: MonthSettings | null,
  override: DayOverride | undefined,
  holidaySet: Set<string>,
): DayStatus {
  const date = ymd(year, month, day);
  const weekday = new Date(year, month - 1, day).getDay();
  const isHoliday = holidaySet.has(date);

  if (override) {
    return {
      day, date, weekday,
      isOpen: override.status === "open",
      openTime: override.open_time,
      closeTime: override.close_time,
      staffName: override.staff_name,
      note: override.note,
      isHoliday,
      reason: "override",
    };
  }

  // 毎月1日は店休日
  if (day === 1) {
    return { day, date, weekday, isOpen: false, openTime: null, closeTime: null,
      staffName: null, note: "店休日", isHoliday, reason: "first-of-month" };
  }

  // 定休日（曜日）
  if (monthSettings && monthSettings.closed_weekday === weekday) {
    return { day, date, weekday, isOpen: false, openTime: null, closeTime: null,
      staffName: null, note: "定休日", isHoliday, reason: "regular-closed" };
  }

  // 曜日既定
  const wd = weekdayDefaults[weekday];
  if (wd && wd.is_open) {
    return { day, date, weekday, isOpen: true, openTime: wd.open_time, closeTime: wd.close_time,
      staffName: null, note: null, isHoliday, reason: "weekday-default" };
  }
  return { day, date, weekday, isOpen: false, openTime: null, closeTime: null,
    staffName: null, note: wd ? null : "お休み", isHoliday, reason: "weekday-default" };
}

/** その月の全日を算出 */
export function computeMonth(
  year: number,
  month: number,
  weekdayDefaults: Record<number, WeekdayDefault>,
  monthSettings: MonthSettings | null,
  overrides: Record<string, DayOverride>,
  holidaySet: Set<string>,
): DayStatus[] {
  const n = daysInMonth(year, month);
  const out: DayStatus[] = [];
  for (let day = 1; day <= n; day++) {
    out.push(
      computeDay(year, month, day, weekdayDefaults, monthSettings, overrides[ymd(year, month, day)], holidaySet),
    );
  }
  return out;
}

const holidayCache: Record<number, Record<string, string>> = {};

/** 日本の祝日を取得（holidays-jp の無料API。年単位でキャッシュ） */
export async function fetchHolidays(year: number): Promise<Record<string, string>> {
  if (holidayCache[year]) return holidayCache[year];
  try {
    const res = await fetch(`https://holidays-jp.github.io/api/v1/${year}/date.json`);
    if (!res.ok) throw new Error("holiday fetch failed");
    const data = (await res.json()) as Record<string, string>;
    holidayCache[year] = data;
    return data;
  } catch {
    holidayCache[year] = {};
    return {};
  }
}

/** 勤務時間（時間・小数）を算出 */
export function workHours(clockIn: string, clockOut: string, breakMin: number): number {
  const [ih, im] = clockIn.split(":").map(Number);
  const [oh, om] = clockOut.split(":").map(Number);
  let mins = oh * 60 + om - (ih * 60 + im) - (breakMin || 0);
  if (mins < 0) mins += 24 * 60; // 日跨ぎ
  return Math.max(0, mins) / 60;
}
