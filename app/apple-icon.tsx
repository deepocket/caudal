import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Home-screen and link-preview icon: the "c" mark on cream, as a PNG.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const mark = readFile(join(process.cwd(), "app/icon.svg"));

export default async function AppleIcon() {
  const svg = await mark;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f2eb",
        }}
      >
        <img
          src={`data:image/svg+xml;base64,${svg.toString("base64")}`}
          width={132}
          height={132}
          alt=""
        />
      </div>
    ),
    size,
  );
}
