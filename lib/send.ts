// lib/send.ts — how a recipient is presented across the Send flow and Activity.
// Contact copy follows Figma (Maxim) and the texts agreed for new address / Ledger.
import { SEND_CONTACTS, type RecipientRef } from "@/lib/legend";
import { shortAddress } from "@/lib/address";

export type RecipientInfo = {
  title: string; // Activity / Review title
  pill: string; // "To Maxim Petrov"
  noteLabel: string; // "Note for Maxim"
  sentHero: string; // Literata title on Sent
  detailLine: string; // "Sent to Maxim Petrov"
  short: string; // "0x7a3f…c41e"
  avatar: "maxim" | "anna" | "wallet";
  knownContact: boolean; // Maxim / Anna — "Let … know" share exists
  first: string;
  isNewAddress: boolean;
};

export function recipientInfo(r: RecipientRef): RecipientInfo {
  if (r.kind === "address") {
    const short = shortAddress(r.address);
    return {
      title: short,
      pill: `To ${short}`,
      noteLabel: "Note (only you see it)",
      sentHero: "On its way",
      detailLine: `Sent to ${short}`,
      short,
      avatar: "wallet",
      knownContact: false,
      first: short,
      isNewAddress: true,
    };
  }
  const c = SEND_CONTACTS[r.id];
  const own = !!c.own;
  return {
    title: c.name,
    pill: `To ${c.name}`,
    noteLabel: own ? "Note (only you see it)" : `Note for ${c.first}`,
    sentHero: own ? "On its way to your Ledger" : `On its way to ${c.first}`,
    detailLine: `Sent to ${c.name}`,
    short: c.short,
    avatar: r.id === "ledger" ? "wallet" : r.id,
    knownContact: !own,
    first: c.first,
    isNewAddress: false,
  };
}
