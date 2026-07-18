"use client";
// app/search/page.tsx — Search, ported from searchflow.jsx. The source exports 3
// static hardcoded snapshots (value="", "bit", "bitcon") with a decorative,
// non-functional search field — no live typing exists there. Here they're one
// real screen: a live <input> + local useState drives an actual substring
// filter over FLUX.coins (name or symbol, case-insensitive), so Initial/
// Results/Empty are genuine states of real input and real data, not a fake
// form. Entry points: Markets' searchbar and Home's search icon, both
// previously inert. Recent chips (static demo list, like the source) re-run
// that coin's symbol as a query when tapped; result/popular rows go to
// /coin/[id], same as Markets' own list.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, eur, pct, chColor } from "@/lib/flux-data";

const RECENT = ["btc", "eth", "sol"];
const POPULAR = ["btc", "eth", "zec", "xrp", "ltc"];

function CoinLine({ id }: { id: string }) {
  const router = useRouter();
  const c = FLUX.coins[id];
  return (
    <button className="fl-coinrow" style={{ width: "100%", background: "none", border: "none" }} onClick={() => router.push(`/coin/${id}`)}>
      <CoinAvatar id={id} size={38} />
      <div style={{ display: "flex", flexDirection: "column", gap: 2, textAlign: "left" }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{c.name}</span>
        <span style={{ fontSize: 12.5, color: "#8A91A3" }}>{c.sym}</span>
      </div>
      <div style={{ marginLeft: "auto", textAlign: "right", display: "flex", flexDirection: "column", gap: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{eur(c.price)}</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: chColor(c.ch) }}>{pct(c.ch)}</span>
      </div>
    </button>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [showRecent, setShowRecent] = React.useState(true);
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => inputRef.current?.focus(), []);

  const query = q.trim().toLowerCase();
  const results = query
    ? Object.values(FLUX.coins).filter((c) => c.name.toLowerCase().includes(query) || c.sym.toLowerCase().includes(query))
    : [];

  const head = (
    <div className="fl-search-head">
      <div className={"fl-searchbar2" + (focused ? " focus" : "")}>
        {Ico.search("rgba(138,145,163,0.9)", 20)}
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search coins"
          className="fl-search-input"
          style={{ flex: 1, background: "none", border: "none", outline: "none", color: "#fff", fontSize: 15, fontWeight: 500, minWidth: 0 }}
        />
        {q && (
          <button className="fl-search-clear" onClick={() => { setQ(""); inputRef.current?.focus(); }} aria-label="Clear search">
            {Ico.close("rgba(255,255,255,0.7)", 18)}
          </button>
        )}
      </div>
      <button className="fl-search-cancel" onClick={() => router.back()}>Cancel</button>
    </div>
  );

  return (
    <PhoneFrame active="markets" scroll>
      {head}

      {!query && (
        <>
          {showRecent && RECENT.length > 0 && (
            <>
              <div className="fl-sec-head" style={{ marginTop: 18, marginBottom: 4 }}>
                <span className="fl-sec-title">Recent</span>
                <button className="fl-sec-link" style={{ background: "none", border: "none" }} onClick={() => setShowRecent(false)}>Clear</button>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                {RECENT.map((id) => (
                  <button key={id} className="fl-recentchip" onClick={() => setQ(FLUX.coins[id].sym)}>
                    <CoinAvatar id={id} size={20} />
                    {FLUX.coins[id].sym}
                  </button>
                ))}
              </div>
            </>
          )}
          <div className="fl-sec-head" style={{ marginTop: 16, marginBottom: 4 }}>
            <span className="fl-sec-title">Popular</span>
          </div>
          <div className="fl-coinlist">
            {POPULAR.map((id) => (
              <CoinLine key={id} id={id} />
            ))}
          </div>
        </>
      )}

      {query && results.length > 0 && (
        <>
          <div className="fl-search-count">{results.length} result{results.length === 1 ? "" : "s"}</div>
          <div className="fl-coinlist">
            {results.map((c) => (
              <CoinLine key={c.id} id={c.id} />
            ))}
          </div>
        </>
      )}

      {query && results.length === 0 && (
        <div className="fl-empty-wrap">
          <div className="fl-empty-ill">
            <div className="fl-empty-ring" />
            <div className="fl-empty-ring" style={{ width: 92, height: 92, animationDelay: ".5s" }} />
            {Ico.search("rgba(255,255,255,0.6)", 36)}
          </div>
          <h2 className="fl-empty-title">Nothing found</h2>
          <p className="fl-empty-sub">We couldn&apos;t find a coin matching &ldquo;{q}&rdquo;. Check the spelling or try another name.</p>
        </div>
      )}
    </PhoneFrame>
  );
}
