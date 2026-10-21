"use client";
// app/swap/page.tsx — Swap 1 · Amount (Figma 2300:3271 / 2300:3803). BTC is typed;
// "You get" is the ETH after spread and fee (lib/money.ts quoteSwap), live on every
// key. Coin pickers and the direction switch are outside this prototype. More BTC
// than Mila has turns the figure red with the agreed "not enough" line.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { NOT_IN_PROTOTYPE } from "@/components/NotInPrototype";
import { fitFont, NotEnough, useAmount } from "@/components/Amount";
import { Button, Coin, Keypad, ScreenHeader } from "@/components/ui";
import { IconArrowDown, IconChevDown } from "@/components/icons";
import { effectiveRateX1e4, quoteSwap } from "@/lib/money";
import { cryptoText, eur, fixed, group, NNBSP, THIN } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function SwapAmountPage() {
  const router = useRouter();
  const { holdings } = useStore();
  const { d, press, setUnits } = useAmount("swap");
  const q = quoteSwap(d.units);
  const tooMuch = d.units > holdings.BTC;

  const [iPart, dPart] = d.input.split(",");
  const typed = group(iPart, THIN) + (dPart !== undefined ? "," + dPart : "");
  const get = fixed(q.ethUnits, 8, 4, THIN);
  // Both figures share one size so the cards stay aligned (34 px in Figma).
  const size = Math.min(fitFont(typed, 34, 200), fitFont("≈ " + get, 34, 200));
  const picker = (asset: "BTC" | "ETH") => (
    <button type="button" className="asset-pick" onClick={() => router.push(NOT_IN_PROTOTYPE)}>
      <Coin asset={asset} size={28} />
      {asset}
      <IconChevDown />
    </button>
  );

  return (
    <Screen
      actions={
        <>
          <div className="amount-keypad">
            <Keypad onKey={press} />
          </div>
          <Button disabled={tooMuch || q.ethUnits <= 0} onClick={() => router.push("/swap/review")}>
            Review
          </Button>
        </>
      }
    >
      <ScreenHeader title="Swap" onLeading={() => router.push("/home")} />

      <div className="swap-cards">
        <section className="swap-card" aria-label="You pay">
          <div className="swap-card-top">
            <span>You pay</span>
            <span>Balance {cryptoText(holdings.BTC, "BTC", 4)}</span>
          </div>
          <div className="swap-card-row">
            {picker("BTC")}
            <span className="swap-card-v">
              <span className={"swap-big" + (tooMuch ? " loss" : "")} style={{ fontSize: size }} aria-live="polite">
                <Num>{typed}</Num>
              </span>
              <span className="swap-sub">
                <Num>{eur(q.valueCents)}</Num>
              </span>
            </span>
          </div>
        </section>
        <button type="button" className="swap-switch" aria-label="Swap direction" onClick={() => router.push(NOT_IN_PROTOTYPE)}>
          <IconArrowDown size={28} />
        </button>
        <section className="swap-card" aria-label="You get">
          <div className="swap-card-top">
            <span>You get</span>
          </div>
          <div className="swap-card-row">
            {picker("ETH")}
            <span className="swap-card-v">
              <span className="swap-big muted" style={{ fontSize: size }}>
                <Num>{"≈ " + get}</Num>
              </span>
              <span className="swap-sub">
                <Num>{"≈ " + eur(q.netCents)}</Num>
              </span>
            </span>
          </div>
        </section>
      </div>

      {tooMuch ? (
        <NotEnough
          error={<>Up to {cryptoText(holdings.BTC, "BTC", 4)} — that’s all your Bitcoin</>}
          chip={<>Swap {cryptoText(holdings.BTC, "BTC", 4)}</>}
          onChip={() => setUnits(holdings.BTC)}
        />
      ) : (
        <p className="swap-rate">
          {q.ethUnits > 0 ? (
            <>1{NNBSP}BTC = {fixed(effectiveRateX1e4(q), 4, 4, NNBSP)}{NNBSP}ETH after all fees</>
          ) : (
            <>&nbsp;</>
          )}
        </p>
      )}
    </Screen>
  );
}
