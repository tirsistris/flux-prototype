"use client";
// app/send/sent/page.tsx — Send 4 · Sent (Figma 2298:2785 / 2298:3716). Receipt of
// the transfer just made. Status reads "On its way", the same as the title above it
// (it used to flip to "Completed" under an "On its way" title); the transfer's
// detail in Activity still settles to "Completed". "Let … know" only for people.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { Button, DetailRow, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconArrowUpRight, IconShare } from "@/components/icons";
import { crypto, cryptoText } from "@/lib/format";
import { recipientInfo } from "@/lib/send";
import { useStore } from "@/lib/store";

export default function SentPage() {
  const router = useRouter();
  const { activity, lastSendId } = useStore();
  const tx = activity.find((a) => a.id === lastSendId);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!tx) router.replace("/home");
  }, [tx, router]);
  if (!tx?.send) return null;

  const d = tx.send;
  const info = recipientInfo(d.recipient);
  const units = -(tx.qty ?? 0);

  const share = async () => {
    const text = `Sent you ${cryptoText(units, "ETH", 4)} on Flux` + (d.note ? ` — ${d.note}` : "");
    try {
      if (navigator.share) await navigator.share({ text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      }
    } catch {
      /* share sheet dismissed */
    }
  };

  return (
    <Screen
      className="sent"
      actions={
        <>
          <Button onClick={() => router.push("/home")}>Done</Button>
          {info.knownContact && (
            <Button variant="secondary" glyph={<IconShare />} onClick={share}>
              {copied ? "Message copied" : `Let ${info.first} know`}
            </Button>
          )}
        </>
      }
    >
      <ScreenHeader leading="close" onLeading={() => router.push("/home")} />

      <div className="done-hero">
        <span className="state-icon">
          <IconArrowUpRight size={40} />
        </span>
        <h1 className="serif">{info.sentHero}</h1>
        <p className="sub">
          {cryptoText(units, "ETH", 4)} usually lands in about a minute. We’ll let you know when it does.
        </p>
      </div>

      <div className="done-receipt">
        <Receipt>
          <div className="receipt-section">
            <div className="receipt-head">
              <span>FLUX · RECEIPT</span>
              <span className="hash">{d.hash}</span>
            </div>
            <DetailRow ui label="Status" value="On its way" />
            <DetailRow label="Sent" value={<Num>{crypto(units, "ETH", 4)}</Num>} />
            <DetailRow label="Network fee" value={<Num>{crypto(d.feeUnits, "ETH", 4)}</Num>} />
            {d.note && <DetailRow ui label="Note" value={d.note} />}
          </div>
          <Perforation />
          <div className="receipt-section">
            <DetailRow strong label="Total" value={<Num>{crypto(units + d.feeUnits, "ETH", 4)}</Num>} />
          </div>
        </Receipt>
      </div>
    </Screen>
  );
}
