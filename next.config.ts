import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        // Agents that ask for Markdown get the whole page as Markdown, same URL.
        {
          source: "/",
          has: [{ type: "header", key: "accept", value: "(.*)text/markdown(.*)" }],
          destination: "/index.md",
        },
      ],
    };
  },
  async headers() {
    return [
      {
        // Point crawlers and agents at the plain-text versions from any response.
        source: "/",
        headers: [
          {
            key: "Link",
            value: '</index.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"; type="text/plain"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
