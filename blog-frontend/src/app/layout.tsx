import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "블로그 - 최신 기술과 개발 경험을 공유하는 블로그",
  description: "다양한 주제의 게시글을 통해 지식을 나누고 함께 성장해 나갑니다. 최신 기술 트렌드부터 실무 경험까지 모든 것을 공유합니다.",
  keywords: ["블로그", "개발", "기술", "프로그래밍", "웹개발", "Next.js", "React"],
  authors: [{ name: "블로그 팀" }],
  creator: "블로그 팀",
  publisher: "블로그",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "블로그 - 최신 기술과 개발 경험을 공유하는 블로그",
    description: "다양한 주제의 게시글을 통해 지식을 나누고 함께 성장해 나갑니다.",
    url: 'http://localhost:3000',
    siteName: '블로그',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '블로그',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "블로그 - 최신 기술과 개발 경험을 공유하는 블로그",
    description: "다양한 주제의 게시글을 통해 지식을 나누고 함께 성장해 나갑니다.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          <Layout>
            {children}
          </Layout>
        </AuthProvider>
      </body>
    </html>
  );
}
