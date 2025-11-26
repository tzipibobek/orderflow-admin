const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  outputFileTracingRoot: path.resolve(__dirname),
  eslint: {
    ignoreDuringBuilds: true,
  },
};
