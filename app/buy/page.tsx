"use client";
// app/buy/page.tsx — Buy 1 · Bitcoin (Figma 2297:1848 / 2297:2393). Position is
// live: quantity and value from the store, gain = value − cost basis, average
// price = cost basis / BTC (cost basis starts at 0,2105 × 96 699,71 € and grows
// by the full amount paid for every buy — the fee counts as cost).
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { NOT_IN_PROTOTYPE } from "@/components/NotInPrototype";
import { Num } from "@/components/Num";
import { Chart } from "@/components/Media";
import { Button, Chip, DetailRow, Divider, IconButton, ScreenHeader } from "@/components/ui";
import { IconBell } from "@/components/icons";
import { ASSETS, BTC_DETAIL } from "@/lib/legend";
import { btcPosition } from "@/lib/money";
import { crypto, eur, eurText, monoLiteral, NNBSP, pct, pctX100, THIN } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function BitcoinPage() {
  const router = useRouter();
  const { holdings, btcCostCents, resetBuy } = useStore();
  const pos = btcPosition(holdings.BTC, btcCostCents);
  const btc = ASSETS.BTC;

  const buy = () => {
    resetBuy();
    router.push("/buy/amount");
  };

  return (
    <Screen
      className="buy1"
      actions={
        <div className="bottom-actions-row">
          {/* Sell is not in this prototype; kept visible as in the frame. */}
          <Button variant="secondary" onClick={() => router.push("/sell")}>Sell</Button>
          <Button onClick={buy}>Buy</Button>
        </div>
      }
    >
      <ScreenHeader
        onLeading={() => router.push("/home")}
        coin="BTC"
        title={btc.name}
        trailing={
          <IconButton label="Price alerts" onClick={() => router.push(NOT_IN_PROTOTYPE)}>
            <IconBell weight={1.5} />
          </IconButton>
        }
      />

      <div className="coin-price">
        <span className="t13 muted">Price</span>
        <span className="value mono">
          <Num faint>{eur(btc.priceCents)}</Num>
        </span>
        <div className="change-row">
          <span className="badge gain">
            <Num>{pct(btc.changePct, true)}</Num>
          </span>
          <span className="t13">{eurText(BTC_DETAIL.todayAbsCents, { sign: true })} today</span>
        </div>
      </div>

      <Chart kind="btc" className="coin-chart" />

      <div className="chips coin-chips" aria-hidden="true">
        {["1H", "1D", "1W", "1M", "1Y", "All"].map((x) => (
          <Chip key={x} selected={x === "1D"}>
            {x}
          </Chip>
        ))}
      </div>

      <section className="card position" aria-label="Your position">
        <span className="t13 muted">Your position</span>
        <div className="value-row">
          <span className="qty">
            <Num>{crypto(holdings.BTC, "BTC", 4)}</Num>
          </span>
          <span className="eur">
            <Num>{eur(pos.value)}</Num>
          </span>
        </div>
        <p className={"since " + (pos.gain >= 0 ? "gain" : "loss")}>
          {eurText(pos.gain, { sign: true })} · {pctX100(pos.gainPctX100, NNBSP)} since you started
        </p>
        <Divider />
        <DetailRow label="Average buy price" value={<Num>{eur(pos.avgPriceCents)}</Num>} />
      </section>

      <div className="stats">
        <div className="stat">
          <span className="k">24h high</span>
          <span className="v">{monoLiteral(BTC_DETAIL.high24h) + THIN}€</span>
        </div>
        <div className="stat">
          <span className="k">24h low</span>
          <span className="v">{monoLiteral(BTC_DETAIL.low24h) + THIN}€</span>
        </div>
        <div className="stat">
          <span className="k">Volume 24h</span>
          <span className="v">
            <Num>{monoLiteral(BTC_DETAIL.volume24h) + THIN + "€"}</Num>
          </span>
        </div>
      </div>
    </Screen>
  );
}
