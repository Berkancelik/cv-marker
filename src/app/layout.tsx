import type { Metadata, Viewport } from "next";
import "./globals.css";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  applicationName: "CV Dock",
  title: "CV Dock — Profesyonel Özgeçmiş Oluşturucu",
  description:
    "CV Dock ile dakikalar içinde Türkçe veya İngilizce profesyonel bir CV oluştur, canlı önizle ve mobilde de indirip paylaşabileceğin PDF olarak dışa aktar.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CV Dock",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f7f1e1",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <SplashScreen />
        {children}
      </body>
    </html>
  );
}
