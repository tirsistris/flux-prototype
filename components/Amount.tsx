"use client";
// components/Amount.tsx — shared parts of the pass-B amount screens (Swap 1, Sell 1,
// Withdraw 1, Earn 3, Unstake 1): keypad typing into the store draft, the unit
// switch, chips that set an exact quantity, and the "not enough" block modelled on
// Send · Not enough ETH (2298:2878): red figure, error line, one chip with the max.
import React from "react";
import { Chip } from "@/components/ui";
import { IconWarn } from "@/components/icons";
import { draftFromCents, draftFromInput, draftFromUnits, useStore, type AmountDraft, type Flow } from "@/lib/store";

const LIMITS = { eur: { int: 6, dec: 2 }, crypto: { int: 3, dec: 8 } } as const;

/** Next keypad text, or null when the key is refused (too many digits). */
export function typeKey(s: string, k: string, lim: { int: number; dec: number }): string | null {
  if (k === "del") return s.length <= 1 ? "0" : s.slice(0, -1);
  if (k === ",") return s.includes(",") ? s : s + ",";
  const [i, d] = s.split(",");
  if (d === undefined && i.length >= lim.int && i !== "0") return null;
  if (d !== undefined && d.length >= lim.dec) return null;
  return s === "0" ? k : s + k;
}

export function useAmount(flow: Flow) {
  const { drafts, setAmount } = useStore();
  const d = drafts[flow];
  const press = (k: string) => {
    const s = typeKey(d.input, k, LIMITS[d.mode]);
    if (s !== null) setAmount(flow, draftFromInput(flow, d.mode, s));
  };
  // Switching units keeps the quantity; only the typed side changes.
  const toggle = () => setAmount(flow, draftFromUnits(flow, d.mode === "eur" ? "crypto" : "eur", d.units));
  const setUnits = (units: number) => setAmount(flow, draftFromUnits(flow, d.mode, units));
  const setCents = (cents: number) => setAmount(flow, draftFromCents(cents));
  return { d, press, toggle, setUnits, setCents };
}

/** Geist Mono advance is 0.6 em: shrink so the figure stays on one 361 px line. */
export const fitFont = (text: string, max: number, width = 361) => Math.min(max, Math.floor(width / (0.6 * text.length)));

/** "25 %", "50 %", "Max" of `total` (floor, so a chip never asks for more than there is). */
export function shareChips(total: number) {
  return [
    { label: "25 %", value: Math.floor(total / 4) },
    { label: "50 %", value: Math.floor(total / 2) },
    { label: "Max", value: total },
  ];
}

export function NotEnough({ error, chip, onChip }: { error: React.ReactNode; chip: React.ReactNode; onChip: () => void }) {
  return (
    <>
      <p className="field-error send-error" role="alert">
        <IconWarn />
        {error}
      </p>
      <div className="chips send-chips not-enough">
        <Chip onClick={onChip}>{chip}</Chip>
      </div>
    </>
  );
}

export type { AmountDraft };
