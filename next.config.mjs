// v1 paths that v2 does not have go to the same path on the v1 archive, so links
// shared before the v2 release keep opening v1. Temporary (307), not permanent.
const V1 = "https://flux-concept-v1.vercel.app";

// v1 used /earn/eth, /earn/sol, /earn/btc, /earn/usdc…; v2 owns /earn/ethereum, /earn/solana,
// /earn/stake and /earn/unstake.
const V1_EARN_ID = ":id((?!ethereum$|solana$|stake$|unstake$)[^/]+)";

const V1_ONLY = [
  ["/alerts/:path*"],
  ["/buy/confirm"],
  ["/buy/payment"],
  ["/buy/success"],
  ["/coin/:path*"],
  ["/create-account"],
  [`/earn/${V1_EARN_ID}`, "/earn/:id"],
  [`/earn/${V1_EARN_ID}/amount`, "/earn/:id/amount"],
  ["/login"],
  ["/onboarding"],
  ["/send/confirm"],
  ["/send/success"],
  ["/settings/:path*"],
  ["/trade"],
  ["/wallet"],
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return V1_ONLY.map(([source, path = source]) => ({ source, destination: V1 + path, permanent: false }));
  },
};

export default nextConfig;
