// Shopify storefront helpers. The key trick for mobile: a cart permalink
// `https://{shop}/cart/{variantId}:{qty},...` is a plain top-level URL that
// adds every item to the shopper's own (first-party) cart — so it works in
// iOS Safari where cross-site fetches are blocked. Verified against a live
// Shopify store (NEWEMO).
import { CatalogVariant } from "./types";

export function shopDomain(): string {
  return (
    process.env.NEXT_PUBLIC_MONSTER_SHOP_DOMAIN?.trim() || "newemoshisha.com"
  );
}

/** Build a cart permalink that adds all items and lands on the cart page. */
export function cartPermalink(
  items: { variantId: string; qty: number }[],
  domain = shopDomain(),
): string {
  const pairs = items
    .filter((i) => i.variantId && i.qty > 0)
    .map((i) => `${i.variantId}:${Math.floor(i.qty)}`)
    .join(",");
  // storefront=true keeps the buyer on the storefront cart (not straight to
  // checkout) so they can review before ordering.
  return `https://${domain}/cart/${pairs}?storefront=true`;
}

/** Normalize a raw Shopify /products.json product into flat variants. */
export function flattenProducts(raw: unknown): CatalogVariant[] {
  const products = (raw as { products?: RawProduct[] })?.products ?? [];
  const out: CatalogVariant[] = [];
  for (const p of products) {
    for (const v of p.variants ?? []) {
      out.push({
        variantId: String(v.id),
        productTitle: p.title ?? "",
        variantTitle: v.title ?? "Default Title",
        sku: v.sku || null,
        price: v.price ?? "",
        handle: p.handle ?? "",
        available: v.available ?? true,
      });
    }
  }
  return out;
}

type RawProduct = {
  title?: string;
  handle?: string;
  variants?: {
    id: number | string;
    title?: string;
    sku?: string;
    price?: string;
    available?: boolean;
  }[];
};

/** Display label for a variant (hides the meaningless "Default Title"). */
export function variantLabel(v: CatalogVariant): string {
  return v.variantTitle && v.variantTitle !== "Default Title"
    ? `${v.productTitle} / ${v.variantTitle}`
    : v.productTitle;
}
