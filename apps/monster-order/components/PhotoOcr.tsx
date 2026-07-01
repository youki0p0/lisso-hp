"use client";

import { useRef, useState } from "react";
import { CatalogVariant, InventoryItem } from "@/lib/types";
import { parseOcr, OcrCandidate } from "@/lib/ocrParse";
import { variantLabel } from "@/lib/shopify";

type Props = {
  catalog: CatalogVariant[];
  onAdd: (items: InventoryItem[]) => void;
};

// Shelf photo → base64 → /api/ocr (Google Vision) → parse+match → user confirms
// rows → add to inventory. On mobile the file input opens the camera directly.
export function PhotoOcr({ catalog, onAdd }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rows, setRows] = useState<OcrCandidate[] | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    setRows(null);
    try {
      const dataUrl = await toDataUrl(file);
      const res = await fetch("/api/ocr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(
          res.status === 501
            ? "OCRキー未設定（AI Studioの Gemini キー MONSTER_GEMINI_API_KEY 推奨・無料/カード不要）。下の手入力をご利用ください。"
            : data.message || data.error || "OCRに失敗しました",
        );
        return;
      }
      const parsed = parseOcr(data.text || "", catalog);
      setRows(parsed);
      if (parsed.length === 0) setError("文字を抽出できませんでした。撮り直すか手入力してください。");
    } catch (err) {
      setError(err instanceof Error ? err.message : "読み取りエラー");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function setRow(i: number, patch: Partial<OcrCandidate>) {
    setRows((prev) => prev && prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }

  function confirm() {
    if (!rows) return;
    const now = new Date().toISOString();
    const items: InventoryItem[] = rows
      .filter((r) => r.name && r.qty > 0)
      .map((r) => ({
        id: r.match?.variantId ?? `local_${r.name}`,
        name: r.match ? variantLabel(r.match) : r.name,
        sku: r.match?.sku ?? null,
        variantId: r.match?.variantId ?? null,
        currentQty: r.qty,
        unit: "個",
        updatedAt: now,
      }));
    onAdd(items);
    setRows(null);
  }

  return (
    <div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFile}
        style={{ display: "none" }}
      />
      <div className="row">
        <button className="btn" onClick={() => fileRef.current?.click()} disabled={busy}>
          {busy ? "読み取り中…" : "📷 棚を撮影 / 画像を選ぶ"}
        </button>
        {rows && (
          <button className="btn ghost" onClick={() => setRows(null)}>
            クリア
          </button>
        )}
      </div>
      {error && <p className="err" style={{ marginTop: 8 }}>{error}</p>}

      {rows && rows.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <p className="small muted">
            読み取り結果を確認・修正してください（マッチした商品は変数IDが付き、後で発注に使えます）。
          </p>
          <table>
            <thead>
              <tr>
                <th>読取</th>
                <th>商品（マッチ）</th>
                <th className="num">数量</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="small muted">{r.raw}</td>
                  <td>
                    <select
                      value={r.match?.variantId ?? ""}
                      onChange={(e) =>
                        setRow(i, {
                          match: catalog.find((v) => v.variantId === e.target.value),
                        })
                      }
                    >
                      <option value="">（未マッチ: {r.name}）</option>
                      {catalog.slice(0, 500).map((v) => (
                        <option key={v.variantId} value={v.variantId}>
                          {variantLabel(v)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="num" style={{ width: 70 }}>
                    <input
                      type="number"
                      min={0}
                      value={r.qty}
                      onChange={(e) => setRow(i, { qty: Number(e.target.value) || 0 })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 10 }}>
            <button className="btn block" onClick={confirm}>
              在庫に反映（{rows.filter((r) => r.qty > 0).length}件）
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result));
    fr.onerror = () => reject(new Error("画像の読み込みに失敗"));
    fr.readAsDataURL(file);
  });
}
