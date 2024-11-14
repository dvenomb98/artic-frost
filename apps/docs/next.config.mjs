
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui"],
  redirects: async () => {
    return [
      {
        source: "/fresh-scroll",
        destination: "/fresh-scroll/introduction",
        permanent: true,
      },
      {
        source: "/chess-lite",
        destination: "/chess-lite/introduction",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;