import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  reactStrictMode: false,
  output: 'standalone',
}

export default nextConfig
