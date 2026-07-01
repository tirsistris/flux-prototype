// buyflow.jsx — Flux "Buy crypto" flow (4 screens). Exports the 4 screens.
const { PhoneFrame, CoinAvatar, Ico, FLUX, eur, fmtNum } = window;

const BTC = FLUX.coins.btc;
const fmtAmt = (str) => {
  const [i, d] = String(str).split('.');
  const gi = (i || '0').replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
  return d !== undefined ? gi + ',' + d : gi;
};

// ── header (back + centered title) ───────────────────────────
function FlowHead({ title }) {
  return (
    <div className="fl-flow-head">
      <button className="fl-roundbtn sm">{Ico.chevL('rgba(255,255,255,0.85)', 20)}</button>
      <span className="fl-flow-title">{title}</span>
      <div style={{ width: 34 }} />
    </div>
  );
}
const ctaFooter = (label, primary = true) => (
  <div className="fl-ctabar">
    <button className={primary ? 'fl-cta-buy' : 'fl-cta-sell'} style={{ width: '100%' }}>{label}</button>
  </div>
);

// ── 1 · Amount ───────────────────────────────────────────────
function ScreenBuyAmount() {
  const [amt, setAmt] = React.useState('100');
  const [unit, setUnit] = React.useState('eur');
  const eurVal = parseFloat(amt || '0') || 0;
  const btcVal = eurVal / BTC.price;

  const press = (k) => setAmt((cur) => {
    if (k === 'del') return cur.length <= 1 ? '0' : cur.slice(0, -1);
    if (k === '.') return cur.includes('.') ? cur : cur + '.';
    if (cur === '0') return k;
    return (cur + k).slice(0, 9);
  });
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

  return (
    <PhoneFrame footer={ctaFooter('Continue')}>
      <FlowHead title="Buy" />

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}>
        <button className="fl-coinchip"><CoinAvatar id="btc" size={24} /><span>Bitcoin</span>{Ico.chevD('rgba(255,255,255,0.55)', 16)}</button>
      </div>

      <div className="fl-amount-mid">
        <div className="fl-amount-display">
          {unit === 'eur'
            ? <span className="fl-bal-amt" style={{ fontSize: 50 }}>{fmtAmt(amt)}<span className="fl-bal-cur">€</span></span>
            : <span className="fl-bal-amt" style={{ fontSize: 44 }}>{fmtNum(btcVal, 6)}<span className="fl-bal-cur">BTC</span></span>}
        </div>
        <div className="fl-unittog">
          <button className={unit === 'eur' ? 'on' : ''} onClick={() => setUnit('eur')}>EUR</button>
          <button className={unit === 'btc' ? 'on' : ''} onClick={() => setUnit('btc')}>BTC</button>
        </div>
        <div className="fl-receive">≈ {fmtNum(btcVal, 6)} BTC · {eur(eurVal)} </div>
      </div>

      <div className="fl-quick">
        {['50', '100', '250'].map((q) => (
          <button key={q} className={'fl-quickchip' + (amt === q ? ' on' : '')} onClick={() => setAmt(q)}>{q} €</button>
        ))}
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

// ── 2 · Payment method ───────────────────────────────────────
const METHODS = [
  { id: 'card', label: 'Visa card', sub: '•••• 4242', ico: Ico.card },
  { id: 'bank', label: 'Bank account', sub: 'IBAN •••• 8821', ico: Ico.bank },
  { id: 'apple', label: 'Apple Pay', sub: 'Default', ico: Ico.apple },
];
function ScreenBuyPayment() {
  const [sel, setSel] = React.useState('card');
  return (
    <PhoneFrame footer={ctaFooter('Continue')}>
      <FlowHead title="Payment" />
      <div style={{ marginTop: 8 }}>
        <h2 className="fl-flow-h2">How would you like to pay?</h2>
        <p className="fl-flow-sub">Choose a payment method for this purchase.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
        {METHODS.map((m) => (
          <button key={m.id} className={'fl-card fl-pay-row' + (sel === m.id ? ' on' : '')} onClick={() => setSel(m.id)}>
            <span className="fl-pay-ico">{m.ico('#fff', 22)}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{m.label}</span>
              <span style={{ fontSize: 12.5, color: '#8A91A3' }}>{m.sub}</span>
            </div>
            <div className={'fl-radio' + (sel === m.id ? ' on' : '')}>{sel === m.id && <div className="fl-radio-dot" />}</div>
          </button>
        ))}
      </div>
      <button className="fl-addmethod">+ Add a new method</button>
    </PhoneFrame>
  );
}

// ── 3 · Confirm ──────────────────────────────────────────────
function SumRow({ label, value, total }) {
  return (
    <div className={'fl-sum-row' + (total ? ' total' : '')}>
      <span className="fl-sum-label">{label}</span>
      <span className="fl-sum-val">{value}</span>
    </div>
  );
}
function ScreenBuyConfirm() {
  const eurVal = 100, fee = 1.49;
  const btcVal = eurVal / BTC.price;
  return (
    <PhoneFrame footer={ctaFooter('Confirm purchase')}>
      <FlowHead title="Confirm" />

      <div className="fl-card fl-confirm-hero">
        <CoinAvatar id="btc" size={48} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 12 }}>
          <span className="fl-bal-amt" style={{ fontSize: 30 }}>{fmtNum(btcVal, 6)}<span className="fl-bal-cur">BTC</span></span>
          <span style={{ fontSize: 13.5, color: '#8A91A3' }}>≈ for {eur(eurVal)}</span>
        </div>
      </div>

      <div className="fl-summary">
        <SumRow label="Pay with" value="Visa •••• 4242" />
        <SumRow label="Price" value={`${eur(BTC.price)} / BTC`} />
        <SumRow label="Fee" value={eur(fee)} />
        <SumRow label="Total" value={eur(eurVal + fee)} total />
      </div>

      <p className="fl-disclaimer">
        Crypto prices can move quickly. The final amount of BTC you receive may differ
        slightly from the estimate shown above.
      </p>
    </PhoneFrame>
  );
}

// ── 4 · Success ──────────────────────────────────────────────
function ScreenBuySuccess() {
  const eurVal = 100;
  const btcVal = eurVal / BTC.price;
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
          {Ico.check('#fff', 46)}
        </div>
        <h2 className="fl-success-title">Purchase complete</h2>
        <p className="fl-success-sub">You've added Bitcoin to your wallet.</p>
        <div className="fl-success-amt">
          <span className="fl-bal-amt" style={{ fontSize: 34 }}>{fmtNum(btcVal, 6)}<span className="fl-bal-cur">BTC</span></span>
          <span style={{ fontSize: 14, color: '#8A91A3', marginTop: 4 }}>{eur(eurVal + 1.49)} paid</span>
        </div>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, { ScreenBuyAmount, ScreenBuyPayment, ScreenBuyConfirm, ScreenBuySuccess });
