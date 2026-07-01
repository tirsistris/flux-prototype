import type { Config } from "tailwindcss";

// Preflight is disabled: the ported Flux design ships its own reset (see
// app/globals.css) and its own component CSS (styles/fx.css, styles/fl.css).
// Tailwind is used only for page-level layout scaffolding around the phone
// frame, so its opinionated base reset would only fight the design.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
