// lib/money.ts — every derived number in the prototype comes from here.
// Integer arithmetic only: euro cents and 1e-8 crypto units. Rounding is half-up.
import { ASSETS, FEE_BP, UNIT, type AssetId, type Holdings } from "@/lib/legend";

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

/** Bitcoin position on the coin screen: cost basis grows by the amount paid (fee included). */
export function btcPosition(units: number, costCents: number) {
  const value = valueCents(units, ASSETS.BTC.priceCents);
  const gain = value - costCents;
  // avg price = cost / BTC, in cents, half-up.
  const avg = Number((B(costCents) * B(UNIT) * 2n + B(units)) / (2n * B(units)));
  // percent with 2 decimals, as hundredths, half-up.
  const pctX100 = Number((B(Math.abs(gain)) * 20_000n + B(costCents)) / (2n * B(costCents)));
  return { value, gain, avgPriceCents: avg, gainPctX100: gain < 0 ? -pctX100 : pctX100 };
}
