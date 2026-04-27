/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/admin/servicos",
        destination: "/admin/servicos-supabase",
        permanent: true,
      },
      {
        source: "/servicos/novo",
        destination: "/plataforma/cotacoes/novo",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
