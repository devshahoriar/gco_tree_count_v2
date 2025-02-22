/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
    serverActions:{
      bodySizeLimit: '10mb',  //sometime image may be up to 3 mb size🙌
    }
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
}

export default nextConfig
