"use client";
// app/buy/done/page.tsx — Buy 5 · Done (Figma 2297:2299 / 2297:2613). Renders the
// receipt of the purchase just executed: next order number after FX-20481, fixed
// 6:19 time, and the BTC holding after the buy. No receipt (reload) → Home.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { Button, DetailRow, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconCheckBold, IconShare } from "@/components/icons";
import { PAY_METHODS } from "@/lib/legend";
import { crypto, cryptoText, eur, eurText } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function DonePage() {
  const router = useRouter();
  const { receipt } = useStore();
  const [shared, setShared] = React.useState<"" | "copied">("");

  React.useEffect(() => {
    if (!receipt) router.replace("/home");
  }, [receipt, router]);
  if (!receipt) return null;

  const r = receipt;
  const paidWith = r.method === "euro" ? "from your Euro balance" : `with ${PAY_METHODS[r.method].label}`;

  const share = async () => {
    const text = `Flux receipt ${r.orderNo}: ${cryptoText(r.units, "BTC", 6)} for ${eurText(r.eurCents)} (fee ${eurText(r.feeCents)}), today ${r.time}.`;
    try {
      if (navigator.share) await navigator.share({ title: `Flux receipt ${r.orderNo}`, text });
      else {
        await navigator.clipboard.writeText(text);
        setShared("copied");
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <Screen
      actions={
        <>
          <Button onClick={() => router.push("/home")}>Done</Button>
          <Button variant="secondary" glyph={<IconShare />} onClick={share}>
            {shared === "copied" ? "Receipt copied" : "Share receipt"}
          </Button>
        </>
      }
    >
      <ScreenHeader leading="close" onLeading={() => router.push("/home")} />

      <div className="done-hero">
        <span className="state-icon">
          <IconCheckBold />
        </span>
        <h1 className="serif">{cryptoText(r.units, "BTC", 6)} is yours</h1>
        <p className="sub">
          Paid {eurText(r.eurCents)} {paidWith}. It’s already in your wallet.
        </p>
      </div>

      <div className="done-receipt">
        <Receipt>
          <div className="receipt-section">
            <div className="receipt-head">
              <span>FLUX · RECEIPT</span>
              <span>{r.orderNo}</span>
            </div>
            <DetailRow label="Price" value={<Num>{eur(r.priceCents) + "/BTC"}</Num>} />
            <DetailRow label="Flux fee" value={<Num>{eur(r.feeCents)}</Num>} />
            <DetailRow label="Paid" value={<Num>{eur(r.eurCents)}</Num>} />
            <DetailRow ui label="Date" value={`Today, ${r.time}`} />
          </div>
          <Perforation />
          <div className="receipt-section">
            <DetailRow strong label="Your Bitcoin now" value={<Num>{crypto(r.btcAfter, "BTC", 4)}</Num>} />
          </div>
        </Receipt>
      </div>
    </Screen>
  );
}
