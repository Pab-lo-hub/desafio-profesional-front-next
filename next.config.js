// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora errores de ESLint durante la compilación
    ignoreDuringBuilds: true,
  },
  images: {
    // Dominios permitidos para cargar imágenes con <Image>
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "tailwindui.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;