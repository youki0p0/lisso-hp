// Domain types for the Shisha MONSTER ordering app. All persisted client-side
// (localStorage) for the MVP — swap the store for a DB later without touching UI.

/** One purchasable Shopify variant, from the store's /products.json catalog. */
export type CatalogVariant = {
  variantId: string;
  productTitle: string;
  variantTitle: string; // "Default Title" when the product has no options
  sku: string | null;
  price: string; // JPY as returned by Shopify
  handle: string;
  available: boolean;
};

/** Current on-hand stock for one item (keyed by Shopify variantId when known). */
export type InventoryItem = {
  id: string; // variantId when matched, else a local id
  name: string;
  sku: string | null;
  variantId: string | null;
  currentQty: number;
  unit: string; // "個" default
  updatedAt: string; // ISO
};

/** One past order line (from imported order history). */
export type OrderRecord = {
  id: string;
  date: string; // "YYYY-MM-DD"
  name: string;
  variantId: string | null;
  qty: number;
};

/** Persisted app state. */
export type AppState = {
  inventory: InventoryItem[];
  orders: OrderRecord[];
  /** ISO date of the last stock-count photo, for the re-photo nudge. */
  lastCountAt: string | null;
  /** Nudges the user dismissed (by key), so we don't nag. */
  dismissedNudges: string[];
};

export const EMPTY_STATE: AppState = {
  inventory: [],
  orders: [],
  lastCountAt: null,
  dismissedNudges: [],
};
