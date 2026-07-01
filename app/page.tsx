import Link from "next/link";

// Phase-1 dev launchpad ONLY. This is not a designed screen — it just links to
// the two pipeline-check routes. In phase 2 this route becomes the Welcome
// screen (golden path entry).
export default function DevIndex() {
  return (
    <main style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", gap: 16, alignItems: "center", justifyContent: "center", padding: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>Flux — phase 1 check</h1>
      <p style={{ color: "#8A91A3", fontSize: 14 }}>Two pipeline-check screens:</p>
      <div style={{ display: "flex", gap: 12 }}>
        <Link href="/home" style={{ padding: "12px 20px", borderRadius: 12, background: "linear-gradient(135deg,#7B61FF,#4A6FE8)", color: "#fff", fontWeight: 700, textDecoration: "none" }}>
          /home (fl)
        </Link>
        <Link href="/login" style={{ padding: "12px 20px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", fontWeight: 700, textDecoration: "none" }}>
          /login (fx)
        </Link>
      </div>
    </main>
  );
}
