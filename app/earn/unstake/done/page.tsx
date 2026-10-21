"use client";
// app/earn/unstake/done/page.tsx — Unstake 3 · Requested (Figma 2316:6791 / 2316:7101):
// a three-step timeline, Requested → Unlocking → Ready to use.
import React from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/Screen";
import { Button, Divider, ScreenHeader } from "@/components/ui";
import { IconCheckBold, IconLock, IconTimer, IconWallet } from "@/components/icons";
import { UNSTAKE_UNLOCKS } from "@/lib/legend";
import { cryptoText } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function UnstakeDonePage() {
  const router = useRouter();
  const { unstakeReceipt: r } = useStore();

  React.useEffect(() => {
    if (!r) router.replace("/earn/ethereum");
  }, [r, router]);
  if (!r) return null;

  const steps = [
    { key: "req", dot: "gain", icon: <IconCheckBold size={18} />, title: "Requested", sub: `Today, ${r.time}` },
    { key: "unl", dot: "neutral", icon: <IconLock size={18} />, title: "Unlocking", sub: "About 7 days · no rewards", strong: true },
    { key: "rdy", dot: "track", icon: <IconWallet size={18} />, title: "Ready to use", sub: `Around ${UNSTAKE_UNLOCKS}`, idle: true },
  ];

  return (
    <Screen actions={<Button onClick={() => router.push("/earn/ethereum")}>Done</Button>}>
      <ScreenHeader leading="close" onLeading={() => router.push("/earn/ethereum")} />

      <div className="done-hero">
        <span className="state-icon neutral">
          <IconTimer size={40} />
        </span>
        <h1 className="serif">Unstaking {cryptoText(r.units, "ETH", 4, " ")}</h1>
        <p className="sub">It should unlock around {UNSTAKE_UNLOCKS}. We’ll tell you when it’s ready to use.</p>
      </div>

      <div className="card timeline" role="list">
        {steps.map((s, i) => (
          <React.Fragment key={s.key}>
            {i > 0 && <Divider inset />}
            <div className="timeline-step" role="listitem">
              <span className={"timeline-dot " + s.dot}>{s.icon}</span>
              <span className="list-row-main">
                <span className={"timeline-title" + (s.strong ? " strong" : "") + (s.idle ? " idle" : "")}>{s.title}</span>
                <span className="list-row-sub">{s.sub}</span>
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </Screen>
  );
}
