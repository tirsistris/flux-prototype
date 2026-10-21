// lib/address.ts — what the "To" field contains. Agreed rules:
//   0x + 40 hex            → Ethereum
//   bc1… / 1… / 3…         → Bitcoin (wrong network for an ETH send)
//   anything else          → not an address (a contact-name filter if it matches one)
export type AddressKind = "eth" | "btc" | "none";

const ETH = /^0x[0-9a-fA-F]{40}$/;
const BTC = /^(bc1[02-9ac-hj-np-z]{11,87}|[13][1-9A-HJ-NP-Za-km-z]{25,34})$/;

export function detectAddress(raw: string): AddressKind {
  const v = raw.trim();
  if (ETH.test(v)) return "eth";
  if (BTC.test(v)) return "btc";
  return "none";
}

/** "0x91c4a07e…7be2" → "0x91c4…7be2", as the design shortens addresses. */
export function shortAddress(a: string): string {
  return a.slice(0, 6) + "…" + a.slice(-4);
}

/** Full ETH address in groups of four: "0x91c4 a07e 3b5d …" (legend.md form). */
export function addressGroups(a: string): string[] {
  const hex = a.slice(2);
  const groups = ["0x" + hex.slice(0, 4)];
  for (let i = 4; i < hex.length; i += 4) groups.push(hex.slice(i, i + 4));
  return groups;
}
