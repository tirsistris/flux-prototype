"use client";
// app/send/review/page.tsx — Send 3 · Review for a contact (Figma 2298:2690 /
// 2298:3670) and Send · New address review (2317:7221 / 2317:7434). Maxim gets the
// calm "You've sent to Maxim before" banner built from his last transfer; Anna and
// My Ledger get none (agreed); a new address shows the full address in groups of
// four and the red first-time banner. Face ID is a ~1 s stand-in overlay.
// Save as contact first keeps the address in this session's contacts, then sends.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { FaceId } from "@/components/FaceId";
import { RecipientAvatar } from "@/components/RecipientAvatar";
import { Button, DetailRow, Perforation, Receipt, ScreenHeader } from "@/components/ui";
import { IconCheckCircle, IconFace, IconWarn } from "@/components/icons";
import { ASSETS, NETWORK_FEE_UNITS } from "@/lib/legend";
import { valueCents } from "@/lib/money";
import { addressGroups } from "@/lib/address";
import { crypto, cryptoText, eur } from "@/lib/format";
import { recipientInfo } from "@/lib/send";
import { useStore } from "@/lib/store";

const PRICE = ASSETS.ETH.priceCents;

export default function SendReviewPage() {
  const router = useRouter();
  const { send, activity, confirmSend, saveAddress } = useStore();
  const [scanning, setScanning] = React.useState(false);
  const leaving = React.useRef(false);

  React.useEffect(() => {
    if (!leaving.current && (!send.recipient || send.units <= 0)) router.replace("/send");
  }, [send.recipient, send.units, router]);

  const finish = React.useCallback(() => {
    leaving.current = true;
    if (confirmSend()) router.replace("/send/sent");
    else {
      leaving.current = false;
      setScanning(false);
    }
  }, [confirmSend, router]);

  if (!send.recipient || send.units <= 0) return null;

  const r = send.recipient;
  const info = recipientInfo(r);
  const total = send.units + NETWORK_FEE_UNITS;
  const note = send.note.trim();

  // Maxim: last outgoing transfer to him, from Activity (legend: 0,0500 ETH, Sun, 18 Oct).
  const last =
    r.kind === "contact" && r.id === "maxim"
      ? activity.find((a) => a.send?.recipient.kind === "contact" && a.send.recipient.id === "maxim")
      : undefined;
  const lastDay = last?.send?.date.split(" · ")[0];

  return (
    <Screen
      actions={
        info.isNewAddress ? (
          <>
            <Button glyph={<IconFace />} onClick={() => setScanning(true)} disabled={scanning}>
              I checked it · Send with Face ID
            </Button>
            <Button
              variant="secondary"
              disabled={scanning}
              onClick={() => {
                if (r.kind === "address") saveAddress(r.address);
                setScanning(true);
              }}
            >
              Save as contact first
            </Button>
          </>
        ) : (
          <Button glyph={<IconFace />} onClick={() => setScanning(true)} disabled={scanning}>
            Send with Face ID
          </Button>
        )
      }
    >
      <ScreenHeader title="Review" onLeading={() => router.push("/send/amount")} />

      <div className="review">
        <Receipt>
          <div className="send-hero">
            <RecipientAvatar kind={info.avatar} size={48} />
            <span className="send-hero-name">{info.isNewAddress ? "New address" : info.title}</span>
            {r.kind === "address" ? (
              <span className="send-hero-address">
                <span>{addressGroups(r.address).slice(0, 5).join(" ")}</span>
                <span>{addressGroups(r.address).slice(5).join(" ")} · Ethereum</span>
              </span>
            ) : (
              <span className="send-hero-short">{info.short} · Ethereum</span>
            )}
            {note && <span className="quote">“{note}”</span>}
            <span className="big">
              <Num>{crypto(send.units, "ETH", 4)}</Num>
            </span>
            <span className="approx">
              <Num>{"≈ " + eur(valueCents(send.units, PRICE))}</Num>
            </span>
          </div>
          <Perforation />
          <div className="receipt-section">
            <DetailRow
              label="Network fee"
              value={
                <>
                  <Num>{crypto(NETWORK_FEE_UNITS, "ETH", 4)}</Num> · <Num>{eur(valueCents(NETWORK_FEE_UNITS, PRICE))}</Num>
                </>
              }
            />
            {!info.isNewAddress && <DetailRow ui label="Arrives" value="in about a minute" />}
            <DetailRow strong label="Total" value={<Num>{crypto(total, "ETH", 4)}</Num>} />
            <DetailRow label="Total in euro" value={<Num>{eur(valueCents(total, PRICE))}</Num>} />
          </div>
        </Receipt>
      </div>

      {last?.send && (
        <div className="banner banner-neutral send-banner">
          <span className="banner-icon gain">
            <IconCheckCircle />
          </span>
          <span className="banner-text">
            <span className="banner-title">You’ve sent to {info.first} before</span>
            <span className="banner-body">
              Last time {cryptoText(-(last.qty ?? 0), "ETH", 4)} on {lastDay}. Transfers can’t be reversed, so we check new addresses twice.
            </span>
          </span>
        </div>
      )}
      {info.isNewAddress && (
        <div className="banner banner-loss send-banner new-address">
          <span className="banner-icon">
            <IconWarn size={22} />
          </span>
          <span className="banner-text">
            <span className="banner-title">First time sending here</span>
            <span className="banner-body">
              Scammers copy the first and last characters of real addresses. Check every group above with the person. Transfers can’t be reversed.
            </span>
          </span>
        </div>
      )}

      {scanning && <FaceId onDone={finish} />}
    </Screen>
  );
}
