/** @type {import('next').NextConfig} */
const removeImports = require('next-remove-imports')();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  ...removeImports({})
}

module.exports = nextConfig
