// screen-markets.jsx — Flux Markets, restyled. Exports ScreenMarkets.
const { PhoneFrame, Segmented, CoinAvatar, Ico, FLUX, eur, pct, chColor } = window;

function MarketRow({ id }) {
  const c = FLUX.coins[id];
  return (
    <div className="fl-mkt-row">
      <CoinAvatar id={id} size={40} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 86 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{c.name}</span>
        <span style={{ fontSize: 12, color: '#8A91A3' }}>{c.supply}</span>
      </div>
      <div style={{ marginLeft: 'auto', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: '#fff' }}>{eur(c.price)}</span>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: chColor(c.ch) }}>{pct(c.ch)}</span>
      </div>
    </div>
  );
}

function EarnCard({ e }) {
  const c = FLUX.coins[e.coin] || { name: e.name, sym: e.sym, id: e.coin };
  return (
    <div className="fl-card fl-earn-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <CoinAvatar id={e.coin} size={28} />
        <span style={{ fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{c.sym}</span>
        <span className="fl-apy-tag">APY</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 12 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: -0.4 }}>{pct(e.apy).replace('+', '')}</span>
      </div>
      <span style={{ fontSize: 12, color: '#8A91A3', marginTop: 2 }}>Earn on your {c.sym}</span>
    </div>
  );
}

function ScreenMarkets() {
  const [tab, setTab] = React.useState('For you');
  const lists = {
    'For you': ['btc', 'eth', 'zec', 'xrp', 'sol'],
    Crypto: ['btc', 'eth', 'sol', 'xrp', 'uni'],
    Gainers: ['btc', 'eth', 'ltc', 'xrp'],
    Hot: ['btc', 'sol', 'uni', 'zec'],
  };
  return (
    <PhoneFrame active="markets">
      <div className="fl-mkt-top">
        <button className="fl-roundbtn">{Ico.copy('rgba(255,255,255,0.8)', 19)}</button>
        <div className="fl-searchbar">{Ico.search('rgba(138,145,163,0.9)', 19)}<span>Search</span></div>
        <button className="fl-roundbtn">{Ico.sliders('rgba(255,255,255,0.8)', 19)}</button>
      </div>

      <div style={{ marginTop: 14 }}>
        <Segmented options={['For you', 'Crypto', 'Gainers', 'Hot']} value={tab} onChange={setTab} full={false} />
      </div>

      <div className="fl-mkt-list">
        {lists[tab].map((id) => <MarketRow key={id} id={id} />)}
      </div>

      <div className="fl-sec-head" style={{ marginTop: 4 }}>
        <span className="fl-sec-title">Earn</span>
        <span className="fl-sec-link">See all</span>
      </div>
      <div className="fl-earn-grid">
        {FLUX.earn.slice(0, 4).map((e, i) => <EarnCard key={i} e={e} />)}
      </div>
    </PhoneFrame>
  );
}

window.ScreenMarkets = ScreenMarkets;
