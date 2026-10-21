// components/RewardsChart.tsx — Figma "Rewards chart" (2296:1269 / 2301:3890): 35 daily
// bars, 3 px apart, bottom-aligned in 52 px; today's bar is action/primary, the rest
// chart/bar (apricot in light, grey in dark).
import React from "react";
import { EARN_BARS } from "@/lib/legend";

export function RewardsChart() {
  return (
    <div className="rewards-chart" aria-hidden="true">
      {EARN_BARS.map((h, i) => (
        <span key={i} className={i === EARN_BARS.length - 1 ? "today" : undefined} style={{ height: h }} />
      ))}
    </div>
  );
}
