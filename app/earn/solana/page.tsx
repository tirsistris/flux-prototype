"use client";
// app/earn/solana/page.tsx — Earn 2 · Solana, not staked (Figma 2301:3967 / 2301:4393).
// The estimate is derived from legend: SOL position value × 5,8 % (round2), and a day
// = that / 365. Start earning is a placeholder until the staking flow is designed.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { Button, Coin, Divider, ScreenHeader } from "@/components/ui";
import { ASSETS, EARN_MORE } from "@/lib/legend";
import { stakeEstimate, valueCents } from "@/lib/money";
import { cryptoText, eur, eurText, NNBSP } from "@/lib/format";
import { useStore } from "@/lib/store";

const SOL = EARN_MORE[0];

const STEPS = [
  { title: "Pick an amount", body: `Any part of your SOL, from 0,1${NNBSP}SOL.` },
  { title: "Earn every day", body: "Rewards land daily and start earning too." },
  { title: "Unstake when you need it", body: "Takes 2–3 days on the Solana network." },
];

export default function EarnSolanaPage() {
  const router = useRouter();
  const { holdings } = useStore();
  const sol = cryptoText(holdings.SOL, "SOL", 4);
  const est = stakeEstimate(valueCents(holdings.SOL, ASSETS.SOL.priceCents), SOL.apyX1000);

  return (
    <Screen actions={<Button>Start earning</Button>}>
      <ScreenHeader title="Earn with Solana" onLeading={() => router.push("/earn")} />

      <div className="earn-hero">
        <Coin asset="SOL" size={64} />
        <h1 className="serif">
          Earn {SOL.apy}
          {NNBSP}% a year on SOL
        </h1>
        <p className="sub">Stake your {sol} and it earns a little every day you hold it.</p>
      </div>

      <div className="if-stake">
        <span className="t13 muted">If you stake all {sol}</span>
        <span className="if-stake-est">
          <span className="if-stake-big">
            <Num>{"≈ " + eur(est.yearCents, { sign: true })}</Num>
          </span>
          <span>in a year</span>
        </span>
        <span className="t13 muted">about {eurText(est.dayCents)} a day · rates change, not guaranteed</span>
      </div>

      <div className="card steps">
        {STEPS.map((s, i) => (
          <React.Fragment key={s.title}>
            {i > 0 && <Divider />}
            <div className="step">
              <span className="step-num">{i + 1}</span>
              <span className="step-text">
                <span className="step-title">{s.title}</span>
                <span className="step-body">{s.body}</span>
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Screen>
  );
}
