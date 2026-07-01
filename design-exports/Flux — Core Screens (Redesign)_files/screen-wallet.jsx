// screen-wallet.jsx — Flux Wallet, restyled. Exports ScreenWallet.
const { PhoneFrame, AreaChart, CoinAvatar, Ico, FLUX, eur, pct, signEur, chColor, BalAmt } = window;

function WalletAction({ icon, label, primary }) {
  return (
    <button className={'fl-action' + (primary ? ' primary' : '')}>
      <span className={'fl-action-ico' + (primary ? ' primary' : '')}>{icon}</span>
      <span className="fl-action-label">{label}</span>
    </button>
  );
}

function TxRow({ tx }) {
  const up = tx.amt >= 0;
  return (
    <div className="fl-tx-row">
      <CoinAvatar id={tx.coin} size={38} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: '#fff' }}>{tx.name}</span>
        <span style={{ fontSize: 12, color: '#8A91A3' }}>{tx.date}</span>
      </div>
      <div style={{ marginLeft: 'auto', textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span style={{ fontSize: 14.5, fontWeight: 700, color: chColor(tx.amt) }}>{signEur(tx.amt)}</span>
        <span style={{ fontSize: 11.5, color: '#8A91A3' }}>{tx.ago}</span>
      </div>
    </div>
  );
}

function ScreenWallet() {
  return (
    <PhoneFrame active="wallet">
      <div className="fl-wallet-head">
        <button className="fl-cur-sel">EUR {Ico.chevD('rgba(255,255,255,0.6)', 16)}</button>
        <span className="fl-wallet-title">Wallet Balance</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="fl-roundbtn sm">{Ico.chevD('rgba(255,255,255,0.7)', 16)}</button>
          <button className="fl-roundbtn sm">{Ico.dots('rgba(255,255,255,0.7)', 18)}</button>
        </div>
      </div>

      <div className="fl-balance center">
        <div className="fl-bal-label">Total balance</div>
        <div className="fl-bal-row">
          <BalAmt n={FLUX.balance} />
        </div>
        <div className="fl-bal-change" style={{ color: chColor(FLUX.dayPct) }}>
          {signEur(FLUX.dayAbs)} ({pct(FLUX.dayPct)})
        </div>
      </div>

      <div className="fl-actions" style={{ marginTop: 18 }}>
        <WalletAction icon={Ico.receive('rgba(255,255,255,0.92)', 22)} label="Receive" />
        <WalletAction icon={Ico.send('rgba(255,255,255,0.92)', 22)} label="Send" />
        <WalletAction icon={Ico.swap('rgba(255,255,255,0.92)', 22)} label="Swap" />
      </div>

      <div style={{ marginTop: 20 }}>
        <AreaChart vals={FLUX.curve} w={342} h={132} label={eur(23565.23, 2)} id="wallet" />
      </div>

      <div className="fl-sec-head" style={{ marginTop: 16 }}>
        <span className="fl-sec-title">Transactions</span>
        <span className="fl-sec-link">See all</span>
      </div>
      <div className="fl-tx-list">
        {FLUX.txs.slice(0, 3).map((tx, i) => <TxRow key={i} tx={tx} />)}
      </div>
    </PhoneFrame>
  );
}

window.ScreenWallet = ScreenWallet;
