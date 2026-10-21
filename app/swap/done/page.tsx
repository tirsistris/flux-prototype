"use client";
// app/swap/done/page.tsx — Swap 3 · Done (Figma 2300:3623 / 2300:3976): the receipt
// of the swap just made. Fees = spread + Flux fee; "Your ETH now" is the whole ETH
// position (staked included), as on Home.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { Button, DetailRow, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconCheckBold } from "@/components/icons";
import { marketRateText } from "@/lib/money";
import { crypto, cryptoText, eur, eurText } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function SwapDonePage() {
  const router = useRouter();
  const { swapReceipt: r } = useStore();

  React.useEffect(() => {
    if (!r) router.replace("/home");
  }, [r, router]);
  if (!r) return null;
  const fees = r.q.spreadCents + r.q.feeCents;

  return (
    <Screen
      actions={
        <>
          <Button onClick={() => router.push("/home")}>Done</Button>
          <Button variant="secondary" onClick={() => router.push("/activity")}>
            View in Activity
          </Button>
        </>
      }
    >
      <ScreenHeader leading="close" onLeading={() => router.push("/home")} />

      <div className="done-hero">
        <span className="state-icon">
          <IconCheckBold />
        </span>
        <h1 className="serif">{cryptoText(r.q.ethUnits, "ETH", 4)} is in your wallet</h1>
        <p className="sub">
          Swapped from {cryptoText(r.q.btcUnits, "BTC", 4)}. Fees of {eurText(fees)} were already included.
        </p>
      </div>

      <div className="done-receipt">
        <Receipt>
          <div className="receipt-section">
            <div className="receipt-head">
              <span>FLUX · RECEIPT</span>
              <span>{r.orderNo}</span>
            </div>
            <DetailRow label="Paid" value={<Num>{crypto(r.q.btcUnits, "BTC", 4)}</Num>} />
            <DetailRow label="Got" value={<Num>{crypto(r.q.ethUnits, "ETH", 4)}</Num>} />
            <DetailRow label="Market rate" value={<Num>{marketRateText()}</Num>} />
            <DetailRow label="Fees" value={<Num>{eur(fees)}</Num>} />
          </div>
          <Perforation />
          <div className="receipt-section tail">
            <DetailRow strong label="Your ETH now" value={<Num>{crypto(r.ethAfter, "ETH", 4)}</Num>} />
          </div>
        </Receipt>
      </div>
    </Screen>
  );
}
