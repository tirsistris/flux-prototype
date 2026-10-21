"use client";
// app/not-in-prototype/page.tsx — opened by placeholder buttons (coin pickers, scan,
// payment methods…): the quiet "Not in this prototype" state with a way back.
import React from "react";
import { Screen } from "@/components/Screen";
import { ScreenHeader } from "@/components/ui";
import { NotInPrototype, useGoBack } from "@/components/NotInPrototype";

export default function NotInPrototypePage() {
  const back = useGoBack();
  return (
    <Screen>
      <ScreenHeader onLeading={back} />
      <NotInPrototype />
    </Screen>
  );
}
