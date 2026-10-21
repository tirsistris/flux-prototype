"use client";
// app/markets/page.tsx — Markets (Figma 2296:1076 / 2296:1824). Chips filter by the
// sign of the 24h change; Watchlist isn't in this prototype. The SOL nudge opens
// Earn 2 · Solana with the same estimate (SOL position × 5,8 %).
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { MarketRow } from "@/components/MarketRow";
import { NOT_IN_PROTOTYPE } from "@/components/NotInPrototype";
import { Chip, Coin, Divider, IconButton } from "@/components/ui";
import { IconChevR, IconSearch } from "@/components/icons";
import { ASSETS, EARN_MORE, MARKETS } from "@/lib/legend";
import { stakeEstimate, valueCents } from "@/lib/money";
import { cryptoText, eurText, NNBSP } from "@/lib/format";
import { useStore } from "@/lib/store";

type Filter = "all" | "gainers" | "losers";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "gainers", label: "Gainers" },
  { id: "losers", label: "Losers" },
];

export default function MarketsPage() {
  const router = useRouter();
  const { holdings } = useStore();
  const [filter, setFilter] = React.useState<Filter>("all");
  const rows = MARKETS.filter((m) => filter === "all" || (filter === "gainers" ? m.up : !m.up));
  const sol = EARN_MORE[0];
  const est = stakeEstimate(valueCents(holdings.SOL, ASSETS.SOL.priceCents), sol.apyX1000);

  return (
    <Screen tab="markets">
      <div className="large-title">
        <h1>Markets</h1>
        <IconButton label="Search" onClick={() => router.push("/search")}>
          <IconSearch />
        </IconButton>
      </div>
      <div className="chips markets-chips" role="group" aria-label="Filter">
        {FILTERS.map((f) => (
          <Chip key={f.id} selected={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </Chip>
        ))}
        <Chip onClick={() => router.push(NOT_IN_PROTOTYPE)}>Watchlist</Chip>
      </div>

      <Link href="/earn/solana" className="card earn-nudge">
        <span className="list-row">
          <Coin asset="SOL" size={36} />
          <span className="list-row-main">
            <span className="nudge-title">
              Your SOL could earn {sol.apy}
              {NNBSP}%
            </span>
            <span className="list-row-sub">
              ≈ {eurText(est.yearCents, { sign: true })} a year on {cryptoText(holdings.SOL, "SOL", 4)}
            </span>
          </span>
          <span className="row-chev">
            <IconChevR />
          </span>
        </span>
      </Link>

      <div className="section-head">
        <h2 className="section-title">On Flux, by market cap</h2>
        <span>24h</span>
      </div>
      <div className="card markets-list">
        {rows.map((m, i) => (
          <React.Fragment key={m.id}>
            {i > 0 && <Divider inset />}
            <MarketRow m={m} />
          </React.Fragment>
        ))}
      </div>
    </Screen>
  );
}
