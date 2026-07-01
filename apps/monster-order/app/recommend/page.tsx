"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import { recommend } from "@/lib/recommend";
import { cartPermalink, shopDomain } from "@/lib/shopify";

export default function RecommendPage() {
  const { state, ready } = useStore();
  const now = useMemo(() => new Date(), []);
  const [coverDays, setCoverDays] = useState(14);
  // Per-suggestion chosen quantity (defaults to the suggested amount).
  const [qty, setQty] = useState<Record<string, number>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const suggestions = useMemo(
    () => recommend(state.inventory, state.orders, now, { coverDays }),
    [state.inventory, state.orders, now, coverDays],
  );

  // Only items matched to a Shopify variant can go into the cart permalink.
  const orderable = suggestions.filter((s) => s.item.variantId);
  const selected = orderable.filter((s) => checked[s.item.id] ?? true);
  const cartItems = selected.map((s) => ({
    variantId: s.item.variantId!,
    qty: qty[s.item.id] ?? s.suggestedQty,
  }));
  const link = cartItems.length > 0 ? cartPermalink(cartItems) : null;

  return (
    <>
      <h1>発注提案</h1>
      <p className="muted small">
        在庫と過去の発注周期から算出。対象ストア <code>{shopDomain()}</code> のカートへワンタップ投入します（スマホ対応）。
      </p>

      <div className="card">
        <div className="row">
          <div style={{ width: 160 }}>
            <label>何日分を確保</label>
            <select value={coverDays} onChange={(e) => setCoverDays(Number(e.target.value))}>
              <option value={7}>7日</option>
              <option value={14}>14日</option>
              <option value={21}>21日</option>
              <option value={30}>30日</option>
            </select>
          </div>
        </div>
      </div>

      {!ready ? null : suggestions.length === 0 ? (
        <div className="card empty">
          今のところ発注提案はありません。<br />
          在庫を登録し、発注履歴を取り込むと、消費ペースに応じて提案が出ます。
        </div>
      ) : (
        <div className="card">
          <table>
            <thead>
              <tr>
                <th style={{ width: 28 }}></th>
                <th>商品</th>
                <th className="num">在庫</th>
                <th className="num">発注数</th>
              </tr>
            </thead>
            <tbody>
              {suggestions.map((s) => {
                const orderableRow = !!s.item.variantId;
                return (
                  <tr key={s.item.id}>
                    <td>
                      <input
                        type="checkbox"
                        style={{ width: "auto" }}
                        disabled={!orderableRow}
                        checked={orderableRow ? (checked[s.item.id] ?? true) : false}
                        onChange={(e) =>
                          setChecked((c) => ({ ...c, [s.item.id]: e.target.checked }))
                        }
                      />
                    </td>
                    <td>
                      {s.item.name}
                      <div className="small muted">{s.reason}</div>
                      {!orderableRow && (
                        <span className="pill warn">カタログ未マッチ（カート不可）</span>
                      )}
                    </td>
                    <td className="num">{s.currentQty}</td>
                    <td className="num" style={{ width: 76 }}>
                      <input
                        type="number"
                        min={0}
                        value={qty[s.item.id] ?? s.suggestedQty}
                        onChange={(e) =>
                          setQty((q) => ({ ...q, [s.item.id]: Number(e.target.value) || 0 }))
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div style={{ marginTop: 12 }}>
            {link ? (
              <a className="btn block" href={link} target="_blank" rel="noopener noreferrer">
                🛒 {selected.length}品目をカートに入れる（{shopDomain()}）
              </a>
            ) : (
              <button className="btn block" disabled>
                カートに入れられる商品がありません（カタログにマッチが必要）
              </button>
            )}
            <p className="muted small" style={{ marginTop: 8 }}>
              タップすると Shopify のカートに全品目が入り、カート画面が開きます（あなたのブラウザ＝スマホでもOK）。
              会員価格やログインが必要な場合は、そのままログインして購入に進めます。
            </p>
          </div>
        </div>
      )}
    </>
  );
}
