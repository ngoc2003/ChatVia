/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    BASE_API: process.env.BASE_API,
  },
};

module.exports = nextConfig;
