"use client";
// lib/store.tsx — client-only demo state (in memory, like v1: a hard reload resets
// the demo to legend.md). Holds balances, the Activity list, the buy draft carried
// across steps, the live price-locked quote and the last receipt, and the
// Send ETH draft (recipient, amount, note) with the last sent transfer, and the
// Profile settings: toggles, signed-in iPad, added bank accounts, price alerts.
import React from "react";
import {
  ACTIVITY,
  ALERTS,
  ASSETS,
  BTC_DETAIL,
  DATE_TODAY,
  DEFAULT_METHOD,
  DEMO_PASTE,
  ETH_STAKED,
  HOLDINGS,
  LAST_ORDER_NO,
  MAXIM_NOTE,
  NETWORK_FEE_UNITS,
  NEW_SEND_HASH,
  NOW,
  PAY_METHODS,
  QUOTE_TTL_MS,
  type ActivityItem,
  type Alert,
  type Holdings,
  type PayMethod,
  type RecipientRef,
} from "@/lib/legend";
import { quoteBuy, valueCents, type BuyQuote } from "@/lib/money";
import { recipientInfo } from "@/lib/send";

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

export type SendDraft = {
  to: string; // what the "To" field holds
  recipient: RecipientRef | null; // chosen contact or validated ETH address
  mode: "eth" | "eur";
  input: string; // keypad text, "," as decimal separator
  units: number; // ETH to send, 1e-8 units
  note: string;
};

const initialSend = (): SendDraft => ({ to: "", recipient: null, mode: "eth", input: "0", units: 0, note: "" });

/** Spendable ETH: total minus staked, minus the network fee. */
export const maxSendUnits = (h: Holdings) => Math.max(0, h.ETH - ETH_STAKED - NETWORK_FEE_UNITS);

type State = {
  holdings: Holdings;
  btcCostCents: number; // cost basis of the BTC position incl. fees (Buy 1 screen)
  activity: ActivityItem[];
  lastOrder: number;
  draft: BuyDraft;
  method: PayMethod;
  quote: LockedQuote | null;
  receipt: Receipt | null;
  send: SendDraft;
  pasteIdx: number;
  lastSendId: string | null;
  sendSeq: number;
  faceId: boolean;
  hideBalances: boolean;
  ipadSignedIn: boolean;
  addedBanks: string[]; // IBANs added in this session (Raiffeisen is the 1 existing)
  alerts: Alert[];
  alertSeq: number;
  // New alert kept while the user looks at "Not in this prototype" (coin picker).
  alertDraft: AlertDraft | null;
};

export type AlertDraft = { above: boolean; input: string; push: boolean };

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
  send: initialSend(),
  pasteIdx: 0,
  lastSendId: null,
  sendSeq: 0,
  faceId: true,
  hideBalances: false,
  ipadSignedIn: true,
  addedBanks: [],
  alerts: ALERTS,
  alertSeq: 0,
  alertDraft: null,
});

type Store = State & {
  setDraft: (d: BuyDraft) => void;
  setMethod: (m: PayMethod) => void;
  lockQuote: () => void;
  confirmBuy: () => Receipt | null;
  resetBuy: () => void;
  setSendTo: (to: string) => void;
  nextPaste: () => string;
  pickRecipient: (r: RecipientRef) => void;
  setSendAmount: (a: Pick<SendDraft, "mode" | "input" | "units">) => void;
  setSendNote: (note: string) => void;
  confirmSend: () => string | null;
  resetSend: () => void;
  setToggle: (k: "faceId" | "hideBalances", on: boolean) => void;
  signOutIpad: () => void;
  addBank: (iban: string) => void;
  setAlertOn: (id: string, on: boolean) => void;
  addAlert: (a: Omit<Alert, "id">) => void;
  setAlertDraft: (d: AlertDraft | null) => void;
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

  // ── Send ETH ──────────────────────────────────────────────────────────────
  const setSendTo = React.useCallback((to: string) => set((p) => ({ ...p, send: { ...p.send, to, recipient: null } })), [set]);

  // Paste cycles the two agreed demo values: Bitcoin address, then the new ETH address.
  const nextPaste = React.useCallback(() => {
    const v = DEMO_PASTE[ref.current.pasteIdx % DEMO_PASTE.length];
    set((p) => ({ ...p, pasteIdx: p.pasteIdx + 1, send: { ...p.send, to: v, recipient: null } }));
    return v;
  }, [set]);

  // Choosing a recipient starts a fresh amount; Maxim's note is prefilled (agreed).
  const pickRecipient = React.useCallback(
    (r: RecipientRef) =>
      set((p) => ({
        ...p,
        send: {
          ...initialSend(),
          to: r.kind === "address" ? r.address : p.send.to,
          recipient: r,
          note: r.kind === "contact" && r.id === "maxim" ? MAXIM_NOTE : "",
        },
      })),
    [set]
  );

  const setSendAmount = React.useCallback(
    (a: Pick<SendDraft, "mode" | "input" | "units">) => set((p) => ({ ...p, send: { ...p.send, ...a } })),
    [set]
  );
  const setSendNote = React.useCallback((note: string) => set((p) => ({ ...p, send: { ...p.send, note } })), [set]);
  const resetSend = React.useCallback(() => set((p) => ({ ...p, send: initialSend() })), [set]);

  // Profile settings — in memory only, like the rest of the demo.
  const setToggle = React.useCallback((k: "faceId" | "hideBalances", on: boolean) => set((p) => ({ ...p, [k]: on })), [set]);
  const signOutIpad = React.useCallback(() => set((p) => ({ ...p, ipadSignedIn: false })), [set]);
  const addBank = React.useCallback(
    (iban: string) => set((p) => (p.addedBanks.includes(iban) ? p : { ...p, addedBanks: [...p.addedBanks, iban] })),
    [set]
  );
  const setAlertOn = React.useCallback(
    (id: string, on: boolean) => set((p) => ({ ...p, alerts: p.alerts.map((a) => (a.id === id ? { ...a, on } : a)) })),
    [set]
  );
  const addAlert = React.useCallback(
    (a: Omit<Alert, "id">) => set((p) => ({ ...p, alertSeq: p.alertSeq + 1, alerts: [{ ...a, id: `new-${p.alertSeq + 1}` }, ...p.alerts] })),
    [set]
  );
  const setAlertDraft = React.useCallback((d: AlertDraft | null) => set((p) => ({ ...p, alertDraft: d })), [set]);

  // Executes the send once: ETH −(amount + fee), Activity row on top. Returns the
  // row id, or null when the draft isn't sendable (so a double tap can't send twice).
  const confirmSend = React.useCallback((): string | null => {
    let out: string | null = null;
    set((p) => {
      const d = p.send;
      if (!d.recipient || d.units <= 0 || d.units > maxSendUnits(p.holdings)) return p;
      const info = recipientInfo(d.recipient);
      const priceCents = ASSETS.ETH.priceCents;
      const seq = p.sendSeq + 1;
      const id = `send-${seq}`;
      const note = d.note.trim();
      const row: ActivityItem = {
        id,
        day: "today",
        kind: "transfer",
        icon: info.avatar === "wallet" ? "wallet" : info.avatar,
        title: info.title,
        sub: (note ? `“${note}”` : "Ethereum") + ` · ${NOW.time}`,
        asset: "ETH",
        qty: -d.units,
        qtyDp: 4,
        eurCents: valueCents(d.units, priceCents),
        send: {
          recipient: d.recipient,
          toShort: info.short,
          note: note || undefined,
          feeUnits: NETWORK_FEE_UNITS,
          hash: NEW_SEND_HASH,
          date: `${DATE_TODAY} · ${NOW.time}`,
          sentAt: Date.now(),
        },
      };
      out = id;
      return {
        ...p,
        holdings: { ...p.holdings, ETH: p.holdings.ETH - d.units - NETWORK_FEE_UNITS },
        activity: [row, ...p.activity],
        lastSendId: id,
        sendSeq: seq,
        send: initialSend(),
      };
    });
    return out;
  }, [set]);

  const value = React.useMemo(
    () => ({ ...s, setDraft, setMethod, lockQuote, confirmBuy, resetBuy, setSendTo, nextPaste, pickRecipient, setSendAmount, setSendNote, confirmSend, resetSend, setToggle, signOutIpad, addBank, setAlertOn, addAlert, setAlertDraft }),
    [s, setDraft, setMethod, lockQuote, confirmBuy, resetBuy, setSendTo, nextPaste, pickRecipient, setSendAmount, setSendNote, confirmSend, resetSend, setToggle, signOutIpad, addBank, setAlertOn, addAlert, setAlertDraft]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}
