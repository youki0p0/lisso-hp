"use client";

import React from "react";
import type { MenuItem } from "@/lib/supabase";
import { WEEKDAY_LABELS, MON_FIRST, firstWeekday, type DayStatus } from "@/lib/schedule";

const MONTH_EN = ["", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

export type PrintPayload =
  | { type: "calendar"; year: number; month: number; days: DayStatus[]; holidays: Record<string, string> }
  | { type: "menu"; items: MenuItem[] }
  | null;

export function PrintView({ payload }: { payload: PrintPayload }) {
  if (!payload) return null;
  if (payload.type === "calendar") return <PrintCalendar {...payload} />;
  return <PrintMenu items={payload.items} />;
}

function PrintCalendar({ year, month, days }: { year: number; month: number; days: DayStatus[]; holidays: Record<string, string> }) {
  const lead = (firstWeekday(year, month) + 6) % 7;
  return (
    <div className="lp-cal">
      <div className="lp-title">SHISHA LISSO</div>
      <div className="lp-sub">— 営業カレンダー —</div>
      <div className="lp-month"><b>{month}</b> {MONTH_EN[month]} {year}</div>
      <div className="lp-grid">
        {MON_FIRST.map((w) => (
          <div key={w} className={`lp-dow ${w === 6 ? "sat" : ""} ${w === 0 ? "sun" : ""}`}>{WEEKDAY_LABELS[w]}</div>
        ))}
        {Array.from({ length: lead }).map((_, i) => <div key={`e${i}`} className="lp-cell empty" />)}
        {days.map((d) => (
          <div key={d.date} className={`lp-cell ${d.isOpen ? "" : "closed"} ${d.weekday === 6 ? "sat" : ""} ${d.weekday === 0 || d.isHoliday ? "sun" : ""}`}>
            <div className="lp-d">{d.day}</div>
            {d.isOpen
              ? <div className="lp-h">{d.openTime} - {d.closeTime}</div>
              : <div className="lp-h"><span className="lp-x">×</span><br />{d.note ?? "お休み"}</div>}
          </div>
        ))}
      </div>
      <div className="lp-foot">SHISHA LISSO</div>
      <div className="lp-addr">〒174-0076 東京都板橋区上板橋2丁目30-7 あやめマンション104号</div>
    </div>
  );
}

function PrintMenu({ items }: { items: MenuItem[] }) {
  const cats = Array.from(new Set(items.map((i) => i.category || "その他")));
  return (
    <div className="lp-menu">
      <div className="lp-title">SHISHA LISSO</div>
      <div className="lp-sub">— 料金メニュー —</div>
      {cats.map((c) => (
        <div key={c} className="lp-mcat">
          <h3>{c}</h3>
          {items.filter((i) => (i.category || "その他") === c).map((i) => (
            <div key={i.id} className="lp-mrow">
              <span className="lp-mname">{i.name}</span>
              <span className="lp-dots" />
              <span className="lp-mprice">¥{i.price.toLocaleString()}</span>
            </div>
          ))}
        </div>
      ))}
      <div className="lp-foot">SHISHA LISSO</div>
      <div className="lp-addr">〒174-0076 東京都板橋区上板橋2丁目30-7 あやめマンション104号</div>
    </div>
  );
}
