"use client";
// app/sell/done/page.tsx — Sell 3 · Done (Figma 2316:6513 / 2316:6975). "Withdraw to
// bank" opens Withdraw 1 with the new euro balance.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { Button, DetailRow, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconArrowUpRight, IconCheckBold } from "@/components/icons";
import { ASSETS } from "@/lib/legend";
import { crypto, cryptoText, eur, eurText } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function SellDonePage() {
  const router = useRouter();
  const { sellReceipt: r } = useStore();

  React.useEffect(() => {
    if (!r) router.replace("/home");
  }, [r, router]);
  if (!r) return null;

  return (
    <Screen
      actions={
        <>
          <Button onClick={() => router.push("/home")}>Done</Button>
          <Button variant="secondary" glyph={<IconArrowUpRight />} onClick={() => router.push("/withdraw")}>
            Withdraw to bank
          </Button>
        </>
      }
    >
      <ScreenHeader leading="close" onLeading={() => router.push("/home")} />

      <div className="done-hero">
        <span className="state-icon">
          <IconCheckBold />
        </span>
        <h1 className="serif">{eurText(r.q.getCents)} is in your euros</h1>
        <p className="sub">Sold {cryptoText(r.q.units, "BTC", 6)}. Spend it on crypto or move it to your bank.</p>
      </div>

      <div className="done-receipt">
        <Receipt>
          <div className="receipt-section">
            <div className="receipt-head">
              <span>FLUX · RECEIPT</span>
              <span>{r.orderNo}</span>
            </div>
            <DetailRow label="Sold" value={<Num>{crypto(r.q.units, "BTC", 6)}</Num>} />
            <DetailRow label="Price" value={<Num>{eur(ASSETS.BTC.priceCents) + "/BTC"}</Num>} />
            <DetailRow label="Flux fee" value={<Num>{eur(r.q.feeCents)}</Num>} />
            <DetailRow label="Got" value={<Num>{eur(r.q.getCents)}</Num>} />
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
