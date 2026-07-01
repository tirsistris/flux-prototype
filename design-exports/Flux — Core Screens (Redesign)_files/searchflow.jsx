// searchflow.jsx — Flux search: initial / results / empty. Exports 3 screens.
const { PhoneFrame, CoinAvatar, Ico, FLUX, eur, pct, chColor } = window;

function SearchBar({ value, focus }) {
  return (
    <div className={'fl-searchbar2' + (focus ? ' focus' : '')}>
      {Ico.search('rgba(138,145,163,0.9)', 20)}
      {value
        ? <span className="fl-search-q">{value}</span>
        : <span className="fl-search-ph">Search coins</span>}
      <span className="fl-search-caret" />
      {value && <button className="fl-search-clear">{Ico.close('rgba(255,255,255,0.7)', 18)}</button>}
    </div>
  );
}
function SearchHead({ value, focus }) {
  return (
    <div className="fl-search-head">
      <SearchBar value={value} focus={focus} />
      <button className="fl-search-cancel">Cancel</button>
    </div>
  );
}

function CoinLine({ id, showPrice }) {
  const c = FLUX.coins[id];
  return (
    <div className="fl-coinrow">
      <CoinAvatar id={id} size={38} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{c.name}</span>
        <span style={{ fontSize: 12.5, color: '#8A91A3' }}>{c.sym}</span>
      </div>
      {showPrice && (
        <div style={{ marginLeft: 'auto', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{eur(c.price)}</span>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: chColor(c.ch) }}>{pct(c.ch)}</span>
        </div>
      )}
    </div>
  );
}

// ── 1 · Initial ──────────────────────────────────────────────
function ScreenSearchInitial() {
  return (
    <PhoneFrame active="markets">
      <SearchHead value="" focus />
      <div className="fl-sec-head" style={{ marginTop: 18, marginBottom: 4 }}>
        <span className="fl-sec-title">Recent</span>
        <span className="fl-sec-link">Clear</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 4 }}>
        {['btc', 'eth', 'sol'].map((id) => (
          <button key={id} className="fl-recentchip"><CoinAvatar id={id} size={20} />{FLUX.coins[id].sym}</button>
        ))}
      </div>
      <div className="fl-sec-head" style={{ marginTop: 16, marginBottom: 4 }}>
        <span className="fl-sec-title">Popular</span>
      </div>
      <div className="fl-coinlist">
        {['btc', 'eth', 'zec', 'xrp', 'ltc'].map((id) => <CoinLine key={id} id={id} showPrice />)}
      </div>
    </PhoneFrame>
  );
}

// ── 2 · Results ──────────────────────────────────────────────
function ScreenSearchResults() {
  return (
    <PhoneFrame active="markets">
      <SearchHead value="bit" />
      <div className="fl-search-count">2 results</div>
      <div className="fl-coinlist">
        <CoinLine id="btc" showPrice />
        <CoinLine id="ltc" showPrice />
      </div>
    </PhoneFrame>
  );
}

// ── 3 · Empty ────────────────────────────────────────────────
function ScreenSearchEmpty() {
  return (
    <PhoneFrame active="markets">
      <SearchHead value="bitcon" />
      <div className="fl-empty-wrap">
        <div className="fl-empty-ill">
          <div className="fl-empty-ring" />
          <div className="fl-empty-ring" style={{ width: 92, height: 92, animationDelay: '.5s' }} />
          {Ico.search('rgba(255,255,255,0.6)', 36)}
        </div>
        <h2 className="fl-empty-title">Nothing found</h2>
        <p className="fl-empty-sub">We couldn't find a coin matching “bitcon”. Check the spelling or try another name.</p>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, { ScreenSearchInitial, ScreenSearchResults, ScreenSearchEmpty });
