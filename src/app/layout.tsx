import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { APP_AUTHOR, APP_AUTHOR_URL, APP_NAME, APP_URL } from "@/lib/app.const";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = `${APP_NAME} - 8-bit Sound Effect Generator`;

export const metadata: Metadata = {
  title: title,
  description:
    "A TypeScript-powered 8-bit sound effect generator for games, apps, and creative projects. Easily generate, tweak, and export retro sound effects.",
  authors: [{ name: APP_AUTHOR, url: APP_AUTHOR_URL }],
  applicationName: title,
  referrer: "origin-when-cross-origin",
  robots: "index, follow",
  formatDetection: {
    telephone: false,
  },
  creator: APP_AUTHOR,
  publisher: APP_AUTHOR,
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
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
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
