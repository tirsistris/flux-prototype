"use client";
// app/buy/review/page.tsx — Buy 4 · Review (Figma 2297:2191 / 2297:2559).
// Opening the screen locks a quote for 30 s; the "Price locked" timer runs for
// real. At 0:00 the screen switches to the expired state (modelled on Swap · Quote
// expired 2300:3519; copy agreed in step 5 — the price itself doesn't move): nothing
// is charged, "Refresh quote" locks a new 30 s quote at the legend price.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { LockExpired, PriceLock, useLockClock } from "@/components/PriceLock";
import { Button, Coin, DetailRow, Note, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconRefresh, IconShield } from "@/components/icons";
import { PAY_METHODS } from "@/lib/legend";
import { quoteBuy } from "@/lib/money";
import { crypto, eur, eurText, NNBSP } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function ReviewPage() {
  const router = useRouter();
  const { draft, method, quote, lockQuote, confirmBuy, resetBuy } = useStore();
  const leaving = React.useRef(false);

  React.useEffect(() => {
    if (leaving.current) return; // bought or cancelled: don't lock a fresh quote on the way out
    if (draft.eurCents <= 0) router.replace("/buy/amount");
    else if (!quote) lockQuote();
  }, [draft.eurCents, quote, lockQuote, router]);

  const { remaining, expired } = useLockClock(quote ? quote.expiresAt : null);
  // Before the effect has locked a quote (first paint) show the draft at full 30 s.
  const q = quote ?? { ...quoteBuy(draft.eurCents), method };
  const label = PAY_METHODS[q.method].label;

  const buy = () => {
    leaving.current = true;
    if (confirmBuy()) router.replace("/buy/done");
    else leaving.current = false;
  };
  const cancel = () => {
    leaving.current = true;
    resetBuy();
    router.push("/buy");
  };

  const actions = expired ? (
    <Button glyph={<IconRefresh />} onClick={lockQuote}>
      Refresh quote
    </Button>
  ) : (
    <>
      {q.method === "apple" ? (
        <Button variant="applepay" onClick={buy}>
          Buy with Apple Pay
        </Button>
      ) : (
        <Button onClick={buy}>Buy Bitcoin</Button>
      )}
      <Button variant="secondary" onClick={cancel}>
        Cancel
      </Button>
    </>
  );

  return (
    <Screen actions={actions}>
      <ScreenHeader onLeading={() => router.push("/buy/pay")} title="Review" />

      <div className="review">
        <Receipt>
          <div className={"review-hero" + (expired ? " stale" : "")}>
            <Coin asset="BTC" size={48} />
            <span className="t13 muted you-get">You get</span>
            <span className="big">
              <Num>{crypto(q.units, "BTC", 6)}</Num>
            </span>
            <span className="approx">
              <Num>{"≈ " + eur(q.netCents)}</Num>
            </span>
          </div>
          <Perforation />
          {expired ? <LockExpired body="Refresh to lock the price again. Nothing has been charged." /> : <PriceLock remaining={remaining} />}
          <Perforation />
          <div className={"receipt-section" + (expired ? " stale" : "")}>
            <DetailRow label="Price" value={<Num>{eur(q.priceCents) + "/BTC"}</Num>} />
            <DetailRow label="Bitcoin" value={<Num>{eur(q.netCents)}</Num>} />
            <DetailRow label={`Flux fee · 1,49${NNBSP}%`} value={<Num>{eur(q.feeCents)}</Num>} />
            <DetailRow ui label="Pay with" value={label} />
            <DetailRow strong label="Total" value={<Num>{eur(q.eurCents)}</Num>} />
          </div>
        </Receipt>
      </div>

      {!expired && (
        <div className="review-note">
          <Note icon={<IconShield />}>
            Nothing is charged if the lock runs out. You never pay more than {eurText(q.eurCents)}.
          </Note>
        </div>
      )}
    </Screen>
  );
}
