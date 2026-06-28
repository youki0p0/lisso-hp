"use client";

import React from "react";
import { supabase, type Profile, type Timecard } from "@/lib/supabase";
import { timeSlots, workHours, pad2 } from "@/lib/schedule";

const SLOTS = timeSlots();

export function TimecardTab({ profile, profiles }: { profile: Profile; profiles: Profile[] }) {
  const isAdmin = profile.role === "admin";
  const today = new Date();
  const [year, setYear] = React.useState(today.getFullYear());
  const [month, setMonth] = React.useState(today.getMonth() + 1);
  // 管理者は対象スタッフを選択可。一般は自分のみ。
  const [targetId, setTargetId] = React.useState(profile.id);
  const canEdit = isAdmin || targetId === profile.id;

  const [wage, setWage] = React.useState(0);
  const [cards, setCards] = React.useState<Timecard[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    const from = `${year}-${pad2(month)}-01`;
    const to = `${year}-${pad2(month)}-31`;
    const [tc, w] = await Promise.all([
      supabase.from("lisso_timecards").select("*")
        .eq("profile_id", targetId).gte("work_date", from).lte("work_date", to).order("work_date"),
      supabase.from("lisso_staff_wage").select("hourly_wage").eq("profile_id", targetId).maybeSingle(),
    ]);
    setCards((tc.data as Timecard[]) ?? []);
    setWage((w.data?.hourly_wage as number) ?? 0);
    setLoading(false);
  }, [year, month, targetId]);

  React.useEffect(() => { load(); }, [load]);

  const saveWage = async () => {
    await supabase.from("lisso_staff_wage").upsert({
      profile_id: targetId, hourly_wage: wage, updated_at: new Date().toISOString(),
    });
  };

  const addCard = async () => {
    const d = `${year}-${pad2(month)}-${pad2(Math.min(today.getDate(), 28))}`;
    const { data } = await supabase
      .from("lisso_timecards")
      .insert({ profile_id: targetId, work_date: d, clock_in: "18:00", clock_out: "23:00", break_minutes: 0 })
      .select()
      .single();
    if (data) setCards((xs) => [...xs, data as Timecard]);
  };

  const update = (id: string, patch: Partial<Timecard>) =>
    setCards((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const saveCard = async (c: Timecard) => {
    await supabase.from("lisso_timecards").update({
      work_date: c.work_date, clock_in: c.clock_in, clock_out: c.clock_out,
      break_minutes: c.break_minutes, note: c.note,
    }).eq("id", c.id);
  };

  const removeCard = async (id: string) => {
    await supabase.from("lisso_timecards").delete().eq("id", id);
    setCards((xs) => xs.filter((x) => x.id !== id));
  };

  const totalHours = cards.reduce((s, c) => s + workHours(c.clock_in, c.clock_out, c.break_minutes), 0);
  const totalPay = Math.round(totalHours * (wage || 0));

  return (
    <div>
      <div className="la-calhead">
        <h2 className="la-section-title">タイムカード</h2>
        <div className="la-spacer" />
      </div>

      <div className="la-settings">
        {isAdmin && (
          <div className="la-field">
            <label>対象スタッフ</label>
            <select value={targetId} onChange={(e) => setTargetId(e.target.value)}>
              {profiles.map((p) => <option key={p.id} value={p.id}>{p.display_name}</option>)}
            </select>
          </div>
        )}
        <div className="la-field">
          <label>年</label>
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ width: 90 }} />
        </div>
        <div className="la-field">
          <label>月</label>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => <option key={m} value={m}>{m}月</option>)}
          </select>
        </div>
        <div className="la-field">
          <label>時給(円)</label>
          <input type="number" value={wage} disabled={!canEdit}
            onChange={(e) => setWage(Number(e.target.value))} onBlur={saveWage} style={{ width: 110 }} />
        </div>
      </div>

      {loading ? (
        <p className="la-muted">読み込み中…</p>
      ) : (
        <table className="la-table">
          <thead>
            <tr>
              <th style={{ width: "20%" }}>日付</th>
              <th>出勤</th>
              <th>退勤</th>
              <th>休憩(分)</th>
              <th>実働</th>
              <th>給与</th>
              {canEdit && <th></th>}
            </tr>
          </thead>
          <tbody>
            {cards.map((c) => {
              const h = workHours(c.clock_in, c.clock_out, c.break_minutes);
              return (
                <tr key={c.id}>
                  <td>
                    {canEdit ? (
                      <input type="date" value={c.work_date} onChange={(e) => update(c.id, { work_date: e.target.value })} onBlur={() => saveCard({ ...c })} />
                    ) : c.work_date}
                  </td>
                  <td>
                    {canEdit ? (
                      <select value={c.clock_in} onChange={(e) => { update(c.id, { clock_in: e.target.value }); }} onBlur={() => saveCard({ ...c })}>
                        {SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    ) : c.clock_in}
                  </td>
                  <td>
                    {canEdit ? (
                      <select value={c.clock_out} onChange={(e) => update(c.id, { clock_out: e.target.value })} onBlur={() => saveCard({ ...c })}>
                        {SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    ) : c.clock_out}
                  </td>
                  <td>
                    {canEdit ? (
                      <input type="number" value={c.break_minutes} onChange={(e) => update(c.id, { break_minutes: Number(e.target.value) })} onBlur={() => saveCard({ ...c })} />
                    ) : c.break_minutes}
                  </td>
                  <td>{h.toFixed(2)}h</td>
                  <td>¥{Math.round(h * (wage || 0)).toLocaleString()}</td>
                  {canEdit && <td><button className="la-btn sm danger ghost" onClick={() => removeCard(c.id)}>削除</button></td>}
                </tr>
              );
            })}
            <tr className="la-tr-total">
              <td colSpan={4}>月合計</td>
              <td>{totalHours.toFixed(2)}h</td>
              <td>¥{totalPay.toLocaleString()}</td>
              {canEdit && <td></td>}
            </tr>
          </tbody>
        </table>
      )}

      {canEdit && (
        <div style={{ marginTop: "1rem" }}>
          <button className="la-btn sm" onClick={addCard}>＋ 勤務を追加</button>
        </div>
      )}
    </div>
  );
}
