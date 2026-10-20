"use client";
// lib/store.tsx — client-only demo state (in memory, like v1: a hard reload resets
// the demo to legend.md). Holds balances, the Activity list, the buy draft carried
// across steps, the live price-locked quote and the last receipt.
import React from "react";
import {
  ACTIVITY,
  BTC_DETAIL,
  DEFAULT_METHOD,
  HOLDINGS,
  LAST_ORDER_NO,
  NOW,
  PAY_METHODS,
  QUOTE_TTL_MS,
  type ActivityItem,
  type Holdings,
  type PayMethod,
} from "@/lib/legend";
import { quoteBuy, valueCents, type BuyQuote } from "@/lib/money";

export type EntryMode = "eur" | "btc";

export type BuyDraft = {
  mode: EntryMode;
  input: string; // what the keypad typed, "," as decimal separator
  eurCents: number; // gross amount the user pays, derived from input in either mode
};

export type LockedQuote = BuyQuote & { method: PayMethod; expiresAt: number; id: number };

export type Receipt = BuyQuote & {
  orderNo: string;
  method: PayMethod;
  time: string;
  btcAfter: number;
};

type State = {
  holdings: Holdings;
  btcCostCents: number; // cost basis of the BTC position incl. fees (Buy 1 screen)
  activity: ActivityItem[];
  lastOrder: number;
  draft: BuyDraft;
  method: PayMethod;
  quote: LockedQuote | null;
  receipt: Receipt | null;
};

const initialDraft = (): BuyDraft => ({ mode: "eur", input: "100", eurCents: 10_000 });

const initialState = (): State => ({
  holdings: { ...HOLDINGS },
  btcCostCents: valueCents(HOLDINGS.BTC, BTC_DETAIL.avgBuyPriceCents),
  activity: ACTIVITY,
  lastOrder: LAST_ORDER_NO,
  draft: initialDraft(),
  method: DEFAULT_METHOD,
  quote: null,
  receipt: null,
});

type Store = State & {
  setDraft: (d: BuyDraft) => void;
  setMethod: (m: PayMethod) => void;
  lockQuote: () => void;
  confirmBuy: () => Receipt | null;
  resetBuy: () => void;
};

const Ctx = React.createContext<Store | null>(null);

let quoteSeq = 0;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setState] = React.useState<State>(initialState);
  // The ref is the synchronous source of truth: actions read and write it first,
  // so two taps inside one frame see each other (no double purchase).
  const ref = React.useRef(s);
  const set = React.useCallback((fn: (p: State) => State) => {
    ref.current = fn(ref.current);
    setState(ref.current);
  }, []);

  const setDraft = React.useCallback((draft: BuyDraft) => set((p) => ({ ...p, draft, quote: null })), [set]);
  const setMethod = React.useCallback((method: PayMethod) => set((p) => ({ ...p, method, quote: null })), [set]);

  // Locks the current draft at the current price for QUOTE_TTL_MS. Used both when
  // Review opens and by "Refresh quote" (same legend price, fresh timer — agreed).
  const lockQuote = React.useCallback(() => {
    set((p) => ({
      ...p,
      quote: { ...quoteBuy(p.draft.eurCents), method: p.method, expiresAt: Date.now() + QUOTE_TTL_MS, id: ++quoteSeq },
    }));
  }, [set]);

  // Executes the locked quote once. Returns null when there is nothing valid to
  // execute (expired, already used) so a double tap can't buy twice.
  const confirmBuy = React.useCallback((): Receipt | null => {
    let out: Receipt | null = null;
    set((p) => {
      const q = p.quote;
      if (!q || Date.now() >= q.expiresAt) return p;
      if (q.method === "euro" && q.eurCents > p.holdings.eurCents) return p;
      const orderNo = p.lastOrder + 1;
      const holdings: Holdings = {
        ...p.holdings,
        BTC: p.holdings.BTC + q.units,
        eurCents: q.method === "euro" ? p.holdings.eurCents - q.eurCents : p.holdings.eurCents,
      };
      const receipt: Receipt = { ...q, orderNo: `FX-${orderNo}`, method: q.method, time: NOW.time, btcAfter: holdings.BTC };
      const row: ActivityItem = {
        id: `buy-${orderNo}`,
        day: "today",
        kind: "trade",
        icon: "buy",
        title: "Bought Bitcoin",
        sub: `${PAY_METHODS[q.method].label} · ${NOW.time}`,
        asset: "BTC",
        qty: q.units,
        qtyDp: 6,
        eurCents: q.eurCents,
      };
      out = receipt;
      return {
        ...p,
        holdings,
        // Fee is part of the cost (accounting view): cost basis grows by what was paid.
        btcCostCents: p.btcCostCents + q.eurCents,
        activity: [row, ...p.activity],
        lastOrder: orderNo,
        quote: null,
        receipt,
        draft: initialDraft(),
        method: DEFAULT_METHOD,
      };
    });
    return out;
  }, [set]);

  const resetBuy = React.useCallback(
    () => set((p) => ({ ...p, draft: initialDraft(), method: DEFAULT_METHOD, quote: null })),
    [set]
  );

  const value = React.useMemo(
    () => ({ ...s, setDraft, setMethod, lockQuote, confirmBuy, resetBuy }),
    [s, setDraft, setMethod, lockQuote, confirmBuy, resetBuy]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}
