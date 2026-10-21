"use client";
// app/cash/add/page.tsx — Cash · Add money (Figma 2315:5812 / 2315:6243). Legend
// "Add money" details (fictional IBAN / BIC). Each copy icon turns into a check for
// 2 s; Share details opens the share sheet or copies ("Details copied"); top-up with
// Apple Pay is outside this prototype (agreed).
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { NOT_IN_PROTOTYPE } from "@/components/NotInPrototype";
import { useCopied } from "@/components/useCopied";
import { Button, Divider, ScreenHeader } from "@/components/ui";
import { IconCheckCircle, IconCopy, IconShare, IconTimer22, IconWallet } from "@/components/icons";
import { FLUX_ACCOUNT } from "@/lib/legend";

const ROWS: { key: string; label: string; value: string; mono?: boolean }[] = [
  { key: "holder", label: "Account holder", value: FLUX_ACCOUNT.holder },
  { key: "iban", label: "IBAN", value: FLUX_ACCOUNT.iban, mono: true },
  { key: "bic", label: "BIC", value: FLUX_ACCOUNT.bic, mono: true },
  { key: "reference", label: "Reference", value: FLUX_ACCOUNT.reference, mono: true },
];

export default function AddMoneyPage() {
  const router = useRouter();
  const { copied, copy } = useCopied();
  const details = ROWS.map((r) => `${r.label}: ${r.value}`).join("\n");

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: "Flux account details", text: details });
      else await copy("share", details);
    } catch {
      /* user dismissed the share sheet */
    }
  };

  return (
    <Screen
      actions={
        <>
          <Button glyph={<IconShare />} onClick={share}>
            {copied === "share" ? "Details copied" : "Share details"}
          </Button>
          <Button variant="secondary" glyph={<IconWallet />} onClick={() => router.push(NOT_IN_PROTOTYPE)}>
            Top up with Apple Pay
          </Button>
        </>
      }
    >
      <ScreenHeader title="Add money" onLeading={() => router.push("/cash")} />

      <p className="add-intro">Send a bank transfer to your Flux account. Use these details:</p>

      <div className="card account-details">
        {ROWS.map((r, i) => (
          <React.Fragment key={r.key}>
            {i > 0 && <Divider />}
            <div className="account-row">
              <span className="account-l">
                <span className="t13 muted">{r.label}</span>
                <span className={"account-v" + (r.mono ? " mono" : "")}>{r.value}</span>
              </span>
              <button type="button" className={"copy-btn" + (copied === r.key ? " done" : "")} aria-label={`Copy ${r.label}`} onClick={() => copy(r.key, r.value)}>
                {copied === r.key ? <IconCheckCircle size={20} /> : <IconCopy />}
              </button>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="banner banner-neutral add-banner">
        <span className="banner-icon">
          <IconTimer22 />
        </span>
        <span className="banner-text">
          <span className="banner-title">Usually arrives in 1 business day</span>
          <span className="banner-body">Flux doesn’t charge for this. Instant if your bank supports it.</span>
        </span>
      </div>
    </Screen>
  );
}
