// components/Screen.tsx — one phone screen: scrolling content, then either pinned
// bottom actions (flows) or the tab bar (tabs).
import React from "react";
import { TabBar, type TabId } from "@/components/TabBar";

export function Screen({
  children,
  actions,
  tab,
  className,
}: {
  children: React.ReactNode;
  actions?: React.ReactNode;
  tab?: TabId;
  className?: string;
}) {
  return (
    <div className={"screen" + (className ? " " + className : "")}>
      <div className="screen-content">{children}</div>
      {actions && <div className="bottom-actions">{actions}</div>}
      {tab && <TabBar active={tab} />}
    </div>
  );
}
