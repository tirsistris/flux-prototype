"use client";
// app/earn/stake/page.tsx — Earn 3 · Stake amount (Figma 2301:4041 / 2301:4448), from
// Stake more on Earn 1. Typed in € (ETH via the unit switch) out of the available
// ETH (not staked, not unlocking). The estimate is round2(value × 2,6 %) a year and
// round2(year / 365) a day. More than available is the agreed "not enough" state —
// in euro, as the entry is (agreed).
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { fitFont, NotEnough, shareChips, useAmount } from "@/components/Amount";
import { Button, Chip, Keypad, ScreenHeader, UnitSwitch } from "@/components/ui";
import { IconEarn } from "@/components/icons";
import { ASSETS } from "@/lib/legend";
import { ETH_APY_X1000, stakeEstimate, valueCents } from "@/lib/money";
import { crypto, cryptoText, eur, eurText, group, THIN } from "@/lib/format";
import { ethAvailable, useStore } from "@/lib/store";

export default function StakeAmountPage() {
  const router = useRouter();
  const store = useStore();
  const { d, press, toggle, setUnits } = useAmount("stake");
  const available = ethAvailable(store);
  const availableCents = valueCents(available, ASSETS.ETH.priceCents);
  const tooMuch = d.units > available;
  const est = stakeEstimate(d.cents, ETH_APY_X1000);

  const [iPart, dPart] = d.input.split(",");
  const typed = group(iPart, THIN) + (dPart !== undefined ? "," + dPart : "");
  const big = typed + THIN + (d.mode === "eur" ? "€" : "ETH");

  return (
    <Screen
      actions={
        <>
          <div className="amount-keypad">
            <Keypad onKey={press} />
          </div>
          <Button disabled={tooMuch || d.units <= 0} onClick={() => router.push("/earn/stake/review")}>
            Review
          </Button>
        </>
      }
    >
      <ScreenHeader coin="ETH" title="Stake ETH" onLeading={() => router.push("/earn/ethereum")} />

      <div className="amount stake-amount">
        <div className={"value" + (tooMuch ? " loss" : "")} style={{ fontSize: fitFont(big, 64) }} aria-live="polite">
          <Num>{big}</Num>
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
          error={<>Up to {eurText(availableCents)} — that’s your {cryptoText(available, "ETH", 4)} available</>}
          chip={<>Stake all · {eurText(availableCents)}</>}
          onChip={() => setUnits(available)}
        />
      ) : (
        <>
          <div className="chips amount-chips stake-chips">
            {shareChips(available).map((c) => (
              <Chip key={c.label} selected={d.units === c.value && d.units > 0} onClick={() => setUnits(c.value)}>
                {c.label}
              </Chip>
            ))}
          </div>
          <p className="stake-available">
            Available {cryptoText(available, "ETH", 4, " ")} ≈ {eurText(availableCents)}
          </p>
        </>
      )}

      <div className="stake-estimate-wrap">
        <span className="stake-estimate">
          <IconEarn size={18} />
          <span>
            ≈ {eurText(est.yearCents, { sign: true })} a year · about {eurText(est.dayCents)} a day
          </span>
        </span>
      </div>
    </Screen>
  );
}
