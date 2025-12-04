/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para manejar archivos Excel grandes
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig
