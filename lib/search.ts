// lib/search.ts — coin search for Search (Figma 2303:5017 / 2303:5075). A query
// matches a coin when its name or ticker contains it, or — for 4+ letters — when it
// is one edit away from the start of the name ("bitcon" → Bitcoin, as the
// Nothing-found screen promises). Anything else (e.g. "pepe") finds nothing.
import type { Market } from "@/lib/legend";

function edits(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[a.length][b.length];
}

export function matches(m: Market, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  const name = m.name.toLowerCase();
  if (name.includes(q) || m.id.toLowerCase().includes(q)) return true;
  if (q.length < 4) return false;
  for (let len = q.length - 1; len <= q.length + 1; len++) {
    if (len <= name.length && edits(q, name.slice(0, len)) <= 1) return true;
  }
  return false;
}
