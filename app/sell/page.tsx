"use client";
// app/sell/page.tsx — Sell 1 · Amount (Figma 2316:6280 / 2316:6879). Typed in € or
// BTC (unit switch); chips 25 % / 50 % / Max of the BTC position set an exact
// quantity. Fee = round(gross × 1,49 %), the rest goes to the euro balance. More
// than the position is the agreed "not enough" state.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { fitFont, NotEnough, shareChips, useAmount } from "@/components/Amount";
import { Button, Chip, DetailRow, Divider, Keypad, Note, ScreenHeader, UnitSwitch } from "@/components/ui";
import { IconInfo } from "@/components/icons";
import { quoteSell, valueCents } from "@/lib/money";
import { ASSETS } from "@/lib/legend";
import { crypto, cryptoText, eur, eurText, group, NNBSP, THIN } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function SellAmountPage() {
  const router = useRouter();
  const { holdings } = useStore();
  const { d, press, toggle, setUnits } = useAmount("sell");
  const q = quoteSell(d.cents, d.units);
  const tooMuch = d.units > holdings.BTC;
  const allCents = valueCents(holdings.BTC, ASSETS.BTC.priceCents);

  const [iPart, dPart] = d.input.split(",");
  const typed = group(iPart, THIN) + (dPart !== undefined ? "," + dPart : "");
  const big = typed + THIN + (d.mode === "eur" ? "€" : "BTC");

  return (
    <Screen
      actions={
        <>
          <div className="amount-keypad">
            <Keypad onKey={press} />
          </div>
          <Button disabled={tooMuch || d.units <= 0 || q.getCents <= 0} onClick={() => router.push("/sell/review")}>
            Continue
          </Button>
        </>
      }
    >
      <ScreenHeader onLeading={() => router.push("/buy")} coin="BTC" title="Sell Bitcoin" />

      <div className="amount">
        <span className="t13 muted">You sell</span>
        <div className={"value" + (tooMuch ? " loss" : "")} style={{ fontSize: fitFont(big, 64) }} aria-live="polite">
          <Num>{big}</Num>
        </div>
        <UnitSwitch onClick={toggle} label={d.mode === "eur" ? "Enter amount in Bitcoin" : "Enter amount in euro"}>
          <span>
            {"≈ "}
            {d.mode === "eur" ? <Num>{crypto(d.units, "BTC", 6)}</Num> : <Num>{eur(d.cents)}</Num>}
          </span>
        </UnitSwitch>
      </div>

      {tooMuch ? (
        <NotEnough
          error={<>Up to {eurText(allCents)} — that’s all your {cryptoText(holdings.BTC, "BTC", 4)}</>}
          chip={<>Sell all · {eurText(allCents)}</>}
          onChip={() => setUnits(holdings.BTC)}
        />
      ) : (
        <div className="chips amount-chips">
          {shareChips(holdings.BTC).map((c) => (
            <Chip key={c.label} selected={d.units === c.value && d.units > 0} onClick={() => setUnits(c.value)}>
              {c.label}
            </Chip>
          ))}
        </div>
      )}

      <section className="card breakdown sell-breakdown" aria-label="Breakdown">
        <DetailRow label="Bitcoin" value={<Num>{crypto(q.units, "BTC", 6)}</Num>} />
        <Divider />
        <DetailRow label={`Flux fee · 1,49${NNBSP}%`} value={<Num>{eur(q.feeCents)}</Num>} />
        <Divider />
        <DetailRow strong label="To Euro balance" value={<Num>{eur(Math.max(0, q.getCents))}</Num>} />
      </section>

      <div className="amount-note sell-note">
        <Note icon={<IconInfo />}>
          You have {cryptoText(holdings.BTC, "BTC", 4)} ≈ {eurText(allCents)}. The fee is taken from what you get.
        </Note>
      </div>
    </Screen>
  );
}
