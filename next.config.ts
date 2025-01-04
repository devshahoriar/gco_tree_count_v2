import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  reactStrictMode: false,
  output: 'standalone',
  eslint:{
    ignoreDuringBuilds: true,
  },
  distDir: 'build',
}

export default nextConfig
