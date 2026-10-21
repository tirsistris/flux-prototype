"use client";
// app/send/amount/page.tsx — Send 2 · Amount (Figma 2298:2589 / 2298:3627) and
// Send · Not enough ETH (2298:2878 / 2298:3762). Entry in ETH or € (unit switch),
// chips 25 % / 50 % / Max of the 0,4200 ETH available. Max = available − network
// fee = 0,4199 ETH; anything above it is the Not enough state.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { RecipientAvatar } from "@/components/RecipientAvatar";
import { Button, Chip, Keypad, ScreenHeader, UnitSwitch } from "@/components/ui";
import { IconWarn } from "@/components/icons";
import { ASSETS, ETH_STAKED } from "@/lib/legend";
import { unitsFor, valueCents } from "@/lib/money";
import { crypto, eur, fixed, group, NNBSP, THIN } from "@/lib/format";
import { recipientInfo } from "@/lib/send";
import { maxSendUnits, useStore } from "@/lib/store";

const PRICE = ASSETS.ETH.priceCents;
const LIMITS = { eth: { int: 3, dec: 8 }, eur: { int: 6, dec: 2 } } as const;

function parse(input: string, scale: number): number {
  const [i, d = ""] = input.split(",");
  return Number(i || "0") * 10 ** scale + Number((d + "0".repeat(scale)).slice(0, scale));
}
function toInput(value: number, scale: number): string {
  const s = fixed(value, scale, scale, "");
  return s.includes(",") ? s.replace(/0+$/, "").replace(/,$/, "") : s;
}

export default function SendAmountPage() {
  const router = useRouter();
  const { send, holdings, setSendAmount, setSendNote } = useStore();

  React.useEffect(() => {
    if (!send.recipient) router.replace("/send");
  }, [send.recipient, router]);
  if (!send.recipient) return null;

  const info = recipientInfo(send.recipient);
  const available = holdings.ETH - ETH_STAKED; // 0,4200 ETH
  const max = maxSendUnits(holdings); // 0,4199 ETH
  const tooMuch = send.units > max;
  const eurCents = valueCents(send.units, PRICE);

  const press = (k: string) => {
    const lim = LIMITS[send.mode];
    let s = send.input;
    if (k === "del") s = s.length <= 1 ? "0" : s.slice(0, -1);
    else if (k === ",") s = s.includes(",") ? s : s + ",";
    else {
      const [i, d] = s.split(",");
      if (d === undefined && i.length >= lim.int && i !== "0") return;
      if (d !== undefined && d.length >= lim.dec) return;
      s = s === "0" ? k : s + k;
    }
    const units = send.mode === "eth" ? parse(s, 8) : unitsFor(parse(s, 2), PRICE);
    setSendAmount({ mode: send.mode, input: s, units });
  };

  const setUnits = (units: number) => setSendAmount({ mode: "eth", input: toInput(units, 8), units });
  const chips = [
    { label: `25${NNBSP}%`, units: Math.floor(available / 4) },
    { label: `50${NNBSP}%`, units: Math.floor(available / 2) },
    { label: "Max", units: max },
  ];

  // Switching units keeps the amount; only the side being typed changes.
  const toggle = () =>
    setSendAmount(
      send.mode === "eth"
        ? { mode: "eur", input: toInput(eurCents, 2), units: send.units }
        : { mode: "eth", input: toInput(send.units, 8), units: send.units }
    );

  const [iPart, dPart] = send.input.split(",");
  const typed = group(iPart, THIN) + (dPart !== undefined ? "," + dPart : "");
  const unit = send.mode === "eth" ? "ETH" : "€";
  // Geist Mono advance 0.6 em: shrink so figure + unit fit on one line (361 px).
  const fontSize = Math.min(64, Math.floor((361 - 10 - 0.6 * 28 * unit.length) / (0.6 * typed.length)));

  return (
    <Screen
      actions={
        <>
          <div className="amount-keypad">
            <Keypad onKey={press} />
          </div>
          <Button disabled={send.units <= 0 || tooMuch} onClick={() => router.push("/send/review")}>
            Review
          </Button>
        </>
      }
    >
      <ScreenHeader coin="ETH" title="Send ETH" onLeading={() => router.push("/send")} />

      <div className="to-pill-wrap">
        <span className="to-pill">
          <RecipientAvatar kind={info.avatar} size={26} />
          {info.pill}
        </span>
      </div>

      <div className="send-amount">
        <div className={"send-value" + (tooMuch ? " loss" : "")} aria-live="polite">
          <span className="send-figure" style={{ fontSize }}>
            <Num>{typed}</Num>
          </span>
          <span className="send-unit">{unit}</span>
        </div>
        {tooMuch ? (
          <span className="send-approx">
            <Num>{"≈ " + eur(eurCents)}</Num>
          </span>
        ) : (
          <UnitSwitch onClick={toggle} label={send.mode === "eth" ? "Enter amount in euro" : "Enter amount in ETH"}>
            <span>
              <Num>{"≈ " + (send.mode === "eth" ? eur(eurCents) : crypto(send.units, "ETH", 4))}</Num>
            </span>
          </UnitSwitch>
        )}
      </div>

      {tooMuch ? (
        <>
          <p className="field-error send-error" role="alert">
            <IconWarn />
            Up to {fixed(max, 8, 4, NNBSP)}
            {NNBSP}ETH after fees — {fixed(ETH_STAKED, 8, 1, NNBSP)}
            {NNBSP}ETH is staked
          </p>
          <div className="chips send-chips not-enough">
            <Chip onClick={() => setUnits(max)}>
              Send {fixed(max, 8, 4, NNBSP)}
              {NNBSP}ETH
            </Chip>
            {/* Unstaking is a later flow (Earn); placeholder for now. */}
            <Chip onClick={() => undefined}>Unstake · 7 days</Chip>
          </div>
        </>
      ) : (
        <>
          <div className="chips send-chips">
            {chips.map((c) => (
              <Chip key={c.label} selected={send.units === c.units && send.units > 0} onClick={() => setUnits(c.units)}>
                {c.label}
              </Chip>
            ))}
          </div>
          <p className="send-available">
            Available {fixed(available, 8, 4, NNBSP)}
            {NNBSP}ETH · {fixed(ETH_STAKED, 8, 1, NNBSP)}
            {NNBSP}ETH is staked
          </p>
          <label className="note-field">
            <span className="note-label">{info.noteLabel}</span>
            <input
              className="note-input"
              value={send.note}
              maxLength={60}
              placeholder="Add a note"
              onChange={(e) => setSendNote(e.target.value)}
            />
          </label>
        </>
      )}
    </Screen>
  );
}
