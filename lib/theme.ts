// lib/theme.ts — shared between the server layout (pre-paint script) and the
// client ThemeToggle.
export const THEME_KEY = "flux-theme";

/** Inline, pre-paint: restores a pinned theme before first render (no flash). */
export const themeBootScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
