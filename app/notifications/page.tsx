"use client";
// app/notifications/page.tsx — Notifications (Figma 2302:4331 / 2302:4928), opened
// from the bell on Home. A read-only feed; the items have no detail screens.
import React from "react";
import { Screen } from "@/components/Screen";
import { useGoBack } from "@/components/NotInPrototype";
import { Divider, ScreenHeader } from "@/components/ui";
import { IconAlarm, IconCheckCircle, IconEarn, IconShield } from "@/components/icons";
import { CONTACTS, NOTIFICATIONS, type Notif } from "@/lib/legend";

function Icon({ kind }: { kind: Notif["icon"] }) {
  if (kind === "anna") return <span className="avatar" aria-hidden="true">{CONTACTS.anna.initials}</span>;
  const glyph =
    kind === "check" ? <IconCheckCircle size={20} /> : kind === "alarm" ? <IconAlarm size={20} /> : kind === "earn" ? <IconEarn /> : <IconShield size={20} />;
  return <span className={"tile notif-tile" + (kind === "check" ? " gain" : "")}>{glyph}</span>;
}

export default function NotificationsPage() {
  const back = useGoBack();
  return (
    <Screen>
      <ScreenHeader title="Notifications" onLeading={back} />
      {NOTIFICATIONS.map((g) => (
        <section key={g.day} aria-label={g.day}>
          <h2 className="day-label notif-label">{g.day}</h2>
          <div className="card notif-card">
            {g.items.map((n, i) => (
              <React.Fragment key={n.title}>
                {i > 0 && <Divider inset />}
                <div className="notif-row">
                  <Icon kind={n.icon} />
                  <span className="notif-main">
                    <span className="notif-top">
                      <span className="notif-title">{n.title}</span>
                      <span className="notif-time">{n.time}</span>
                      {n.unread && <span className="notif-dot" aria-label="Unread" />}
                    </span>
                    <span className="notif-body">{n.body}</span>
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </section>
      ))}
    </Screen>
  );
}
