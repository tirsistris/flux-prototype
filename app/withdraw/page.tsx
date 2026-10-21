"use client";
// app/withdraw/page.tsx — Withdraw 1 · Amount (Figma 2315:5927 / 2315:6295), from Cash ·
// Euro or Sell 3. Euro only; chips 25 % / 50 % / Max of the euro balance. More than
// the balance is the agreed "not enough" state. The bank row is outside this prototype.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { NOT_IN_PROTOTYPE, useGoBack } from "@/components/NotInPrototype";
import { fitFont, NotEnough, shareChips, useAmount } from "@/components/Amount";
import { Button, Chip, Keypad, Note, ScreenHeader } from "@/components/ui";
import { IconBank, IconChevR, IconInfo } from "@/components/icons";
import { BANK } from "@/lib/legend";
import { eurText, group, THIN } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function WithdrawAmountPage() {
  const router = useRouter();
  const back = useGoBack();
  const { holdings } = useStore();
  const { d, press, setCents } = useAmount("withdraw");
  const balance = holdings.eurCents;
  const tooMuch = d.cents > balance;

  const [iPart, dPart] = d.input.split(",");
  const big = group(iPart, THIN) + (dPart !== undefined ? "," + dPart : "") + THIN + "€";

  return (
    <Screen
      className="withdraw-screen"
      actions={
        <>
          <div className="amount-keypad">
            <Keypad onKey={press} />
          </div>
          <Button disabled={tooMuch || d.cents <= 0} onClick={() => router.push("/withdraw/review")}>
            Review
          </Button>
        </>
      }
    >
      <ScreenHeader title="Withdraw" onLeading={back} />

      <div className="amount">
        <span className="t13 muted">To your bank</span>
        <div className={"value" + (tooMuch ? " loss" : "")} style={{ fontSize: fitFont(big, 64) }} aria-live="polite">
          <Num>{big}</Num>
        </div>
        <span className="amount-of">of {eurText(balance)} available</span>
      </div>

      {tooMuch ? (
        <NotEnough
          error={<>Up to {eurText(balance)} — that’s your whole euro balance</>}
          chip={<>Withdraw {eurText(balance)}</>}
          onChip={() => setCents(balance)}
        />
      ) : (
        <div className="chips amount-chips">
          {shareChips(balance).map((c) => (
            <Chip key={c.label} selected={d.cents === c.value && d.cents > 0} onClick={() => setCents(c.value)}>
              {c.label}
            </Chip>
          ))}
        </div>
      )}

      <div className="card withdraw-to">
        <button type="button" className="list-row" onClick={() => router.push(NOT_IN_PROTOTYPE)}>
          <span className="tile">
            <IconBank />
          </span>
          <span className="list-row-main">
            <span className="list-row-title">{BANK.name}</span>
            <span className="list-row-sub">{BANK.masked}</span>
          </span>
          <span className="row-chev">
            <IconChevR />
          </span>
        </button>
      </div>

      <div className="withdraw-note">
        <Note icon={<IconInfo />}>Withdrawals are free and usually arrive within 1 business day.</Note>
      </div>
    </Screen>
  );
}
