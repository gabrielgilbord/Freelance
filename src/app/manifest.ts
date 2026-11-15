import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cota — Ingeniería digital a medida",
    short_name: "Cota",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0d0c",
    theme_color: "#0c0d0c",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
