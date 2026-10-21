"use client";
// app/tx/[id]/page.tsx — Transaction · Detail (Figma 2300:3713 / 2300:4022), opened
// from an outgoing transfer row in Activity. "€ when sent" is the stored value at
// the time; "€ now" = round2(ETH × today's price). Only transfers have a detail
// screen in this step (other row types have no design yet).
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { RecipientAvatar } from "@/components/RecipientAvatar";
import { Button, DetailRow, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconArrowUpRight, IconCopy } from "@/components/icons";
import { useTxStatus } from "@/components/useTxStatus";
import { ASSETS } from "@/lib/legend";
import { valueCents } from "@/lib/money";
import { crypto, eur, eurText } from "@/lib/format";
import { recipientInfo } from "@/lib/send";
import { useStore } from "@/lib/store";

export default function TxDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { activity, pickRecipient } = useStore();
  const tx = activity.find((a) => a.id === id);
  const status = useTxStatus(tx?.send?.sentAt);

  React.useEffect(() => {
    if (!tx?.send) router.replace("/activity");
  }, [tx, router]);
  if (!tx?.send) return null;

  const d = tx.send;
  const info = recipientInfo(d.recipient);
  const units = -(tx.qty ?? 0);
  const nowCents = valueCents(units, ASSETS.ETH.priceCents);

  return (
    <Screen
      actions={
        <>
          <Button
            glyph={<IconArrowUpRight />}
            onClick={() => {
              pickRecipient(d.recipient);
              router.push("/send/amount");
            }}
          >
            Send again
          </Button>
          {/* No real transaction exists, so there is nothing to open on Etherscan. */}
          <Button variant="secondary">View on Etherscan</Button>
        </>
      }
    >
      <ScreenHeader title="Transaction" onLeading={() => router.push("/activity")} />

      <div className="review">
        <Receipt>
          <div className="send-hero detail-hero">
            <RecipientAvatar kind={info.avatar} size={48} />
            <span className="detail-line">{info.detailLine}</span>
            <span className="big">
              <Num>{crypto(-units, "ETH", 4)}</Num>
            </span>
            <span className="detail-line">
              {eurText(tx.eurCents)} when sent · {eurText(nowCents)} now
            </span>
            <span className={"status-badge" + (status === "completed" ? " done" : "")}>
              {status === "completed" ? "Completed" : "Confirming…"}
            </span>
            {d.note && <span className="quote">“{d.note}”</span>}
          </div>
          <Perforation />
          <div className="receipt-section">
            <DetailRow ui label="Date" value={d.date} />
            <DetailRow label="To" value={d.toShort} />
            <DetailRow ui label="Network" value="Ethereum" />
            <DetailRow
              label="Network fee"
              value={
                <>
                  <Num>{crypto(d.feeUnits, "ETH", 4)}</Num> · <Num>{eur(valueCents(d.feeUnits, ASSETS.ETH.priceCents))}</Num>
                </>
              }
            />
            <div className="detail-row">
              <span className="detail-label">Transaction</span>
              <span className="detail-value">{d.hash}</span>
              {/* Only the short hash exists (design / legend), so copy is decorative. */}
              <span className="hash-copy" aria-hidden="true">
                <IconCopy />
              </span>
            </div>
          </div>
        </Receipt>
      </div>
    </Screen>
  );
}
