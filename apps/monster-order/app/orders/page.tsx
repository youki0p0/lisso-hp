"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useCatalog } from "@/lib/useCatalog";
import { parseOrderCsv } from "@/lib/orders";

const SAMPLE = `日付,商品名,数量
2026-05-02,Bonche Singapore Sling 120g,2
2026-05-20,Bonche Singapore Sling 120g,2
2026-06-10,Bonche Singapore Sling 120g,3`;

export default function OrdersPage() {
  const { state, ready, update } = useStore();
  const catalog = useCatalog();
  const [text, setText] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function importText(raw: string) {
    const rows = parseOrderCsv(raw, catalog.variants);
    if (rows.length === 0) {
      setMsg("行を認識できませんでした。日付,商品名,数量 の形式をご確認ください。");
      return;
    }
    update((s) => ({ ...s, orders: [...s.orders, ...rows] }));
    const matched = rows.filter((r) => r.variantId).length;
    setMsg(`${rows.length}件を取り込みました（うち ${matched} 件はカタログにマッチ）。`);
    setText("");
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    importText(await f.text());
    e.target.value = "";
  }

  function clearAll() {
    if (confirm("発注履歴を全て削除しますか？")) update((s) => ({ ...s, orders: [] }));
  }

  return (
    <>
      <h1>発注履歴の取込</h1>

      <div className="card">
        <h2>CSV / テキストで取込</h2>
        <p className="small muted">
          列は <code>日付, 商品名, 数量</code>（英語ヘッダやヘッダ無しの <code>date,name,qty</code> も可）。
          Shopify の注文エクスポートCSVもそのまま貼り付けられます。
        </p>
        <textarea
          rows={6}
          placeholder={SAMPLE}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn" onClick={() => importText(text)} disabled={!text.trim()}>
            取り込む
          </button>
          <label className="btn ghost" style={{ cursor: "pointer" }}>
            CSVファイル
            <input type="file" accept=".csv,text/csv,text/plain" onChange={onFile} style={{ display: "none" }} />
          </label>
          <button className="btn ghost" onClick={() => setText(SAMPLE)}>
            サンプル
          </button>
        </div>
        {msg && <p className="ok" style={{ marginTop: 8 }}>{msg}</p>}
      </div>

      <div className="card">
        <h2>取込済み（{state.orders.length}）</h2>
        {!ready ? null : state.orders.length === 0 ? (
          <div className="empty">
            まだ履歴がありません。履歴が無い間は、在庫を1〜2週間おきに撮影すると消費ペースを学習できます。
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>日付</th>
                  <th>商品</th>
                  <th className="num">数量</th>
                </tr>
              </thead>
              <tbody>
                {[...state.orders]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 200)
                  .map((o) => (
                    <tr key={o.id}>
                      <td className="small muted">{o.date}</td>
                      <td>
                        {o.name}
                        {!o.variantId && <span className="pill" style={{ marginLeft: 6 }}>未マッチ</span>}
                      </td>
                      <td className="num">{o.qty}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <button className="btn ghost sm" style={{ marginTop: 8 }} onClick={clearAll}>
              全削除
            </button>
          </>
        )}
      </div>
    </>
  );
}
