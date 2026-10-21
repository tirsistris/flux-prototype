// lib/format.ts — number typography from the Flux · Final frames.
//   Mono (Geist Mono, figures and receipts): thin space U+2009 between digit groups
//   and before €, % or a ticker. The comma tracking is applied at render time by
//   <Num> (components/Num.tsx).
//   Prose (system UI font): narrow no-break space U+202F in the same places.
// Values arrive as integers in a fixed scale (cents = 2, crypto units = 8).

export const THIN = " ";
export const NNBSP = " ";
export const MINUS = "−";

/** Format integer `value` stored with `scale` decimals, shown with `dp` decimals. */
export function fixed(value: number, scale: number, dp: number, sep: string): string {
  const neg = value < 0;
  let v = BigInt(Math.abs(value));
  if (dp < scale) {
    const div = 10n ** BigInt(scale - dp);
    v = (v * 2n + div) / (2n * div); // half-up
  } else if (dp > scale) {
    v = v * 10n ** BigInt(dp - scale);
  }
  const s = v.toString().padStart(dp + 1, "0");
  const int = s.slice(0, s.length - dp) || "0";
  const frac = dp ? s.slice(s.length - dp) : "";
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return (neg ? MINUS : "") + grouped + (dp ? "," + frac : "");
}

type Opts = { sign?: boolean; dp?: number };

const signed = (s: string, value: number, sign?: boolean) =>
  sign && value > 0 ? "+" + s : s;

/** Euro amount for mono text: "22 258,51 €" (thin spaces). */
export function eur(cents: number, o: Opts = {}): string {
  return signed(fixed(cents, 2, o.dp ?? 2, THIN) + THIN + "€", cents, o.sign);
}

/** Euro amount inside SF prose: "500,00 € available" (narrow no-break spaces). */
export function eurText(cents: number, o: Opts = {}): string {
  return signed(fixed(cents, 2, o.dp ?? 2, NNBSP) + NNBSP + "€", cents, o.sign);
}

/** Crypto quantity for mono text: "0,000932 BTC". */
export function crypto(units: number, ticker: string, dp: number, o: { sign?: boolean } = {}): string {
  return signed(fixed(units, 8, dp, THIN) + THIN + ticker, units, o.sign);
}

/** Crypto quantity inside prose / Literata headings: "0,000932 BTC". */
export function cryptoText(units: number, ticker: string, dp: number): string {
  return fixed(units, 8, dp, NNBSP) + NNBSP + ticker;
}

/** Percent for mono text from a legend string like "2,1": "+2,1 %". */
export function pct(value: string, up: boolean): string {
  return (up ? "+" : MINUS) + value + THIN + "%";
}

/** Percent from hundredths (e.g. 931 → "9,31"), sign optional. */
export function pctX100(x100: number, sep: string, sign = true): string {
  const s = fixed(x100, 2, 2, sep) + sep + "%";
  return sign && x100 > 0 ? "+" + s : s;
}

/** Group a plain integer string ("106212" → "106 212"). */
export function group(int: string, sep = THIN): string {
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

/** Literal figure from legend/Figma written with plain spaces → mono spacing. */
export function monoLiteral(s: string): string {
  return s.replace(/ /g, THIN);
}

/** Up to 4 decimals without trailing zeros (agreed): 0,2 · 0,3407 · 0,1. */
export function short4(units: number, sep: string): string {
  const s = fixed(units, 8, 4, sep);
  return s.includes(",") ? s.replace(/0+$/, "").replace(/,$/, "") : s;
}

/** Mono euro without ",00" for whole amounts ("≈ 500 €" on Earn 4), else two decimals. */
export function eurWhole(cents: number): string {
  return cents % 100 === 0 ? group(String(cents / 100)) + THIN + "€" : eur(cents);
}
