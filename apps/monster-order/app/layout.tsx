import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "Shisha MONSTER 発注アプリ",
  description:
    "棚写真OCRで在庫化し、発注履歴から消費周期を学習して発注をレコメンド。Shopifyカートへワンタップ投入。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Nav />
        <main className="wrap">{children}</main>
      </body>
    </html>
  );
}
