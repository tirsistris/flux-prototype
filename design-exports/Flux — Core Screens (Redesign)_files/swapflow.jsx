// swapflow.jsx — Flux "Swap" confirm + success (converter lives on Trade). Exports 2 screens.
const { PhoneFrame, CoinAvatar, Ico, FLUX, eur, fmtNum, ACCENT } = window;

const SB = FLUX.coins.btc, SE = FLUX.coins.eth;
const PAY_BTC = 0.1;
const PAY_VAL = PAY_BTC * SB.price;               // 10 574,11 €
const REC_VAL = PAY_VAL * (1 - 0.0024);           // 0,24% spread
const REC_ETH = REC_VAL / SE.price;
const RATE = SB.price / SE.price;                 // 1 BTC = N ETH

function SwapPair({ big }) {
  return (
    <div className={'fl-swap-pair' + (big ? ' big' : '')}>
      <div className="fl-swap-leg">
        <CoinAvatar id="btc" size={big ? 44 : 38} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span className="fl-swap-amt">{fmtNum(PAY_BTC, 4)} BTC</span>
          <span className="fl-swap-sub">From · {eur(PAY_VAL)}</span>
        </div>
      </div>
      <div className="fl-swap-arrow">{Ico.swapV ? Ico.swapV('#fff', 20) : Ico.swap('#fff', 20)}</div>
      <div className="fl-swap-leg">
        <CoinAvatar id="eth" size={big ? 44 : 38} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span className="fl-swap-amt">{fmtNum(REC_ETH, 4)} ETH</span>
          <span className="fl-swap-sub">To · {eur(REC_VAL)}</span>
        </div>
      </div>
    </div>
  );
}

function SwSumRow({ label, value, total }) {
  return (
    <div className={'fl-sum-row' + (total ? ' total' : '')}>
      <span className="fl-sum-label">{label}</span>
      <span className="fl-sum-val">{value}</span>
    </div>
  );
}

// ── 1 · Confirm swap ─────────────────────────────────────────
function ScreenSwapConfirm() {
  const footer = (
    <div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: '100%' }}>Confirm swap</button></div>
  );
  return (
    <PhoneFrame footer={footer}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm">{Ico.chevL('rgba(255,255,255,0.85)', 20)}</button>
        <span className="fl-flow-title">Confirm swap</span>
        <div style={{ width: 34 }} />
      </div>

      <div className="fl-card fl-swap-hero">
        <SwapPair big />
      </div>

      <div className="fl-summary">
        <SwSumRow label="Rate" value={`1 BTC = ${fmtNum(RATE, 4)} ETH`} />
        <SwSumRow label="Spread (0,24 %)" value={eur(PAY_VAL - REC_VAL)} />
        <SwSumRow label="Network fee" value={eur(1.90)} />
        <SwSumRow label="You receive" value={`${fmtNum(REC_ETH, 4)} ETH`} total />
      </div>

      <p className="fl-disclaimer">
        Crypto prices can move quickly. The amount of ETH you receive may differ slightly
        from the estimate shown above.
      </p>
    </PhoneFrame>
  );
}

// ── 2 · Success ──────────────────────────────────────────────
function ScreenSwapSuccess() {
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
        <h2 className="fl-success-title">Swap complete</h2>
        <p className="fl-success-sub">Your coins have been exchanged.</p>
        <div className="fl-swap-result">
          <div className="fl-swap-res-leg">
            <CoinAvatar id="btc" size={34} />
            <span>{fmtNum(PAY_BTC, 4)} BTC</span>
          </div>
          <span className="fl-swap-res-arrow">{Ico.arrowR('#A78BFA', 22)}</span>
          <div className="fl-swap-res-leg">
            <CoinAvatar id="eth" size={34} />
            <span>{fmtNum(REC_ETH, 4)} ETH</span>
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, { ScreenSwapConfirm, ScreenSwapSuccess });
