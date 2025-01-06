/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextConfig } from 'next'
import { webpack } from 'next/dist/compiled/webpack/webpack';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  reactStrictMode: true,
  output: 'standalone',
  eslint:{
    ignoreDuringBuilds: true,
  },
  crossOrigin: 'anonymous',
  webpack: (config)=>{
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /osx-temperature-sensor/ }),
    );
    return config;
  }
}

export default nextConfig
