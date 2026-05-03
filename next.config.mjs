/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/pdf',
        destination: '/field-brief.pdf',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
