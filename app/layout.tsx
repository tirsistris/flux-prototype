import type { Metadata, Viewport } from "next";
import { Literata } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/app/providers";
import { Stage } from "@/components/Phone";
import { stageFitScript, themeBootScript } from "@/lib/theme";
import "@/styles/tokens.css";
import "@/styles/app.css";

// Fonts: UI is the system stack only (SF Pro files are not embedded — Apple's
// licence forbids it). Figures and receipts: Geist Mono (OFL, `geist` package).
// Large headings: Literata Regular, self-hosted by next/font.
const literata = Literata({ subsets: ["latin"], weight: ["400"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: "Flux — prototype v2",
  description: "Flux v2 prototype — an EUR-first crypto wallet concept. Design/UX prototype, not a financial product.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistMono.variable} ${literata.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: stageFitScript }} />
      </head>
      <body>
        <Providers>
          <Stage>{children}</Stage>
        </Providers>
      </body>
    </html>
  );
}
