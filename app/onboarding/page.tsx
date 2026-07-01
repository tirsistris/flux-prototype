"use client";
// app/onboarding/page.tsx — the 3 fx value screens as ONE route with internal
// step state (1→2→3), matching the source's single parameterised ScreenValue.
// The export had no interactive controller (it was a static print board), so the
// step/skip flow is our wiring. Content (kicker/title/body/illo) is verbatim from
// the onboarding board. Next advances; step 3 → /create-account; Skip jumps
// straight there; Back from step 1 returns to Welcome.
import React from "react";
import { useRouter } from "next/navigation";
import { FxPhone, TopChrome, Dots, PrimaryButton, Heading, Body, CoinCluster, MiniPortfolio, SecurityShield, FX_THEME } from "@/components/fx/ui";
import { Ico } from "@/components/icons";

const T = FX_THEME;

const VALUES = [
  {
    illo: <CoinCluster />,
    kicker: "Step 1",
    title: "Buy your first crypto in minutes",
    body: "It's no harder than tapping your bank card. Pick a coin, choose an amount, and we handle the rest.",
  },
  {
    illo: <MiniPortfolio T={T} />,
    kicker: "Step 2",
    title: "Start with just €1",
    body: "You don't need a fortune. Begin with the price of a coffee and grow whenever you're ready.",
  },
  {
    illo: <SecurityShield T={T} />,
    kicker: "Step 3",
    title: "Bank-grade security",
    body: "Face ID and bank-level encryption keep your money safe. Only you can ever access it.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState(1); // 1..3
  const v = VALUES[step - 1];

  const next = () => (step === 3 ? router.push("/create-account") : setStep((s) => s + 1));
  const back = () => (step === 1 ? router.push("/") : setStep((s) => s - 1));
  const skip = () => router.push("/create-account");

  return (
    <FxPhone>
      <div className="fx-screen">
        <TopChrome onBack={back} onSkip={skip} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 36 }}>
          <div>{v.illo}</div>
          <div style={{ textAlign: "center", padding: "0 4px" }}>
            <div className="fx-kicker">{v.kicker}</div>
            <Heading>{v.title}</Heading>
            <Body>{v.body}</Body>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22, alignItems: "center" }}>
          <Dots active={step - 1} total={3} T={T} />
          <PrimaryButton label={step === 3 ? "Continue" : "Next"} onClick={next} T={T} icon={Ico.arrowR("#fff", 19)} />
        </div>
      </div>
    </FxPhone>
  );
}
