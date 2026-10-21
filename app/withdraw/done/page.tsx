"use client";
// app/withdraw/done/page.tsx — Withdraw 3 · Done (Figma 2315:6118 / 2315:6382).
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { Button, DetailRow, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconArrowUpRight } from "@/components/icons";
import { BANK } from "@/lib/legend";
import { eur, eurText } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function WithdrawDonePage() {
  const router = useRouter();
  const { withdrawReceipt: r } = useStore();

  React.useEffect(() => {
    if (!r) router.replace("/home");
  }, [r, router]);
  if (!r) return null;

  return (
    <Screen actions={<Button onClick={() => router.push("/home")}>Done</Button>}>
      <ScreenHeader leading="close" onLeading={() => router.push("/home")} />

      <div className="done-hero">
        <span className="state-icon">
          <IconArrowUpRight size={40} />
        </span>
        <h1 className="serif">{eurText(r.cents)} is on its way</h1>
        <p className="sub">Expect it at {BANK.name} by tomorrow evening.</p>
      </div>

      <div className="done-receipt">
        <Receipt>
          <div className="receipt-section">
            <div className="receipt-head">
              <span>FLUX · RECEIPT</span>
              <span>{r.orderNo}</span>
            </div>
            <DetailRow label="Amount" value={<Num>{eur(r.cents)}</Num>} />
            <DetailRow ui label="To" value={BANK.name} />
            <DetailRow ui label="Fee" value="Free" />
            <DetailRow ui label="Status" value="Sent to bank" />
          </div>
          <Perforation />
          <div className="receipt-section tail">
            <DetailRow strong label="Euro balance now" value={<Num>{eur(r.eurAfter)}</Num>} />
          </div>
        </Receipt>
      </div>
    </Screen>
  );
}
