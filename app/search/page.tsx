"use client";
// app/search/page.tsx — Search: Start (Figma 2303:4921 / 2303:5495), Results
// (2303:5017 / 2303:5534), Nothing found (2303:5075 / 2303:5567). Live search over
// the coins on Flux by name and ticker, typo-tolerant (lib/search.ts). Recent chips
// fill the field; Cancel goes back.
import React from "react";
import { Screen } from "@/components/Screen";
import { ALL_COINS, coin, MarketRow } from "@/components/MarketRow";
import { useGoBack } from "@/components/NotInPrototype";
import { Chip, Divider } from "@/components/ui";
import { IconCloseCircle, IconSearch } from "@/components/icons";
import { SEARCH_RECENT, SEARCH_TRENDING, type Market } from "@/lib/legend";
import { matches } from "@/lib/search";

function List({ items }: { items: Market[] }) {
  return (
    <div className="card search-list">
      {items.map((m, i) => (
        <React.Fragment key={m.id}>
          {i > 0 && <Divider inset />}
          <MarketRow m={m} />
        </React.Fragment>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const back = useGoBack();
  const [q, setQ] = React.useState("");
  const input = React.useRef<HTMLInputElement>(null);
  const query = q.trim();
  const found = ALL_COINS.filter((m) => matches(m, query));

  return (
    <Screen>
      <div className="search-bar">
        <label className="search-field">
          <IconSearch />
          <input
            ref={input}
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Coins, e.g. Bitcoin"
            aria-label="Search coins"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
          {q && (
            <button
              type="button"
              className="search-clear"
              aria-label="Clear"
              onClick={() => {
                setQ("");
                input.current?.focus();
              }}
            >
              <IconCloseCircle />
            </button>
          )}
        </label>
        <button type="button" className="search-cancel" onClick={back}>
          Cancel
        </button>
      </div>

      {!query && (
        <>
          <h2 className="day-label search-label">RECENT</h2>
          <div className="chips search-recent">
            {SEARCH_RECENT.map((id) => (
              <Chip key={id} onClick={() => setQ(coin(id).name)}>
                {coin(id).name}
              </Chip>
            ))}
          </div>
          <h2 className="day-label search-label trending">TRENDING TODAY</h2>
          <List items={SEARCH_TRENDING.map(coin)} />
        </>
      )}

      {query && found.length > 0 && (
        <>
          <h2 className="day-label search-label">
            {found.length} {found.length === 1 ? "RESULT" : "RESULTS"}
          </h2>
          <List items={found} />
        </>
      )}

      {query && found.length === 0 && (
        <>
          <div className="search-empty">
            <span className="search-empty-icon">
              <IconSearch size={32} />
            </span>
            <h1 className="serif">Flux doesn’t list “{query}”</h1>
            <p>We add coins slowly and check each one first. Typos are fine — “bitcon” finds Bitcoin.</p>
          </div>
          <h2 className="day-label search-label popular">POPULAR ON FLUX</h2>
          <List items={[coin("BTC")]} />
        </>
      )}
    </Screen>
  );
}
