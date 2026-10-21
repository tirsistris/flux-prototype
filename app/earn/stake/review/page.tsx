"use client";
// app/earn/stake/review/page.tsx — Earn 4 · Review (Figma 2301:4135 / 2301:4485).
// No price lock: staking moves ETH, the euro figure is only an estimate.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { FaceId } from "@/components/FaceId";
import { Button, Coin, DetailRow, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconFace, IconLock } from "@/components/icons";
import { EARN_ETH } from "@/lib/legend";
import { crypto, eurWhole, NNBSP, THIN } from "@/lib/format";
import { ethAvailable, useStore } from "@/lib/store";

export default function StakeReviewPage() {
  const router = useRouter();
  const store = useStore();
  const { drafts, staked, confirmStake } = store;
  const [scanning, setScanning] = React.useState(false);
  const leaving = React.useRef(false);
  const d = drafts.stake;
  const available = ethAvailable(store);

  React.useEffect(() => {
    if (!leaving.current && (d.units <= 0 || d.units > available)) router.replace("/earn/stake");
  }, [d.units, available, router]);

  const finish = React.useCallback(() => {
    leaving.current = true;
    if (confirmStake()) router.replace("/earn/stake/done");
    else {
      leaving.current = false;
      setScanning(false);
    }
  }, [confirmStake, router]);

  return (
    <Screen
      actions={
        <Button glyph={<IconFace />} onClick={() => setScanning(true)} disabled={scanning}>
          Stake with Face ID
        </Button>
      }
    >
      <ScreenHeader title="Review" onLeading={() => router.push("/earn/stake")} />

      <div className="review">
        <Receipt>
          <div className="review-hero">
            <Coin asset="ETH" size={48} />
            <span className="t13 muted you-get">You stake</span>
            <span className="big">
              <Num>{crypto(d.units, "ETH", 4)}</Num>
            </span>
            <span className="approx">
              <Num>{"≈ " + eurWhole(d.cents)}</Num>
            </span>
          </div>
          <Perforation />
          <div className="receipt-section">
            <DetailRow label={`APY after Flux’s ${EARN_ETH.fluxSharePct}${NNBSP}%`} value={<Num>{`${EARN_ETH.apy}${THIN}%`}</Num>} />
            <DetailRow ui label="Rewards" value={`Daily at ${EARN_ETH.payoutAt}`} />
            <DetailRow ui label="First reward" value={`Tomorrow, ${EARN_ETH.payoutAt}`} />
            <DetailRow ui label="Unstaking" value={EARN_ETH.unstake} />
            <DetailRow strong label="Total staked after" value={<Num>{crypto(staked + d.units, "ETH", 4)}</Num>} />
          </div>
        </Receipt>
      </div>

      <div className="banner banner-neutral stake-banner">
        <span className="banner-icon">
          <IconLock size={22} />
        </span>
        <span className="banner-text">
          <span className="banner-title">Staked ETH is locked</span>
          <span className="banner-body">You can unstake any time. It usually takes 7 days, and rewards stop the day you ask.</span>
        </span>
      </div>

      {scanning && <FaceId onDone={finish} />}
    </Screen>
  );
}
