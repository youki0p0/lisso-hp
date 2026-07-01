// Turn raw OCR text (from a shelf photo) into candidate stock lines, and match
// them against the Shopify catalog by fuzzy name/SKU. Deterministic + testable.
import { CatalogVariant } from "./types";
import { variantLabel } from "./shopify";

export type OcrCandidate = {
  raw: string;
  name: string;
  qty: number;
  match?: CatalogVariant;
  score: number;
};

/** Normalize for matching: lowercase, NFKC, strip spaces/punct. */
export function norm(s: string): string {
  return s
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s　_.,/|・()（）\-]+/g, "");
}

/** Pull a trailing/leading quantity like "x3" "×3" "3個" "3本" from a line. */
function extractQty(line: string): { name: string; qty: number } {
  const m =
    line.match(/[x×]\s*(\d{1,3})\b/i) ||
    line.match(/(\d{1,3})\s*(?:個|本|箱|pcs?)\b/i);
  const qty = m ? parseInt(m[1], 10) : 1;
  const name = m ? line.replace(m[0], "").trim() : line.trim();
  return { name, qty: Number.isFinite(qty) && qty > 0 ? qty : 1 };
}

/** Bigram Dice coefficient — cheap fuzzy similarity in [0,1]. */
function dice(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const bg = (s: string) => {
    const m = new Map<string, number>();
    for (let i = 0; i < s.length - 1; i++) {
      const g = s.slice(i, i + 2);
      m.set(g, (m.get(g) ?? 0) + 1);
    }
    return m;
  };
  const A = bg(a);
  const B = bg(b);
  let inter = 0;
  for (const [g, n] of A) inter += Math.min(n, B.get(g) ?? 0);
  return (2 * inter) / (a.length - 1 + (b.length - 1));
}

/** Best catalog match for a line (by SKU exact, else fuzzy name). */
export function matchLine(
  name: string,
  catalog: CatalogVariant[],
): { match?: CatalogVariant; score: number } {
  const n = norm(name);
  if (!n) return { score: 0 };
  let best: CatalogVariant | undefined;
  let bestScore = 0;
  for (const v of catalog) {
    if (v.sku && norm(v.sku) === n) return { match: v, score: 1 };
    const s = dice(n, norm(variantLabel(v)));
    if (s > bestScore) {
      bestScore = s;
      best = v;
    }
  }
  return bestScore >= 0.45 ? { match: best, score: bestScore } : { score: bestScore };
}

/** Parse OCR text into matched candidates, skipping obvious noise lines. */
export function parseOcr(text: string, catalog: CatalogVariant[]): OcrCandidate[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length >= 2 && /[a-z぀-ヿ一-鿿]/i.test(l));
  const out: OcrCandidate[] = [];
  for (const raw of lines) {
    const { name, qty } = extractQty(raw);
    if (norm(name).length < 2) continue;
    const { match, score } = matchLine(name, catalog);
    out.push({ raw, name, qty, match, score });
  }
  return out;
}
