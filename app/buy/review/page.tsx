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
import { Button, Coin, DetailRow, Note, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconRefresh, IconShield, IconTimer, IconTimer22 } from "@/components/icons";
import { PAY_METHODS, QUOTE_TTL_MS } from "@/lib/legend";
import { quoteBuy } from "@/lib/money";
import { crypto, eur, eurText, NNBSP } from "@/lib/format";
import { useStore } from "@/lib/store";

function useNow(active: boolean) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(Date.now()), 100);
    return () => window.clearInterval(id);
  }, [active]);
  return now;
}

export default function ReviewPage() {
  const router = useRouter();
  const { draft, method, quote, lockQuote, confirmBuy, resetBuy } = useStore();
  const leaving = React.useRef(false);

  React.useEffect(() => {
    if (leaving.current) return; // bought or cancelled: don't lock a fresh quote on the way out
    if (draft.eurCents <= 0) router.replace("/buy/amount");
    else if (!quote) lockQuote();
  }, [draft.eurCents, quote, lockQuote, router]);

  const now = useNow(!!quote);
  // Before the effect has locked a quote (first paint) show the full 30 s.
  const q = quote ?? { ...quoteBuy(draft.eurCents), method, expiresAt: now + QUOTE_TTL_MS, id: 0 };
  // Clamp: right after a refresh `now` is up to one tick old.
  const remaining = Math.min(QUOTE_TTL_MS, Math.max(0, q.expiresAt - now));
  const expired = !!quote && remaining === 0;
  const secs = Math.ceil(remaining / 1000);
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
          {expired ? (
            <div className="banner banner-loss" role="alert">
              <span className="banner-icon">
                <IconTimer22 />
              </span>
              <span className="banner-text">
                <span className="banner-title">Your price lock ran out</span>
                <span className="banner-body">Refresh to lock the price again. Nothing has been charged.</span>
              </span>
            </div>
          ) : (
            <div className="price-lock">
              <div className="row">
                <IconTimer />
                <span>Price locked</span>
                <span className="count" aria-live="off">
                  0:{String(secs).padStart(2, "0")}
                </span>
              </div>
              <div
                className="track"
                role="progressbar"
                aria-label="Time left on locked price"
                aria-valuemin={0}
                aria-valuemax={QUOTE_TTL_MS / 1000}
                aria-valuenow={secs}
              >
                <div className="fill" style={{ transform: `scaleX(${remaining / QUOTE_TTL_MS})` }} />
              </div>
            </div>
          )}
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
