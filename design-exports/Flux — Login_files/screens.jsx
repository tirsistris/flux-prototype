// screens.jsx — shared UI + the 5 Flux onboarding screens. Exports to window.
const { Coin, Ico } = window;

// ── helpers ───────────────────────────────────────────────────
function areaPath(vals, w, h, pad = 3) {
  const n = vals.length, max = Math.max(...vals), min = Math.min(...vals);
  const xs = i => pad + i * (w - 2 * pad) / (n - 1);
  const ys = v => h - pad - (v - min) / (max - min || 1) * (h - 2 * pad);
  let d = `M ${xs(0).toFixed(1)} ${ys(vals[0]).toFixed(1)}`;
  for (let i = 0; i < n - 1; i++) {
    const x0 = xs(i), y0 = ys(vals[i]), x1 = xs(i + 1), y1 = ys(vals[i + 1]);
    const cx = (x0 + x1) / 2;
    d += ` C ${cx.toFixed(1)} ${y0.toFixed(1)}, ${cx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return { line: d, area: `${d} L ${xs(n - 1).toFixed(1)} ${h} L ${xs(0).toFixed(1)} ${h} Z` };
}

function Sparkline({ vals, w, h, T, id }) {
  const { line, area } = areaPath(vals, w, h, 4);
  const gid = `g_${id}`, lid = `l_${id}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={T.accent.to} stopOpacity="0.42" />
          <stop offset="1" stopColor={T.accent.to} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={lid} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={T.accent.from} /><stop offset="1" stopColor={T.accent.to} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={`url(#${lid})`} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PrimaryButton({ label, onClick, T, icon }) {
  return (
    <button className="fx-primary" onClick={onClick} style={{
      background: `linear-gradient(135deg, ${T.accent.from}, ${T.accent.to})`,
      borderRadius: T.radius, boxShadow: `0 12px 34px ${T.accent.glow}, inset 0 1px 0 rgba(255,255,255,0.28)`,
    }}>
      <span>{label}</span>
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
    </button>
  );
}

function Dots({ active, total, T }) {
  return (
    <div style={{ display: 'flex', gap: 7, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height: 6, borderRadius: 99, transition: 'all .35s cubic-bezier(.22,1,.36,1)',
          width: i === active ? 22 : 6,
          background: i === active ? `linear-gradient(90deg, ${T.accent.from}, ${T.accent.to})` : 'rgba(255,255,255,0.16)',
        }} />
      ))}
    </div>
  );
}

function TopChrome({ onBack, onSkip }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 36 }}>
      {onBack
        ? <button className="fx-icon-btn" onClick={onBack} aria-label="Back">{Ico.chevL('rgba(255,255,255,0.85)', 22)}</button>
        : <div style={{ width: 36 }} />}
      {onSkip
        ? <button className="fx-skip" onClick={onSkip}>Skip</button>
        : <div style={{ width: 36 }} />}
    </div>
  );
}

function Chip({ icon, label }) {
  return (
    <div className="fx-chip">
      <span style={{ display: 'flex', opacity: 0.9 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}

const Heading = ({ children }) => <h1 className="fx-h1">{children}</h1>;
const Body = ({ children }) => <p className="fx-body">{children}</p>;

// ── illustrations ─────────────────────────────────────────────
function CoinCluster() {
  // floating composition of token coins with depth
  const items = [
    { id: 'btc', size: 96, x: 0, y: 0, z: 3, delay: 0 },
    { id: 'eth', size: 64, x: -104, y: -26, z: 2, delay: .6 },
    { id: 'sol', size: 56, x: 96, y: -44, z: 2, delay: 1.1 },
    { id: 'usdc', size: 50, x: 108, y: 58, z: 1, delay: .3 },
    { id: 'xrp', size: 44, x: -110, y: 64, z: 1, delay: .9 },
    { id: 'uni', size: 38, x: -8, y: 96, z: 1, delay: 1.4 },
  ];
  return (
    <div style={{ position: 'relative', width: 280, height: 248, margin: '0 auto' }}>
      {/* soft halo */}
      <div style={{ position: 'absolute', inset: '8% 14%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,97,255,0.30), transparent 68%)', filter: 'blur(8px)' }} />
      {items.map((it, i) => (
        <div key={i} className="fx-float" style={{
          position: 'absolute', left: '50%', top: '50%',
          transform: `translate(calc(-50% + ${it.x}px), calc(-50% + ${it.y}px))`,
          zIndex: it.z, animationDelay: `${it.delay}s`,
          opacity: it.z === 1 ? 0.92 : 1,
        }}>
          <Coin id={it.id} size={it.size} />
        </div>
      ))}
    </div>
  );
}

function MiniPortfolio({ T }) {
  const vals = [4, 5, 4.4, 6, 5.6, 7.4, 7, 8.6, 8.2, 9.6, 10.2, 11];
  return (
    <div style={{ position: 'relative', width: 260, margin: '0 auto' }}>
      <div className="fx-card" style={{ borderRadius: 22, padding: '18px 18px 14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Coin id="btc" size={34} glowScale={0.4} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Your first €1</span>
            <span style={{ fontSize: 12, color: 'rgba(235,235,245,0.5)' }}>Bitcoin · BTC</span>
          </div>
          <div className="fx-pill-green" style={{ marginLeft: 'auto' }}>+3.1%</div>
        </div>
        <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>€1.03</div>
        <div style={{ fontSize: 12.5, color: '#3FD68C', fontWeight: 600, marginTop: 2, marginBottom: 8 }}>+€0.03 today</div>
        <Sparkline vals={vals} w={224} h={62} T={T} id="mini" />
      </div>
      {/* floating €1 chips */}
      <div className="fx-float fx-euro" style={{ left: -22, top: 150, animationDelay: '.2s' }}>€1</div>
      <div className="fx-float fx-euro" style={{ right: -18, top: 150, animationDelay: '1s' }}>€1</div>
    </div>
  );
}

function SecurityShield({ T }) {
  return (
    <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {[210, 168, 130].map((d, i) => (
        <div key={i} className="fx-ring" style={{
          position: 'absolute', width: d, height: d, borderRadius: '50%',
          border: `1px solid rgba(123,97,255,${0.05 + i * 0.05})`, animationDelay: `${i * 0.4}s`,
        }} />
      ))}
      <div style={{ position: 'absolute', width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,97,255,0.30), transparent 70%)', filter: 'blur(6px)' }} />
      {/* shield */}
      <div style={{
        width: 104, height: 116, position: 'relative',
        clipPath: 'path("M52 2 C52 2 96 14 96 14 L96 60 C96 92 74 108 52 116 C30 108 8 92 8 60 L8 14 C8 14 52 2 52 2 Z")',
        background: `linear-gradient(150deg, ${T.accent.from}, ${T.accent.to})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 18px 44px ${T.accent.glow}`,
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.22), transparent 45%)' }} />
        {Ico.lock('#fff', 40)}
      </div>
    </div>
  );
}

function FluxLogo({ T, size = 64 }) {
  const v = [3, 5, 4, 7, 6, 9];
  const { line } = areaPath(v, size * 0.62, size * 0.42, 2);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.3,
        background: `linear-gradient(150deg, ${T.accent.from}, ${T.accent.to})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 16px 40px ${T.accent.glow}, inset 0 1.5px 0 rgba(255,255,255,0.3)`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(255,255,255,0.2), transparent 50%)' }} />
        <svg width={size * 0.62} height={size * 0.42} viewBox={`0 0 ${size * 0.62} ${size * 0.42}`} style={{ position: 'relative' }}>
          <path d={line} fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx={size * 0.62 - 2} cy={size * 0.42 * (1 - (9 - 3) / (9 - 3)) + 2} r="3.2" fill="#fff" />
        </svg>
      </div>
      <span style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>Flux</span>
    </div>
  );
}

// ── the screens ───────────────────────────────────────────────
function ScreenWelcome({ T, onNext, onLogin }) {
  return (
    <div className="fx-screen">
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 0 }}>
        <FluxLogo T={T} />
        <h1 className="fx-h1" style={{ marginTop: 40, fontSize: 34 }}>{T.slogan}</h1>
        <Body>Buy, hold and grow your money — without the confusing jargon.</Body>
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
        <PrimaryButton label="Get started" onClick={onNext} T={T} />
        <button className="fx-textlink" onClick={onLogin}>I already have an account</button>
      </div>
    </div>
  );
}

function ScreenValue({ T, page, onNext, onBack, onSkip, illo, kicker, title, body }) {
  return (
    <div className="fx-screen">
      <TopChrome onBack={onBack} onSkip={onSkip} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 36 }}>
        <div>{illo}</div>
        <div style={{ textAlign: 'center', padding: '0 4px' }}>
          {kicker && <div className="fx-kicker">{kicker}</div>}
          <Heading>{title}</Heading>
          <Body>{body}</Body>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 22, alignItems: 'center' }}>
        <Dots active={page - 1} total={3} T={T} />
        <PrimaryButton label={page === 3 ? 'Continue' : 'Next'} onClick={onNext} T={T} icon={Ico.arrowR('#fff', 19)} />
      </div>
    </div>
  );
}

function ScreenSignup({ T, onBack, onCreate, onLogin }) {
  return (
    <div className="fx-screen">
      <TopChrome onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <FluxLogo T={T} size={52} />
        </div>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Heading>Create your account</Heading>
          <Body>It only takes a minute. Your money stays yours, always.</Body>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <PrimaryButton label="Create account" onClick={onCreate} T={T} />
          <div className="fx-or"><span>or continue with</span></div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="fx-outline" onClick={onCreate}>{Ico.apple('#fff', 19)}<span>Apple</span></button>
            <button className="fx-outline" onClick={onCreate}>{Ico.google('#fff', 18)}<span>Google</span></button>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
        <button className="fx-textlink" onClick={onLogin}>I already have an account</button>
        <p className="fx-terms">By continuing you agree to Flux's <a>Terms</a> & <a>Privacy Policy</a>.</p>
      </div>
    </div>
  );
}

function SuccessOverlay({ T, onDone }) {
  return (
    <div className="fx-overlay">
      <div className="fx-success-card">
        <div className="fx-success-badge" style={{ background: `linear-gradient(150deg, ${T.accent.from}, ${T.accent.to})`, boxShadow: `0 16px 40px ${T.accent.glow}` }}>
          {Ico.check('#fff', 38)}
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: '22px 0 6px' }}>You're all set</h2>
        <p style={{ fontSize: 15, color: 'rgba(235,235,245,0.6)', margin: 0, lineHeight: 1.5 }}>Welcome to Flux. Let's buy your first crypto.</p>
        <button className="fx-textlink" style={{ marginTop: 22 }} onClick={onDone}>Back to start</button>
      </div>
    </div>
  );
}

Object.assign(window, {
  Sparkline, PrimaryButton, Dots, TopChrome, Chip, CoinCluster, MiniPortfolio, SecurityShield, FluxLogo,
  ScreenWelcome, ScreenValue, ScreenSignup, SuccessOverlay, Ico,
});
