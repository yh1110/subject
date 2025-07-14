import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | GitHub Repository Search",
    default: "GitHub Repository Search",
  },
  description: "GitHubリポジトリの検索と詳細表示ができるアプリケーション。リポジトリの統計情報、言語、ライセンス情報などを確認できます。",
  keywords: [
    "GitHub",
    "リポジトリ",
    "repository",
    "search",
    "検索",
    "開発",
    "プログラミング",
    "オープンソース",
  ],
  authors: [{ name: "GitHub Repository Search" }],
  creator: "GitHub Repository Search",
  publisher: "GitHub Repository Search",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    title: "GitHub Repository Search",
    description: "GitHubリポジトリの検索と詳細表示ができるアプリケーション",
    siteName: "GitHub Repository Search",
    images: [
      {
        url: "/og-image.png", // 後でOG画像を追加する場合
        width: 1200,
        height: 630,
        alt: "GitHub Repository Search",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GitHub Repository Search",
    description: "GitHubリポジトリの検索と詳細表示ができるアプリケーション",
    images: ["/og-image.png"],
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
