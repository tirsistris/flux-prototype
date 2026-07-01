"use client";
// lib/store.ts — client-only demo store for the Buy flow (phase 2a).
// In-memory React Context, no localStorage: a full page reload resets the store
// to a clean demo start (honest for a prototype). Holds the in-flight purchase
// (pendingBuy) plus the transaction list (phase 2b) seeded from FLUX.txs.
import React from "react";
import { FLUX, type Tx } from "@/lib/flux-data";

// Seed the transaction list from the canonical FLUX.txs, giving each a stable id
// so Wallet rows can link to /tx/[id] and the detail screen can resolve them.
// A hard reload rebuilds this list — injected purchases vanish (demo-honest).
const seedTransactions = (): Tx[] =>
  FLUX.txs.map((tx, i) => ({ ...tx, id: `seed-${i}` }));

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
  clearPendingBuy: () => void;
  transactions: Tx[];
  addTransaction: (tx: Tx) => void;
};

const StoreCtx = React.createContext<Store | null>(null);

export function BuyProvider({ children }: { children: React.ReactNode }) {
  const [pendingBuy, setPendingBuy] = React.useState<PendingBuy | null>(null);
  const [transactions, setTransactions] = React.useState<Tx[]>(seedTransactions);

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

  // Idempotency guard for the buy flow: /buy/success clears the pending buy once
  // it has snapshotted it, so navigating back to /buy/confirm can't re-inject the
  // same transaction (confirm's own guard then bounces an empty store to /buy).
  const clearPendingBuy = React.useCallback(() => setPendingBuy(null), []);

  // New purchases go to the FRONT so they surface at the top of the Wallet list.
  const addTransaction = React.useCallback((tx: Tx) => {
    setTransactions((prev) => [tx, ...prev]);
  }, []);

  const value = React.useMemo(
    () => ({ pendingBuy, setBuyAmount, setBuyMethod, clearPendingBuy, transactions, addTransaction }),
    [pendingBuy, setBuyAmount, setBuyMethod, clearPendingBuy, transactions, addTransaction]
  );

  return React.createElement(StoreCtx.Provider, { value }, children);
}

export function useBuy(): Store {
  const ctx = React.useContext(StoreCtx);
  if (!ctx) throw new Error("useBuy must be used within BuyProvider");
  return ctx;
}
