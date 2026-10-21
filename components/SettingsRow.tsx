// components/SettingsRow.tsx — Figma Profile / Safety rows: 40 px tile with a glyph,
// label (+ optional sub), muted value, chevron. A row is a link when it has `href`.
import React from "react";
import Link from "next/link";
import { IconChevR } from "@/components/icons";

export function SettingsRow({
  icon,
  label,
  sub,
  value,
  href,
  trailing,
}: {
  icon?: React.ReactNode;
  label: string;
  sub?: string;
  value?: string;
  href?: string;
  trailing?: React.ReactNode;
}) {
  const body = (
    <>
      {icon && <span className="tile settings-tile">{icon}</span>}
      <span className="list-row-main">
        <span className="settings-label">{label}</span>
        {sub && <span className="list-row-sub">{sub}</span>}
      </span>
      {value && <span className="settings-value">{value}</span>}
      {trailing ??
        (href && (
          <span className="row-chev">
            <IconChevR />
          </span>
        ))}
    </>
  );
  const cls = "list-row settings-row" + (sub ? " has-sub" : "");
  return href ? (
    <Link href={href} className={cls}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}
