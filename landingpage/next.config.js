/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "build",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_BLOG_IMAGE,
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "img.ppi-karabuk.com",
        port: "",
      },
    ],
  },
}

module.exports = nextConfig
