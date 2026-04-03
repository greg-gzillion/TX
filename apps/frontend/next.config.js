/** @type {import("next").NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/create",
        destination: "/auctions/create",
        permanent: true,
      },
    ];
  },
};
module.exports = nextConfig;
