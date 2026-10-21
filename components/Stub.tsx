// components/Stub.tsx — tabs outside the prototype (Markets, Profile): the large
// title, then the quiet "Not in this prototype" state; the tab bar stays.
import React from "react";
import { Screen } from "@/components/Screen";
import { NotInPrototype } from "@/components/NotInPrototype";
import type { TabId } from "@/components/TabBar";

export function Stub({ tab, title }: { tab: TabId; title: string }) {
  return (
    <Screen tab={tab}>
      <div className="large-title">
        <h1>{title}</h1>
      </div>
      <NotInPrototype />
    </Screen>
  );
}
