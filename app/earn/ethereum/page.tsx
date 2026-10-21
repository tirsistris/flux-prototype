"use client";
// app/earn/ethereum/page.tsx — Earn 1 · Ethereum (Figma 2301:3823 / 2301:4309).
// The stake is ETH_STAKED, not the wallet balance: a send never changes this screen.
// Unstake and Stake more are placeholders until their flows are designed.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { RewardsChart } from "@/components/RewardsChart";
import { Button, DetailRow, Divider, ScreenHeader } from "@/components/ui";
import { ASSETS, EARN_ETH, ETH_STAKED } from "@/lib/legend";
import { valueCents } from "@/lib/money";
import { crypto, eur, eurText, NNBSP, THIN } from "@/lib/format";

export default function EarnEthereumPage() {
  const router = useRouter();

  return (
    <Screen
      actions={
        <div className="bottom-actions-row">
          <Button variant="secondary">Unstake</Button>
          <Button>Stake more</Button>
        </div>
      }
    >
      <ScreenHeader coin="ETH" title="Ethereum staking" onLeading={() => router.push("/earn")} />

      <div className="stake-hero">
        <span className="t13 muted">Your stake</span>
        <span className="stake-hero-big">
          <Num>{crypto(ETH_STAKED, "ETH", 4)}</Num>
        </span>
        <span className="stake-hero-sub">
          <span className="stake-eur">
            <Num>{eur(valueCents(ETH_STAKED, ASSETS.ETH.priceCents))}</Num>
          </span>
          <span className="badge gain">
            <Num>{`${EARN_ETH.apy}${THIN}% APY`}</Num>
          </span>
        </span>
      </div>

      <section className="card rewards-card" aria-label="Rewards">
        <div className="rewards-top">
          <h2>Rewards</h2>
          <span className="t13 muted">≈ {eurText(EARN_ETH.dailyCents)} a day</span>
        </div>
        <RewardsChart />
        <div className="earned">
          <span className="earned-qty">
            <Num>{crypto(EARN_ETH.earnedUnits, "ETH", 4, { sign: true })}</Num>
          </span>
          <span className="earned-sub">
            ≈ {eurText(EARN_ETH.earnedCents)} since {EARN_ETH.since}
          </span>
        </div>
      </section>

      <div className="card stake-details">
        <DetailRow ui label="Flux’s share" value={`${EARN_ETH.fluxSharePct}${NNBSP}% of rewards`} />
        <Divider />
        <DetailRow label="Next reward" value={<Num>{`≈ ${crypto(EARN_ETH.nextRewardUnits, "ETH", 6)} at ${EARN_ETH.payoutAt}`}</Num>} />
        <Divider />
        <DetailRow label="Per year at this rate" value={<Num>{"≈ " + eur(EARN_ETH.yearCents, { sign: true })}</Num>} />
        <Divider />
        <DetailRow ui label="Unstaking takes" value={EARN_ETH.unstake} />
      </div>
    </Screen>
  );
}
