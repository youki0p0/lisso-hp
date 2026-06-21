import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LISSO — 香りを、設計する。",
  description:
    "合同会社 LISSO — シーシャの味覚設計と、インフラ・セキュリティ・DX の技術支援。理論と精度で体験を設計する会社です。",
  openGraph: {
    title: "LISSO — 香りを、設計する。",
    description:
      "シーシャの味覚設計と、インフラ・セキュリティ・DX の技術支援。理論と精度で体験を設計する会社。",
    locale: "ja_JP",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
