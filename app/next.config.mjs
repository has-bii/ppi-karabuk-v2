/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        port: "54321",
        protocol: "http",
        pathname: "/storage/v1/object/public/**",
      },
      {
        hostname: process.env.NEXT_PUBLIC_SUPABASE_URL.replace("https://", ""),
        pathname: "/storage/v1/object/public/**",
        protocol: "https",
      },
    ],
  },
}

export default nextConfig
