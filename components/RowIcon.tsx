// components/RowIcon.tsx — the 40 px leading icon of an Activity row (also used by
// Cash · Euro RECENT): contact photo / initials or a glyph tile.
import React from "react";
import { Person } from "@/components/Media";
import { IconAddCircle, IconBank, IconEarn, IconSwap, IconTimer, IconWallet } from "@/components/icons";
import { CONTACTS, type ActivityItem } from "@/lib/legend";

export function RowIcon({ item }: { item: ActivityItem }) {
  switch (item.icon) {
    case "maxim":
      return <Person who="maxim" size={40} alt={`${CONTACTS.maxim.first} ${CONTACTS.maxim.last}`} />;
    case "anna":
      return <span className="avatar" aria-hidden="true">{CONTACTS.anna.initials}</span>;
    case "earn":
      return <span className="tile"><IconEarn /></span>;
    case "bank":
      return <span className="tile"><IconBank /></span>;
    case "wallet":
    case "sell":
      return <span className="tile"><IconWallet /></span>;
    case "swap":
      return <span className="tile"><IconSwap size={20} /></span>;
    case "unstake":
      return <span className="tile"><IconTimer size={20} /></span>;
    default:
      return <span className="tile"><IconAddCircle /></span>;
  }
}
