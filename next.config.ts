import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
  devIndicators: false,
  // firebase-admin은 서버 전용 CJS/ESM 혼합 패키지라 Next의 서버리스 번들러가 처리하면
  // ERR_REQUIRE_ESM으로 죽는다. 번들링 대상에서 빼고 런타임에 node_modules에서 그대로 불러오게 한다.
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
