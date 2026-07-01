"use client";

import { useState } from "react";
import { useStore, newId, todayIso } from "@/lib/store";
import { useCatalog } from "@/lib/useCatalog";
import { InventoryItem } from "@/lib/types";
import { PhotoOcr } from "@/components/PhotoOcr";
import { variantLabel } from "@/lib/shopify";

export default function InventoryPage() {
  const { state, ready, update } = useStore();
  const catalog = useCatalog();
  const [manualName, setManualName] = useState("");
  const [manualQty, setManualQty] = useState(1);
  const [manualVariant, setManualVariant] = useState("");

  // Upsert by id: a photo/stock-count SETS the current quantity (not adds).
  function upsert(items: InventoryItem[]) {
    update((s) => {
      const map = new Map(s.inventory.map((i) => [i.id, i]));
      for (const it of items) map.set(it.id, { ...map.get(it.id), ...it });
      return { ...s, inventory: [...map.values()], lastCountAt: todayIso() };
    });
  }

  function addManual() {
    const v = catalog.variants.find((x) => x.variantId === manualVariant);
    const name = v ? variantLabel(v) : manualName.trim();
    if (!name) return;
    upsert([
      {
        id: v?.variantId ?? newId("inv"),
        name,
        sku: v?.sku ?? null,
        variantId: v?.variantId ?? null,
        currentQty: manualQty,
        unit: "個",
        updatedAt: todayIso(),
      },
    ]);
    setManualName("");
    setManualQty(1);
    setManualVariant("");
  }

  function setQty(id: string, qty: number) {
    update((s) => ({
      ...s,
      inventory: s.inventory.map((i) =>
        i.id === id ? { ...i, currentQty: qty, updatedAt: todayIso() } : i,
      ),
    }));
  }
  function remove(id: string) {
    update((s) => ({ ...s, inventory: s.inventory.filter((i) => i.id !== id) }));
  }

  return (
    <>
      <h1>在庫</h1>

      <div className="card">
        <h2>📷 棚写真から登録（OCR）</h2>
        {catalog.loading && <p className="muted small">カタログ読込中…</p>}
        {catalog.error && (
          <p className="err small">カタログ: {catalog.error}（手入力は可能）</p>
        )}
        <PhotoOcr catalog={catalog.variants} onAdd={upsert} />
      </div>

      <div className="card">
        <h2>＋ 手入力で登録</h2>
        <div className="row">
          <div style={{ flex: 2, minWidth: 200 }}>
            <label>商品（カタログから選択 or 名前入力）</label>
            <select value={manualVariant} onChange={(e) => setManualVariant(e.target.value)}>
              <option value="">（自由入力する）</option>
              {catalog.variants.slice(0, 500).map((v) => (
                <option key={v.variantId} value={v.variantId}>
                  {variantLabel(v)}
                </option>
              ))}
            </select>
            {!manualVariant && (
              <input
                style={{ marginTop: 6 }}
                placeholder="商品名"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
              />
            )}
          </div>
          <div style={{ width: 90 }}>
            <label>数量</label>
            <input
              type="number"
              min={0}
              value={manualQty}
              onChange={(e) => setManualQty(Number(e.target.value) || 0)}
            />
          </div>
          <button className="btn" onClick={addManual}>
            登録
          </button>
        </div>
      </div>

      <div className="card">
        <h2>現在の在庫（{state.inventory.length}）</h2>
        {!ready ? null : state.inventory.length === 0 ? (
          <div className="empty">まだ在庫がありません。上から登録してください。</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>商品</th>
                <th className="num">在庫</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {state.inventory.map((i) => (
                <tr key={i.id}>
                  <td>
                    {i.name}
                    {!i.variantId && <span className="pill" style={{ marginLeft: 6 }}>未マッチ</span>}
                  </td>
                  <td className="num" style={{ width: 90 }}>
                    <input
                      type="number"
                      min={0}
                      value={i.currentQty}
                      onChange={(e) => setQty(i.id, Number(e.target.value) || 0)}
                    />
                  </td>
                  <td style={{ width: 40 }}>
                    <button className="btn ghost sm" onClick={() => remove(i.id)}>
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {state.lastCountAt && (
          <p className="muted small" style={{ marginTop: 8 }}>
            最終カウント: {new Date(state.lastCountAt).toLocaleString("ja-JP")}
          </p>
        )}
      </div>
    </>
  );
}
