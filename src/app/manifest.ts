import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CV Dock — Profesyonel Özgeçmiş Oluşturucu",
    short_name: "CV Dock",
    description:
      "Profesyonel CV oluştur, canlı önizle ve PDF olarak indirip paylaş.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f7f1e1",
    theme_color: "#f7f1e1",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
