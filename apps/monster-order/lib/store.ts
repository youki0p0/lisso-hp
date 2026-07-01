"use client";

// localStorage-backed app store + a React hook. Intentionally tiny: the MVP
// keeps everything on the device so it works on Vercel with no database. The
// shape (AppState) is the single source of truth; a server/DB store can replace
// this later behind the same read/write surface.
import { useCallback, useEffect, useState } from "react";
import { AppState, EMPTY_STATE } from "./types";

const KEY = "monster-order:v1";

function read(): AppState {
  if (typeof window === "undefined") return EMPTY_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY_STATE;
    return { ...EMPTY_STATE, ...(JSON.parse(raw) as AppState) };
  } catch {
    return EMPTY_STATE;
  }
}

function write(state: AppState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* quota / private mode — ignore */
  }
}

export function useStore() {
  const [state, setState] = useState<AppState>(EMPTY_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setState(read());
    setReady(true);
  }, []);

  const update = useCallback((fn: (s: AppState) => AppState) => {
    setState((prev) => {
      const next = fn(prev);
      write(next);
      return next;
    });
  }, []);

  return { state, ready, update };
}

export function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function todayIso(): string {
  return new Date().toISOString();
}

export function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}
