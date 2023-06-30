/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  i18n,
  trailingSlash: true,
  publicRuntimeConfig: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    BASE_API: process.env.BASE_API,
    SOCKET_API: process.env.SOCKET_API,
    IMGBB_API: process.env.IMGBB_API,
    IMAGES: process.env.IMAGES,
  },
  images: {
    domains: (process.env.IMAGES || "").split(","),
  },
};

module.exports = nextConfig;
