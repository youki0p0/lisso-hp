"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useStore } from "@/lib/store";
import { recommend, photoNudge } from "@/lib/recommend";
import { shopDomain } from "@/lib/shopify";

export default function Home() {
  const { state, ready, update } = useStore();

  const now = useMemo(() => new Date(), []);
  const suggestions = useMemo(
    () => recommend(state.inventory, state.orders, now),
    [state.inventory, state.orders, now],
  );
  const nudge = useMemo(
    () => photoNudge(state.lastCountAt, state.orders.length, now),
    [state.lastCountAt, state.orders.length, now],
  );
  const nudgeKey = "photo-nudge";
  const showNudge = ready && nudge.show && !state.dismissedNudges.includes(nudgeKey);

  return (
    <>
      <h1>ダッシュボード</h1>
      <p className="muted small">
        対象ストア: <code>{shopDomain()}</code>
      </p>

      {showNudge && (
        <div className="nudge">
          <b>📸 在庫の棚を撮影しませんか？</b>
          <p className="small muted" style={{ margin: "6px 0" }}>
            発注履歴がまだ無いので、消費ペースを学習できていません。
            {state.lastCountAt
              ? `前回カウントから ${nudge.daysSince} 日経過。1週後(${nudge.dueDates[0]})・2週後(${nudge.dueDates[1]})に撮ると精度が上がります。`
              : "まずは今の在庫を撮って登録し、1週間後・2週間後にもう一度撮ると消費ペースが分かります。"}
            （任意です）
          </p>
          <div className="row">
            <Link className="btn sm" href="/inventory">
              棚を撮影 / 在庫登録
            </Link>
            <button
              className="btn ghost sm"
              onClick={() =>
                update((s) => ({ ...s, dismissedNudges: [...s.dismissedNudges, nudgeKey] }))
              }
            >
              今はしない
            </button>
          </div>
        </div>
      )}

      <div className="grid2">
        <Link className="card" href="/inventory" style={{ textDecoration: "none" }}>
          <h2>在庫</h2>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{state.inventory.length}</div>
          <div className="muted small">品目 — 棚写真OCR / 手入力で登録</div>
        </Link>
        <Link className="card" href="/orders" style={{ textDecoration: "none" }}>
          <h2>発注履歴</h2>
          <div style={{ fontSize: 28, fontWeight: 700 }}>{state.orders.length}</div>
          <div className="muted small">明細 — CSV取込で消費周期を学習</div>
        </Link>
      </div>

      <Link className="card" href="/recommend" style={{ textDecoration: "none", display: "block" }}>
        <h2>発注提案</h2>
        <div style={{ fontSize: 28, fontWeight: 700 }}>
          {ready ? suggestions.length : "…"}
          <span className="muted small" style={{ fontWeight: 400 }}> 件</span>
        </div>
        <div className="muted small">
          在庫状況と過去の発注周期から算出。ワンタップで Shopify カートへ。
        </div>
      </Link>

      <p className="muted small">
        ※ データはこの端末（ブラウザ）に保存されます。会計・在庫の正式管理は別途ご検討ください。
      </p>
    </>
  );
}
