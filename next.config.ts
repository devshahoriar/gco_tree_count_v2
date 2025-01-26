/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextConfig } from 'next'
import { webpack } from 'next/dist/compiled/webpack/webpack'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'ik.imagekit.io',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  crossOrigin: 'anonymous',
}

export default nextConfig
