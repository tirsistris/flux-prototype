"use client";
// app/earn/page.tsx — Earn tab (Figma 2296:1234 / 2296:1877). The stake card opens
// Earn 1 · Ethereum, the Solana row opens Earn 2 · Solana; Polkadot and Cardano open
// the "Not in this prototype" state. Every figure is legend.md "Earn ETH" / "More ways".
import React from "react";
import Link from "next/link";
import { Screen } from "@/components/Screen";
import { NOT_IN_PROTOTYPE } from "@/components/NotInPrototype";
import { Num } from "@/components/Num";
import { RewardsChart } from "@/components/RewardsChart";
import { Coin, Divider, Note } from "@/components/ui";
import { IconAlarm, IconInfo } from "@/components/icons";
import { ASSETS, EARN_ETH, EARN_MORE, ETH_STAKED } from "@/lib/legend";
import { valueCents } from "@/lib/money";
import { crypto, eur, eurText, THIN } from "@/lib/format";

export default function EarnPage() {
  return (
    <Screen tab="earn">
      <div className="large-title">
        <h1>Earn</h1>
      </div>

      <Link href="/earn/ethereum" className="card stake-card">
        <span className="stake-top">
          <Coin asset="ETH" size={28} />
          <span className="stake-title">Ethereum staking</span>
          <span className="badge gain">
            <Num>{`${EARN_ETH.apy}${THIN}% APY`}</Num>
          </span>
        </span>
        <span className="stake-big">
          <Num>{crypto(ETH_STAKED, "ETH", 4)}</Num>
        </span>
        <span className="stake-eur">
          <Num>{eur(valueCents(ETH_STAKED, ASSETS.ETH.priceCents))}</Num>
        </span>
        <RewardsChart />
        <span className="earned">
          <span className="earned-qty">
            <Num>{crypto(EARN_ETH.earnedUnits, "ETH", 4, { sign: true })}</Num>
          </span>
          <span className="earned-sub">
            earned in {EARN_ETH.earnedDays} days · ≈ {eurText(EARN_ETH.dailyCents)} a day
          </span>
        </span>
        <span className="next-reward">
          <IconAlarm />
          <span>
            Next reward ≈ {eurText(EARN_ETH.dailyCents)} at {EARN_ETH.payoutAt} — while you sleep
          </span>
        </span>
      </Link>

      <h2 className="section-title">More ways to earn</h2>
      <div className="card earn-list">
        {EARN_MORE.map((m, i) => {
          const body = (
            <>
              <Coin asset={m.id} size={40} />
              <span className="list-row-main">
                <span className="list-row-title">{m.name}</span>
                <span className="list-row-sub">{m.sub}</span>
              </span>
              <span className="list-row-side">
                <span className="primary">
                  <Num>{`${m.apy}${THIN}%`}</Num>
                </span>
                <span className="secondary">APY</span>
              </span>
            </>
          );
          return (
            <React.Fragment key={m.id}>
              {i > 0 && <Divider inset />}
              <Link href={"href" in m ? m.href : NOT_IN_PROTOTYPE} className="list-row">
                {body}
              </Link>
            </React.Fragment>
          );
        })}
      </div>

      <div className="earn-note">
        <Note icon={<IconInfo />}>
          Rates are after Flux’s {EARN_ETH.fluxSharePct}{" "}% share. They move with each network and aren’t guaranteed. Staked coins can’t be sent until you unstake.
        </Note>
      </div>
    </Screen>
  );
}
