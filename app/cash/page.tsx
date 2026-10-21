"use client";
// app/cash/page.tsx — Cash · Euro (Figma 2315:5708 / 2315:6200), from the Euro row on
// Home. RECENT lists the last three euro-balance movements from Activity (agreed):
// with nothing done yet that is the Figma row, Added money · Fri, 16 Oct.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Num } from "@/components/Num";
import { RowIcon } from "@/components/RowIcon";
import { Button, Divider, Note, ScreenHeader } from "@/components/ui";
import { IconAddCircle, IconArrowUpRight, IconShield } from "@/components/icons";
import { eur } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function CashPage() {
  const router = useRouter();
  const { holdings, activity } = useStore();
  const recent = activity.filter((a) => a.cashCents !== undefined).slice(0, 3);

  return (
    <Screen>
      <ScreenHeader coin="EUR" title="Euro" onLeading={() => router.push("/home")} />

      <div className="cash-balance">
        <span className="t15 muted">Euro balance</span>
        <span className="cash-value">
          <Num faint>{eur(holdings.eurCents)}</Num>
        </span>
        <span className="t13 muted">Ready for crypto or for your bank.</span>
      </div>

      <div className="bottom-actions-row cash-actions">
        <Button glyph={<IconAddCircle size={20} />} onClick={() => router.push("/cash/add")}>
          Add money
        </Button>
        <Button variant="secondary" glyph={<IconArrowUpRight />} onClick={() => router.push("/withdraw")}>
          Withdraw
        </Button>
      </div>

      <h2 className="day-label cash-label">RECENT</h2>
      <div className="card cash-list">
        {recent.map((a, i) => (
          <React.Fragment key={a.id}>
            {i > 0 && <Divider inset />}
            <div className="list-row">
              <RowIcon item={a} />
              <div className="list-row-main">
                <span className="list-row-title">{a.title}</span>
                <span className="list-row-sub">{a.cashSub}</span>
              </div>
              <div className="list-row-side">
                <span className={"primary" + ((a.cashCents ?? 0) > 0 ? " gain" : "")}>
                  <Num>{eur(a.cashCents ?? 0, { sign: true })}</Num>
                </span>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      <div className="cash-note">
        <Note icon={<IconShield />}>Your euros are kept separately from Flux’s own money.</Note>
      </div>
    </Screen>
  );
}
