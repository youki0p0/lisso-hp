"use client";

import React from "react";
import { supabase, type Profile, type MenuItem } from "@/lib/supabase";

export function MenuTab({ profile, onPrint }: { profile: Profile; onPrint: (items: MenuItem[]) => void }) {
  const isAdmin = profile.role === "admin";
  const [items, setItems] = React.useState<MenuItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("lisso_menu_items").select("*").order("sort_order");
    setItems((data as MenuItem[]) ?? []);
    setLoading(false);
  }, []);

  React.useEffect(() => { load(); }, [load]);

  const update = (id: string, patch: Partial<MenuItem>) =>
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const saveRow = async (it: MenuItem) => {
    await supabase.from("lisso_menu_items").update({
      category: it.category, name: it.name, price: it.price, sort_order: it.sort_order,
    }).eq("id", it.id);
  };

  const addRow = async () => {
    const next = (items.reduce((m, x) => Math.max(m, x.sort_order), 0) || 0) + 10;
    const { data } = await supabase.from("lisso_menu_items")
      .insert({ category: "", name: "新しい項目", price: 0, sort_order: next }).select().single();
    if (data) setItems((xs) => [...xs, data as MenuItem]);
  };

  const removeRow = async (id: string) => {
    await supabase.from("lisso_menu_items").delete().eq("id", id);
    setItems((xs) => xs.filter((x) => x.id !== id));
  };

  return (
    <div>
      <div className="la-calhead">
        <h2 className="la-section-title">料金メニュー</h2>
        <div className="la-spacer" />
        <button className="la-btn primary sm" onClick={() => onPrint(items)}>🖨 メニューをPDF印刷</button>
      </div>

      {loading ? (
        <p className="la-muted">読み込み中…</p>
      ) : (
        <table className="la-table">
          <thead>
            <tr>
              <th style={{ width: "22%" }}>カテゴリ</th>
              <th>項目名</th>
              <th style={{ width: "16%" }}>価格(円)</th>
              <th style={{ width: "10%" }}>並び</th>
              {isAdmin && <th style={{ width: "8%" }}></th>}
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td>
                  {isAdmin ? (
                    <input value={it.category} onChange={(e) => update(it.id, { category: e.target.value })} onBlur={() => saveRow(it)} />
                  ) : it.category}
                </td>
                <td>
                  {isAdmin ? (
                    <input value={it.name} onChange={(e) => update(it.id, { name: e.target.value })} onBlur={() => saveRow(it)} />
                  ) : it.name}
                </td>
                <td>
                  {isAdmin ? (
                    <input type="number" value={it.price} onChange={(e) => update(it.id, { price: Number(e.target.value) })} onBlur={() => saveRow(it)} />
                  ) : `¥${it.price.toLocaleString()}`}
                </td>
                <td>
                  {isAdmin ? (
                    <input type="number" value={it.sort_order} onChange={(e) => update(it.id, { sort_order: Number(e.target.value) })} onBlur={() => saveRow(it)} />
                  ) : it.sort_order}
                </td>
                {isAdmin && (
                  <td><button className="la-btn sm danger ghost" onClick={() => removeRow(it.id)}>削除</button></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isAdmin && (
        <div style={{ marginTop: "1rem" }}>
          <button className="la-btn sm" onClick={addRow}>＋ 項目を追加</button>
        </div>
      )}
      {!isAdmin && <p className="la-muted" style={{ marginTop: ".8rem" }}>※ 料金メニューの編集は管理者のみ可能です。</p>}
    </div>
  );
}
