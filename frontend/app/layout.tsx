import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { CartSessionBridge } from "@/src/components/storefront/cart-session-bridge";
import { AppProviders } from "@/src/providers/app-providers";
import "./globals.css";

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
    default: "HMART | Shop Groceries & Essentials",
    template: "%s | HMART",
  },
  description:
    "Shop groceries, household essentials, and everyday products from HMART.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProviders>
          <CartSessionBridge />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
