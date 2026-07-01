// notifyflow.jsx — Flux Notifications list + Create price alert. Exports 2 screens.
const { PhoneFrame, CoinAvatar, Ico, FLUX, eur, fmtNum, pct, GROWTH, FALL } = window;

// ── notification list ────────────────────────────────────────
const NOTIFS = {
  Today: [
    { type: 'price', coin: 'btc', title: 'Bitcoin is up', body: 'BTC rose +9,35 % to 105 741,12 € today.', time: '11:42', unread: true, dir: 1 },
    { type: 'tx', coin: 'eth', title: 'Transfer completed', body: 'You received 0,0236 ETH.', time: '09:18', unread: true },
    { type: 'price', coin: 'sol', title: 'Solana is down', body: 'SOL dropped -1,34 % to 159,36 €.', time: '08:03', unread: false, dir: -1 },
  ],
  Yesterday: [
    { type: 'security', title: 'New sign-in', body: 'Your account was accessed from a new iPhone.', time: '21:50', unread: false },
    { type: 'tx', coin: 'btc', title: 'Purchase completed', body: 'You bought 0,000946 BTC for 100,00 €.', time: '18:24', unread: false },
    { type: 'price', coin: 'zec', title: 'Price alert', body: 'ZEC fell below your target of 500,00 €.', time: '12:11', unread: false, dir: -1 },
  ],
};

function NotifIcon({ n }) {
  if (n.type === 'security') {
    return <div className="fl-notif-ico" style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.12)' }}>{Ico.shield('#8A91A3', 22)}</div>;
  }
  if (n.type === 'tx') {
    return <div className="fl-notif-ico" style={{ background: 'rgba(74,222,128,0.13)', borderColor: 'rgba(74,222,128,0.28)' }}>{Ico.check(GROWTH, 22)}</div>;
  }
  // price
  const up = n.dir >= 0;
  return (
    <div className="fl-notif-ico" style={{ background: up ? 'rgba(74,222,128,0.13)' : 'rgba(248,113,113,0.13)', borderColor: up ? 'rgba(74,222,128,0.28)' : 'rgba(248,113,113,0.28)' }}>
      <span style={{ transform: up ? 'none' : 'rotate(90deg)', display: 'flex' }}>{Ico.tabMarkets(up ? GROWTH : FALL, 22)}</span>
    </div>
  );
}

function NotifRow({ n }) {
  return (
    <div className={'fl-notif-row' + (n.unread ? ' unread' : '')}>
      <NotifIcon n={n} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className="fl-notif-title">{n.title}</span>
          {n.coin && <span className="fl-notif-coinchip"><CoinAvatar id={n.coin} size={15} />{FLUX.coins[n.coin]?.sym}</span>}
          <span className="fl-notif-time">{n.time}</span>
        </div>
        <span className="fl-notif-body">{n.body}</span>
      </div>
      {n.unread && <div className="fl-notif-dot" />}
    </div>
  );
}

function ScreenNotifications() {
  return (
    <PhoneFrame scroll footer={<div style={{ height: 12 }} />}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm">{Ico.chevL('rgba(255,255,255,0.85)', 20)}</button>
        <span className="fl-flow-title">Notifications</span>
        <div style={{ width: 34 }} />
      </div>

      {Object.entries(NOTIFS).map(([day, items]) => (
        <div key={day}>
          <div className="fl-notif-daylabel">{day}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {items.map((n, i) => <NotifRow key={i} n={n} />)}
          </div>
        </div>
      ))}
    </PhoneFrame>
  );
}

// ── create price alert ───────────────────────────────────────
function ScreenPriceAlert() {
  const coin = FLUX.coins.btc;
  const [cond, setCond] = React.useState('Above');
  const [amt, setAmt] = React.useState('110000');
  const [push, setPush] = React.useState(true);
  const target = parseFloat(amt || '0') || 0;
  const delta = ((target - coin.price) / coin.price) * 100;

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
    <PhoneFrame footer={<div className="fl-ctabar"><button className="fl-cta-buy" style={{ width: '100%' }}>Create alert</button></div>}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm">{Ico.chevL('rgba(255,255,255,0.85)', 20)}</button>
        <span className="fl-flow-title">New price alert</span>
        <div style={{ width: 34 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <button className="fl-coinchip"><CoinAvatar id="btc" size={24} /><span>Bitcoin</span>{Ico.chevD('rgba(255,255,255,0.55)', 16)}</button>
      </div>

      <div className="fl-cond-tog">
        <button className={cond === 'Above' ? 'on' : ''} onClick={() => setCond('Above')}>{Ico.tabMarkets(cond === 'Above' ? '#fff' : 'rgba(255,255,255,0.6)', 17)}Above</button>
        <button className={cond === 'Below' ? 'on' : ''} onClick={() => setCond('Below')}><span style={{ transform: 'rotate(90deg)', display: 'flex' }}>{Ico.tabMarkets(cond === 'Below' ? '#fff' : 'rgba(255,255,255,0.6)', 17)}</span>Below</button>
      </div>

      <div className="fl-amount-mid" style={{ flex: '0 0 auto', margin: '18px 0', gap: 8 }}>
        <span className="fl-alert-cap">Notify me when BTC goes {cond.toLowerCase()}</span>
        <div className="fl-amount-display"><span className="fl-bal-amt" style={{ fontSize: 46 }}>{fmtAmt(amt)}<span className="fl-bal-cur">€</span></span></div>
        <div className="fl-receive">Now {eur(coin.price)} · <span style={{ color: delta >= 0 ? GROWTH : FALL }}>{pct(delta)}</span> away</div>
      </div>

      <button className="fl-pushrow" onClick={() => setPush(p => !p)}>
        <span className="fl-pay-ico" style={{ width: 38, height: 38 }}>{Ico.bell('#fff', 19)}</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, textAlign: 'left' }}>
          <span style={{ fontSize: 14.5, fontWeight: 600, color: '#fff' }}>Push notification</span>
          <span style={{ fontSize: 12.5, color: '#8A91A3' }}>Alert me on this device</span>
        </div>
        <div className={'fl-switch' + (push ? ' on' : '')}><div className="fl-switch-knob" /></div>
      </button>

      <div className="fl-numpad" style={{ marginTop: 'auto' }}>
        {keys.map((k) => (
          <button key={k} className="fl-key" onClick={() => press(k)}>
            {k === 'del' ? Ico.backspace('rgba(255,255,255,0.85)', 24) : k}
          </button>
        ))}
      </div>
    </PhoneFrame>
  );
}

Object.assign(window, { ScreenNotifications, ScreenPriceAlert });
