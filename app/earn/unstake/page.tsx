"use client";
// app/earn/unstake/page.tsx — Unstake 1 · Amount (Figma 2316:6604 / 2316:7021), from
// Unstake on Earn 1 and from the Send · Not enough chip (agreed). Typed in ETH (€ via
// the unit switch) out of what is staked; chips 25 % / 50 % / Max of the stake. More
// than the stake is the agreed "not enough" state.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { useGoBack } from "@/components/NotInPrototype";
import { fitFont, NotEnough, shareChips, useAmount } from "@/components/Amount";
import { Button, Chip, Keypad, ScreenHeader, UnitSwitch } from "@/components/ui";
import { IconTimer22 } from "@/components/icons";
import { UNSTAKE_UNLOCKS } from "@/lib/legend";
import { crypto, cryptoText, eur, group, NNBSP, short4, THIN } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function UnstakeAmountPage() {
  const router = useRouter();
  const back = useGoBack();
  const { staked } = useStore();
  const { d, press, toggle, setUnits } = useAmount("unstake");
  const tooMuch = d.units > staked;

  const [iPart, dPart] = d.input.split(",");
  const typed = group(iPart, THIN) + (dPart !== undefined ? "," + dPart : "");
  const unit = d.mode === "eur" ? "€" : "ETH";
  // Figure 64 px + unit 28 px with a 10 px gap, as in Send 2.
  const size = fitFont(typed + "  " + unit, 64);

  return (
    <Screen
      actions={
        <>
          <div className="amount-keypad">
            <Keypad onKey={press} />
          </div>
          <Button disabled={tooMuch || d.units <= 0} onClick={() => router.push("/earn/unstake/review")}>
            Review
          </Button>
        </>
      }
    >
      <ScreenHeader coin="ETH" title="Unstake ETH" onLeading={back} />

      <div className="send-amount unstake-amount">
        <span className="t13 muted">of {cryptoText(staked, "ETH", 4)} staked</span>
        <div className={"send-value" + (tooMuch ? " loss" : "")} aria-live="polite">
          <span className="send-figure" style={{ fontSize: size }}>
            <Num>{typed}</Num>
          </span>
          <span className="send-unit">{unit}</span>
        </div>
        <UnitSwitch onClick={toggle} label={d.mode === "eur" ? "Enter amount in ETH" : "Enter amount in euro"}>
          <span>
            {"≈ "}
            {d.mode === "eur" ? <Num>{crypto(d.units, "ETH", 4)}</Num> : <Num>{eur(d.cents)}</Num>}
          </span>
        </UnitSwitch>
      </div>

      {tooMuch ? (
        <NotEnough
          error={<>Up to {short4(staked, NNBSP)}{NNBSP}ETH — that’s all you have staked</>}
          chip={<>Unstake {cryptoText(staked, "ETH", 4)}</>}
          onChip={() => setUnits(staked)}
        />
      ) : (
        <div className="chips amount-chips">
          {shareChips(staked).map((c) => (
            <Chip key={c.label} selected={d.units === c.value && d.units > 0} onClick={() => setUnits(c.value)}>
              {c.label}
            </Chip>
          ))}
        </div>
      )}

      <div className="banner banner-neutral unstake-banner">
        <span className="banner-icon">
          <IconTimer22 />
        </span>
        <span className="banner-text">
          <span className="banner-title">Usually 7 days</span>
          <span className="banner-body">
            Rewards stop today. Your {short4(d.units, NNBSP)}
            {NNBSP}ETH should unlock around {UNSTAKE_UNLOCKS}.
          </span>
        </span>
      </div>
    </Screen>
  );
}
