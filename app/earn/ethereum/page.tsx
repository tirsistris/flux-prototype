"use client";
// app/earn/ethereum/page.tsx — Earn 1 · Ethereum (Figma 2301:3823 / 2301:4309).
// The stake is the store's staked quantity, not the wallet balance: a send never
// changes this screen; Stake more / Unstake do. Value, a day, a year and the next
// reward are computed from it (lib/money.ts ethStake); the earned history is fixed.
// Unstake → Unstake 1, Stake more → Earn 3. ETH asked back shows as the agreed
// "Unlocking" card under the stake (variant A).
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { RewardsChart } from "@/components/RewardsChart";
import { Button, DetailRow, Divider, ScreenHeader } from "@/components/ui";
import { IconTimer22 } from "@/components/icons";
import { EARN_ETH, UNSTAKE_UNLOCKS } from "@/lib/legend";
import { ethStake } from "@/lib/money";
import { useStore } from "@/lib/store";
import { crypto, cryptoText, eur, eurText, NNBSP, THIN } from "@/lib/format";

export default function EarnEthereumPage() {
  const router = useRouter();
  const { staked, unstaking } = useStore();
  const est = ethStake(staked);

  return (
    <Screen
      actions={
        <div className="bottom-actions-row">
          <Button variant="secondary" onClick={() => router.push("/earn/unstake")}>
            Unstake
          </Button>
          <Button onClick={() => router.push("/earn/stake")}>Stake more</Button>
        </div>
      }
    >
      <ScreenHeader coin="ETH" title="Ethereum staking" onLeading={() => router.push("/earn")} />

      <div className="stake-hero">
        <span className="t13 muted">Your stake</span>
        <span className="stake-hero-big">
          <Num>{crypto(staked, "ETH", 4)}</Num>
        </span>
        <span className="stake-hero-sub">
          <span className="stake-eur">
            <Num>{eur(est.valueCents)}</Num>
          </span>
          <span className="badge gain">
            <Num>{`${EARN_ETH.apy}${THIN}% APY`}</Num>
          </span>
        </span>
      </div>

      {unstaking > 0 && (
        <div className="banner banner-neutral unlocking-card">
          <span className="banner-icon">
            <IconTimer22 />
          </span>
          <span className="banner-text">
            <span className="banner-title">Unlocking {cryptoText(unstaking, "ETH", 4)}</span>
            <span className="banner-body">Around {UNSTAKE_UNLOCKS} · no rewards meanwhile</span>
          </span>
        </div>
      )}

      <section className="card rewards-card" aria-label="Rewards">
        <div className="rewards-top">
          <h2>Rewards</h2>
          <span className="t13 muted">≈ {eurText(est.dayCents)} a day</span>
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
        <DetailRow label="Next reward" value={<Num>{`≈ ${crypto(est.nextRewardUnits, "ETH", 6)} at ${EARN_ETH.payoutAt}`}</Num>} />
        <Divider />
        <DetailRow label="Per year at this rate" value={<Num>{"≈ " + eur(est.yearCents, { sign: true })}</Num>} />
        <Divider />
        <DetailRow ui label="Unstaking takes" value={EARN_ETH.unstake} />
      </div>
    </Screen>
  );
}
