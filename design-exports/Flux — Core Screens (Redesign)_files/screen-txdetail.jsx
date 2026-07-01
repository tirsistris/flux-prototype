// screen-txdetail.jsx — Flux transaction detail (tap a tx from the list). Exports ScreenTxDetail.
const { PhoneFrame, CoinAvatar, Ico, FLUX, eur, fmtNum, GROWTH } = window;

const TX = {
  kind: 'received',          // received | sent | swap
  coin: 'btc',
  amtCrypto: 0.0236,
  date: '30.11.25 · 11:44',
  from: '0x4f9…2ab',
  to: '0x1a2…f9c',
  network: 'Bitcoin',
  feeCrypto: 0.00008,
  hash: '0x9f2c4e7a…b3e1',
};
const KIND = {
  received: { label: 'Received', ico: Ico.receive, sign: 1 },
  sent: { label: 'Sent', ico: Ico.send, sign: -1 },
  swap: { label: 'Swapped', ico: Ico.swap, sign: 1 },
};

function DetailRow({ label, value, mono, copy, last }) {
  return (
    <div className={'fl-sum-row' + (last ? ' total' : '')}>
      <span className="fl-sum-label">{label}</span>
      <span className="fl-tx-val" style={{ fontVariantNumeric: mono ? 'tabular-nums' : 'normal' }}>
        {value}
        {copy && <button className="fl-tx-copy">{Ico.copy('#A78BFA', 16)}</button>}
      </span>
    </div>
  );
}

function ScreenTxDetail() {
  const c = FLUX.coins[TX.coin];
  const k = KIND[TX.kind];
  const eurVal = TX.amtCrypto * c.price;
  const feeEur = TX.feeCrypto * c.price;
  const signed = (k.sign >= 0 ? '+' : '-');

  const footer = (
    <div className="fl-ctabar"><button className="fl-cta-sell" style={{ width: '100%' }}>Done</button></div>
  );

  return (
    <PhoneFrame footer={footer} scroll>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm">{Ico.chevL('rgba(255,255,255,0.85)', 20)}</button>
        <span className="fl-flow-title">Transaction</span>
        <div style={{ width: 34 }} />
      </div>

      <div className="fl-tx-top">
        <div className="fl-tx-kind-ico">
          {k.ico('#fff', 26)}
          <div className="fl-tx-coin-badge"><CoinAvatar id={TX.coin} size={26} /></div>
        </div>
        <div className="fl-tx-status">{Ico.check(GROWTH, 15)}<span>Completed</span></div>
        <div className="fl-tx-amt-wrap">
          <span className="fl-bal-amt" style={{ fontSize: 38 }}>{signed}{fmtNum(TX.amtCrypto, 4)}<span className="fl-bal-cur">{c.sym}</span></span>
          <span className="fl-tx-eur">≈ {eur(eurVal)}</span>
        </div>
      </div>

      <div className="fl-summary" style={{ marginTop: 8 }}>
        <DetailRow label="Type" value={k.label} />
        <DetailRow label="Date" value={TX.date} />
        <DetailRow label="From" value={TX.from} mono />
        <DetailRow label="To" value={TX.to} mono />
        <DetailRow label="Network" value={TX.network} />
        <DetailRow label="Network fee" value={`${fmtNum(TX.feeCrypto, 5)} ${c.sym} · ${eur(feeEur)}`} />
        <DetailRow label="Transaction hash" value={TX.hash} mono copy last />
      </div>

      <button className="fl-explorer" style={{ alignSelf: 'flex-start', marginTop: 16 }}>
        View on explorer {Ico.external('#A78BFA', 16)}
      </button>
    </PhoneFrame>
  );
}

window.ScreenTxDetail = ScreenTxDetail;
