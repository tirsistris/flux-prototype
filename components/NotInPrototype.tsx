"use client";
// components/NotInPrototype.tsx — the quiet state for everything outside the
// prototype's flows (agreed copy): placeholder buttons open it as a screen
// (/not-in-prototype). Go back is the main action.
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

export const NOT_IN_PROTOTYPE = "/not-in-prototype";
const CASE_STUDY = "https://baatr.vercel.app/en/cases/flux";

export function useGoBack() {
  const router = useRouter();
  return React.useCallback(() => {
    if (window.history.length > 1) router.back();
    else router.push("/home");
  }, [router]);
}

export function NotInPrototype() {
  const back = useGoBack();
  return (
    <div className="nip">
      <h2 className="nip-title">Not in this prototype</h2>
      <p className="nip-body">This prototype covers Buy, Sell, Swap, Send, Receive, Earn and your euro balance.</p>
      <div className="nip-actions">
        <Button variant="secondary" onClick={back}>
          Go back
        </Button>
      </div>
      <a className="nip-link" href={CASE_STUDY} target="_blank" rel="noopener noreferrer">
        See the full design in the case study →
      </a>
    </div>
  );
}
