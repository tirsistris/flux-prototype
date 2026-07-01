// screen-receive.jsx — Flux Receive crypto. Exports ScreenReceive.
const { PhoneFrame, CoinAvatar, Ico, FLUX } = window;

const ADDR = '0x7d3F1a9C42eb8B0a14F9c2Ab88c5d10e3F2a1b9c';
const ADDR_SHORT = ADDR.slice(0, 6) + '…' + ADDR.slice(-4);

// deterministic faux-QR (geometric squares) — placeholder for a real QR
function QRCode({ size = 196 }) {
  const N = 25, cell = size / N;
  // seeded pseudo-random fill
  let s = 0x9e3779b9;
  const rnd = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  const isFinder = (r, c) => {
    const inBox = (br, bc) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
  };
  const cells = [];
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    if (isFinder(r, c)) continue;
    if (rnd() > 0.55) cells.push(<rect key={r + '-' + c} x={c * cell} y={r * cell} width={cell} height={cell} rx={cell * 0.22} fill="#0A0D1A" />);
  }
  const Finder = ({ x, y }) => (
    <g>
      <rect x={x} y={y} width={cell * 7} height={cell * 7} rx={cell * 1.4} fill="#0A0D1A" />
      <rect x={x + cell} y={y + cell} width={cell * 5} height={cell * 5} rx={cell} fill="#fff" />
      <rect x={x + cell * 2} y={y + cell * 2} width={cell * 3} height={cell * 3} rx={cell * 0.7} fill="#0A0D1A" />
    </g>
  );
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {cells}
      <Finder x={0} y={0} />
      <Finder x={cell * (N - 7)} y={0} />
      <Finder x={0} y={cell * (N - 7)} />
      {/* center coin badge */}
      <circle cx={size / 2} cy={size / 2} r={cell * 3.4} fill="#fff" />
    </svg>
  );
}

function ScreenReceive() {
  const footer = (
    <div className="fl-recv-warn">
      {Ico.shield('#F8C66B', 18)}
      <span>Only send <b>Bitcoin</b> on the <b>Bitcoin network</b> to this address. Other assets may be lost.</span>
    </div>
  );
  return (
    <PhoneFrame footer={footer}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm">{Ico.chevL('rgba(255,255,255,0.85)', 20)}</button>
        <span className="fl-flow-title">Receive</span>
        <div style={{ width: 34 }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
        <button className="fl-coinchip"><CoinAvatar id="btc" size={24} /><span>Bitcoin · Bitcoin network</span>{Ico.chevD('rgba(255,255,255,0.55)', 16)}</button>
      </div>

      <div className="fl-recv-mid">
        <div className="fl-qr-plaque">
          <QRCode size={196} />
          <div className="fl-qr-coin"><CoinAvatar id="btc" size={40} /></div>
        </div>
        <span className="fl-recv-label">Your Bitcoin address</span>
        <div className="fl-recv-addr">{ADDR}</div>
      </div>

      <div className="fl-recv-actions">
        <button className="fl-recv-btn">{Ico.copy('#fff', 19)}<span>Copy address</span></button>
        <button className="fl-recv-btn">{Ico.share('#fff', 19)}<span>Share</span></button>
      </div>
    </PhoneFrame>
  );
}

window.ScreenReceive = ScreenReceive;
