// Parse pasted/uploaded order-history CSV into OrderRecord rows. Deterministic.
// Accepts flexible headers (Japanese or English) and also a headerless
// "date,name,qty" form. Matches item names to catalog variants when possible.
import { CatalogVariant, OrderRecord } from "./types";
import { matchLine } from "./ocrParse";

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (q && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else q = !q;
    } else if (c === "," && !q) {
      out.push(cur);
      cur = "";
    } else cur += c;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

const DATE_KEYS = ["date", "日付", "注文日", "発注日", "created", "created_at", "購入日"];
const NAME_KEYS = ["name", "商品", "商品名", "品名", "title", "lineitem name", "item"];
const QTY_KEYS = ["qty", "quantity", "数量", "個数", "点数", "lineitem quantity"];

function findIdx(header: string[], keys: string[]): number {
  const low = header.map((h) => h.toLowerCase());
  for (const k of keys) {
    const i = low.findIndex((h) => h.includes(k));
    if (i >= 0) return i;
  }
  return -1;
}

function normDate(s: string): string {
  const t = s.trim().replace(/\//g, "-");
  const m = t.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
  const d = new Date(t);
  return Number.isFinite(d.getTime()) ? d.toISOString().slice(0, 10) : "";
}

export function parseOrderCsv(text: string, catalog: CatalogVariant[]): OrderRecord[] {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const first = splitCsvLine(lines[0]);
  const hasHeader = findIdx(first, [...DATE_KEYS, ...NAME_KEYS, ...QTY_KEYS]) >= 0;
  let di = 0, ni = 1, qi = 2;
  let start = 0;
  if (hasHeader) {
    di = findIdx(first, DATE_KEYS);
    ni = findIdx(first, NAME_KEYS);
    qi = findIdx(first, QTY_KEYS);
    start = 1;
  }

  const out: OrderRecord[] = [];
  for (let i = start; i < lines.length; i++) {
    const cols = splitCsvLine(lines[i]);
    const name = (cols[ni] ?? "").trim();
    if (!name) continue;
    const date = normDate(cols[di] ?? "");
    const qty = parseInt((cols[qi] ?? "1").replace(/[^\d.-]/g, ""), 10);
    const { match } = matchLine(name, catalog);
    out.push({
      id: `ord_${i}_${Math.random().toString(36).slice(2, 7)}`,
      date: date || new Date().toISOString().slice(0, 10),
      name,
      variantId: match?.variantId ?? null,
      qty: Number.isFinite(qty) && qty > 0 ? qty : 1,
    });
  }
  return out;
}
