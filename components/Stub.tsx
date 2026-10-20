// components/Stub.tsx — placeholder for tabs that are built in later steps.
import React from "react";
import { Screen } from "@/components/Screen";
import type { TabId } from "@/components/TabBar";

export function Stub({ tab, title }: { tab: TabId; title: string }) {
  return (
    <Screen tab={tab}>
      <div className="large-title">
        <h1>{title}</h1>
      </div>
      <p className="stub">This tab comes in a later step of the v2 prototype. Buy Bitcoin from Home to try the flow.</p>
    </Screen>
  );
}
