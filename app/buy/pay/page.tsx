"use client";
// app/buy/pay/page.tsx — Buy 3 · Pay with (Figma 2297:2092 / 2297:2501).
// Apple Pay is preselected (last used). Euro balance works while the amount fits
// in the 500,00 € cash; Visa behaves like Apple Pay; Bank transfer is listed but
// not selectable (no design for a deferred-price purchase yet — agreed).
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { NOT_IN_PROTOTYPE } from "@/components/NotInPrototype";
import { Num } from "@/components/Num";
import { Button, Coin, Divider, Note, Radio, ScreenHeader } from "@/components/ui";
import { IconAddCircle, IconBank, IconCard, IconShield, IconWallet } from "@/components/icons";
import { PAY_METHODS, type PayMethod } from "@/lib/legend";
import { quoteBuy } from "@/lib/money";
import { crypto, eur, eurText } from "@/lib/format";
import { useStore } from "@/lib/store";

const ORDER: PayMethod[] = ["euro", "apple", "visa", "bank"];

function MethodIcon({ m }: { m: PayMethod }) {
  if (m === "euro") return <Coin asset="EUR" />;
  const I = m === "apple" ? IconWallet : m === "visa" ? IconCard : IconBank;
  return (
    <span className="tile">
      <I />
    </span>
  );
}

export default function PayWithPage() {
  const router = useRouter();
  const { draft, method, setMethod, holdings } = useStore();
  const q = quoteBuy(draft.eurCents);

  React.useEffect(() => {
    if (draft.eurCents <= 0) router.replace("/buy/amount");
  }, [draft.eurCents, router]);

  const available = (m: PayMethod) => PAY_METHODS[m].selectable && (m !== "euro" || draft.eurCents <= holdings.eurCents);
  const selected = available(method) ? method : "apple";

  return (
    <Screen
      actions={
        <Button
          onClick={() => {
            setMethod(selected);
            router.push("/buy/review");
          }}
        >
          Continue
        </Button>
      }
    >
      <ScreenHeader onLeading={() => router.push("/buy/amount")} title="Pay with" />

      <div className="pay-top">
        <span className="order-pill">
          <Coin asset="BTC" size={22} />
          <span>
            <Num>{crypto(q.units, "BTC", 6)}</Num> · <Num>{eur(q.eurCents)}</Num>
          </span>
        </span>
      </div>

      <div className="card methods" role="radiogroup" aria-label="Payment method">
        {ORDER.map((m, i) => {
          const ok = available(m);
          const sub = m === "euro" ? `${eurText(holdings.eurCents)} ${PAY_METHODS.euro.sub}` : PAY_METHODS[m].sub;
          return (
            <React.Fragment key={m}>
              {i > 0 && <Divider inset />}
              <button
                type="button"
                role="radio"
                aria-checked={selected === m}
                aria-disabled={!ok}
                className="list-row method"
                onClick={() => ok && setMethod(m)}
              >
                <MethodIcon m={m} />
                <span className="list-row-main">
                  <span className="list-row-title">{PAY_METHODS[m].label}</span>
                  <span className="list-row-sub">{sub}</span>
                </span>
                <Radio on={selected === m} />
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* Adding a method needs a payments backend that a prototype doesn't have. */}
      <button type="button" className="add-method" onClick={() => router.push(NOT_IN_PROTOTYPE)}>
        <IconAddCircle />
        Add payment method
      </button>

      <div className="pay-note">
        <Note icon={<IconShield />}>Card details stay with our payment partner. Flux never sees your full card number.</Note>
      </div>
    </Screen>
  );
}
