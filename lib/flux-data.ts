// flux-data.ts — single source of truth for Flux, ported verbatim from the
// design export data.js. EUR everywhere, European number format: thousands
// separator = no-break space (U+00A0), decimal = comma, and a narrow no-break
// space (U+202F) before the €/% sign. Crypto-only.

export function fmtNum(n: number, dec = 2): string {
  const neg = n < 0;
  const fixed = Math.abs(n).toFixed(dec);
  const parts = fixed.split(".");
  let int = parts[0];
  const frac = parts[1];
  int = int.replace(/\B(?=(\d{3})+(?!\d))/g, " "); // thousands = U+00A0
  return (neg ? "-" : "") + int + (dec ? "," + frac : "");
}

export const eur = (n: number, dec = 2) => fmtNum(n, dec) + " €";
export const pct = (n: number, dec = 2) =>
  (n >= 0 ? "+" : "") + fmtNum(n, dec) + " %";
export const signEur = (n: number, dec = 2) =>
  (n >= 0 ? "+" : "") + fmtNum(n, dec) + " €";

// Single crypto-amount format used everywhere a coin quantity is shown (buy
// confirm/success + tx detail) so one transaction reads identically in all three.
// 6 dp = the quantity the user actually bought; keeps significant precision for
// seed amounts (ETH 0,011987 / XRP 0,005746) without padding ugly trailing zeros.
export const fmtCrypto = (n: number) => fmtNum(n, 6);

// Formats a Date into the same string shape the seed txs use: "DD.MM.YY, HH:MM".
// Used when injecting a freshly-created transaction (phase 2b) so an injected
// row is indistinguishable in form from the seed rows Wallet renders.
export function fmtTxDate(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${String(d.getFullYear()).slice(-2)}, ${p(d.getHours())}:${p(d.getMinutes())}`;
}

export type Coin = {
  id: string;
  name: string;
  sym: string;
  price: number;
  ch: number;
  supply: string;
  spark: number[];
};

export type TxType = "buy" | "received" | "sent" | "swap";

export type Tx = {
  // Wallet-render fields (the original seed shape — TxRow reads exactly these):
  coin: string;
  name: string;
  amt: number; // signed EUR: + = in (buy/receive), − = out (sell/send)
  date: string;
  ago: string;
  // 2b superset — populated on store txs; raw FLUX.txs seeds omit these:
  id?: string; // store assigns: `seed-N` for seeds, `tx-<ts>` for injected
  type?: TxType; // explicit for injected buys; seeds fall back to amt sign
  cryptoAmount?: number; // injected buys carry the exact crypto amount
  feeEur?: number; // injected buys carry the fee; seeds have none → detail hides the row
};

export type Earn = {
  coin: string;
  apy: number;
  earned: number;
  name?: string;
  sym?: string;
};

// canonical prices (EUR) — identical on every screen
export const COINS_DATA: Record<string, Coin> = {
  btc: { id: "btc", name: "Bitcoin", sym: "BTC", price: 105741.12, ch: 9.35, supply: "19,6M BTC", spark: [38, 42, 40, 46, 44, 52, 49, 58, 55, 66, 63, 72] },
  eth: { id: "eth", name: "Ethereum", sym: "ETH", price: 3553.94, ch: 4.77, supply: "120,2M ETH", spark: [30, 33, 31, 36, 34, 33, 38, 37, 42, 40, 45, 47] },
  sol: { id: "sol", name: "Solana", sym: "SOL", price: 159.36, ch: -1.34, supply: "447,7M SOL", spark: [52, 50, 53, 48, 46, 49, 45, 47, 43, 44, 41, 40] },
  xrp: { id: "xrp", name: "XRP", sym: "XRP", price: 2424.55, ch: 0.28, supply: "53,9B XRP", spark: [40, 41, 40, 42, 41, 43, 42, 44, 43, 44, 44, 45] },
  zec: { id: "zec", name: "Zcash", sym: "ZEC", price: 481.33, ch: -1.44, supply: "16,3M ZEC", spark: [50, 49, 51, 47, 48, 45, 46, 44, 45, 42, 43, 41] },
  uni: { id: "uni", name: "Uniswap", sym: "UNI", price: 8544.4, ch: -0.63, supply: "753,8M UNI", spark: [46, 47, 45, 46, 44, 45, 43, 44, 45, 43, 44, 43] },
  ltc: { id: "ltc", name: "Litecoin", sym: "LTC", price: 92.18, ch: 2.04, supply: "74,8M LTC", spark: [40, 41, 43, 42, 45, 44, 47, 46, 49, 48, 51, 53] },
};

export const FLUX = {
  user: { name: "Nikola Jokić", first: "Nikola", email: "nikola@flux.app" },
  balance: 24849.55, // identical on Home & Wallet
  dayAbs: 1384.54,
  dayPct: 5.9,
  coins: COINS_DATA,
  // 90-day-ish portfolio curve for Wallet/Trade area chart
  curve: [42, 44, 43, 47, 46, 45, 49, 48, 52, 50, 49, 53, 55, 54, 58, 57, 61, 60, 59, 63, 66, 64, 68, 67, 71, 70, 74, 73, 77, 80],
  txs: [
    { coin: "xrp", name: "XRP", amt: -13.93, date: "24.11.25, 13:34", ago: "1 hour ago" },
    { coin: "sol", name: "Solana", amt: 325.06, date: "25.11.25, 08:46", ago: "2 hours ago" },
    { coin: "uni", name: "Uniswap", amt: -125.0, date: "01.12.25, 09:12", ago: "3 hours ago" },
    { coin: "btc", name: "Bitcoin", amt: 250.0, date: "30.11.25, 11:44", ago: "5 hours ago" },
    { coin: "eth", name: "Ethereum", amt: -42.6, date: "29.11.25, 18:03", ago: "1 day ago" },
  ] as Tx[],
  earn: [
    { coin: "eth", apy: 4.2, earned: 119.2 },
    { coin: "btc", apy: 3.1, earned: 152.56 },
    { coin: "sol", apy: 5.8, earned: 58.04 },
    { coin: "usdc", apy: 6.5, earned: 84.1, name: "USDC", sym: "USDC" },
  ] as Earn[],
};

// Per-coin modelled detail data for the coin screen. A coin is present here ONLY
// when we actually have numbers to show for it — the demo does not model holdings
// or per-coin market stats generically, so btc is the single modelled coin. The
// coin screen renders the stats grid / "Your balance" / About sections *only* when
// its id is in this map; absent coins show header+price+change+chart+CTA and
// nothing invented (no "0 ETH", no placeholder cap/vol). BTC's values are the ones
// previously hardcoded inline in /coin/btc — lifted here so they live in one place.
export type CoinDetail = {
  holdAmt: number; // demo holding shown in "Your balance"
  marketCap: string; // pre-formatted (T/Mrd magnitudes have no generic formatter)
  volume: string; // pre-formatted 24h volume
  high: number; // 24h high (EUR) — rendered via eur()
  low: number; // 24h low (EUR) — rendered via eur()
  about: string; // "About {name}" body (the trailing "Read more" link is added in JSX)
};

export const COIN_DETAIL: Record<string, CoinDetail> = {
  btc: {
    holdAmt: 0.2105,
    marketCap: "2,07 T €",
    volume: "38,4 Mrd €",
    high: 108240,
    low: 101920,
    about:
      "Bitcoin is the original cryptocurrency — digital money you can send to anyone, " +
      "anywhere, without a bank in the middle. It’s the most widely held coin on Flux and " +
      "a simple first step into crypto.",
  },
};

export const GROWTH = "#4ADE80";
export const FALL = "#F87171";
export const chColor = (n: number) => (n >= 0 ? GROWTH : FALL);
