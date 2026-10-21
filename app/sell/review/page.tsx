"use client";
// app/sell/review/page.tsx — Sell 2 · Review (Figma 2316:6414 / 2316:6923). The quote
// is locked for 30 s as in Buy. The expired state has no frame: it follows Swap ·
// Quote expired with the agreed copy ("Nothing has been sold."), "Refresh quote".
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { FaceId } from "@/components/FaceId";
import { LockExpired, PriceLock, useLockClock } from "@/components/PriceLock";
import { Button, Coin, DetailRow, Note, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconFace, IconRefresh, IconShield } from "@/components/icons";
import { ASSETS } from "@/lib/legend";
import { quoteSell } from "@/lib/money";
import { crypto, eur, NNBSP } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function SellReviewPage() {
  const router = useRouter();
  const { drafts, holdings, sellLock, lockSell, confirmSell } = useStore();
  const [scanning, setScanning] = React.useState(false);
  const leaving = React.useRef(false);
  const d = drafts.sell;

  React.useEffect(() => {
    if (leaving.current) return;
    if (d.units <= 0 || d.units > holdings.BTC) router.replace("/sell");
    else if (!sellLock) lockSell();
  }, [d.units, holdings.BTC, sellLock, lockSell, router]);

  const { remaining, expired } = useLockClock(sellLock ? sellLock.expiresAt : null);
  const q = sellLock?.q ?? quoteSell(d.cents, d.units);

  const finish = React.useCallback(() => {
    leaving.current = true;
    if (confirmSell()) router.replace("/sell/done");
    else {
      leaving.current = false;
      setScanning(false);
    }
  }, [confirmSell, router]);

  return (
    <Screen
      actions={
        expired ? (
          <Button glyph={<IconRefresh />} onClick={lockSell}>
            Refresh quote
          </Button>
        ) : (
          <Button glyph={<IconFace />} onClick={() => setScanning(true)} disabled={scanning}>
            Sell with Face ID
          </Button>
        )
      }
    >
      <ScreenHeader title="Review" onLeading={() => router.push("/sell")} />

      <div className="review">
        <Receipt>
          <div className={"review-hero" + (expired ? " stale" : "")}>
            <Coin asset="BTC" size={48} />
            <span className="t13 muted you-get">You sell</span>
            <span className="big">
              <Num>{crypto(q.units, "BTC", 6)}</Num>
            </span>
            <span className="approx">
              <Num>{"≈ " + eur(q.grossCents)}</Num>
            </span>
          </div>
          <Perforation />
          {expired ? <LockExpired body="Refresh to lock the price again. Nothing has been sold." /> : <PriceLock remaining={remaining} />}
          <Perforation />
          <div className={"receipt-section" + (expired ? " stale" : "")}>
            <DetailRow label="Price" value={<Num>{eur(ASSETS.BTC.priceCents) + "/BTC"}</Num>} />
            <DetailRow label={`Flux fee · 1,49${NNBSP}%`} value={<Num>{eur(q.feeCents)}</Num>} />
            <DetailRow ui label="Goes to" value="Euro balance" />
            <DetailRow strong label="You get" value={<Num>{eur(q.getCents)}</Num>} />
          </div>
        </Receipt>
      </div>

      {!expired && (
        <div className="sell-review-note">
          <Note icon={<IconShield />}>If the timer runs out, you’ll see a new price before anything is sold.</Note>
        </div>
      )}

      {scanning && <FaceId onDone={finish} />}
    </Screen>
  );
}
