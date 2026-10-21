// lib/theme.ts — shared between the server layout (pre-paint script) and the
// client ThemeToggle.
export const THEME_KEY = "flux-theme";

/** Inline, pre-paint: restores a pinned theme before first render (no flash). */
export const themeBootScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

/** Inline, pre-paint: scales the stage (bar 34 + gap 20 + phone 852 = 906 px, plus
 *  56 px of stage padding) to the window height, never above 1. Phones (≤ 500 px
 *  wide) keep 1 — the frame is the screen there. Kept in sync on resize. */
export const stageFitScript = `(function(){var r=document.documentElement;function f(){var s=innerWidth<=500?1:Math.min(1,(innerHeight-56)/906);r.style.setProperty("--stage-scale",String(Math.max(0.5,s)))}f();addEventListener("resize",f)})()`;
