"use client";
// app/providers.tsx — client provider tree wrapping the whole app. Currently
// just the Buy-flow store (phase 2a); future client providers compose here.
import React from "react";
import { BuyProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <BuyProvider>{children}</BuyProvider>;
}
