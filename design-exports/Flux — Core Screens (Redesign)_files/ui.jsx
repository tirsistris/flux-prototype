// ui.jsx — shared Flux UI primitives in the onboarding visual language. Exports to window.
const { Coin, Ico, eur, pct, signEur, fmtNum, chColor, GROWTH, FALL } = window;

const ACCENT = { from: '#8B5CF6', to: '#6366F1', glow: 'rgba(124,92,246,0.45)' };

// ── status bar (white, integrated) ───────────────────────────
function StatusBar() {
  const c = '#fff';
  return (
    <div className="fl-statusbar">
      <span className="fl-time">6:19</span>
      <div className="fl-status-icons">
        <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="7" width="3" height="4" rx="0.6" fill={c} /><rect x="4.5" y="4.7" width="3" height="6.3" rx="0.6" fill={c} /><rect x="9" y="2.4" width="3" height="8.6" rx="0.6" fill={c} /><rect x="13.5" y="0" width="3" height="11" rx="0.6" fill={c} /></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.8c2.1 0 4 .8 5.4 2.2l1-1C12.7 2.3 10.5 1.3 8 1.3S3.3 2.3 1.6 4l1 1C4 3.6 5.9 2.8 8 2.8Z" fill={c} /><path d="M8 6c1.2 0 2.3.5 3.1 1.3l1-1C11 5.2 9.6 4.6 8 4.6s-3 .6-4.1 1.7l1 1C5.7 6.5 6.8 6 8 6Z" fill={c} /><circle cx="8" cy="9.4" r="1.3" fill={c} /></svg>
        <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke={c} strokeOpacity="0.4" fill="none" /><rect x="2" y="2" width="18" height="8" rx="1.8" fill={c} /><path d="M23 4v4c.7-.3 1.2-1 1.2-2S23.7 4.3 23 4Z" fill={c} fillOpacity="0.5" /></svg>
      </div>
    </div>
  );
}

// ── tab bar ──────────────────────────────────────────────────
const TABS = [
  { id: 'home', label: 'Home', ico: Ico.tabHome },
  { id: 'markets', label: 'Markets', ico: Ico.tabMarkets },
  { id: 'wallet', label: 'Wallet', ico: Ico.tabWallet },
  { id: 'trade', label: 'Trade', ico: Ico.tabTrade },
  { id: 'profile', label: 'Profile', ico: Ico.tabProfile },
];
function TabBar({ active }) {
  return (
    <div className="fl-tabbar">
      {TABS.map((t) => {
        const on = t.id === active;
        return (
          <div key={t.id} className="fl-tab">
            <div className={'fl-tab-ico' + (on ? ' on' : '')}>
              {t.ico(on ? '#0A0D1A' : 'rgba(255,255,255,0.5)', 23)}
            </div>
            <span style={{ color: on ? '#fff' : 'rgba(255,255,255,0.4)' }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── phone frame ──────────────────────────────────────────────
function PhoneFrame({ active, children, scroll = false, footer }) {
  return (
    <div className="fl-phone">
      <div className="fl-bg-glow" />
      <div className="fl-island" />
      <StatusBar />
      <div className={'fl-content' + (scroll ? ' scroll' : '')}>{children}</div>
      {footer || <TabBar active={active} />}
      <div className="fl-home-ind" />
    </div>
  );
}

// ── header (title + actions) ─────────────────────────────────
function ScreenHeader({ title, left, right }) {
  return (
    <div className="fl-screenhead">
      {left || <div style={{ minWidth: 1 }} />}
      {title && <h1 className="fl-screentitle">{title}</h1>}
      <div style={{ display: 'flex', gap: 10, marginLeft: 'auto' }}>{right}</div>
    </div>
  );
}
function RoundBtn({ children, onClick, active }) {
  return <button className={'fl-roundbtn' + (active ? ' active' : '')} onClick={onClick}>{children}</button>;
}

// ── segmented control ────────────────────────────────────────
function Segmented({ options, value, onChange, full = true }) {
  return (
    <div className={'fl-seg' + (full ? ' full' : '')}>
      {options.map((o) => (
        <button key={o} className={'fl-seg-item' + (o === value ? ' on' : '')} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

// ── pill chip ────────────────────────────────────────────────
function Pill({ icon, label, color }) {
  return (
    <div className="fl-pill">
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      <span style={{ color: color || '#fff' }}>{label}</span>
    </div>
  );
}

// ── primary / secondary action buttons ───────────────────────
function PrimaryBtn({ label, icon, onClick, style }) {
  return (
    <button className="fl-primary" onClick={onClick} style={style}>
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}<span>{label}</span>
    </button>
  );
}

// ── big balance / price (dense display grotesque, muted € ) ───
function BalAmt({ n, dec = 2, hidden = false }) {
  if (hidden) return <span className="fl-bal-amt">{'\u2022\u2022\u2022\u2022\u2022\u2022'}</span>;
  return <span className="fl-bal-amt">{fmtNum(n, dec)}<span className="fl-bal-cur">€</span></span>;
}

// ── coin avatar (uses Coin marks) ────────────────────────────
function CoinAvatar({ id, size = 40 }) {
  const known = ['btc', 'eth', 'sol', 'xrp', 'zec', 'uni', 'ltc', 'usdc'];
  if (known.includes(id)) return <Coin id={id} size={size} glowScale={0.35} />;
  return <div style={{ width: size, height: size, borderRadius: '50%', background: '#222838', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: size * 0.4 }}>{id.slice(0, 1).toUpperCase()}</div>;
}

// ── charts ───────────────────────────────────────────────────
function smoothPath(vals, w, h, pad = 4) {
  const n = vals.length, max = Math.max(...vals), min = Math.min(...vals);
  const xs = i => pad + i * (w - 2 * pad) / (n - 1);
  const ys = v => h - pad - (v - min) / (max - min || 1) * (h - 2 * pad);
  let d = `M ${xs(0).toFixed(1)} ${ys(vals[0]).toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const x0 = xs(i), y0 = ys(vals[i]), x1 = xs(i + 1), y1 = ys(vals[i + 1]);
    const cx = (x0 + x1) / 2;
    d += ` C ${cx.toFixed(1)} ${y0.toFixed(1)}, ${cx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return { line: d, area: `${d} L ${xs(n - 1).toFixed(1)} ${h} L ${xs(0).toFixed(1)} ${h} Z`, xs, ys };
}

function Sparkline({ vals, w, h, color, id, up = true }) {
  const { line, area } = smoothPath(vals, w, h, 3);
  const c = color || (up ? GROWTH : FALL);
  const gid = `sg_${id}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs><linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} stopOpacity="0.28" /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient></defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TIMEFRAMES = ['1H', '1D', '1W', '1M', '6M', '1Y'];
function AreaChart({ vals, w, h, label, id }) {
  const [tf, setTf] = React.useState('1W');
  // derive a per-timeframe variation deterministically
  const seed = TIMEFRAMES.indexOf(tf);
  const data = vals.map((v, i) => v + Math.sin(i * 0.7 + seed) * (2 + seed) + seed * 1.5);
  const { line, area, xs, ys } = smoothPath(data, w, h, 6);
  const peakIdx = data.indexOf(Math.max(...data));
  const gid = `ac_${id}`, lid = `acl_${id}`;
  return (
    <div>
      <div style={{ position: 'relative', height: h }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={ACCENT.from} stopOpacity="0.45" /><stop offset="1" stopColor={ACCENT.from} stopOpacity="0" /></linearGradient>
            <linearGradient id={lid} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={ACCENT.from} /><stop offset="1" stopColor={ACCENT.to} /></linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((g, i) => <line key={i} x1="0" x2={w} y1={h * g} y2={h * g} stroke="rgba(255,255,255,0.05)" strokeDasharray="2 5" />)}
          <path d={area} fill={`url(#${gid})`} />
          <path d={line} fill="none" stroke={`url(#${lid})`} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <line x1={xs(peakIdx)} x2={xs(peakIdx)} y1={ys(data[peakIdx])} y2={h} stroke="rgba(255,255,255,0.18)" strokeDasharray="3 3" />
          <circle cx={xs(peakIdx)} cy={ys(data[peakIdx])} r="5" fill="#fff" stroke={ACCENT.from} strokeWidth="2.5" />
        </svg>
        {label && (
          <div className="fl-chart-tip" style={{ left: Math.min(Math.max(xs(peakIdx) - 36, 0), w - 84), top: Math.max(ys(data[peakIdx]) - 30, 2) }}>
            {label}
          </div>
        )}
      </div>
      <div className="fl-tf-row">
        {TIMEFRAMES.map((t) => (
          <button key={t} className={'fl-tf' + (t === tf ? ' on' : '')} onClick={() => setTf(t)}>{t}</button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  ACCENT, StatusBar, TabBar, PhoneFrame, ScreenHeader, RoundBtn, Segmented, Pill,
  PrimaryBtn, BalAmt, CoinAvatar, Sparkline, AreaChart, smoothPath, TIMEFRAMES,
});
