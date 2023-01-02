require("dotenv").config({path: "../.env"});
const {i18n} = require("./next-i18next.config.js");

/**
 * @type {import("next").NextConfig}
 * @see [configuration documentation](https://nextjs.org/docs/api-reference/next.config.js/introduction)
 * @see [configuration github](https://github.com/vercel/next.js/blob/canary/packages/next/server/config-shared.ts#L184)
 */
const nextConfig = {
  i18n,
  reactStrictMode: false,
  env:             {
    NEXT_PUBLIC_PORT_BACKEND: process.env.SERVER_BACKEND_PORT,
  },
};

module.exports = nextConfig;
