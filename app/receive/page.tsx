"use client";
// app/receive/page.tsx — Receive · BTC (Figma 2298:3053 / 2298:3846). Home Receive
// opens Bitcoin directly: there is no coin choice in the design (agreed assumption);
// the coin chip opens the quiet state. Copy → "Copied" for 2 s; Share opens the share
// sheet, or copies with the same "Copied" where there is none (agreed).
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { NOT_IN_PROTOTYPE } from "@/components/NotInPrototype";
import { QrCode } from "@/components/QrCode";
import { Button, Coin, Note, ScreenHeader } from "@/components/ui";
import { IconChevDown, IconCopy, IconInfo, IconShare } from "@/components/icons";
import { useCopied } from "@/components/useCopied";
import { RECEIVE_BTC } from "@/lib/legend";

export default function ReceivePage() {
  const router = useRouter();
  const { copied, copy } = useCopied();
  const address = RECEIVE_BTC.address;
  const groups = address.match(/.{1,4}/g) ?? [];

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ text: address });
      else await copy("share", address);
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <Screen
      actions={
        <div className="bottom-actions-row">
          <Button variant="secondary" glyph={<IconCopy />} onClick={() => copy("copy", address)}>
            {copied === "copy" ? "Copied" : "Copy"}
          </Button>
          <Button glyph={<IconShare />} onClick={share}>
            {copied === "share" ? "Copied" : "Share"}
          </Button>
        </div>
      }
    >
      <ScreenHeader leading="close" title="Receive" onLeading={() => router.push("/home")} />

      <div className="receive">
        <button type="button" className="asset-chip" onClick={() => router.push(NOT_IN_PROTOTYPE)}>
          <Coin asset="BTC" size={26} />
          Bitcoin
          <IconChevDown />
        </button>
        <QrCode label="QR code of your Bitcoin address" />
        <span className="receive-network">{RECEIVE_BTC.network}</span>
        <p className="receive-address" aria-label={address}>
          {groups.map((g, i) => (
            <React.Fragment key={i}>
              {i > 0 && " "}
              <span className={i === 0 || i >= groups.length - 2 ? undefined : "muted"}>{g}</span>
            </React.Fragment>
          ))}
        </p>
      </div>

      <div className="receive-note">
        <Note icon={<IconInfo />}>Send only Bitcoin (BTC) here. It usually shows up after one confirmation, about 10 minutes.</Note>
      </div>
    </Screen>
  );
}
