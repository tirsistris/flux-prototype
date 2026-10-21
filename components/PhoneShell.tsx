"use client";
// components/PhoneShell.tsx — the phone frame element. Routes drawn "always dark"
// in Figma (Send · Scan QR) force the dark tokens on the whole frame, status bar
// included, whatever the prototype theme is.
import React from "react";
import { usePathname } from "next/navigation";

const ALWAYS_DARK = ["/send/scan"];

export function PhoneShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return <div className={"phone" + (ALWAYS_DARK.includes(path) ? " force-dark" : "")}>{children}</div>;
}
