import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "tsfxr - 8-bit Sound Effect Generator",
  description:
    "A TypeScript-powered 8-bit sound effect generator for games, apps, and creative projects. Easily generate, tweak, and export retro sound effects.",
  keywords: [
    "8-bit sound generator",
    "retro sound effects",
    "pixel art games",
    "chiptune sfx",
    "JavaScript sound synthesis",
    "TypeScript audio generation",
    "game sound design",
    "procedural sound effects",
    "NES sound generator",
  ],
  openGraph: {
    title: "tsfxr - 8-bit Sound Effect Generator",
    description:
      "Generate and customize retro-style 8-bit sound effects for your games and projects. Easy to use and export!",
    url: "https://yourprojecturl.com", // TODO: Replace with actual URL
    siteName: "tsfxr",
    type: "website",
    images: [
      {
        url: "https://yourprojecturl.com/og-image.png", // TODO: Replace with actual image
        width: 1200,
        height: 630,
        alt: "tsfxr - 8-bit Sound Effect Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "tsfxr - 8-bit Sound Generator",
    description:
      "Generate customizable 8-bit sound effects for games, apps, and creative projects. Free and open-source!",
    images: ["https://yourprojecturl.com/twitter-image.png"], // TODO: Replace with actual image
  },
  authors: [{ name: "Your Name", url: "https://yourwebsite.com" }], // TODO: Replace with your details
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="tsfxr" />
      </head>
      <body className={geistSans.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <TooltipProvider>
            {children}
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
