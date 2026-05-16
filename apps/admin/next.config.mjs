/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@crm/database'],
  output: 'standalone',
};

export default nextConfig;
