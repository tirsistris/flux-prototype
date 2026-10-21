"use client";
// lib/store.tsx — client-only demo state (in memory, like v1: a hard reload resets
// the demo to legend.md). Holds balances, the Activity list, the buy draft carried
// across steps, the live price-locked quote and the last receipt, and the
// Send ETH draft (recipient, amount, note) with the last sent transfer, and the
// Profile settings: toggles, signed-in iPad, added bank accounts, price alerts.
// Pass B: amount drafts for Swap, Sell, Withdraw, Stake and Unstake, the locked
// Swap / Sell quotes and the last receipt of each operation.
import React from "react";
import {
  ACTIVITY,
  ALERTS,
  ASSETS,
  BANK,
  BTC_DETAIL,
  DATE_TODAY,
  DEFAULT_METHOD,
  DEMO_PASTE,
  EARN_ETH,
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
  UNSTAKE_UNLOCKS,
} from "@/lib/legend";
import { costAdd, costAfterSell, costFromAvg, quoteBuy, quoteSell, quoteSwap, unitsFor, valueCents, type BuyQuote, type Cost, type SellQuote, type SwapQuote } from "@/lib/money";
import { cryptoText, NNBSP } from "@/lib/format";
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

/** ETH that is staked or unlocking can't be sent; the rest is available. */
export const ethLocked = (s: Pick<State, "staked" | "unstaking">) => s.staked + s.unstaking;
export const ethAvailable = (s: Pick<State, "holdings" | "staked" | "unstaking">) => Math.max(0, s.holdings.ETH - ethLocked(s));
/** Spendable ETH: available minus the network fee. */
export const maxSendUnits = (s: Pick<State, "holdings" | "staked" | "unstaking">) => Math.max(0, ethAvailable(s) - NETWORK_FEE_UNITS);

// ── Pass B drafts ─────────────────────────────────────────────────────────────
// One shape for every amount screen: what the keypad typed, in which unit, and both
// sides kept consistent (cents ⇄ 1e-8 units) so a chip can set an exact quantity.
export type Flow = "swap" | "sell" | "withdraw" | "stake" | "unstake";
export type AmountDraft = { mode: "eur" | "crypto"; input: string; units: number; cents: number };

const FLOW_PRICE: Record<Flow, number> = {
  swap: ASSETS.BTC.priceCents,
  sell: ASSETS.BTC.priceCents,
  withdraw: 1,
  stake: ASSETS.ETH.priceCents,
  unstake: ASSETS.ETH.priceCents,
};

/** "12,5" → integer in `scale` decimals (cents or 1e-8 units). */
export function parseScaled(input: string, scale: number): number {
  const [i, d = ""] = input.split(",");
  return Number(i || "0") * 10 ** scale + Number((d + "0".repeat(scale)).slice(0, scale));
}
/** Integer value → shortest keypad string ("100", "0,1"). */
export function toKeypad(value: number, scale: number): string {
  const s = String(value).padStart(scale + 1, "0");
  const frac = s.slice(s.length - scale).replace(/0+$/, "");
  return s.slice(0, s.length - scale) + (frac ? "," + frac : "");
}

/** Draft from typed text (`mode` says which side was typed). */
export function draftFromInput(flow: Flow, mode: AmountDraft["mode"], input: string): AmountDraft {
  const price = FLOW_PRICE[flow];
  if (mode === "eur") {
    const cents = parseScaled(input, 2);
    return { mode, input, cents, units: flow === "withdraw" || !cents ? 0 : unitsFor(cents, price) };
  }
  const units = parseScaled(input, 8);
  return { mode, input, units, cents: valueCents(units, price) };
}
/** Draft from an exact quantity (chips, Max); the typed side shows it rounded. */
export function draftFromUnits(flow: Flow, mode: AmountDraft["mode"], units: number): AmountDraft {
  const cents = valueCents(units, FLOW_PRICE[flow]);
  return { mode, units, cents, input: mode === "eur" ? toKeypad(cents, 2) : toKeypad(units, 8) };
}
/** Withdraw: euro only. */
export const draftFromCents = (cents: number): AmountDraft => ({ mode: "eur", units: 0, cents, input: toKeypad(cents, 2) });

// Figma defaults: Swap 0,1 BTC, Sell 250 €, Withdraw 300 €, Stake 500 €, Unstake 0,1 ETH.
const initialDrafts = (): Record<Flow, AmountDraft> => ({
  swap: draftFromInput("swap", "crypto", "0,1"),
  sell: draftFromInput("sell", "eur", "250"),
  withdraw: draftFromInput("withdraw", "eur", "300"),
  stake: draftFromInput("stake", "eur", "500"),
  unstake: draftFromInput("unstake", "crypto", "0,1"),
});

export type Locked<Q> = { q: Q; expiresAt: number; id: number };
export type SwapReceipt = { orderNo: string; q: SwapQuote; ethAfter: number };
export type SellReceipt = { orderNo: string; q: SellQuote; eurAfter: number };
export type WithdrawReceipt = { orderNo: string; cents: number; eurAfter: number };
export type StakeReceipt = { orderNo: string; units: number; stakedAfter: number };
export type UnstakeReceipt = { units: number; time: string };

type State = {
  holdings: Holdings; // ETH here is the whole position, staked and unlocking included
  staked: number; // ETH earning, 1e-8 units (legend 0,2000)
  unstaking: number; // ETH asked back, unlocking until UNSTAKE_UNLOCKS, no rewards
  btcCost: Cost; // exact cost basis of the BTC position incl. fees (Buy 1 screen)
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
  drafts: Record<Flow, AmountDraft>;
  swapLock: Locked<SwapQuote> | null;
  sellLock: Locked<SellQuote> | null;
  swapReceipt: SwapReceipt | null;
  sellReceipt: SellReceipt | null;
  withdrawReceipt: WithdrawReceipt | null;
  stakeReceipt: StakeReceipt | null;
  unstakeReceipt: UnstakeReceipt | null;
};

export type AlertDraft = { above: boolean; input: string; push: boolean };

const initialDraft = (): BuyDraft => ({ mode: "eur", input: "100", eurCents: 10_000 });

const initialState = (): State => ({
  holdings: { ...HOLDINGS },
  staked: ETH_STAKED,
  unstaking: 0,
  btcCost: costFromAvg(HOLDINGS.BTC, BTC_DETAIL.avgBuyPriceCents),
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
  drafts: initialDrafts(),
  swapLock: null,
  sellLock: null,
  swapReceipt: null,
  sellReceipt: null,
  withdrawReceipt: null,
  stakeReceipt: null,
  unstakeReceipt: null,
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
  setAmount: (flow: Flow, d: AmountDraft) => void;
  resetAmount: (flow: Flow) => void;
  lockSwap: () => void;
  lockSell: () => void;
  confirmSwap: () => boolean;
  confirmSell: () => boolean;
  confirmWithdraw: () => boolean;
  confirmStake: () => boolean;
  confirmUnstake: () => boolean;
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
        // A buy from the euro balance is a euro movement too (Cash · Euro RECENT).
        ...(q.method === "euro" ? { cashCents: -q.eurCents, cashSub: `${cryptoText(q.units, "BTC", 6)} · Today, ${NOW.time}` } : {}),
      };
      out = receipt;
      return {
        ...p,
        holdings,
        // Fee is part of the cost (accounting view): cost basis grows by what was paid.
        btcCost: costAdd(p.btcCost, q.eurCents),
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

  // ── Pass B: Swap, Sell, Withdraw, Stake, Unstake ────────────────────────────
  // A new amount drops the locked quote of that flow (Review locks a fresh one).
  const setAmount = React.useCallback(
    (flow: Flow, d: AmountDraft) =>
      set((p) => ({
        ...p,
        drafts: { ...p.drafts, [flow]: d },
        swapLock: flow === "swap" ? null : p.swapLock,
        sellLock: flow === "sell" ? null : p.sellLock,
      })),
    [set]
  );
  const resetAmount = React.useCallback((flow: Flow) => setAmount(flow, initialDrafts()[flow]), [setAmount]);

  // Same rule as Buy: 30 s at the legend price; Refresh locks again at that price.
  const lockSwap = React.useCallback(
    () => set((p) => ({ ...p, swapLock: { q: quoteSwap(p.drafts.swap.units), expiresAt: Date.now() + QUOTE_TTL_MS, id: ++quoteSeq } })),
    [set]
  );
  const lockSell = React.useCallback(
    () =>
      set((p) => ({
        ...p,
        sellLock: { q: quoteSell(p.drafts.sell.cents, p.drafts.sell.units), expiresAt: Date.now() + QUOTE_TTL_MS, id: ++quoteSeq },
      })),
    [set]
  );

  // Each confirm runs once: it checks the lock / balance, then resets the draft, so
  // a second tap returns false and changes nothing.
  const confirmSwap = React.useCallback((): boolean => {
    let ok = false;
    set((p) => {
      const l = p.swapLock;
      if (!l || Date.now() >= l.expiresAt) return p;
      const q = l.q;
      if (q.btcUnits <= 0 || q.btcUnits > p.holdings.BTC || q.ethUnits <= 0) return p;
      const orderNo = p.lastOrder + 1;
      const holdings: Holdings = { ...p.holdings, BTC: p.holdings.BTC - q.btcUnits, ETH: p.holdings.ETH + q.ethUnits };
      const row: ActivityItem = {
        id: `swap-${orderNo}`,
        day: "today",
        kind: "trade",
        icon: "swap",
        title: "Swapped to Ethereum",
        sub: `From ${cryptoText(q.btcUnits, "BTC", 4)} · ${NOW.time}`,
        asset: "ETH",
        qty: q.ethUnits,
        qtyDp: 4,
        eurCents: q.netCents,
      };
      ok = true;
      return {
        ...p,
        holdings,
        // Average-cost method: the BTC that left takes its share of the cost basis.
        btcCost: costAfterSell(p.btcCost, p.holdings.BTC, q.btcUnits),
        activity: [row, ...p.activity],
        lastOrder: orderNo,
        swapLock: null,
        swapReceipt: { orderNo: `FX-${orderNo}`, q, ethAfter: holdings.ETH },
        drafts: { ...p.drafts, swap: initialDrafts().swap },
      };
    });
    return ok;
  }, [set]);

  const confirmSell = React.useCallback((): boolean => {
    let ok = false;
    set((p) => {
      const l = p.sellLock;
      if (!l || Date.now() >= l.expiresAt) return p;
      const q = l.q;
      if (q.units <= 0 || q.units > p.holdings.BTC || q.getCents <= 0) return p;
      const orderNo = p.lastOrder + 1;
      const holdings: Holdings = { ...p.holdings, BTC: p.holdings.BTC - q.units, eurCents: p.holdings.eurCents + q.getCents };
      const row: ActivityItem = {
        id: `sell-${orderNo}`,
        day: "today",
        kind: "trade",
        icon: "sell",
        title: "Sold Bitcoin",
        sub: `To Euro balance · ${NOW.time}`,
        asset: "BTC",
        qty: -q.units,
        qtyDp: 6,
        eurCents: q.getCents,
        cashCents: q.getCents,
        cashSub: `${cryptoText(q.units, "BTC", 6)} · Today, ${NOW.time}`,
      };
      ok = true;
      return {
        ...p,
        holdings,
        btcCost: costAfterSell(p.btcCost, p.holdings.BTC, q.units),
        activity: [row, ...p.activity],
        lastOrder: orderNo,
        sellLock: null,
        sellReceipt: { orderNo: `FX-${orderNo}`, q, eurAfter: holdings.eurCents },
        drafts: { ...p.drafts, sell: initialDrafts().sell },
      };
    });
    return ok;
  }, [set]);

  const confirmWithdraw = React.useCallback((): boolean => {
    let ok = false;
    set((p) => {
      const cents = p.drafts.withdraw.cents;
      if (cents <= 0 || cents > p.holdings.eurCents) return p;
      const orderNo = p.lastOrder + 1;
      const eurAfter = p.holdings.eurCents - cents;
      const row: ActivityItem = {
        id: `withdraw-${orderNo}`,
        day: "today",
        kind: "transfer",
        icon: "bank",
        title: "Withdrawn to bank",
        sub: `${BANK.name} · ${NOW.time}`,
        eurCents: -cents,
        cashCents: -cents,
        cashSub: `${BANK.name} · Today, ${NOW.time}`,
      };
      ok = true;
      return {
        ...p,
        holdings: { ...p.holdings, eurCents: eurAfter },
        activity: [row, ...p.activity],
        lastOrder: orderNo,
        withdrawReceipt: { orderNo: `FX-${orderNo}`, cents, eurAfter },
        drafts: { ...p.drafts, withdraw: initialDrafts().withdraw },
      };
    });
    return ok;
  }, [set]);

  const confirmStake = React.useCallback((): boolean => {
    let ok = false;
    set((p) => {
      const d = p.drafts.stake;
      if (d.units <= 0 || d.units > ethAvailable(p)) return p;
      const orderNo = p.lastOrder + 1;
      const stakedAfter = p.staked + d.units;
      const row: ActivityItem = {
        id: `stake-${orderNo}`,
        day: "today",
        kind: "earn",
        icon: "earn",
        title: "Staked Ethereum",
        sub: `Earning ${EARN_ETH.apy}${NNBSP}% · ${NOW.time}`,
        asset: "ETH",
        qty: d.units,
        qtyDp: 4,
        eurCents: d.cents,
        plain: true,
      };
      ok = true;
      return {
        ...p,
        staked: stakedAfter,
        activity: [row, ...p.activity],
        lastOrder: orderNo,
        stakeReceipt: { orderNo: `FX-${orderNo}`, units: d.units, stakedAfter },
        drafts: { ...p.drafts, stake: initialDrafts().stake },
      };
    });
    return ok;
  }, [set]);

  // Unstaking moves ETH from staked to unlocking (no rewards, can't be sent); a
  // second request adds to the same unlock date (agreed).
  const confirmUnstake = React.useCallback((): boolean => {
    let ok = false;
    set((p) => {
      const d = p.drafts.unstake;
      if (d.units <= 0 || d.units > p.staked) return p;
      const row: ActivityItem = {
        id: `unstake-${p.activity.length + 1}`,
        day: "today",
        kind: "earn",
        icon: "unstake",
        title: "Unstaking Ethereum",
        sub: `Unlocks around ${UNSTAKE_UNLOCKS}`,
        asset: "ETH",
        qty: d.units,
        qtyDp: 4,
        eurCents: d.cents,
        plain: true,
      };
      ok = true;
      return {
        ...p,
        staked: p.staked - d.units,
        unstaking: p.unstaking + d.units,
        activity: [row, ...p.activity],
        unstakeReceipt: { units: d.units, time: NOW.time },
        drafts: { ...p.drafts, unstake: initialDrafts().unstake },
      };
    });
    return ok;
  }, [set]);

  // Executes the send once: ETH −(amount + fee), Activity row on top. Returns the
  // row id, or null when the draft isn't sendable (so a double tap can't send twice).
  const confirmSend = React.useCallback((): string | null => {
    let out: string | null = null;
    set((p) => {
      const d = p.send;
      if (!d.recipient || d.units <= 0 || d.units > maxSendUnits(p)) return p;
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
    () => ({ ...s, setDraft, setMethod, lockQuote, confirmBuy, resetBuy, setSendTo, nextPaste, pickRecipient, setSendAmount, setSendNote, confirmSend, resetSend, setToggle, signOutIpad, addBank, setAlertOn, addAlert, setAlertDraft, setAmount, resetAmount, lockSwap, lockSell, confirmSwap, confirmSell, confirmWithdraw, confirmStake, confirmUnstake }),
    [s, setDraft, setMethod, lockQuote, confirmBuy, resetBuy, setSendTo, nextPaste, pickRecipient, setSendAmount, setSendNote, confirmSend, resetSend, setToggle, signOutIpad, addBank, setAlertOn, addAlert, setAlertDraft, setAmount, resetAmount, lockSwap, lockSell, confirmSwap, confirmSell, confirmWithdraw, confirmStake, confirmUnstake]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const c = React.useContext(Ctx);
  if (!c) throw new Error("useStore must be used within StoreProvider");
  return c;
}
