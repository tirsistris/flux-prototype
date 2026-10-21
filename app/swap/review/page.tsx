"use client";
// app/swap/review/page.tsx — Swap 2 · Review (Figma 2300:3403 / 2300:3857) and
// Swap · Quote expired (2300:3519 / 2300:3921). Opening it locks the quote for 30 s,
// as in Buy; at 0:00 the pair and the details fade, "Refresh quote" locks again at
// the legend price. "Swap with Face ID" runs the Face ID stand-in, then swaps.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { FaceId } from "@/components/FaceId";
import { LockExpired, PriceLock, useLockClock } from "@/components/PriceLock";
import { Button, Coin, DetailRow, Note, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconArrowDown, IconFace, IconInfo, IconRefresh } from "@/components/icons";
import { marketRateText, quoteSwap } from "@/lib/money";
import { crypto, eur, NNBSP } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function SwapReviewPage() {
  const router = useRouter();
  const { drafts, holdings, swapLock, lockSwap, confirmSwap } = useStore();
  const [scanning, setScanning] = React.useState(false);
  const leaving = React.useRef(false);
  const d = drafts.swap;

  React.useEffect(() => {
    if (leaving.current) return;
    if (d.units <= 0 || d.units > holdings.BTC) router.replace("/swap");
    else if (!swapLock) lockSwap();
  }, [d.units, holdings.BTC, swapLock, lockSwap, router]);

  const { remaining, expired } = useLockClock(swapLock ? swapLock.expiresAt : null);
  const q = swapLock?.q ?? quoteSwap(d.units);

  const finish = React.useCallback(() => {
    leaving.current = true;
    if (confirmSwap()) router.replace("/swap/done");
    else {
      leaving.current = false;
      setScanning(false);
    }
  }, [confirmSwap, router]);

  return (
    <Screen
      actions={
        expired ? (
          <Button glyph={<IconRefresh />} onClick={lockSwap}>
            Refresh quote
          </Button>
        ) : (
          <Button glyph={<IconFace />} onClick={() => setScanning(true)} disabled={scanning}>
            Swap with Face ID
          </Button>
        )
      }
    >
      <ScreenHeader title="Review swap" onLeading={() => router.push("/swap")} />

      <div className="review">
        <Receipt>
          <div className={"swap-pair" + (expired ? " stale" : "")}>
            <div className="swap-leg">
              <Coin asset="BTC" size={40} />
              <span className="swap-leg-l">
                <span className="t13 muted">You pay</span>
                <span className="swap-leg-big">
                  <Num>{crypto(q.btcUnits, "BTC", 4)}</Num>
                </span>
              </span>
              <span className="swap-leg-eur">
                <Num>{eur(q.valueCents)}</Num>
              </span>
            </div>
            <div className="swap-pair-arrow" aria-hidden="true">
              <span className="line" />
              <span className="down">
                <IconArrowDown size={23} />
              </span>
              <span className="line" />
            </div>
            <div className="swap-leg">
              <Coin asset="ETH" size={40} />
              <span className="swap-leg-l">
                <span className="t13 muted">You get</span>
                <span className="swap-leg-big">
                  <Num>{crypto(q.ethUnits, "ETH", 4)}</Num>
                </span>
              </span>
              <span className="swap-leg-eur">
                <Num>{"≈ " + eur(q.netCents)}</Num>
              </span>
            </div>
          </div>
          <Perforation />
          {expired ? <LockExpired body="Refresh to lock the rate again. Nothing has been swapped." /> : <PriceLock remaining={remaining} />}
          <Perforation />
          <div className={"receipt-section" + (expired ? " stale" : "")}>
            <DetailRow label="Market rate" value={<Num>{marketRateText()}</Num>} />
            <DetailRow label={`Spread · 0,24${NNBSP}%`} value={<Num>{eur(q.spreadCents)}</Num>} />
            <DetailRow label="Flux fee" value={<Num>{eur(q.feeCents)}</Num>} />
            <DetailRow strong label="You get" value={<Num>{crypto(q.ethUnits, "ETH", 4)}</Num>} />
          </div>
        </Receipt>
      </div>

      {!expired && (
        <div className="swap-note">
          <Note icon={<IconInfo />}>Fees are already taken out of what you get. If the price moves past the lock, we’ll ask before swapping.</Note>
        </div>
      )}

      {scanning && <FaceId onDone={finish} />}
    </Screen>
  );
}
