"use client";
// app/login/page.tsx — Flux Login (fx system), ported from login.jsx (resting
// "empty" state). Phase-1 pipeline check for the fx CSS + fx primitives + the
// fx phone chassis. The password eye toggles live; navigation/other states land
// in phase 2 (golden path) and phase 3.
import React from "react";
import { StatusBar } from "@/components/frame/StatusBar";
import { FluxLogo, PrimaryButton, FX_THEME } from "@/components/fx/ui";
import { Ico } from "@/components/icons";

const T = FX_THEME;

export default function LoginPage() {
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

          <button className="fx-forgot">Forgot password?</button>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
            <PrimaryButton label="Log in" onClick={() => {}} T={T} />
            <button className="fx-outline-wide">{Ico.faceid("#fff", 22)}<span>Log in with Face ID</span></button>
          </div>

          <div className="fx-or" style={{ margin: "18px 0" }}>
            <span>or continue with</span>
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button className="fx-outline">{Ico.apple("#fff", 19)}<span>Apple</span></button>
            <button className="fx-outline">{Ico.google("#fff", 18)}<span>Google</span></button>
          </div>

          <div style={{ flex: 1 }} />
          <p className="fx-footer">New to Flux? <a>Create account</a></p>
        </div>

        <div className="fx-home-ind" />
      </div>
    </div>
  );
}
