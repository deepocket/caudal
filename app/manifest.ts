import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name}: CRM para distribuidoras de material quirúrgico`,
    short_name: site.name,
    description: site.seo.description,
    lang: site.locale,
    start_url: "/",
    display: "browser",
    background_color: "#f4f2eb",
    theme_color: "#1c3a13",
    icons: [{ src: "/icon.svg", type: "image/svg+xml", sizes: "any" }],
  };
}
