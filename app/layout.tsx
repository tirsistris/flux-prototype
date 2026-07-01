import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import "@/styles/fx.css";
import "@/styles/fl.css";

// Inter is self-hosted through next/font (no Google Fonts <link>). It is exposed
// as the --font-inter CSS variable, which globals.css maps onto <body> and onto
// the few design rules that name 'Inter' literally.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Flux — crypto, made simple",
  description: "Flux prototype — an EUR-first crypto wallet for newcomers.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05070c",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
