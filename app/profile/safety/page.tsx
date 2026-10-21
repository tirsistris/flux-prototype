"use client";
// app/profile/safety/page.tsx — Safety & privacy (Figma 2302:4646 / 2302:5095).
// Face ID and Hide balances toggle in memory (Hide balances = Home opens with the
// balance hidden); "Sign out" removes the iPad row. Passcode and Two-step
// verification are outside this prototype.
import React from "react";
import { Screen } from "@/components/Screen";
import { NOT_IN_PROTOTYPE, useGoBack } from "@/components/NotInPrototype";
import { SettingsRow } from "@/components/SettingsRow";
import { Divider, ScreenHeader, Toggle } from "@/components/ui";
import { IconEye, IconFace, IconLock, IconShield } from "@/components/icons";
import { useStore } from "@/lib/store";

export default function SafetyPage() {
  const back = useGoBack();
  const { faceId, hideBalances, ipadSignedIn, setToggle, signOutIpad } = useStore();
  return (
    <Screen>
      <ScreenHeader title="Safety & privacy" onLeading={back} />

      <h2 className="day-label sub-label">SIGN-IN</h2>
      <div className="card settings-card roomy">
        <SettingsRow
          icon={<IconFace />}
          label="Face ID"
          sub="Unlock and approve payments"
          trailing={<Toggle on={faceId} onChange={(v) => setToggle("faceId", v)} label="Face ID" />}
        />
        <Divider inset />
        <SettingsRow icon={<IconLock />} label="Passcode" value="Change" href={NOT_IN_PROTOTYPE} />
        <Divider inset />
        <SettingsRow icon={<IconShield size={20} />} label="Two-step verification" value="On" href={NOT_IN_PROTOTYPE} />
      </div>

      <h2 className="day-label sub-label">DEVICES</h2>
      <div className="card devices-card">
        <div className="device-row">
          <span className="list-row-main">
            <span className="settings-label">iPhone 16</span>
            <span className="list-row-sub">Belgrade · this phone</span>
          </span>
          <span className="status-badge done">Active</span>
        </div>
        {ipadSignedIn && (
          <>
            <Divider />
            <div className="device-row">
              <span className="list-row-main">
                <span className="settings-label">iPad Air</span>
                <span className="list-row-sub">Belgrade · 3 days ago</span>
              </span>
              <button type="button" className="sign-out" onClick={signOutIpad}>
                Sign out
              </button>
            </div>
          </>
        )}
      </div>

      <h2 className="day-label sub-label">PRIVACY</h2>
      <div className="card settings-card">
        <SettingsRow
          icon={<IconEye size={20} />}
          label="Hide balances on open"
          sub="Tap the eye to show them"
          trailing={<Toggle on={hideBalances} onChange={(v) => setToggle("hideBalances", v)} label="Hide balances on open" />}
        />
      </div>
    </Screen>
  );
}
