"use client";
// app/profile/alerts/page.tsx — Price alerts (Figma 2317:7010 / 2317:7323). Toggles
// pause / resume an alert (sub-line follows); New alert adds a row on top. The fired
// alert has no detail screen in this prototype.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { NOT_IN_PROTOTYPE, useGoBack } from "@/components/NotInPrototype";
import { Button, Coin, Divider, Note, ScreenHeader, Toggle } from "@/components/ui";
import { IconAddCircle, IconChevR, IconInfo } from "@/components/icons";
import { FIRED_ALERT } from "@/lib/legend";
import { alertSub, alertTitle } from "@/lib/alerts";
import { useStore } from "@/lib/store";

export default function PriceAlertsPage() {
  const router = useRouter();
  const back = useGoBack();
  const { alerts, setAlertOn } = useStore();
  return (
    <Screen
      actions={
        <Button glyph={<IconAddCircle />} onClick={() => router.push("/profile/alerts/new")}>
          New alert
        </Button>
      }
    >
      <ScreenHeader title="Price alerts" onLeading={back} />

      <h2 className="day-label sub-label">ACTIVE</h2>
      <div className="card alerts-card">
        {alerts.map((a, i) => (
          <React.Fragment key={a.id}>
            {i > 0 && <Divider inset />}
            <div className="list-row alert-row">
              <Coin asset={a.asset} size={36} />
              <span className="list-row-main">
                <span className="alert-title">{alertTitle(a)}</span>
                <span className="list-row-sub">{alertSub(a)}</span>
              </span>
              <Toggle on={a.on} onChange={(v) => setAlertOn(a.id, v)} label={alertTitle(a)} />
            </div>
          </React.Fragment>
        ))}
      </div>

      <h2 className="day-label sub-label fired">FIRED</h2>
      <button type="button" className="card alerts-card fired-card" onClick={() => router.push(NOT_IN_PROTOTYPE)}>
        <span className="list-row alert-row">
          <Coin asset="BTC" size={36} />
          <span className="list-row-main">
            <span className="alert-title">{FIRED_ALERT.title}</span>
            <span className="list-row-sub">{FIRED_ALERT.sub}</span>
          </span>
          <span className="row-chev">
            <IconChevR />
          </span>
        </span>
      </button>

      <div className="alerts-note">
        <Note icon={<IconInfo />}>Alerts check the price every minute, around the clock. Paused alerts stay here until you delete them.</Note>
      </div>
    </Screen>
  );
}
