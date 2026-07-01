// sendflow.jsx — Flux "Send crypto" flow (4 screens + QR scanner overlay).
const { PhoneFrame, StatusBar, CoinAvatar, Ico, FLUX, eur, fmtNum } = window;

const ETH = FLUX.coins.eth;
const sFmtAmt = (str) => {
  const [i, d] = String(str).split('.');
  const gi = (i || '0').replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  return d !== undefined ? gi + ',' + d : gi;
};

function SFlowHead({ title }) {
  return (
    <div className="fl-flow-head">
      <button className="fl-roundbtn sm">{Ico.chevL('rgba(255,255,255,0.85)', 20)}</button>
      <span className="fl-flow-title">{title}</span>
      <div style={{ width: 34 }} />
    </div>
  );
}
const sCta = (label) => (
  <div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: '100%' }}>{label}</button></div>
);

// ── 1 · Recipient ────────────────────────────────────────────
const RECENTS = [
  { name: 'Hardware wallet', addr: '0x7d3…a14', hue: 262 },
  { name: 'Anna', addr: '0x4f9…2ab', hue: 205 },
  { name: 'Saved address', addr: '0x88c…d10', hue: 150 },
];
function Ident({ hue }) {
  return <div className="fl-ident" style={{ background: `linear-gradient(135deg, hsl(${hue} 70% 62%), hsl(${hue + 40} 65% 48%))` }} />;
}
function ScreenSendRecipient() {
  return (
    <PhoneFrame footer={sCta('Continue')}>
      <SFlowHead title="Send" />
      <div style={{ marginTop: 8 }}>
        <h2 className="fl-flow-h2">Send to</h2>
        <p className="fl-flow-sub">Paste, type or scan a wallet address.</p>
      </div>

      <div className="fl-addr-field">
        <span className="fl-addr-placeholder">Address or ENS name</span>
        <button className="fl-addr-scan">{Ico.camera('#fff', 21)}</button>
      </div>

      <div className="fl-net-row">
        <span className="fl-flow-sub" style={{ margin: 0 }}>Network</span>
        <button className="fl-coinchip" style={{ padding: '6px 11px 6px 6px' }}><CoinAvatar id="eth" size={22} /><span>Ethereum</span>{Ico.chevD('rgba(255,255,255,0.55)', 15)}</button>
      </div>

      <div className="fl-sec-head" style={{ marginTop: 18, marginBottom: 8 }}><span className="fl-sec-title">Recent</span></div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {RECENTS.map((r, i) => (
          <button key={i} className="fl-recent-row">
            <Ident hue={r.hue} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: '#fff' }}>{r.name}</span>
              <span style={{ fontSize: 12.5, color: '#8A91A3', fontVariantNumeric: 'tabular-nums' }}>{r.addr}</span>
            </div>
            <span style={{ marginLeft: 'auto', display: 'flex' }}>{Ico.chevR('rgba(255,255,255,0.3)', 18)}</span>
          </button>
        ))}
      </div>
    </PhoneFrame>
  );
}

// ── 2 · Amount ───────────────────────────────────────────────
function ScreenSendAmount() {
  const [amt, setAmt] = React.useState('1.5');
  const avail = 6.4;
  const eurVal = (parseFloat(amt || '0') || 0) * ETH.price;
  const press = (k) => setAmt((cur) => {
    if (k === 'del') return cur.length <= 1 ? '0' : cur.slice(0, -1);
    if (k === '.') return cur.includes('.') ? cur : cur + '.';
    if (cur === '0') return k;
    return (cur + k).slice(0, 9);
  });
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];
  return (
    <PhoneFrame footer={sCta('Continue')}>
      <SFlowHead title="Send" />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <button className="fl-coinchip"><CoinAvatar id="eth" size={24} /><span>Ethereum</span>{Ico.chevD('rgba(255,255,255,0.55)', 16)}</button>
      </div>

      <div className="fl-amount-mid">
        <div className="fl-amount-display">
          <span className="fl-bal-amt" style={{ fontSize: 46 }}>{sFmtAmt(amt)}<span className="fl-bal-cur">ETH</span></span>
        </div>
        <div className="fl-receive">≈ {eur(eurVal)}</div>
      </div>

      <div className="fl-avail-row">
        <span>Available <b style={{ color: '#fff', fontWeight: 600 }}>{fmtNum(avail, 4)} ETH</b></span>
        <button className="fl-max-btn" onClick={() => setAmt(String(avail))}>Max</button>
      </div>

      <div className="fl-numpad">
        {keys.map((k) => (
          <button key={k} className="fl-key" onClick={() => press(k)}>
            {k === 'del' ? Ico.backspace('rgba(255,255,255,0.85)', 24) : k}
          </button>
        ))}
      </div>
    </PhoneFrame>
  );
}

// ── 3 · Confirm ──────────────────────────────────────────────
function SSumRow({ label, value, total }) {
  return (
    <div className={'fl-sum-row' + (total ? ' total' : '')}>
      <span className="fl-sum-label">{label}</span>
      <span className="fl-sum-val">{value}</span>
    </div>
  );
}
function ScreenSendConfirm() {
  const amt = 1.5, fee = 0.0009;
  const eurVal = amt * ETH.price;
  return (
    <PhoneFrame footer={sCta('Confirm')}>
      <SFlowHead title="Confirm" />
      <div className="fl-card fl-confirm-hero">
        <CoinAvatar id="eth" size={48} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 12 }}>
          <span className="fl-bal-amt" style={{ fontSize: 30 }}>{fmtNum(amt, 4)}<span className="fl-bal-cur">ETH</span></span>
          <span style={{ fontSize: 13.5, color: '#8A91A3' }}>≈ {eur(eurVal)}</span>
        </div>
      </div>

      <div className="fl-summary">
        <SSumRow label="To" value="0x1a2…f9c" />
        <SSumRow label="Network" value="Ethereum" />
        <SSumRow label="Network fee" value={`${fmtNum(fee, 4)} ETH · ${eur(fee * ETH.price)}`} />
        <SSumRow label="Total" value={`${fmtNum(amt + fee, 4)} ETH`} total />
      </div>

      <div className="fl-warn">
        {Ico.shield('#F87171', 18)}
        <span>Crypto transfers are irreversible. Double-check the address before you confirm.</span>
      </div>
    </PhoneFrame>
  );
}

// ── 4 · Success ──────────────────────────────────────────────
function ScreenSendSuccess() {
  const amt = 1.5;
  const footer = (
    <div className="fl-ctabar col">
      <button className="fl-cta-buy" style={{ width: '100%' }}>View in wallet</button>
      <button className="fl-done-link">Done</button>
    </div>
  );
  return (
    <PhoneFrame footer={footer}>
      <div className="fl-success-wrap">
        <div className="fl-success-badge">
          <div className="fl-sring" style={{ width: 150, height: 150 }} />
          <div className="fl-sring" style={{ width: 118, height: 118, animationDelay: '.5s' }} />
          {Ico.check('#fff', 44)}
        </div>
        <h2 className="fl-success-title">Sent</h2>
        <p className="fl-success-sub">Your transfer is on its way.</p>
        <div className="fl-success-amt">
          <span className="fl-bal-amt" style={{ fontSize: 32 }}>{fmtNum(amt, 4)}<span className="fl-bal-cur">ETH</span></span>
          <span style={{ fontSize: 13.5, color: '#8A91A3', marginTop: 4 }}>to 0x1a2…f9c</span>
        </div>
        <button className="fl-explorer">0x9f2c…7b3e {Ico.external('#A78BFA', 16)}<span>View on explorer</span></button>
      </div>
    </PhoneFrame>
  );
}

// ── 5 · QR scanner overlay ───────────────────────────────────
function ScreenScanQR() {
  return (
    <div className="fl-phone fl-phone-scan">
      <div className="fl-island" />
      <StatusBar />
      <div className="fl-scan-body">
        <div className="fl-scan-top">
          <button className="fl-roundbtn sm">{Ico.close('#fff', 20)}</button>
          <span className="fl-flow-title">Scan QR</span>
          <div style={{ width: 34 }} />
        </div>
        <div className="fl-scan-center">
          <div className="fl-viewfinder">
            <div className="fl-vf-corner tl" /><div className="fl-vf-corner tr" />
            <div className="fl-vf-corner bl" /><div className="fl-vf-corner br" />
            <div className="fl-scanline" />
          </div>
          <p className="fl-scan-hint">Point at an address QR code</p>
        </div>
        <button className="fl-scan-paste">Paste address instead</button>
      </div>
      <div className="fl-home-ind" />
    </div>
  );
}

Object.assign(window, { ScreenSendRecipient, ScreenSendAmount, ScreenSendConfirm, ScreenSendSuccess, ScreenScanQR });
