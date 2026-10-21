"use client";
// app/activity/page.tsx — Activity (Figma 2312:6011 / 2312:6154). Reads the store's
// list, newest first, so a purchase appears as "Bought Bitcoin" at the top of
// TODAY. The filter chips work on the row kind (trade / transfer / earn).
// Right column (legend.md): a buy shows what was paid, a sale what reached the euro
// balance, a swap what came in and its value; stake / unstake rows carry no sign.
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { NOT_IN_PROTOTYPE } from "@/components/NotInPrototype";
import { Num } from "@/components/Num";
import { Chip, Divider, IconButton } from "@/components/ui";
import { RowIcon } from "@/components/RowIcon";
import { IconSearch } from "@/components/icons";
import { DAY_LABEL, type ActivityItem, type ActivityKind } from "@/lib/legend";
import { crypto, eur } from "@/lib/format";
import { useStore } from "@/lib/store";

const FILTERS: { id: "all" | ActivityKind; label: string }[] = [
  { id: "all", label: "All" },
  { id: "trade", label: "Trades" },
  { id: "transfer", label: "Transfers" },
  { id: "earn", label: "Earn" },
];

function Row({ item }: { item: ActivityItem }) {
  const incoming = item.asset ? (item.qty ?? 0) > 0 : item.eurCents > 0;
  // Outgoing transfers open Transaction · Detail; other rows have no detail design yet.
  const Tag = item.send ? Link : "div";
  return (
    <Tag className="list-row" href={item.send ? `/tx/${item.id}` : (undefined as unknown as string)}>
      <RowIcon item={item} />
      <div className="list-row-main">
        <span className="list-row-title">{item.title}</span>
        <span className="list-row-sub">{item.sub}</span>
      </div>
      <div className="list-row-side">
        {item.asset ? (
          <>
            <span className={"primary" + (incoming && !item.plain ? " gain" : "")}>
              <Num>{crypto(item.qty ?? 0, item.asset, item.qtyDp ?? 4, { sign: !item.plain })}</Num>
            </span>
            <span className="secondary">
              <Num>{eur(item.eurCents)}</Num>
            </span>
          </>
        ) : (
          <span className={"primary" + (incoming ? " gain" : "")}>
            <Num>{eur(item.eurCents, { sign: true })}</Num>
          </span>
        )}
      </div>
    </Tag>
  );
}

export default function ActivityPage() {
  const { activity } = useStore();
  const router = useRouter();
  const [filter, setFilter] = React.useState<"all" | ActivityKind>("all");
  const rows = activity.filter((a) => filter === "all" || a.kind === filter);
  const days = (Object.keys(DAY_LABEL) as ActivityItem["day"][]).filter((d) => rows.some((r) => r.day === d));

  return (
    <Screen tab="activity">
      <div className="large-title">
        <h1>Activity</h1>
        <IconButton label="Search activity" onClick={() => router.push(NOT_IN_PROTOTYPE)}>
          <IconSearch />
        </IconButton>
      </div>
      <div className="chips activity-chips" role="group" aria-label="Filter">
        {FILTERS.map((f) => (
          <Chip key={f.id} selected={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
          </Chip>
        ))}
      </div>
      {days.length === 0 && <p className="activity-empty">Nothing here yet.</p>}
      {days.map((d) => {
        const items = rows.filter((r) => r.day === d);
        return (
          <section key={d} aria-label={DAY_LABEL[d]}>
            <h2 className="day-label">{DAY_LABEL[d]}</h2>
            <div className="card activity-card">
              {items.map((it, i) => (
                <React.Fragment key={it.id}>
                  {i > 0 && <Divider inset />}
                  <Row item={it} />
                </React.Fragment>
              ))}
            </div>
          </section>
        );
      })}
    </Screen>
  );
}
