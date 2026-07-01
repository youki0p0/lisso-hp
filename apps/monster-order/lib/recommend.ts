// Reorder recommendation engine (pure functions — no I/O, easy to test).
//
// Idea: learn each item's consumption cadence from imported order history, then
// compare against current on-hand stock to suggest what/how much to reorder.
// When there is no history yet, fall back to a simple low-stock threshold and
// (in the UI) nudge the user to photograph stock at 1 & 2 weeks so we can start
// learning the cadence.
import { InventoryItem, OrderRecord } from "./types";

const DAY = 24 * 60 * 60 * 1000;

export type Cadence = {
  key: string; // variantId or normalized name
  totalQty: number;
  orderCount: number;
  spanDays: number; // first→last order span
  perDay: number; // estimated consumption per day
  avgOrderQty: number;
};

function keyOf(r: { variantId: string | null; name: string }): string {
  return r.variantId || r.name.trim().toLowerCase();
}

/** Estimate per-day consumption per item from order history. */
export function computeCadence(orders: OrderRecord[], now: Date): Cadence[] {
  const groups = new Map<string, OrderRecord[]>();
  for (const o of orders) {
    const k = keyOf(o);
    (groups.get(k) ?? groups.set(k, []).get(k)!).push(o);
  }
  const out: Cadence[] = [];
  for (const [key, rows] of groups) {
    const times = rows
      .map((r) => new Date(r.date).getTime())
      .filter((t) => Number.isFinite(t))
      .sort((a, b) => a - b);
    const totalQty = rows.reduce((s, r) => s + (r.qty || 0), 0);
    const first = times[0] ?? now.getTime();
    // Span from first order to *now* (stock has been consumed since the last buy).
    const spanDays = Math.max(1, (now.getTime() - first) / DAY);
    out.push({
      key,
      totalQty,
      orderCount: rows.length,
      spanDays: Math.round(spanDays),
      perDay: totalQty / spanDays,
      avgOrderQty: totalQty / rows.length,
    });
  }
  return out;
}

export type Suggestion = {
  item: InventoryItem;
  currentQty: number;
  suggestedQty: number;
  reason: string;
  hasHistory: boolean;
};

export type RecommendOptions = {
  /** Days of stock to cover per order (reorder cycle). */
  coverDays?: number;
  /** Low-stock threshold used when there is no history. */
  lowStockThreshold?: number;
};

/**
 * Recommend reorder quantities. With history: order enough to cover `coverDays`
 * of estimated consumption beyond current stock. Without history: suggest a
 * top-up when stock is at/below the low threshold.
 */
export function recommend(
  inventory: InventoryItem[],
  orders: OrderRecord[],
  now: Date,
  opts: RecommendOptions = {},
): Suggestion[] {
  const coverDays = opts.coverDays ?? 14;
  const low = opts.lowStockThreshold ?? 1;
  const cadence = new Map(computeCadence(orders, now).map((c) => [c.key, c]));

  const suggestions: Suggestion[] = [];
  for (const item of inventory) {
    const key = item.variantId || item.name.trim().toLowerCase();
    const c = cadence.get(key);
    if (c && c.perDay > 0) {
      const needed = c.perDay * coverDays;
      const deficit = needed - item.currentQty;
      if (deficit > 0.5) {
        suggestions.push({
          item,
          currentQty: item.currentQty,
          suggestedQty: Math.max(1, Math.round(deficit)),
          reason: `過去${c.orderCount}回・約${c.perDay.toFixed(2)}個/日 → ${coverDays}日分に不足`,
          hasHistory: true,
        });
      }
    } else if (item.currentQty <= low) {
      suggestions.push({
        item,
        currentQty: item.currentQty,
        suggestedQty: Math.max(1, Math.round(c?.avgOrderQty ?? 1)),
        reason: "発注履歴なし・在庫僅少（要撮影で消費周期を学習）",
        hasHistory: false,
      });
    }
  }
  // Biggest deficits first.
  return suggestions.sort((a, b) => b.suggestedQty - a.suggestedQty);
}

/**
 * Whether to nudge the user to re-photograph stock. Returns the suggested next
 * count dates (1 & 2 weeks after the last count) when there is no order history
 * to learn from yet. Never forces — the UI shows it as dismissible guidance.
 */
export function photoNudge(
  lastCountAt: string | null,
  ordersCount: number,
  now: Date,
): { show: boolean; dueDates: string[]; daysSince: number | null } {
  if (ordersCount > 0) return { show: false, dueDates: [], daysSince: null };
  if (!lastCountAt) return { show: true, dueDates: [], daysSince: null };
  const last = new Date(lastCountAt).getTime();
  const daysSince = Math.floor((now.getTime() - last) / DAY);
  const dueDates = [7, 14].map((d) =>
    new Date(last + d * DAY).toISOString().slice(0, 10),
  );
  // Show once ~a week has passed since the last count.
  return { show: daysSince >= 7, dueDates, daysSince };
}
