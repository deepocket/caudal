import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { threads } from "@/components/landing/flow-lines";
import { site } from "@/lib/site";

// The card WhatsApp, LinkedIn, X and search results show for a shared link:
// the wordmark, the claim and the brand ribbon, built at build time.

export const alt = "Caudal: CRM para distribuidoras de material quirúrgico en México";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Inter, the product's own face: Satori mis-measures Geist's "i" and spaces words unevenly.
const inter = readFile(join(process.cwd(), "assets/fonts/Inter-Medium.ttf"));
const wordmark = readFile(join(process.cwd(), "public/caudal-wordmark.svg"));

// The hero ribbon with literal colors (satori can't read CSS variables).
const ribbon = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">',
  '<defs><linearGradient id="r" x1="700" y1="0" x2="1150" y2="820" gradientUnits="userSpaceOnUse">',
  '<stop offset="0" stop-color="#d6e6c8"/><stop offset="0.3" stop-color="#7fa46b"/>',
  '<stop offset="0.65" stop-color="#2f5a24"/><stop offset="1" stop-color="#1c3a13"/>',
  '</linearGradient></defs><g fill="none" stroke-linecap="round" stroke-linejoin="round">',
  ...threads.map(
    (thread) =>
      `<path d="${thread.d}" stroke="${thread.gold ? "#d9a441" : "url(#r)"}" stroke-width="${thread.width * 1.4}" stroke-opacity="${thread.opacity}"/>`,
  ),
  "</g></svg>",
].join("");

const dataUri = (svg: string | Buffer) =>
  `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

export default async function Image() {
  const [font, logo] = await Promise.all([inter, wordmark]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#f4f2eb",
          fontFamily: "Inter",
        }}
      >
        <img
          src={dataUri(ribbon)}
          width={1050}
          height={700}
          alt=""
          style={{ position: "absolute", top: -40, right: 0 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 72px",
            width: 780,
            height: "100%",
          }}
        >
          <img src={dataUri(logo)} width={133} height={50} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 66, lineHeight: 1.06, letterSpacing: -2, color: "#111111" }}>
              De la cotización al cobro, sin fugas.
            </div>
            <div
              style={{
                marginTop: 24,
                letterSpacing: -0.6,
                fontSize: 32,
                lineHeight: 1.2,
                color: "#858176",
              }}
            >
              CRM para distribuidoras de material quirúrgico en México
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, color: "#5c5a54" }}>
            <div
              style={{
                display: "flex",
                padding: "8px 16px",
                borderRadius: 999,
                background: "#1c3a13",
                color: "#f7f5ee",
                fontSize: 20,
              }}
            >
              Cotiza · Aparta · Entrega · Factura · Cobra
            </div>
            <div style={{ display: "flex" }}>{site.url.replace("https://", "")}</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: font, weight: 500, style: "normal" }],
    },
  );
}
