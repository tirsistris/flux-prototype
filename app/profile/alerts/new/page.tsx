"use client";
// app/profile/alerts/new/page.tsx — Price alert · New (Figma 2302:4450 / 2302:5000).
// Keypad edits the target; the % line is recomputed from today's Bitcoin price.
// Chips set ±2/5/10 % from that price, rounded to whole euros. Create adds the alert
// to Price alerts (needs a target on the chosen side of the price). Picking another
// coin is outside this prototype.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { NOT_IN_PROTOTYPE, useGoBack } from "@/components/NotInPrototype";
import { Button, Chip, Coin, Keypad, ScreenHeader, Toggle } from "@/components/ui";
import { IconBell, IconChevDown } from "@/components/icons";
import { ASSETS } from "@/lib/legend";
import { awayX100 } from "@/lib/alerts";
import { eurText, group, NNBSP, pctX100, THIN } from "@/lib/format";
import { useStore } from "@/lib/store";

const PRICE = ASSETS.BTC.priceCents;
const STEPS = [2, 5, 10];

function toCents(input: string): number {
  const [i, d = ""] = input.split(",");
  return Number(i || "0") * 100 + Number((d + "00").slice(0, 2));
}

export default function NewAlertPage() {
  const router = useRouter();
  const back = useGoBack();
  const { addAlert } = useStore();
  const [above, setAbove] = React.useState(true);
  const [input, setInput] = React.useState("110000"); // Figma default target
  const [push, setPush] = React.useState(true);

  const target = toCents(input);
  const away = awayX100(target, PRICE);
  const valid = target > 0 && (above ? target > PRICE : target < PRICE);

  const press = (k: string) => {
    let s = input;
    if (k === "del") s = s.length <= 1 ? "0" : s.slice(0, -1);
    else if (k === ",") s = s.includes(",") ? s : s + ",";
    else {
      const [i, d] = s.split(",");
      if (d === undefined && i.length >= 7 && i !== "0") return;
      if (d !== undefined && d.length >= 2) return;
      s = s === "0" ? k : s + k;
    }
    setInput(s);
  };

  const [iPart, dPart] = input.split(",");
  const shown = group(iPart, THIN) + (dPart !== undefined ? "," + dPart : "") + THIN + "€";
  // Geist Mono advance 0.6 em: shrink so the figure fits on one line (361 px).
  const fontSize = Math.min(56, Math.floor(361 / (0.6 * shown.length)));

  return (
    <Screen
      actions={
        <>
          <div className="amount-keypad">
            <Keypad onKey={press} />
          </div>
          <Button
            disabled={!valid}
            onClick={() => {
              addAlert({ asset: "BTC", above, targetCents: target, on: push });
              back();
            }}
          >
            Create alert
          </Button>
        </>
      }
    >
      <ScreenHeader title="New price alert" onLeading={back} />

      <div className="to-pill-wrap">
        <button type="button" className="asset-chip" onClick={() => router.push(NOT_IN_PROTOTYPE)}>
          <Coin asset="BTC" size={26} />
          Bitcoin
          <IconChevDown />
        </button>
      </div>

      <div className="segmented" role="radiogroup" aria-label="Direction">
        {[true, false].map((v) => (
          <button key={String(v)} type="button" role="radio" aria-checked={above === v} className={above === v ? "on" : ""} onClick={() => setAbove(v)}>
            {v ? "Above" : "Below"}
          </button>
        ))}
      </div>

      <div className="alert-target">
        <span className="t13 muted">Tell me when Bitcoin goes {above ? "above" : "below"}</span>
        <span className="alert-figure" style={{ fontSize }}>
          <Num>{shown}</Num>
        </span>
        <span className="alert-delta">
          <span className={away >= 0 ? "gain" : "loss"}>
            <Num>{pctX100(away, THIN)}</Num>
          </span>
          <span className="muted">from {eurText(PRICE)} now</span>
        </span>
      </div>

      <div className="chips alert-chips">
        {STEPS.map((p) => {
          const euros = Math.round((PRICE * (above ? 100 + p : 100 - p)) / 10_000);
          return (
            <Chip key={p} onClick={() => setInput(String(euros))}>
              {above ? "+" : "−"}
              {p}
              {NNBSP}%
            </Chip>
          );
        })}
      </div>

      <div className="card settings-card delivery">
        <div className="list-row settings-row has-sub delivery-row">
          <span className="tile delivery-tile">
            <IconBell size={18} />
          </span>
          <span className="list-row-main">
            <span className="alert-title">Push notification</span>
            <span className="list-row-sub">On this iPhone</span>
          </span>
          <Toggle on={push} onChange={setPush} label="Push notification" />
        </div>
      </div>
    </Screen>
  );
}
