// lib/alerts.ts — price-alert figures. The distance is target ÷ current price − 1,
// in hundredths of a percent, half-up ("BTC > 110 000 € (+4,03 %)" in legend.md).
import { ASSETS, type Alert } from "@/lib/legend";
import { fixed, NNBSP, pctX100 } from "@/lib/format";

export function awayX100(targetCents: number, priceCents: number): number {
  return Math.round(((targetCents - priceCents) * 10_000) / priceCents);
}

/** "110 000 €" — whole euros unless the target has cents. */
export function targetText(cents: number, sep = NNBSP): string {
  return fixed(cents, 2, cents % 100 === 0 ? 0 : 2, sep) + sep + "€";
}

export function alertTitle(a: Alert): string {
  return `${ASSETS[a.asset].name} ${a.above ? "above" : "below"} ${targetText(a.targetCents)}`;
}

export function alertSub(a: Alert): string {
  return `${pctX100(awayX100(a.targetCents, ASSETS[a.asset].priceCents), NNBSP)} away · ${a.on ? "push" : "paused"}`;
}
