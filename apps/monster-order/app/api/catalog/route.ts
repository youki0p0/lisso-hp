import { NextResponse } from "next/server";
import { flattenProducts, shopDomain } from "@/lib/shopify";

export const runtime = "nodejs";
// Catalog changes rarely; cache for an hour to keep it snappy.
export const revalidate = 3600;

// Proxy the target Shopify store's public /products.json (server-side to avoid
// CORS) and return flat variants with their numeric variantId — the id needed
// to build cart permalinks. Paginates up to a sane cap.
export async function GET() {
  const domain = shopDomain();
  const all: unknown[] = [];
  try {
    for (let page = 1; page <= 10; page++) {
      const res = await fetch(
        `https://${domain}/products.json?limit=250&page=${page}`,
        { headers: { "User-Agent": "monster-order/1.0" }, next: { revalidate: 3600 } },
      );
      if (res.status === 401 || res.status === 404) {
        return NextResponse.json(
          {
            error: "store_locked",
            message: `${domain} はパスワード保護中か非公開です（401/404）。公開ストアのドメインを NEXT_PUBLIC_MONSTER_SHOP_DOMAIN に設定してください。`,
            domain,
            variants: [],
          },
          { status: 200 },
        );
      }
      if (!res.ok) break;
      const data = (await res.json()) as { products?: unknown[] };
      const products = data.products ?? [];
      if (products.length === 0) break;
      all.push(...products);
      if (products.length < 250) break;
    }
    const variants = flattenProducts({ products: all });
    return NextResponse.json({ domain, count: variants.length, variants });
  } catch (err) {
    return NextResponse.json(
      { error: "catalog_failed", message: err instanceof Error ? err.message : "unknown", domain, variants: [] },
      { status: 200 },
    );
  }
}
