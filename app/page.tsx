"use client";
// app/page.tsx — Flux Welcome (fx system), golden-path entry. Ported from
// screens.jsx ScreenWelcome. Replaces the phase-1 dev launchpad, which now lives
// at /dev (outside the golden path). [Get started] → onboarding; the secondary
// link → /login.
import { useRouter } from "next/navigation";
import { FxPhone, FluxLogo, PrimaryButton, Body, FX_THEME } from "@/components/fx/ui";

const T = FX_THEME;

export default function WelcomePage() {
  const router = useRouter();
  return (
    <FxPhone>
      <div className="fx-screen">
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <FluxLogo T={T} />
          <h1 className="fx-h1" style={{ marginTop: 40, fontSize: 34 }}>{T.slogan}</h1>
          <Body>Buy, hold and grow your money — without the confusing jargon.</Body>
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: "center" }}>
          <PrimaryButton label="Get started" onClick={() => router.push("/onboarding")} T={T} />
          <button className="fx-textlink" onClick={() => router.push("/login")}>I already have an account</button>
        </div>
      </div>
    </FxPhone>
  );
}
