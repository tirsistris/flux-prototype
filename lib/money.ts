// lib/money.ts — every derived number in the prototype comes from here.
// Integer arithmetic only: euro cents and 1e-8 crypto units. Rounding is half-up.
import { fixed, THIN } from "@/lib/format";
import { ASSETS, FEE_BP, SWAP_FEE_CENTS, SWAP_SPREAD_BP, UNIT, type AssetId, type Holdings } from "@/lib/legend";

const B = BigInt;

/** fee_cents = Math.round(eur_cents × 149 / 10000) — the agreed formula. */
export function feeCents(eurCents: number): number {
  return Math.round((eurCents * FEE_BP) / 10_000);
}

/** round8(net / price): crypto units bought for `netCents` at `priceCents`. */
export function unitsFor(netCents: number, priceCents: number): number {
  // (net × 1e8 + price/2) / price, half-up, in BigInt to stay exact.
  const n = B(netCents) * B(UNIT) * 2n + B(priceCents);
  return Number(n / (2n * B(priceCents)));
}

/** round2(units × price): value of a position in cents, from the exact quantity. */
export function valueCents(units: number, priceCents: number): number {
  const n = B(units) * B(priceCents) * 2n + B(UNIT);
  return Number(n / (2n * B(UNIT)));
}

/** Staking estimate: a year = round2(value × APY), a day = round2(year / 365). APY in tenths of a percent. */
export function stakeEstimate(valueCentsNow: number, apyX1000: number) {
  const yearCents = Math.round((valueCentsNow * apyX1000) / 1_000);
  return { yearCents, dayCents: Math.round(yearCents / 365) };
}

export type BuyQuote = {
  eurCents: number; // what the user pays (fee included)
  feeCents: number;
  netCents: number; // what buys Bitcoin
  units: number; // BTC in satoshi
  priceCents: number;
};

export function quoteBuy(eurCents: number, asset: AssetId = "BTC"): BuyQuote {
  const priceCents = ASSETS[asset].priceCents;
  const fee = feeCents(eurCents);
  const net = eurCents - fee;
  return { eurCents, feeCents: fee, netCents: net, units: unitsFor(net, priceCents), priceCents };
}

/** Smallest euro amount whose quote delivers at least `units` (BTC entry mode). */
export function eurForUnits(units: number, asset: AssetId = "BTC"): number {
  if (units <= 0) return 0;
  const priceCents = ASSETS[asset].priceCents;
  // First estimate from the inverse formula, then walk to the exact boundary.
  let eur = Math.ceil(((units * priceCents) / UNIT) / (1 - FEE_BP / 10_000));
  while (eur > 1 && quoteBuy(eur - 1, asset).units >= units) eur--;
  while (quoteBuy(eur, asset).units < units) eur++;
  return eur;
}

/** Position values and the Home total: sum of already-rounded position values. */
export function portfolio(h: Holdings) {
  const btc = valueCents(h.BTC, ASSETS.BTC.priceCents);
  const eth = valueCents(h.ETH, ASSETS.ETH.priceCents);
  const sol = valueCents(h.SOL, ASSETS.SOL.priceCents);
  return { eur: h.eurCents, btc, eth, sol, total: h.eurCents + btc + eth + sol };
}

// ── BTC cost basis, kept exact ───────────────────────────────────────────────
// The cost is a fraction of cents (n / d, BigInt) and is rounded only for display,
// so the average price never moves on a sale or a swap (average-cost method).
export type Cost = { n: bigint; d: bigint };

const gcd = (a: bigint, b: bigint): bigint => (b === 0n ? (a < 0n ? -a : a) : gcd(b, a % b));
const reduce = (c: Cost): Cost => {
  const g = gcd(c.n, c.d) || 1n;
  return { n: c.n / g, d: c.d / g };
};
/** half-up a / b for non-negative b. */
const roundDiv = (a: bigint, b: bigint): bigint => (a >= 0n ? (2n * a + b) / (2n * b) : -((-2n * a + b) / (2n * b)));

/** legend: 0,2105 BTC bought at 96 699,71 € on average → cost = avg × BTC, exactly. */
export const costFromAvg = (units: number, avgCents: number): Cost => reduce({ n: B(units) * B(avgCents), d: B(UNIT) });
/** A buy adds what was paid, fee included. */
export const costAdd = (c: Cost, cents: number): Cost => reduce({ n: c.n + B(cents) * c.d, d: c.d });
/** A sale or swap keeps (held − sold) / held of the cost: the average stays the same. */
export function costAfterSell(c: Cost, units: number, soldUnits: number): Cost {
  if (soldUnits >= units) return { n: 0n, d: 1n };
  return reduce({ n: c.n * B(units - soldUnits), d: c.d * B(units) });
}
export const costCents = (c: Cost) => Number(roundDiv(c.n, c.d));

/** Bitcoin position on the coin screen: value, gain, average price and gain %. */
export function btcPosition(units: number, cost: Cost) {
  const value = valueCents(units, ASSETS.BTC.priceCents);
  if (units <= 0 || cost.n <= 0n) return { value, gain: 0, avgPriceCents: 0, gainPctX100: 0 };
  // gain = value − cost, avg = cost / BTC, % = gain / cost — each rounded once, half-up.
  const gainN = B(value) * cost.d - cost.n; // gain × d
  const gain = Number(roundDiv(gainN, cost.d));
  const avg = Number(roundDiv(cost.n * B(UNIT), cost.d * B(units)));
  const pctX100 = Number(roundDiv(gainN * 10_000n, cost.n));
  return { value, gain, avgPriceCents: avg, gainPctX100: pctX100 };
}

// ── Swap BTC → ETH ──────────────────────────────────────────────────────────
// value = round2(BTC × price); spread = round(value × 0,24 %); fee = 1,90 €;
// what buys ETH = value − spread − fee; ETH = round8(net / ETH price).
export type SwapQuote = { btcUnits: number; valueCents: number; spreadCents: number; feeCents: number; netCents: number; ethUnits: number };

export function quoteSwap(btcUnits: number): SwapQuote {
  const value = valueCents(btcUnits, ASSETS.BTC.priceCents);
  const spread = Math.round((value * SWAP_SPREAD_BP) / 10_000);
  const net = Math.max(0, value - spread - SWAP_FEE_CENTS);
  return { btcUnits, valueCents: value, spreadCents: spread, feeCents: SWAP_FEE_CENTS, netCents: net, ethUnits: net ? unitsFor(net, ASSETS.ETH.priceCents) : 0 };
}

/** Rate in 1e-4 ETH per BTC, half-up: market 29,7532, or "after all fees" from a quote. */
export const marketRateX1e4 = () => Math.round((ASSETS.BTC.priceCents * 10_000) / ASSETS.ETH.priceCents);
/** "1 BTC = 29,7532 ETH" in mono spacing (Swap 2, Swap 3). */
export const marketRateText = () => `1${THIN}BTC = ${fixed(marketRateX1e4(), 4, 4, THIN)}${THIN}ETH`;
export const effectiveRateX1e4 = (q: SwapQuote) =>
  Number((B(q.ethUnits) * 10_000n * 2n + B(q.btcUnits)) / (2n * B(q.btcUnits)));

// ── Sell BTC → euro balance ─────────────────────────────────────────────────
// Typed in euro: BTC = round8(gross / price). Typed in BTC or picked with a chip
// (Max = the whole position): gross = round2(BTC × price). Either way fee =
// round(gross × 1,49 %) and the euro balance gets gross − fee.
export type SellQuote = { grossCents: number; units: number; feeCents: number; getCents: number };

export function quoteSell(grossCents: number, units: number): SellQuote {
  const fee = feeCents(grossCents);
  return { grossCents, units, feeCents: fee, getCents: grossCents - fee };
}

// ── ETH staking, from the staked quantity ───────────────────────────────────
// value = round2(staked × price); a year = round2(value × 2,6 %); a day = round2(year / 365);
// next reward = round8(staked × 2,6 % / 365).
export const ETH_APY_X1000 = 26; // 2,6 % (legend "2,6 % net"; EARN_ETH.apy is the label)
export function ethStake(stakedUnits: number) {
  const value = valueCents(stakedUnits, ASSETS.ETH.priceCents);
  const { yearCents, dayCents } = stakeEstimate(value, ETH_APY_X1000);
  const nextRewardUnits = Number((B(stakedUnits) * B(ETH_APY_X1000) * 2n + 365_000n) / (2n * 365_000n));
  return { valueCents: value, yearCents, dayCents, nextRewardUnits };
}
