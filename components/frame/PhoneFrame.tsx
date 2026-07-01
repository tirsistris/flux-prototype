// PhoneFrame.tsx — Flux core (fl) phone chassis, ported from ui.jsx. The
// .device-stage wrapper (see globals.css) is our addition for standalone
// routes: it centers the device on desktop and goes full-bleed below 420px.
// The fl-phone / island / status bar / home indicator are byte-for-byte source.
import React from "react";
import { StatusBar } from "@/components/frame/StatusBar";
import { TabBar } from "@/components/frame/TabBar";

export function PhoneFrame({
  active,
  children,
  scroll = false,
  footer,
}: {
  active?: string;
  children?: React.ReactNode;
  scroll?: boolean;
  footer?: React.ReactNode;
}) {
  return (
    <div className="device-stage">
      <div className="fl-phone">
        <div className="fl-bg-glow" />
        <div className="fl-island" />
        <StatusBar system="fl" />
        <div className={"fl-content" + (scroll ? " scroll" : "")}>{children}</div>
        {footer || <TabBar active={active} />}
        <div className="fl-home-ind" />
      </div>
    </div>
  );
}
