// components/Num.tsx — renders a mono figure string (from lib/format.ts) with the
// Figma comma rule: the glyph before the decimal comma and the comma itself get
// letter-spacing −0.22 em. `faint` greys the comma and decimals (hero balances).
import React from "react";

export function Num({ children, faint, className }: { children: string; faint?: boolean; className?: string }) {
  const s = children;
  const i = s.indexOf(",");
  const cls = "num" + (className ? " " + className : "");
  if (i < 1) return <span className={cls}>{s}</span>;
  const head = s.slice(0, i - 1);
  const pre = s[i - 1];
  const tail = s.slice(i + 1);
  return (
    <span className={cls}>
      {head}
      <span className="kern">{pre}</span>
      <span className={faint ? "kern faint" : "kern"}>,</span>
      {faint ? <span className="faint">{tail}</span> : tail}
    </span>
  );
}
