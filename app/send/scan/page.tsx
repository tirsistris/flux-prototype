"use client";
// app/send/scan/page.tsx — QR scanner, ported from sendflow.jsx ScreenScanQR. A
// standalone full-screen scanner with its own chassis (.fl-phone.fl-phone-scan, own
// StatusBar, no tab bar), opened from the Recipient scan button. [X] and [Paste
// address instead] both → router.back() to /send. Demo only: there is no camera —
// the viewfinder is decorative.
import React from "react";
import { useRouter } from "next/navigation";
import { StatusBar } from "@/components/frame/StatusBar";
import { Ico } from "@/components/icons";

export default function SendScanPage() {
  const router = useRouter();
  return (
    <div className="device-stage">
      <div className="fl-phone fl-phone-scan">
        <div className="fl-island" />
        <StatusBar system="fl" />
        <div className="fl-scan-body">
          <div className="fl-scan-top">
            <button className="fl-roundbtn sm" onClick={() => router.back()}>{Ico.close("#fff", 20)}</button>
            <span className="fl-flow-title">Scan QR</span>
            <div style={{ width: 34 }} />
          </div>
          <div className="fl-scan-center">
            <div className="fl-viewfinder">
              <div className="fl-vf-corner tl" /><div className="fl-vf-corner tr" />
              <div className="fl-vf-corner bl" /><div className="fl-vf-corner br" />
              <div className="fl-scanline" />
            </div>
            <p className="fl-scan-hint">Point at an address QR code</p>
          </div>
          <button className="fl-scan-paste" onClick={() => router.back()}>Paste address instead</button>
        </div>
        <div className="fl-home-ind" />
      </div>
    </div>
  );
}
