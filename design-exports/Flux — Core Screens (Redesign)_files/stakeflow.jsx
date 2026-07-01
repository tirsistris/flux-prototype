// stakeflow.jsx — Flux staking detail + amount/confirm (from Earn). Exports 2 screens.
const { PhoneFrame, CoinAvatar, Ico, FLUX, eur, fmtNum, GROWTH } = window;

const STK = FLUX.coins.eth;
const APY = 4.20;
const STAKED_ETH = 1.85;        // existing stake (set 0 to hide)

function StakeStat({ label, value }) {
  return (
    <div className="fl-stat2">
      <span className="fl-stat2-label">{label}</span>
      <span className="fl-stat2-val">{value}</span>
    </div>
  );
}

function HowRow({ n, title, body }) {
  return (
    <div className="fl-how-row">
      <div className="fl-how-num">{n}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span className="fl-how-title">{title}</span>
        <span className="fl-how-body">{body}</span>
      </div>
    </div>
  );
}

// ── 1 · Stake asset detail ───────────────────────────────────
function ScreenStakeDetail() {
  const stakedEur = STAKED_ETH * STK.price;
  const yearEarn = stakedEur * APY / 100;
  const footer = (
    <div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: '100%' }}>Start earning</button></div>
  );
  return (
    <PhoneFrame footer={footer} scroll>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm">{Ico.chevL('rgba(255,255,255,0.85)', 20)}</button>
        <span className="fl-flow-title">Earn · {STK.sym}</span>
        <div style={{ width: 34 }} />
      </div>

      <div className="fl-stake-hero">
        <CoinAvatar id="eth" size={56} />
        <span className="fl-stake-apy"><span className="fl-bal-amt" style={{ fontSize: 44 }}>{fmtNum(APY, 2)}<span className="fl-bal-cur" style={{ color: GROWTH, fontSize: '0.5em' }}>% APY</span></span></span>
        <span className="fl-stake-hero-sub">Earn rewards on your Ethereum, paid automatically.</span>
      </div>

      <div className="fl-sec-head" style={{ marginTop: 8, marginBottom: 10 }}><span className="fl-sec-title">How it works</span></div>
      <div className="fl-card" style={{ padding: '6px 16px' }}>
        <HowRow n="1" title="Lock your ETH" body="Choose an amount and start earning right away." />
        <HowRow n="2" title="Earn every day" body="Rewards build up automatically at 4,20 % a year." />
        <HowRow n="3" title="Withdraw anytime" body="Unstake whenever you like after the lock period." />
      </div>

      <div className="fl-stat2-grid" style={{ marginTop: 16 }}>
        <StakeStat label="Lock period" value="7 days" />
        <StakeStat label="Payouts" value="Daily" />
      </div>

      {STAKED_ETH > 0 && (
        <>
          <div className="fl-sec-head" style={{ marginTop: 22, marginBottom: 10 }}><span className="fl-sec-title">Your stake</span></div>
          <div className="fl-card fl-holding">
            <CoinAvatar id="eth" size={42} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 14.5, fontWeight: 600, color: '#fff' }}>{fmtNum(STAKED_ETH, 4)} ETH</span>
              <span style={{ fontSize: 12.5, color: '#8A91A3' }}>{eur(stakedEur)}</span>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: GROWTH }}>+{eur(yearEarn)}</span>
              <span style={{ fontSize: 12, color: '#8A91A3' }}>per year</span>
            </div>
          </div>
        </>
      )}
    </PhoneFrame>
  );
}

// ── 2 · Amount + confirm ─────────────────────────────────────
function ScreenStakeAmount() {
  const [amt, setAmt] = React.useState('500');
  const avail = 22743.60;
  const eurVal = parseFloat(amt || '0') || 0;
  const ethVal = eurVal / STK.price;
  const yearEarn = eurVal * APY / 100;
  const press = (k) => setAmt((cur) => {
    if (k === 'del') return cur.length <= 1 ? '0' : cur.slice(0, -1);
    if (k === '.') return cur.includes('.') ? cur : cur + '.';
    if (cur === '0') return k;
    return (cur + k).slice(0, 9);
  });
  const fmtAmt = (str) => {
    const [i, d] = String(str).split('.');
    const gi = (i || '0').replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0');
    return d !== undefined ? gi + ',' + d : gi;
  };
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

  return (
    <PhoneFrame footer={<div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: '100%' }}>Confirm</button></div>}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm">{Ico.chevL('rgba(255,255,255,0.85)', 20)}</button>
        <span className="fl-flow-title">Stake ETH</span>
        <div style={{ width: 34 }} />
      </div>

      <div className="fl-amount-mid" style={{ gap: 14 }}>
        <div className="fl-amount-display">
          <span className="fl-bal-amt" style={{ fontSize: 50 }}>{fmtAmt(amt)}<span className="fl-bal-cur">€</span></span>
        </div>
        <div className="fl-receive">≈ {fmtNum(ethVal, 4)} ETH</div>
        <div className="fl-stake-forecast">
          {Ico.tabMarkets(GROWTH, 18)}
          <span>≈ <b style={{ color: GROWTH }}>{eur(yearEarn)}</b> a year at {fmtNum(APY, 2)} % APY</span>
        </div>
      </div>

      <div className="fl-avail-row">
        <span>Available <b style={{ color: '#fff', fontWeight: 600 }}>{eur(avail)}</b></span>
        <button className="fl-max-btn" onClick={() => setAmt(String(Math.floor(avail)))}>Max</button>
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

Object.assign(window, { ScreenStakeDetail, ScreenStakeAmount });
