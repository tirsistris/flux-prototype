"use client";
// components/useCopied.ts — copy to the clipboard and confirm for 2 s (Receive,
// Add money). `copied` is the key of the control that was used.
import React from "react";

/** Copies, then shows `copied` for 2 s. */
export function useCopied() {
  const [copied, setCopied] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(null), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard blocked: the label still confirms the tap in the prototype */
    }
    setCopied(key);
  };
  return { copied, copy };
}
