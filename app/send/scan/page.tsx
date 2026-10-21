"use client";
// app/send/scan/page.tsx — Send · Scan QR (Figma 2298:2978, always dark). No
// camera is opened (agreed): the viewfinder is drawn as in the frame, Torch is
// decorative, and "Paste address" feeds the same demo-address cycle as Send 1.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Button, ScreenHeader } from "@/components/ui";
import { IconClipboard, IconTorch } from "@/components/icons";
import { useStore } from "@/lib/store";

export default function ScanPage() {
  const router = useRouter();
  const { nextPaste } = useStore();

  return (
    <Screen
      className="scan"
      actions={
        <Button
          variant="secondary"
          glyph={<IconClipboard />}
          onClick={() => {
            nextPaste();
            router.push("/send");
          }}
        >
          Paste address
        </Button>
      }
    >
      <div className="scan-camera" aria-hidden="true">
        <span className="scan-blur b1" />
        <span className="scan-blur b2" />
        <span className="scan-blur b3" />
      </div>
      <ScreenHeader leading="close" title="Scan" onLeading={() => router.push("/send")} />
      <div className="viewfinder" aria-hidden="true">
        <span className="c tl" />
        <span className="c tr" />
        <span className="c bl" />
        <span className="c br" />
      </div>
      <div className="scan-caption">
        <p className="t17 w590">Point at a wallet QR code</p>
        <p className="t13 muted">Ethereum addresses only</p>
      </div>
      <div className="torch">
        <span className="torch-btn" aria-hidden="true">
          <IconTorch />
        </span>
        <span className="t13 w510">Torch</span>
      </div>
    </Screen>
  );
}
