"use client";
// components/ThemeToggle.tsx — prototype-level theme switch (lives outside the
// phone). "Auto" follows prefers-color-scheme; Light/Dark pin <html data-theme>.
// The choice is a per-viewer convenience kept in localStorage (guarded).
import React from "react";
import { THEME_KEY as KEY } from "@/lib/theme";

type Choice = "auto" | "light" | "dark";

function apply(c: Choice) {
  const root = document.documentElement;
  if (c === "auto") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", c);
}

export function ThemeToggle() {
  const [choice, setChoice] = React.useState<Choice>("auto");

  React.useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === "light" || v === "dark") setChoice(v);
    } catch {}
  }, []);

  const pick = (c: Choice) => {
    setChoice(c);
    apply(c);
    try {
      if (c === "auto") localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, c);
    } catch {}
  };

  return (
    <div className="theme-toggle" role="radiogroup" aria-label="Theme">
      {(["auto", "light", "dark"] as const).map((c) => (
        <button key={c} type="button" role="radio" aria-checked={choice === c} className={choice === c ? "on" : ""} onClick={() => pick(c)}>
          {c === "auto" ? "Auto" : c === "light" ? "Light" : "Dark"}
        </button>
      ))}
    </div>
  );
}
