"use client";
// app/home/page.tsx — Home (Figma 2312:5726 / 2312:5928). Balances come from the
// store, so a finished purchase shows here at once: BTC quantity and value, and
// the total as the sum of the rounded position values (as legend.md does it).
import React from "react";
import Link from "next/link";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { Chart, Person } from "@/components/Media";
import { Coin, Divider, IconButton } from "@/components/ui";
import { IconAddCircle, IconBell, IconChevR, IconEye, IconRecv, IconScan, IconSend, IconSwap } from "@/components/icons";
import { ASSETS, ETH_STAKED, NOW, PERSONA, TODAY } from "@/lib/legend";
import { portfolio } from "@/lib/money";
import { crypto, eur, eurText, fixed, NNBSP, pct } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const { holdings } = useStore();
  const [hidden, setHidden] = React.useState(false);
  const p = portfolio(holdings);

  return (
    <Screen tab="home">
      <div className="home-greeting">
        <Person who="mila" size={44} alt={`${PERSONA.first} ${PERSONA.last}`} />
        <div className="hello">
          <span className="t13 muted">{NOW.dateLong}</span>
          <span className="serif">Good morning, {PERSONA.first}</span>
        </div>
        <IconButton label="Scan QR code" inert>
          <IconScan />
        </IconButton>
        <span className="bell">
          <IconButton label="Notifications" inert>
            <IconBell />
          </IconButton>
          <span className="unread" aria-hidden="true" />
        </span>
      </div>

      <div className="home-balance">
        <div className="label">
          Total balance
          <button type="button" onClick={() => setHidden((h) => !h)} aria-label={hidden ? "Show balance" : "Hide balance"} aria-pressed={hidden}>
            <IconEye />
          </button>
        </div>
        <div className="value mono">{hidden ? "••••••" : <Num faint>{eur(p.total)}</Num>}</div>
        <div className="change-row">
          <span className="badge gain">
            <Num>{pct(TODAY.pct, true)}</Num>
          </span>
          <span className="t13">{eurText(TODAY.absCents, { sign: true })} today · mostly Bitcoin</span>
        </div>
      </div>

      <Chart kind="home" className="home-chart" />

      <div className="periods" aria-hidden="true">
        {["1D", "1W", "1M", "1Y", "All"].map((x) => (
          <span key={x} className={"period" + (x === "1D" ? " on" : "")}>
            {x}
          </span>
        ))}
      </div>

      <div className="home-actions">
        <Link href="/buy" className="home-action primary">
          <span className="circle">
            <IconAddCircle size={24} weight={1.5} />
          </span>
          Buy
        </Link>
        <button type="button" className="home-action" data-inert disabled>
          <span className="circle">
            <IconSend />
          </span>
          Send
        </button>
        <button type="button" className="home-action" data-inert disabled>
          <span className="circle">
            <IconRecv />
          </span>
          Receive
        </button>
        <button type="button" className="home-action" data-inert disabled>
          <span className="circle">
            <IconSwap />
          </span>
          Swap
        </button>
      </div>

      <section className="card assets" aria-label="Your assets">
        <div className="assets-head">
          <span>Your assets</span>
          <IconChevR />
        </div>
        <div className="list-row">
          <Coin asset="EUR" />
          <div className="list-row-main">
            <span className="list-row-title">Euro</span>
            <span className="list-row-sub mono">EUR</span>
          </div>
          <div className="list-row-side">
            <span className="primary">
              <Num>{eur(p.eur)}</Num>
            </span>
          </div>
        </div>
        <Divider inset />
        <Link href="/buy" className="list-row">
          <Coin asset="BTC" />
          <div className="list-row-main">
            <span className="list-row-title">{ASSETS.BTC.name}</span>
            <span className="list-row-sub mono">
              <Num>{crypto(holdings.BTC, "BTC", 4)}</Num>
            </span>
          </div>
          <div className="list-row-side">
            <span className="primary">
              <Num>{eur(p.btc)}</Num>
            </span>
            <span className="secondary gain">
              <Num>{pct(ASSETS.BTC.changePct, true)}</Num>
            </span>
          </div>
        </Link>
        <Divider inset />
        <div className="list-row">
          <Coin asset="ETH" />
          <div className="list-row-main">
            <span className="list-row-title">{ASSETS.ETH.name}</span>
            <span className="list-row-sub">
              {fixed(holdings.ETH, 8, 4, NNBSP)}
              {NNBSP}ETH · {fixed(ETH_STAKED, 8, 1, NNBSP)} earning
            </span>
          </div>
          <div className="list-row-side">
            <span className="primary">
              <Num>{eur(p.eth)}</Num>
            </span>
            <span className="secondary loss">
              <Num>{pct(ASSETS.ETH.changePct, false)}</Num>
            </span>
          </div>
        </div>
        <Divider inset />
        <div className="list-row">
          <Coin asset="SOL" />
          <div className="list-row-main">
            <span className="list-row-title">{ASSETS.SOL.name}</span>
            <span className="list-row-sub mono">
              <Num>{crypto(holdings.SOL, "SOL", 4)}</Num>
            </span>
          </div>
          <div className="list-row-side">
            <span className="primary">
              <Num>{eur(p.sol)}</Num>
            </span>
            <span className="secondary gain">
              <Num>{pct(ASSETS.SOL.changePct, true)}</Num>
            </span>
          </div>
        </div>
      </section>
    </Screen>
  );
}
