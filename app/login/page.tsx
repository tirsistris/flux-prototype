"use client";
// app/login/page.tsx — Flux Login (fx system), ported from login.jsx (resting
// "empty" state). Was a phase-1 pipeline check with every CTA a dead stub
// ([Log in] onClick={() => {}}, Face ID/Apple/Google with no handler at all,
// "Create account" a bare <a> with no href) and no way back to Welcome — a
// dead end once 3b wired Welcome -> /login in. Phase-4c: every CTA goes
// somewhere. Log in / Face ID / Apple / Google all go straight to /home
// (demo shortcut, same as create-account's Apple/Google and its post-signup
// overlay — no real auth exists to gate on). Forgot password stays an
// honestly-disabled control (no reset flow exists). Create account -> the
// real /create-account route. AUTHORED: the source design has no back
// affordance on this screen; added one (TopChrome, same as create-account)
// since without it /login is a dead end with only the OS back gesture to
// escape.
import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StatusBar } from "@/components/frame/StatusBar";
import { FluxLogo, PrimaryButton, TopChrome, FX_THEME } from "@/components/fx/ui";
import { Ico } from "@/components/icons";

const T = FX_THEME;

export default function LoginPage() {
  const router = useRouter();
  const [hide, setHide] = React.useState(true);
  return (
    <div className="device-stage">
      <div className="fx-phone">
        <div
          className="fx-herohlow"
          style={{ background: "radial-gradient(125% 62% at 50% -8%, rgba(123,97,255,0.34), rgba(74,111,232,0.12) 42%, transparent 70%)" }}
        />
        <div className="fx-island" />
        <StatusBar system="fx" />

        <div className="fx-screen fx-login">
          <TopChrome onBack={() => router.back()} />
          <div style={{ display: "flex", justifyContent: "center", marginTop: 4, marginBottom: 22 }}>
            <FluxLogo T={T} size={46} />
          </div>

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h1 className="fx-h1">Welcome back</h1>
            <p className="fx-body">Log in to pick up where you left off.</p>
          </div>

          <div className="fx-field">
            <span className="fx-label">Email</span>
            <div className="fx-input">
              <span className="fx-input-ph">you@email.com</span>
            </div>
          </div>

          <div className="fx-field" style={{ marginTop: 14 }}>
            <span className="fx-label">Password</span>
            <div className="fx-input">
              <span className="fx-input-ph">Enter your password</span>
              <button className="fx-eye" onClick={() => setHide((h) => !h)} aria-label="Show password">
                {hide ? Ico.eye("rgba(235,235,245,0.55)", 21) : Ico.eyeOff("rgba(235,235,245,0.55)", 21)}
              </button>
            </div>
          </div>

          {/* No reset flow exists behind this — honestly disabled rather than a dead-looking-live control. */}
          <button className="fx-forgot" disabled style={{ opacity: 0.5, cursor: "default" }}>Forgot password?</button>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
            <PrimaryButton label="Log in" onClick={() => router.push("/home")} T={T} />
            <button className="fx-outline-wide" onClick={() => router.push("/home")}>{Ico.faceid("#fff", 22)}<span>Log in with Face ID</span></button>
          </div>

          <div className="fx-or" style={{ margin: "18px 0" }}>
            <span>or continue with</span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="fx-outline" onClick={() => router.push("/home")}>{Ico.apple("#fff", 19)}<span>Apple</span></button>
            <button className="fx-outline" onClick={() => router.push("/home")}>{Ico.google("#fff", 18)}<span>Google</span></button>
          </div>

          <div style={{ flex: 1 }} />
          <p className="fx-footer">New to Flux? <Link href="/create-account">Create account</Link></p>
        </div>

        <div className="fx-home-ind" />
      </div>
    </div>
  );
}
