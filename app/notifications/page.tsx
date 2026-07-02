"use client";
// app/notifications/page.tsx — Notifications feed, ported from notifyflow.jsx
// ScreenNotifications. Static demo feed (NOTIFS) — all coins referenced (btc, eth,
// sol, zec) are real FLUX.coins entries; nothing invented. Entry point: the bell
// added to Home's header (AUTHORED — the source screen has none, matching the
// bell icon that already existed unused in components/icons.tsx). Tapping "Price
// alert" style rows doesn't deep-link anywhere (the demo has no per-alert detail
// screen) — the row itself isn't a control, just a static feed item, same as the
// rest of this list.
import React from "react";
import { useRouter } from "next/navigation";
import { PhoneFrame } from "@/components/frame/PhoneFrame";
import { CoinAvatar } from "@/components/fl/ui";
import { Ico } from "@/components/icons";
import { FLUX, GROWTH, FALL } from "@/lib/flux-data";

type Notif = {
  type: "price" | "tx" | "security";
  coin?: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  dir?: number;
};

const NOTIFS: Record<string, Notif[]> = {
  Today: [
    { type: "price", coin: "btc", title: "Bitcoin is up", body: "BTC rose +9,35 % to 105 741,12 € today.", time: "11:42", unread: true, dir: 1 },
    { type: "tx", coin: "eth", title: "Transfer completed", body: "You received 0,0236 ETH.", time: "09:18", unread: true },
    { type: "price", coin: "sol", title: "Solana is down", body: "SOL dropped -1,34 % to 159,36 €.", time: "08:03", unread: false, dir: -1 },
  ],
  Yesterday: [
    { type: "security", title: "New sign-in", body: "Your account was accessed from a new iPhone.", time: "21:50", unread: false },
    { type: "tx", coin: "btc", title: "Purchase completed", body: "You bought 0,000946 BTC for 100,00 €.", time: "18:24", unread: false },
    { type: "price", coin: "zec", title: "Price alert", body: "ZEC fell below your target of 500,00 €.", time: "12:11", unread: false, dir: -1 },
  ],
};

function NotifIcon({ n }: { n: Notif }) {
  if (n.type === "security") {
    return <div className="fl-notif-ico" style={{ background: "rgba(255,255,255,0.07)", borderColor: "rgba(255,255,255,0.12)" }}>{Ico.shield("#8A91A3", 22)}</div>;
  }
  if (n.type === "tx") {
    return <div className="fl-notif-ico" style={{ background: "rgba(74,222,128,0.13)", borderColor: "rgba(74,222,128,0.28)" }}>{Ico.check(GROWTH, 22)}</div>;
  }
  const up = (n.dir ?? 0) >= 0;
  return (
    <div className="fl-notif-ico" style={{ background: up ? "rgba(74,222,128,0.13)" : "rgba(248,113,113,0.13)", borderColor: up ? "rgba(74,222,128,0.28)" : "rgba(248,113,113,0.28)" }}>
      <span style={{ transform: up ? "none" : "rotate(90deg)", display: "flex" }}>{Ico.tabMarkets(up ? GROWTH : FALL, 22)}</span>
    </div>
  );
}

function NotifRow({ n }: { n: Notif }) {
  return (
    <div className={"fl-notif-row" + (n.unread ? " unread" : "")}>
      <NotifIcon n={n} />
      <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

export default function NotificationsPage() {
  const router = useRouter();
  return (
    <PhoneFrame scroll footer={<div style={{ height: 12 }} />}>
      <div className="fl-flow-head">
        <button className="fl-roundbtn sm" onClick={() => router.back()}>{Ico.chevL("#fff", 20)}</button>
        <span className="fl-flow-title">Notifications</span>
        {/* AUTHORED: the source has no way to reach ScreenPriceAlert from the list —
            without this there'd be no in-app entry point to /alerts/new at all. */}
        <button className="fl-roundbtn sm" onClick={() => router.push("/alerts/new")} aria-label="New price alert">{Ico.plus("#fff", 20)}</button>
      </div>

      {Object.entries(NOTIFS).map(([day, items]) => (
        <div key={day}>
          <div className="fl-notif-daylabel">{day}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {items.map((n, i) => (
              <NotifRow key={i} n={n} />
            ))}
          </div>
        </div>
      ))}
    </PhoneFrame>
  );
}
