import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['10.10.0.*', '192.168.*.*', '172.16.*.*'],
};

export default nextConfig;
