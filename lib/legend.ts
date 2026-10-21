// lib/legend.ts — legend.md as typed data. legend.md stays the single source of
// truth; every number here is copied from it (or, where marked "Figma", from the
// Flux · Final frames and cross-checked against legend.md). Nothing is computed
// "by eye": money is integer euro cents, crypto quantities are integer units of
// 1e-8 (satoshi for BTC), and anything derived goes through lib/money.ts.

export type AssetId = "BTC" | "ETH" | "SOL";

export type Asset = {
  id: AssetId;
  name: string;
  priceCents: number; // EUR price per 1 unit
  changePct: string; // 24h change exactly as legend.md prints it
  changeUp: boolean;
};

/** Crypto quantities are stored in 1e-8 units. */
export const UNIT = 100_000_000;

// "Prices: BTC 105 741,12 € +2,1 % | ETH 3 553,94 € −0,18 % | SOL 159,36 € +3,4 %"
export const ASSETS: Record<AssetId, Asset> = {
  BTC: { id: "BTC", name: "Bitcoin", priceCents: 10_574_112, changePct: "2,1", changeUp: true },
  ETH: { id: "ETH", name: "Ethereum", priceCents: 355_394, changePct: "0,18", changeUp: false },
  SOL: { id: "SOL", name: "Solana", priceCents: 15_936, changePct: "3,4", changeUp: true },
};

// "Now: Mon 19 Oct, 6:19 (status bar fixed)."
export const NOW = {
  time: "6:19",
  dateLong: "Monday, 19 October",
};

// "Persona Mila Orlova (mila.orlova@gmail.com) (+ Maxim Petrov, Anna Volkova), Belgrade."
export const PERSONA = {
  first: "Mila",
  last: "Orlova",
  email: "mila.orlova@gmail.com",
  city: "Belgrade",
};

export const CONTACTS = {
  maxim: { first: "Maxim", last: "Petrov" },
  anna: { first: "Anna", last: "Volkova", initials: "AV" },
};

// "Holdings: EUR cash 500,00 € | BTC 0,2105 = 22 258,51 € | ETH 0,6200 = 2 203,44 €
//  (0,4200 avail + 0,2000 staked) | SOL 2,4322 = 387,60 €. Total 25 349,55 €."
// These holdings already include the 6:12 Apple Pay buy listed in Activity.
export type Holdings = { eurCents: number } & Record<AssetId, number>;

export const HOLDINGS: Holdings = {
  eurCents: 50_000,
  BTC: 21_050_000, // 0,2105 BTC
  ETH: 62_000_000, // 0,6200 ETH
  SOL: 243_220_000, // 2,4322 SOL
};

export const ETH_STAKED = 20_000_000; // 0,2000 ETH — "0,2 earning" on Home

// "Today +466,59 € (+1,88 %)." — fixed for the session; a buy is not a gain.
export const TODAY = { absCents: 46_659, pct: "1,88" };

// "Buy/Sell fee label 'Flux fee · 1,49 %'" — fee is inside the amount paid.
export const FEE_BP = 149; // basis points of the gross amount

// Receipt numbering: Figma Buy 5 shows FX-20481 for the 6:12 buy; next is 20482.
export const LAST_ORDER_NO = 20_481;

// Price lock on Review (agreed: 30 seconds).
export const QUOTE_TTL_MS = 30_000;

// Bitcoin screen (Buy 1) — Figma 2297:1848, not in legend.md, cross-checked:
// avg price 96 699,71 € × 0,2105 BTC = 20 355,29 € cost → +1 903,22 € (+9,35 %),
// and +2 174,89 € today = 105 741,12 × 2,1 % / 102,1 %.
export const BTC_DETAIL = {
  avgBuyPriceCents: 9_669_971,
  todayAbsCents: 217_489,
  high24h: "106 212",
  low24h: "103 140",
  volume24h: "38,4 B",
};

export type PayMethod = "euro" | "apple" | "visa" | "bank";

export const PAY_METHODS: Record<PayMethod, { label: string; sub: string; selectable: boolean }> = {
  euro: { label: "Euro balance", sub: "available · instant", selectable: true },
  apple: { label: "Apple Pay", sub: "Instant · last used", selectable: true },
  visa: { label: "Visa •••• 4242", sub: "Instant", selectable: true },
  // Agreed: shown but not selectable — no design for a deferred-price purchase.
  bank: { label: "Bank transfer", sub: "1–2 days · price set when money arrives", selectable: false },
};

// "Pay with default Apple Pay = last used."
export const DEFAULT_METHOD: PayMethod = "apple";

// Activity — values at the time of each operation ("History values at time of tx").
export type ActivityKind = "trade" | "transfer" | "earn";
export type ActivityIcon = "buy" | "earn" | "bank" | "maxim" | "anna" | "wallet";

// Outgoing transfer details, shown on Transaction · Detail (Figma 2300:3713).
export type SendDetail = {
  recipient: RecipientRef;
  toShort: string; // "0x7a3f…c41e"
  note?: string;
  feeUnits: number;
  hash: string; // short form only — legend.md / Figma have no full hashes
  date: string; // "Sun, 18 Oct · 19:12"
  sentAt: number | null; // ms timestamp of a prototype send; null = long settled
};

export type ActivityItem = {
  id: string;
  day: "today" | "yesterday" | "fri16";
  kind: ActivityKind;
  icon: ActivityIcon;
  title: string;
  sub: string;
  // Crypto leg (absent for pure euro rows). qty in 1e-8 units, signed.
  asset?: AssetId;
  qty?: number;
  qtyDp?: number;
  // Euro amount at the time of the operation, in cents, signed when it is the
  // primary amount (euro-only rows), otherwise unsigned secondary line.
  eurCents: number;
  send?: SendDetail;
};

export const ACTIVITY: ActivityItem[] = [
  // "Buy today 6:12 Apple Pay 100 € → 0,000932 BTC" (exact: 0,00093161 BTC)
  { id: "buy-0612", day: "today", kind: "trade", icon: "buy", title: "Bought Bitcoin", sub: "Apple Pay · 6:12", asset: "BTC", qty: 93_161, qtyDp: 6, eurCents: 10_000 },
  // "7-day rewards 0,000100 ETH = 0,35 €"
  { id: "earn-7d", day: "today", kind: "earn", icon: "earn", title: "Staking rewards", sub: "Last 7 days · paid daily", asset: "ETH", qty: 10_000, qtyDp: 6, eurCents: 35 },
  // "Maxim −0,0500 ETH = 178,02 € then"
  // "Maxim tx yesterday fee 0,0001 ETH 0,36 €"; date, hash and address from Figma 2300:3713.
  {
    id: "maxim", day: "yesterday", kind: "transfer", icon: "maxim", title: "Maxim Petrov", sub: "“Dinner split” · 19:12",
    asset: "ETH", qty: -5_000_000, qtyDp: 4, eurCents: 17_802,
    send: { recipient: { kind: "contact", id: "maxim" }, toShort: "0x7a3f…c41e", note: "Dinner split", feeUnits: 10_000, hash: "0x51d0…9e3a", date: "Sun, 18 Oct · 19:12", sentAt: null },
  },
  // "Anna +0,5000 SOL = 77,06 € then"
  { id: "anna", day: "yesterday", kind: "transfer", icon: "anna", title: "Anna Volkova", sub: "“Concert tickets” · 12:40", asset: "SOL", qty: 50_000_000, qtyDp: 4, eurCents: 7_706 },
  // Figma Activity 2312:6011: Added money, Raiffeisen banka · SEPA, +500,00 €
  { id: "added", day: "fri16", kind: "transfer", icon: "bank", title: "Added money", sub: "Raiffeisen banka · SEPA", eurCents: 50_000 },
];

export const DAY_LABEL: Record<ActivityItem["day"], string> = {
  today: "TODAY",
  yesterday: "YESTERDAY",
  fri16: "FRI, 16 OCT",
};

// ── Send ETH (step 2) ────────────────────────────────────────────────────────
// "Send: 0,3 ETH to Maxim = 1 066,18 €, network fee 0,0001 ETH 0,36 €, total 0,3001 ETH 1 066,54 €."
// "Send max after fee: 0,4199 ETH." Available = 0,6200 − 0,2000 staked = 0,4200 ETH.
export const NETWORK_FEE_UNITS = 10_000; // 0,0001 ETH
export const DATE_TODAY = "Mon, 19 Oct"; // legend "Now: Mon 19 Oct, 6:19"

export type ContactId = "maxim" | "anna" | "ledger";
export type RecipientRef = { kind: "contact"; id: ContactId } | { kind: "address"; address: string };

// Send 1 · To (Figma 2298:2457). Only the short addresses exist in the design.
export const SEND_CONTACTS: Record<ContactId, { name: string; short: string; first: string; tag?: string; own?: boolean }> = {
  maxim: { name: "Maxim Petrov", first: "Maxim", short: "0x7a3f…c41e" },
  anna: { name: "Anna Volkova", first: "Anna", short: "0x19be…77d0" },
  ledger: { name: "My Ledger", first: "My Ledger", short: "0x88cd…1d10", tag: "your hardware wallet", own: true },
};

// Paste cycles through these two demo values (agreed); the second is legend's
// "New address full: 0x91c4 a07e 3b5d 92f1 c8e6 04ab 7d29 e5f0 13c8 7be2".
export const DEMO_PASTE = [
  "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  "0x91c4a07e3b5d92f1c8e604ab7d29e5f013c87be2",
];

// Hash for every prototype send (Figma Send 4 · Sent 2298:2785) — agreed.
export const NEW_SEND_HASH = "0x9c4e…a71b";

// Maxim's note in Figma Send 2 (prefilled for Maxim only — agreed).
export const MAXIM_NOTE = "Rent · October";

// Sent → status flips from "Confirming…" to "Completed" after this long.
export const CONFIRM_MS = 4_000;
