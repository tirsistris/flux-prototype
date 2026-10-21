"use client";
// app/profile/page.tsx — Profile (Figma 2296:1548 / 2296:2058). Personal data,
// Safety & privacy, Price alerts, Language and Add bank account have screens;
// Payment methods, Statements & tax, Help & support and Log out are outside this
// prototype. Bank accounts counts the one existing account plus any added here.
import React from "react";
import Link from "next/link";
import { Screen } from "@/components/Screen";
import { Person } from "@/components/Media";
import { NOT_IN_PROTOTYPE } from "@/components/NotInPrototype";
import { SettingsRow } from "@/components/SettingsRow";
import { Divider } from "@/components/ui";
import { IconBank, IconBell, IconCard, IconChevR, IconClipboard, IconGlobe, IconInfo, IconLock, IconLogout, IconUserId } from "@/components/icons";
import { PROFILE } from "@/lib/legend";
import { useStore } from "@/lib/store";

export default function ProfilePage() {
  const { faceId, addedBanks } = useStore();

  return (
    <Screen tab="profile">
      <div className="large-title">
        <h1>Profile</h1>
      </div>

      <Link href="/profile/personal" className="card me-card">
        <span className="list-row">
          <Person who="mila" size={56} alt={PROFILE.name} />
          <span className="list-row-main">
            <span className="me-name">{PROFILE.name}</span>
            <span className="list-row-sub">{PROFILE.email}</span>
          </span>
          <span className="status-badge done">Verified</span>
          <span className="row-chev">
            <IconChevR />
          </span>
        </span>
      </Link>

      <h2 className="day-label profile-label">ACCOUNT</h2>
      <div className="card settings-card">
        <SettingsRow icon={<IconUserId />} label="Personal data" value="Verified" href="/profile/personal" />
        <Divider inset />
        <SettingsRow icon={<IconLock />} label="Safety & privacy" value={faceId ? "Face ID on" : "Face ID off"} href="/profile/safety" />
        <Divider inset />
        <SettingsRow icon={<IconBell />} label="Notifications & price alerts" href="/profile/alerts" />
        <Divider inset />
        <SettingsRow icon={<IconGlobe />} label="Language" value="English" href="/profile/language" />
      </div>

      <h2 className="day-label profile-label money">MONEY &amp; HELP</h2>
      <div className="card settings-card">
        <SettingsRow icon={<IconBank />} label="Bank accounts" value={String(1 + addedBanks.length)} href="/profile/bank" />
        <Divider inset />
        <SettingsRow icon={<IconCard />} label="Payment methods" value={String(PROFILE.paymentMethods)} href={NOT_IN_PROTOTYPE} />
        <Divider inset />
        <SettingsRow icon={<IconClipboard />} label="Statements & tax" value={PROFILE.statements} href={NOT_IN_PROTOTYPE} />
        <Divider inset />
        <SettingsRow icon={<IconInfo size={20} />} label="Help & support" value="Chat 24/7" href={NOT_IN_PROTOTYPE} />
      </div>

      <Link href={NOT_IN_PROTOTYPE} className="logout">
        <IconLogout />
        Log out
      </Link>
    </Screen>
  );
}
