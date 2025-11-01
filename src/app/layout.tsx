import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // ------------------------------------------------------------------
  // 1. CORE APPLICATION METADATA
  // ------------------------------------------------------------------
  title: "SkillSage | Personalized AI Career Roadmap Builder",
  description: "A personalized adaptive learning platform powered by AI, designed to guide career growth and skill development using modern Next.js and Tailwind CSS.",
  keywords: ["SkillSage", "Career Roadmap", "AI Learning", "Skill Development", "TypeScript", "Next.js", "Prisma"],
  authors: [{ name: "Sonam Yadav" }], 

  // ------------------------------------------------------------------
  // 2. FAVICON (ICON) SETUP
  // ------------------------------------------------------------------
  // Assuming you save your new icon as /public/favicon.ico or /public/logo.png
  icons: {
    icon: "/logo.png?v=1", 
  },
  
  // ------------------------------------------------------------------
  // 3. SOCIAL MEDIA SHARING (OpenGraph / Facebook/LinkedIn)
  // ------------------------------------------------------------------
  openGraph: {
    title: "SkillSage | AI Career Roadmap Generator",
    description: "A personalized adaptive learning platform powered by AI, designed to guide career growth.",
    url: " https://github.com/my-skillsage-project ", 
    siteName: "SkillSage",
    type: "website",
  },
  
  // ------------------------------------------------------------------
  // 4. TWITTER/X CARD SHARING
  // ------------------------------------------------------------------
  twitter: {
    card: "summary_large_image",
    title: "SkillSage | AI Career Roadmap",
    description: "A personalized adaptive learning platform for career growth.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
