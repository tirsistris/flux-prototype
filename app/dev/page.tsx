import Link from "next/link";

// app/dev/page.tsx — developer launchpad (moved off / in phase 3b, which now
// shows the real Welcome screen). NOT part of the golden path; links to every
// screen for quick manual navigation. Hide or remove before any real deploy.
const ROUTES: [string, string][] = [
  ["/", "Welcome"],
  ["/onboarding", "Onboarding (3 value)"],
  ["/create-account", "Create account"],
  ["/login", "Login"],
  ["/home", "Home"],
  ["/markets", "Markets"],
  ["/wallet", "Wallet"],
  ["/trade", "Trade"],
  ["/profile", "Profile"],
  ["/coin/btc", "Coin · BTC"],
  ["/coin/eth", "Coin · ETH"],
  ["/buy", "Buy flow"],
  ["/tx/seed-0", "Tx detail (seed)"],
];

export default function DevIndex() {
  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", gap: 16, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>Flux — dev launchpad</h1>
      <p style={{ color: "#8A91A3", fontSize: 14 }}>All screens (not part of the golden path):</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center", maxWidth: 520 }}>
        {ROUTES.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            style={{ padding: "12px 18px", borderRadius: 12, background: "linear-gradient(135deg,#7B61FF,#4A6FE8)", color: "#fff", fontWeight: 700, textDecoration: "none", fontSize: 14 }}
          >
            {label}
          </Link>
        ))}
      </div>
    </main>
  );
}
