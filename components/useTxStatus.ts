"use client";
// components/useTxStatus.ts — a prototype send confirms CONFIRM_MS after it was
// sent ("Confirming…" → "Completed"); seed transfers are long settled.
import React from "react";
import { CONFIRM_MS } from "@/lib/legend";

export function useTxStatus(sentAt: number | null | undefined): "confirming" | "completed" {
  const done = () => sentAt == null || Date.now() - sentAt >= CONFIRM_MS;
  const [completed, setCompleted] = React.useState(done);
  React.useEffect(() => {
    if (done()) {
      setCompleted(true);
      return;
    }
    setCompleted(false);
    const id = window.setTimeout(() => setCompleted(true), CONFIRM_MS - (Date.now() - (sentAt as number)));
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentAt]);
  return completed ? "completed" : "confirming";
}
