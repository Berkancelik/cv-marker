import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CV Marker — Profesyonel Özgeçmiş Oluşturucu",
  description:
    "20 profesyonel şablonla dakikalar içinde Türkçe veya İngilizce CV oluştur, canlı önizle ve PDF olarak indir.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
