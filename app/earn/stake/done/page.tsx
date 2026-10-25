"use client";
// app/earn/stake/done/page.tsx — Earn 5 · Done (Figma 2301:4228 / 2301:4527). The yearly
// estimate is for the whole stake after this one (lib/money.ts ethStake), and its label
// names that amount ("Per year on all 0,4814 ETH").
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { Button, DetailRow, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconEarn } from "@/components/icons";
import { EARN_ETH } from "@/lib/legend";
import { ethStake } from "@/lib/money";
import { crypto, cryptoText, eur, THIN } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function StakeDonePage() {
  const router = useRouter();
  const { stakeReceipt: r } = useStore();

  React.useEffect(() => {
    if (!r) router.replace("/earn/ethereum");
  }, [r, router]);
  if (!r) return null;
  const est = ethStake(r.stakedAfter);

  return (
    <Screen actions={<Button onClick={() => router.push("/earn/ethereum")}>Done</Button>}>
      <ScreenHeader leading="close" onLeading={() => router.push("/earn/ethereum")} />

      <div className="done-hero">
        <span className="state-icon">
          <IconEarn size={40} />
        </span>
        <h1 className="serif">Earning on {cryptoText(r.stakedAfter, "ETH", 4)}</h1>
        <p className="sub">Your first reward lands tomorrow around {EARN_ETH.payoutAt} — while you sleep.</p>
      </div>

      <div className="done-receipt">
        <Receipt>
          <div className="receipt-section">
            <div className="receipt-head">
              <span>FLUX · RECEIPT</span>
              <span>{r.orderNo}</span>
            </div>
            <DetailRow label="Staked now" value={<Num>{crypto(r.units, "ETH", 4)}</Num>} />
            <DetailRow label="APY after fees" value={<Num>{`${EARN_ETH.apy}${THIN}%`}</Num>} />
            <DetailRow label={`Per year on all ${cryptoText(r.stakedAfter, "ETH", 4)}`} value={<Num>{"≈ " + eur(est.yearCents, { sign: true })}</Num>} />
          </div>
          <Perforation />
          <div className="receipt-section tail">
            <DetailRow strong label="Total staked" value={<Num>{crypto(r.stakedAfter, "ETH", 4)}</Num>} />
          </div>
        </Receipt>
      </div>
    </Screen>
  );
}
