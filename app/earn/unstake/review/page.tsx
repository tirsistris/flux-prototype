"use client";
// app/earn/unstake/review/page.tsx — Unstake 2 · Review (Figma 2316:6707 / 2316:7058).
// "You'll earn less" is the daily estimate of the unstaked ETH: round2(round2(value ×
// 2,6 %) / 365) — 0,03 € for 0,1 ETH (legend corrected from 0,04).
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { FaceId } from "@/components/FaceId";
import { useGoBack } from "@/components/NotInPrototype";
import { Button, Coin, DetailRow, Note, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconFace, IconInfo } from "@/components/icons";
import { UNSTAKE_UNLOCKS } from "@/lib/legend";
import { ETH_APY_X1000, stakeEstimate } from "@/lib/money";
import { crypto, eur, eurText } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function UnstakeReviewPage() {
  const router = useRouter();
  const back = useGoBack(); // Unstake 1 is reached from Earn 1 or Send: go back the way we came
  const { drafts, staked, confirmUnstake } = useStore();
  const [scanning, setScanning] = React.useState(false);
  const leaving = React.useRef(false);
  const d = drafts.unstake;

  React.useEffect(() => {
    if (!leaving.current && (d.units <= 0 || d.units > staked)) router.replace("/earn/unstake");
  }, [d.units, staked, router]);

  const finish = React.useCallback(() => {
    leaving.current = true;
    if (confirmUnstake()) router.replace("/earn/unstake/done");
    else {
      leaving.current = false;
      setScanning(false);
    }
  }, [confirmUnstake, router]);

  const less = stakeEstimate(d.cents, ETH_APY_X1000).dayCents;

  return (
    <Screen
      actions={
        <Button glyph={<IconFace />} onClick={() => setScanning(true)} disabled={scanning}>
          Unstake with Face ID
        </Button>
      }
    >
      <ScreenHeader title="Review" onLeading={back} />

      <div className="review">
        <Receipt>
          <div className="review-hero">
            <Coin asset="ETH" size={48} />
            <span className="t13 muted you-get">You unstake</span>
            <span className="big">
              <Num>{crypto(d.units, "ETH", 4)}</Num>
            </span>
            <span className="approx">
              <Num>{"≈ " + eur(d.cents)}</Num>
            </span>
          </div>
          <Perforation />
          <div className="receipt-section">
            <DetailRow ui label="Unlocks" value={`Around ${UNSTAKE_UNLOCKS}`} />
            <DetailRow ui label="Rewards stop" value="Today" />
            <DetailRow ui label="You’ll earn less" value={`≈ ${eurText(less)} a day`} />
            <DetailRow strong label="Still staked" value={<Num>{crypto(staked - d.units, "ETH", 4)}</Num>} />
          </div>
        </Receipt>
      </div>

      <div className="unstake-note">
        <Note icon={<IconInfo />}>
          You can’t cancel once unstaking starts. It usually takes 7 days, longer if the network queue is busy. Meanwhile the ETH earns nothing and can’t be sent.
        </Note>
      </div>

      {scanning && <FaceId onDone={finish} />}
    </Screen>
  );
}
