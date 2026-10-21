"use client";
// app/profile/bank/page.tsx — Add bank account (Figma 2302:4843 / 2302:5233). The
// IBAN is legend's Commerzbank account, prefilled as in the frame; clearing it
// disables Add account. Adding returns to Profile with Bank accounts = 2.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { useGoBack } from "@/components/NotInPrototype";
import { Button, DetailRow, Divider, Note, ScreenHeader } from "@/components/ui";
import { IconCheckCircle, IconCloseCircle, IconLock, IconShield } from "@/components/icons";
import { NEW_BANK, PROFILE } from "@/lib/legend";
import { useStore } from "@/lib/store";

const norm = (s: string) => s.replace(/\s+/g, "").toUpperCase();

export default function AddBankPage() {
  const router = useRouter();
  const back = useGoBack();
  const { addBank } = useStore();
  const [iban, setIban] = React.useState(NEW_BANK.iban);
  const known = norm(iban) === norm(NEW_BANK.iban);

  return (
    <Screen
      actions={
        <Button
          disabled={!known}
          onClick={() => {
            addBank(norm(iban));
            router.push("/profile");
          }}
        >
          Add account
        </Button>
      }
    >
      <ScreenHeader title="Add bank account" onLeading={back} />

      <div className="form-field holder">
        <span className="form-label">Account holder</span>
        <div className="form-input locked">
          <span>{PROFILE.name}</span>
          <IconLock />
        </div>
        <span className="form-hint">Must match your verified name</span>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="iban">
          IBAN
        </label>
        <div className="form-input focus">
          <input id="iban" className="mono" value={iban} onChange={(e) => setIban(e.target.value)} spellCheck={false} autoCapitalize="characters" />
          {iban && (
            <button type="button" className="form-clear" aria-label="Clear" onClick={() => setIban("")}>
              <IconCloseCircle />
            </button>
          )}
        </div>
        {known && (
          <span className="form-hint ok">
            <IconCheckCircle size={16} />
            {NEW_BANK.bank}
          </span>
        )}
      </div>

      <div className="card bank-info">
        <DetailRow label="Transfers" value="SEPA" />
        <Divider />
        <DetailRow ui label="Arrives" value="1 business day" />
        <Divider />
        <DetailRow ui label="Fee" value="Free" />
      </div>

      <div className="bank-note">
        <Note icon={<IconShield />}>We’ll send 0,01{" "}€ with a short code to confirm the account is yours.</Note>
      </div>
    </Screen>
  );
}
