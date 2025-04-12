// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Ignora errores de ESLint durante la compilación
    ignoreDuringBuilds: true,
  },
  images: {
    // Dominios permitidos para cargar imágenes con <Image>
    domains: ["localhost", "tailwindui.com"],
  },
};

module.exports = nextConfig;