"use client";

import { createClient } from "@supabase/supabase-js";

// 公開（publishable / anon）キーはクライアントに露出して問題ありません。
// データ保護は Supabase 側の RLS で行います。
// 環境変数があればそれを優先し、なければ下記のフォールバックを使います。
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://ykynfdrmtskmyvrrrwux.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_f-qJI_mBbJZDUvT1jt6jaQ_LNL5Eebp";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Role = "admin" | "staff";

export type Profile = {
  id: string;
  name: string;
  role: Role;
  hourly_wage: number;
};

export type WeekdayDefault = {
  weekday: number; // 0=日 .. 6=土
  is_open: boolean;
  open_time: string;
  close_time: string;
};

export type MonthSettings = {
  year: number;
  month: number;
  closed_weekday: number | null;
};

export type DayOverride = {
  d: string; // YYYY-MM-DD
  status: "open" | "closed";
  open_time: string | null;
  close_time: string | null;
  staff_name: string | null;
  note: string | null;
};

export type MenuItem = {
  id: string;
  category: string;
  name: string;
  price: number;
  sort_order: number;
};

export type Timecard = {
  id: string;
  profile_id: string;
  work_date: string;
  clock_in: string;
  clock_out: string;
  break_minutes: number;
  note: string | null;
};
