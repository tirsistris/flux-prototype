"use client";
// app/withdraw/review/page.tsx — Withdraw 2 · Review (Figma 2315:6036 / 2315:6341).
// Free, no price lock; "Withdraw with Face ID" runs the Face ID stand-in.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { FaceId } from "@/components/FaceId";
import { useGoBack } from "@/components/NotInPrototype";
import { Button, DetailRow, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconBank, IconFace } from "@/components/icons";
import { BANK } from "@/lib/legend";
import { eur } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function WithdrawReviewPage() {
  const router = useRouter();
  const back = useGoBack(); // Withdraw 1 is reached from Cash or Sell 3: go back the way we came
  const { drafts, holdings, confirmWithdraw } = useStore();
  const [scanning, setScanning] = React.useState(false);
  const leaving = React.useRef(false);
  const cents = drafts.withdraw.cents;

  React.useEffect(() => {
    if (!leaving.current && (cents <= 0 || cents > holdings.eurCents)) router.replace("/withdraw");
  }, [cents, holdings.eurCents, router]);

  const finish = React.useCallback(() => {
    leaving.current = true;
    if (confirmWithdraw()) router.replace("/withdraw/done");
    else {
      leaving.current = false;
      setScanning(false);
    }
  }, [confirmWithdraw, router]);

  return (
    <Screen
      actions={
        <Button glyph={<IconFace />} onClick={() => setScanning(true)} disabled={scanning}>
          Withdraw with Face ID
        </Button>
      }
    >
      <ScreenHeader title="Review" onLeading={back} />

      <div className="review">
        <Receipt>
          <div className="review-hero">
            <span className="tile tile-48">
              <IconBank size={24} />
            </span>
            <span className="t13 muted you-get">You withdraw</span>
            <span className="big">
              <Num>{eur(cents)}</Num>
            </span>
            <span className="approx ui">to {BANK.name}</span>
          </div>
          <Perforation />
          <div className="receipt-section">
            <DetailRow label="Account" value={BANK.masked} />
            <DetailRow ui label="Fee" value="Free" />
            <DetailRow ui label="Arrives" value={BANK.arrives} />
            <DetailRow strong label="Euro balance after" value={<Num>{eur(holdings.eurCents - cents)}</Num>} />
          </div>
        </Receipt>
      </div>

      {scanning && <FaceId onDone={finish} />}
    </Screen>
  );
}
