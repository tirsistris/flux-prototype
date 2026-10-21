// components/RecipientAvatar.tsx — Maxim's photo, Anna's AV initials or a wallet
// tile (Ledger / new address), at the sizes the Send frames use (26, 40, 48).
import React from "react";
import { Person } from "@/components/Media";
import { IconWallet } from "@/components/icons";
import { CONTACTS } from "@/lib/legend";

export function RecipientAvatar({ kind, size }: { kind: "maxim" | "anna" | "wallet"; size: number }) {
  if (kind === "maxim") return <Person who="maxim" size={size} alt={`${CONTACTS.maxim.first} ${CONTACTS.maxim.last}`} />;
  if (kind === "anna") {
    return (
      <span className="avatar" style={{ width: size, height: size, borderRadius: size / 2, fontSize: Math.round((size * 15) / 40) }} aria-hidden="true">
        {CONTACTS.anna.initials}
      </span>
    );
  }
  // Figma tiles: 40 → radius 12 / icon 20, 48 → radius 14 / icon 24.
  const radius = size >= 48 ? 14 : size >= 40 ? 12 : 8;
  return (
    <span className="tile" style={{ width: size, height: size, borderRadius: radius }} aria-hidden="true">
      <IconWallet size={size >= 48 ? 24 : size >= 40 ? 20 : 16} />
    </span>
  );
}
