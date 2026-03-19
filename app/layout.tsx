import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SnapPLC™ – Generate PLC Code from a Photo",
  description: "Take a picture of your control panel and instantly generate PLC logic. SnapPLC™ is the fastest way to reverse engineer automation systems.",
  metadataBase: new URL("https://www.snapplc.com"),
  openGraph: {
    title: "SnapPLC™ – Generate PLC Code from a Photo",
    description: "Take a picture of your control panel and instantly generate PLC logic.",
    url: "https://www.snapplc.com",
    siteName: "SnapPLC™",
    type: "website",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SnapPLC™ – Generate PLC Code from a Photo",
    description: "Take a picture of your control panel and instantly generate PLC logic.",
    images: ["/opengraph-image"],
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
