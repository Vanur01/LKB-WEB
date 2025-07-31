import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/contexts/CartContext";
import GlobalCartSidebar from "@/components/GlobalCartSidebar";
import ConditionalHeader from "@/components/ConditionalHeader";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LKB Food App | Order Delicious Food Online",
  description: "Order delicious food from LKB. Fast delivery, online ordering, catering services, and dine-in options available. Enjoy specialty dishes from our chef's unique creations.",
  keywords: ["food delivery", "online ordering", "catering", "restaurant", "LKB food", "campus food", "hostel delivery", "specialty dishes"],
  authors: [{ name: "LKB Restaurant" }],
  creator: "LKB Food Team",
  publisher: "LKB Restaurant",
  metadataBase: new URL("https://lkbfood.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LKB Food App | Order Delicious Food Online",
    description: "Order delicious food from LKB with fast delivery to your hostel or dine in our cozy atmosphere. Perfect for students!",
    siteName: "LKB Food",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/lkb_Logo.png",
        width: 1200,
        height: 630,
        alt: "LKB Food Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LKB Food App | Order Delicious Food Online",
    description: "Order delicious food from LKB with fast delivery to your hostel or dine in our cozy atmosphere!",
    images: ["/images/lkb_Logo.png"],
    creator: "@lkbfood",
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
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#f97316" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <ConditionalHeader />
          <main className="flex-grow">{children}</main>
          <GlobalCartSidebar />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
