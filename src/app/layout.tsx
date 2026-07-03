import type { Metadata } from "next";
import Script from "next/script";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TicketFlow | Premium Event Booking",
  description: "Secure, real-time concurrent event ticketing and booking system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased dark`}
    >
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        {children}
        <Toaster position="top-right" closeButton richColors theme="dark" />
      </body>
    </html>
  );
}
