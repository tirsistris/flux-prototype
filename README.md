# Flux — prototype v2

An EUR-first crypto wallet concept for newcomers: a clickable design/UX prototype,
not a financial product. Live: https://flux-concept.vercel.app

It covers **Buy**, **Sell**, **Swap**, **Send**, **Receive**, **Earn** (stake, unstake) and the
euro balance (add money, withdraw), plus Home, Markets, Search, Activity and Profile. Some
buttons (coin pickers, scan, payment methods…) are placeholders.

## How it is built

- Screens follow Figma "Flux · Final" (colour modes "Light · Flux" / "Dark · Flux").
- Every number comes from `legend.md` (the single source of truth) via `lib/legend.ts`;
  derived figures go through `lib/money.ts` in integer cents and 1e-8 crypto units.
- Next.js 14 (App Router), no backend: state lives in memory and resets on reload.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production build
```

## v1

The first version is archived at tag `v1` (branch `v1-archive`) and deployed at
https://flux-concept-v1.vercel.app
