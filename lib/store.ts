"use client";
// lib/store.ts — client-only demo store for the Buy flow (phase 2a).
// In-memory React Context, no localStorage: a full page reload resets the store
// to a clean demo start (honest for a prototype). No transaction array yet —
// that lands in phase 2b. Store holds only the in-flight purchase.
import React from "react";
import { FLUX } from "@/lib/flux-data";

export type BuyMethod = "card" | "bank" | "apple";

export type PendingBuy = {
  asset: "BTC";
  eurAmount: number;
  cryptoAmount: number;
  method: BuyMethod;
  feeEur: number;
};

// Flat purchase fee, matching the source buyflow.jsx (Confirm + Success both
// used a hardcoded 1,49 €, added on top of the EUR amount — not a percentage).
const BUY_FEE_EUR = 1.49;

type Store = {
  pendingBuy: PendingBuy | null;
  setBuyAmount: (eur: number) => void;
  setBuyMethod: (m: BuyMethod) => void;
};

const StoreCtx = React.createContext<Store | null>(null);

export function BuyProvider({ children }: { children: React.ReactNode }) {
  const [pendingBuy, setPendingBuy] = React.useState<PendingBuy | null>(null);

  // Commits the EUR amount and derives the BTC equivalent from the canonical
  // FLUX price. Keeps a previously chosen method if the user goes back and edits.
  const setBuyAmount = React.useCallback((eur: number) => {
    const price = FLUX.coins.btc.price;
    setPendingBuy((prev) => ({
      asset: "BTC",
      eurAmount: eur,
      cryptoAmount: price > 0 ? eur / price : 0,
      method: prev?.method ?? "card",
      feeEur: BUY_FEE_EUR,
    }));
  }, []);

  const setBuyMethod = React.useCallback((m: BuyMethod) => {
    setPendingBuy((prev) => (prev ? { ...prev, method: m } : prev));
  }, []);

  const value = React.useMemo(
    () => ({ pendingBuy, setBuyAmount, setBuyMethod }),
    [pendingBuy, setBuyAmount, setBuyMethod]
  );

  return React.createElement(StoreCtx.Provider, { value }, children);
}

export function useBuy(): Store {
  const ctx = React.useContext(StoreCtx);
  if (!ctx) throw new Error("useBuy must be used within BuyProvider");
  return ctx;
}
