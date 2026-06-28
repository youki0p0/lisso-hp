"use client";

import React from "react";
import {
  supabase,
  type Profile,
  type WeekdayDefault,
  type MonthSettings,
  type DayOverride,
} from "@/lib/supabase";
import {
  WEEKDAY_LABELS,
  MON_FIRST,
  computeMonth,
  fetchHolidays,
  firstWeekday,
  timeSlots,
  ymd,
  type DayStatus,
} from "@/lib/schedule";

const SLOTS = timeSlots();

type Props = {
  profile: Profile;
  staffNames: string[];
  onPrint: (month: { year: number; month: number; days: DayStatus[]; holidays: Record<string, string> }) => void;
};

export function CalendarTab({ profile, staffNames, onPrint }: Props) {
  const isAdmin = profile.role === "admin";
  const today = new Date();
  const [year, setYear] = React.useState(today.getFullYear() === 2026 ? 2026 : today.getFullYear());
  const [month, setMonth] = React.useState(7); // 既定で7月を表示（参考要望）

  const [weekday, setWeekday] = React.useState<Record<number, WeekdayDefault>>({});
  const [settings, setSettings] = React.useState<MonthSettings | null>(null);
  const [overrides, setOverrides] = React.useState<Record<string, DayOverride>>({});
  const [holidays, setHolidays] = React.useState<Record<string, string>>({});
  const [editing, setEditing] = React.useState<DayStatus | null>(null);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    const [wd, ms, ov, hol] = await Promise.all([
      supabase.from("lisso_weekday_defaults").select("*"),
      supabase.from("lisso_month_settings").select("*").eq("year", year).eq("month", month).maybeSingle(),
      supabase
        .from("lisso_day_overrides")
        .select("*")
        .gte("d", ymd(year, month, 1))
        .lte("d", ymd(year, month, 31)),
      fetchHolidays(year),
    ]);
    const wmap: Record<number, WeekdayDefault> = {};
    (wd.data ?? []).forEach((r) => (wmap[r.weekday] = r));
    setWeekday(wmap);
    setSettings((ms.data as MonthSettings) ?? { year, month, closed_weekday: null });
    const omap: Record<string, DayOverride> = {};
    (ov.data ?? []).forEach((r) => (omap[r.d] = r));
    setOverrides(omap);
    setHolidays(hol);
    setLoading(false);
  }, [year, month]);

  React.useEffect(() => {
    load();
  }, [load]);

  const holidaySet = React.useMemo(() => new Set(Object.keys(holidays)), [holidays]);
  const days = React.useMemo(
    () => computeMonth(year, month, weekday, settings, overrides, holidaySet),
    [year, month, weekday, settings, overrides, holidaySet],
  );

  const lead = (firstWeekday(year, month) + 6) % 7; // 月曜始まりの先頭空白数

  const move = (delta: number) => {
    let m = month + delta;
    let y = year;
    if (m < 1) { m = 12; y--; }
    if (m > 12) { m = 1; y++; }
    setMonth(m);
    setYear(y);
  };

  const saveClosedWeekday = async (val: number | null) => {
    if (!isAdmin) return;
    setSettings({ year, month, closed_weekday: val });
    await supabase.from("lisso_month_settings").upsert({ year, month, closed_weekday: val });
  };

  return (
    <div>
      <div className="la-calhead">
        <button className="la-btn sm" onClick={() => move(-1)}>‹ 前月</button>
        <div className="la-month"><b>{month}</b>{year}</div>
        <button className="la-btn sm" onClick={() => move(1)}>翌月 ›</button>
        <div className="la-spacer" />
        <button className="la-btn primary sm" onClick={() => onPrint({ year, month, days, holidays })}>
          🖨 カレンダーをPDF印刷
        </button>
      </div>

      {isAdmin && (
        <div className="la-settings">
          <div className="la-field">
            <label>定休日（曜日）</label>
            <select
              value={settings?.closed_weekday ?? ""}
              onChange={(e) => saveClosedWeekday(e.target.value === "" ? null : Number(e.target.value))}
            >
              <option value="">なし</option>
              {[1, 2, 3, 4, 5, 6, 0].map((w) => (
                <option key={w} value={w}>{WEEKDAY_LABELS[w]}曜日</option>
              ))}
            </select>
          </div>
          <div className="la-muted" style={{ maxWidth: 360 }}>
            毎月1日は自動で「店休日」、祝日は日付が赤になります（営業状態は変わりません）。
            個別に変えたい日はセルをクリックして上書きできます。
          </div>
        </div>
      )}

      <div className="la-legend">
        <span><i className="la-sw" style={{ background: "#efe9e0" }} /> 営業</span>
        <span><i className="la-sw" style={{ background: "#202027" }} /> 休み（定休日/店休日）</span>
        <span><i className="la-sw" style={{ background: "#efe9e0", boxShadow: "inset 0 0 0 2px #d99aa9" }} /> 個別設定あり</span>
        <span style={{ color: "#c0504a" }}>● 日曜・祝日</span>
        <span style={{ color: "#5b82bd" }}>● 土曜</span>
      </div>

      <div className="la-grid">
        {MON_FIRST.map((w) => (
          <div key={w} className={`la-dow ${w === 6 ? "sat" : ""} ${w === 0 ? "sun" : ""}`}>
            {WEEKDAY_LABELS[w]}
          </div>
        ))}
        {Array.from({ length: lead }).map((_, i) => (
          <div key={`e${i}`} className="la-cell empty" />
        ))}
        {days.map((d) => {
          const cls = [
            "la-cell",
            d.isOpen ? "" : "closed",
            d.weekday === 6 ? "sat" : "",
            d.weekday === 0 ? "sun" : "",
            d.isHoliday ? "holiday" : "",
            d.reason === "override" ? "ov" : "",
          ].join(" ");
          return (
            <div
              key={d.date}
              className={cls}
              onClick={() => isAdmin && setEditing(d)}
              title={holidays[d.date] ?? ""}
              style={{ cursor: isAdmin ? "pointer" : "default" }}
            >
              <div className="d">{d.day}</div>
              {d.isOpen ? (
                <div className="hours">{d.openTime} - {d.closeTime}</div>
              ) : (
                <div className="rest">× {d.note ?? "お休み"}</div>
              )}
              {d.staffName && <div className="who">{d.staffName}</div>}
            </div>
          );
        })}
      </div>

      {loading && <p className="la-muted" style={{ marginTop: ".8rem" }}>読み込み中…</p>}

      {editing && (
        <DayEditor
          day={editing}
          staffNames={staffNames}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function DayEditor({
  day,
  staffNames,
  onClose,
  onSaved,
}: {
  day: DayStatus;
  staffNames: string[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [status, setStatus] = React.useState<"open" | "closed">(day.isOpen ? "open" : "closed");
  const [open, setOpen] = React.useState(day.openTime ?? "16:00");
  const [close, setClose] = React.useState(day.closeTime ?? "23:00");
  const [staff, setStaff] = React.useState(day.staffName ?? "");
  const [note, setNote] = React.useState(day.note ?? "");
  const [busy, setBusy] = React.useState(false);

  const save = async () => {
    setBusy(true);
    await supabase.from("lisso_day_overrides").upsert({
      d: day.date,
      status,
      open_time: status === "open" ? open : null,
      close_time: status === "open" ? close : null,
      staff_name: staff || null,
      note: note || null,
      updated_at: new Date().toISOString(),
    });
    setBusy(false);
    onSaved();
  };

  const reset = async () => {
    setBusy(true);
    await supabase.from("lisso_day_overrides").delete().eq("d", day.date);
    setBusy(false);
    onSaved();
  };

  return (
    <div className="la-modal-bg" onClick={onClose}>
      <div className="la-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{day.date}（{WEEKDAY_LABELS[day.weekday]}）の設定</h3>
        <div className="row">
          <div className="la-field">
            <label>状態</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as "open" | "closed")}>
              <option value="open">開店日</option>
              <option value="closed">店休日</option>
            </select>
          </div>
          <div className="la-field">
            <label>担当</label>
            <select value={staff} onChange={(e) => setStaff(e.target.value)}>
              <option value="">（なし）</option>
              {staffNames.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        {status === "open" && (
          <div className="row">
            <div className="la-field">
              <label>開店</label>
              <select value={open} onChange={(e) => setOpen(e.target.value)}>
                {SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="la-field">
              <label>閉店</label>
              <select value={close} onChange={(e) => setClose(e.target.value)}>
                {SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        )}
        <div className="la-field">
          <label>メモ（任意）</label>
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="例: 貸切, イベント" />
        </div>
        <div className="actions">
          <button className="la-btn ghost danger sm" onClick={reset} disabled={busy}>既定に戻す</button>
          <div className="la-spacer" />
          <button className="la-btn ghost" onClick={onClose} disabled={busy}>キャンセル</button>
          <button className="la-btn primary" onClick={save} disabled={busy}>保存</button>
        </div>
      </div>
    </div>
  );
}
