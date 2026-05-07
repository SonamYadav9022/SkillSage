import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SonnerProvider from "@/components/ui/sonner";
import Providers from "./providers";
import GlobalChatbot from '@/components/GlobalChatbot'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSage | Personalized AI Career Roadmap Builder",
  description:
    "A personalized adaptive learning platform powered by AI.",

  icons: {
    icon: "/logo.png?v=1",
  },

  openGraph: {
    title: "SkillSage",
    description: "AI Career Roadmap Generator",
    siteName: "SkillSage",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "SkillSage",
    description: "AI Career Roadmap",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Providers>
          {children}
          <SonnerProvider />
        </Providers>
        <GlobalChatbot />
      </body>
    </html>
  );
}