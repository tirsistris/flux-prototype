"use client";
// app/providers.tsx — client provider tree. Only the demo store for now.
import React from "react";
import { StoreProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
