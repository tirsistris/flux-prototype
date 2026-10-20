"use client";
// app/buy/amount/page.tsx — Buy 2 · Amount (Figma 2297:1979 / 2297:2456).
// Keypad entry in € or BTC (unit switch), quick chips 50/100/250/500 €, and the
// "Bitcoin / Flux fee · 1,49 % / You pay" breakdown recomputed on every key.
// Fee is inside the amount: you pay X, fee = round(X × 1,49 %), the rest buys BTC.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { Button, Chip, DetailRow, Divider, Keypad, Note, ScreenHeader, UnitSwitch } from "@/components/ui";
import { IconInfo } from "@/components/icons";
import { eurForUnits, quoteBuy } from "@/lib/money";
import { crypto, eur, eurText, fixed, group, NNBSP, THIN } from "@/lib/format";
import { useStore, type BuyDraft } from "@/lib/store";

const CHIPS = [50, 100, 250, 500];
const LIMITS = { eur: { int: 6, dec: 2 }, btc: { int: 2, dec: 8 } } as const;

/** "12,5" → integer in `scale` decimals (cents or 1e-8 units). */
function parse(input: string, scale: number): number {
  const [i, d = ""] = input.split(",");
  return Number(i || "0") * 10 ** scale + Number((d + "0".repeat(scale)).slice(0, scale));
}

/** Integer value → shortest keypad string ("100", "0,00093161"). */
function toInput(value: number, scale: number): string {
  const s = fixed(value, scale, scale, "");
  return s.includes(",") ? s.replace(/0+$/, "").replace(/,$/, "") : s;
}

/** Whole euros print without decimals in prose ("100 €"), otherwise two. */
const eurShort = (cents: number) => (cents % 100 === 0 ? group(String(cents / 100), NNBSP) + NNBSP + "€" : eurText(cents));

export default function AmountPage() {
  const router = useRouter();
  const { draft, setDraft } = useStore();
  const q = quoteBuy(draft.eurCents);

  const press = (k: string) => {
    const lim = LIMITS[draft.mode];
    let s = draft.input;
    if (k === "del") s = s.length <= 1 ? "0" : s.slice(0, -1);
    else if (k === ",") s = s.includes(",") ? s : s + ",";
    else {
      const [i, d] = s.split(",");
      if (d === undefined && i.length >= lim.int && i !== "0") return;
      if (d !== undefined && d.length >= lim.dec) return;
      s = s === "0" ? k : s + k;
    }
    const eurCents = draft.mode === "eur" ? parse(s, 2) : eurForUnits(parse(s, 8));
    setDraft({ mode: draft.mode, input: s, eurCents });
  };

  const chip = (e: number) => setDraft({ mode: "eur", input: String(e), eurCents: e * 100 });

  // Switching units keeps the amount; only the side being typed changes.
  const toggle = () => {
    const next: BuyDraft =
      draft.mode === "eur"
        ? { mode: "btc", input: toInput(q.units, 8), eurCents: draft.eurCents }
        : { mode: "eur", input: toInput(draft.eurCents, 2), eurCents: draft.eurCents };
    setDraft(next);
  };

  const [iPart, dPart] = draft.input.split(",");
  const typed = group(iPart, THIN) + (dPart !== undefined ? "," + dPart : "");
  const big = typed + THIN + (draft.mode === "eur" ? "€" : "BTC");
  // Geist Mono advance is 0.6 em: shrink the figure so it always fits on one line.
  const fontSize = Math.min(64, Math.floor(361 / (0.6 * big.length)));

  return (
    <Screen
      actions={
        <>
          {/* Keypad is pinned with the button so it stays reachable on short phones. */}
          <div className="amount-keypad">
            <Keypad onKey={press} />
          </div>
          <Button disabled={draft.eurCents <= 0} onClick={() => router.push("/buy/pay")}>
            Continue
          </Button>
        </>
      }
    >
      <ScreenHeader onLeading={() => router.push("/buy")} coin="BTC" title="Buy Bitcoin" />

      <div className="amount">
        <span className="t13 muted">{draft.mode === "eur" ? "You pay" : "You get"}</span>
        <div className="value" style={{ fontSize }} aria-live="polite">
          <Num>{big}</Num>
        </div>
        <UnitSwitch onClick={toggle} label={draft.mode === "eur" ? "Enter amount in Bitcoin" : "Enter amount in euro"}>
          <span>
            {"≈ "}
            {draft.mode === "eur" ? <Num>{crypto(q.units, "BTC", 6)}</Num> : <Num>{eur(draft.eurCents)}</Num>}
          </span>
        </UnitSwitch>
      </div>

      <div className="chips amount-chips">
        {CHIPS.map((c) => (
          <Chip key={c} selected={draft.mode === "eur" && draft.eurCents === c * 100} onClick={() => chip(c)}>
            {c}
            {NNBSP}€
          </Chip>
        ))}
      </div>

      <section className="card breakdown" aria-label="Breakdown">
        <DetailRow label="Bitcoin" value={<Num>{eur(q.netCents)}</Num>} />
        <Divider />
        <DetailRow label={`Flux fee · 1,49${NNBSP}%`} value={<Num>{eur(q.feeCents)}</Num>} />
        <Divider />
        <DetailRow strong label="You pay" value={<Num>{eur(q.eurCents)}</Num>} />
      </section>

      <div className="amount-note">
        <Note icon={<IconInfo />}>The fee is already inside the {eurShort(draft.eurCents)}. Nothing is added later.</Note>
      </div>

    </Screen>
  );
}
