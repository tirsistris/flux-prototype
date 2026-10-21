"use client";
// app/profile/personal/page.tsx — Personal data (Figma 2302:4566 / 2302:5050).
// Read-only; editing email or phone is outside this prototype.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { NOT_IN_PROTOTYPE, useGoBack } from "@/components/NotInPrototype";
import { Button, Divider, Note, ScreenHeader } from "@/components/ui";
import { IconCheckCircle, IconLock } from "@/components/icons";
import { PROFILE } from "@/lib/legend";

const FIELDS: [string, string][] = [
  ["Full name", PROFILE.name],
  ["Residence", PROFILE.residence],
  ["Email", PROFILE.email],
  ["Phone", PROFILE.phone],
];

export default function PersonalDataPage() {
  const router = useRouter();
  const back = useGoBack();
  return (
    <Screen
      actions={
        <Button variant="secondary" onClick={() => router.push(NOT_IN_PROTOTYPE)}>
          Edit email or phone
        </Button>
      }
    >
      <ScreenHeader title="Personal data" onLeading={back} />
      <div className="banner banner-gain personal-banner">
        <span className="banner-icon gain">
          <IconCheckCircle />
        </span>
        <span className="banner-text">
          <span className="banner-title">You’re verified</span>
          <span className="banner-body">Buy, sell and withdraw up to {PROFILE.limit.replace(/ /g, " ")} a month.</span>
        </span>
      </div>
      <div className="card fields-card">
        {FIELDS.map(([k, v], i) => (
          <React.Fragment key={k}>
            {i > 0 && <Divider />}
            <div className="field-row">
              <span className="field-key">{k}</span>
              <span className="field-value">{v}</span>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="personal-note">
        <Note icon={<IconLock size={18} />}>Name and residence come from your ID. If something changed, write to us in Help &amp; support.</Note>
      </div>
    </Screen>
  );
}
