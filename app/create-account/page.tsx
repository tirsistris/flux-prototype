"use client";
// app/create-account/page.tsx — fx ScreenSignup + SuccessOverlay. Ported verbatim
// from screens.jsx (the source signup is button-only — NO input fields — so there
// is no fake form pretending to validate). Honest demo frame: [Create account]
// shows the success overlay → [Let's buy your first crypto] → /home; Apple/Google
// go straight into the app (not fake OAuth); the secondary link → /login.
import React from "react";
import { useRouter } from "next/navigation";
import { FxPhone, TopChrome, FluxLogo, PrimaryButton, Heading, Body, SuccessOverlay, FX_THEME } from "@/components/fx/ui";
import { Ico } from "@/components/icons";

const T = FX_THEME;

export default function CreateAccountPage() {
  const router = useRouter();
  const [done, setDone] = React.useState(false);

  return (
    <FxPhone>
      <div className="fx-screen">
        <TopChrome onBack={() => router.back()} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <FluxLogo T={T} size={52} />
          </div>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <Heading>Create your account</Heading>
            <Body>It only takes a minute. Your money stays yours, always.</Body>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <PrimaryButton label="Create account" onClick={() => setDone(true)} T={T} />
            <div className="fx-or"><span>or continue with</span></div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="fx-outline" onClick={() => router.push("/home")}>{Ico.apple("#fff", 19)}<span>Apple</span></button>
              <button className="fx-outline" onClick={() => router.push("/home")}>{Ico.google("#fff", 18)}<span>Google</span></button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <button className="fx-textlink" onClick={() => router.push("/login")}>I already have an account</button>
          <p className="fx-terms">By continuing you agree to Flux&apos;s <a>Terms</a> &amp; <a>Privacy Policy</a>.</p>
        </div>
      </div>
      {done && <SuccessOverlay T={T} onDone={() => router.push("/home")} />}
    </FxPhone>
  );
}
