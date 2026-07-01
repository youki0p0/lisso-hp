"use client";

import { useEffect, useState } from "react";
import { CatalogVariant } from "./types";

type CatalogState = {
  variants: CatalogVariant[];
  loading: boolean;
  error: string | null;
  domain: string | null;
};

// Fetch the target store's catalog once (cached by the API route for an hour).
export function useCatalog(): CatalogState {
  const [s, setS] = useState<CatalogState>({
    variants: [],
    loading: true,
    error: null,
    domain: null,
  });
  useEffect(() => {
    let alive = true;
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((d) => {
        if (!alive) return;
        setS({
          variants: d.variants ?? [],
          loading: false,
          error: d.error ? d.message || d.error : null,
          domain: d.domain ?? null,
        });
      })
      .catch((e) => alive && setS((p) => ({ ...p, loading: false, error: String(e) })));
    return () => {
      alive = false;
    };
  }, []);
  return s;
}
