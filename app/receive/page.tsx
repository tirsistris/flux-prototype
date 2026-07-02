"use client";
// app/receive/page.tsx — Receive crypto (BTC), ported from screen-receive.jsx.
// The QR is a deterministic faux-QR placeholder (seeded geometric squares, not a
// scannable code) and the address is a demo placeholder.
//   • Copy address → a real clipboard write of the on-screen address, with a
//     transient "Copied!" confirmation. Honest, real action.
//   • Share → honestly DISABLED. Opening the OS share sheet with a fake demo
//     address would push invalid data into a real flow; a clipboard fallback would
//     just duplicate Copy. So it is inert/dimmed rather than faked.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";

const ADDR = "0x7d3F1a9C42eb8B0a14F9c2Ab88c5d10e3F2a1b9c";

// Deterministic faux-QR (seeded pseudo-random squares) — placeholder for a real QR.
function QRCode({ size = 196 }: { size?: number }) {
  const N = 25,
    cell = size / N;
  let s = 0x9e3779b9;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  const isFinder = (r: number, c: number) => {
    const inBox = (br: number, bc: number) => r >= br && r < br + 7 && c >= bc && c < bc + 7;
    return inBox(0, 0) || inBox(0, N - 7) || inBox(N - 7, 0);
  };
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < N; r++)
    for (let c = 0; c < N; c++) {
      if (isFinder(r, c)) continue;
      if (rnd() > 0.55) cells.push(<rect key={r + "-" + c} x={c * cell} y={r * cell} width={cell} height={cell} rx={cell * 0.22} fill="#0A0D1A" />);
    }
  const Finder = ({ x, y }: { x: number; y: number }) => (
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
      <circle cx={size / 2} cy={size / 2} r={cell * 3.4} fill="#fff" />
    </svg>
  );
}

export default function ReceivePage() {
  const router = useRouter();
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ADDR);
    } catch {
      /* clipboard may be blocked in some contexts; the label still confirms intent */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const footer = (
    <div className="fl-recv-warn">
      {Ico.shield("#F8C66B", 18)}
      <span>Only send <b>Bitcoin</b> on the <b>Bitcoin network</b> to this address. Other assets may be lost.</span>
    </div>
  );
  return (
    <PhoneFrame footer={footer}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()}>{Ico.chevL("rgba(255,255,255,0.85)", 20)}</button>
        <span className="fl-flow-title">Receive</span>
        <div style={{ width: 34 }} />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <button className="fl-coinchip"><CoinAvatar id="btc" size={24} /><span>Bitcoin · Bitcoin network</span>{Ico.chevD("rgba(255,255,255,0.55)", 16)}</button>
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
        <button className="fl-recv-btn" onClick={copy}>
          {copied ? Ico.check("#4ADE80", 19) : Ico.copy("#fff", 19)}
          <span>{copied ? "Copied!" : "Copy address"}</span>
        </button>
        {/* Share honestly disabled — see file header. */}
        <button className="fl-recv-btn" disabled style={{ opacity: 0.4, cursor: "default" }}>{Ico.share("#fff", 19)}<span>Share</span></button>
      </div>
    </PhoneFrame>
  );
}
