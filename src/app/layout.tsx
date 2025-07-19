import type { Metadata } from "next";
import { Inter, Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

// Initialize console filtering for development
if (process.env.NODE_ENV === 'development') {
  import('@/lib/console-filter')
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Hoppn Vendor Dashboard - Grow Your African Restaurant",
  description: "Join Minnesota's premier platform for authentic African cuisine. Manage orders, track revenue, and connect with customers who appreciate cultural authenticity.",
  keywords: ["African food", "restaurant management", "vendor dashboard", "Minnesota", "food delivery"],
  authors: [{ name: "Hoppn Team" }],
  creator: "Hoppn",
  publisher: "Hoppn",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#F15029",
  manifest: "/manifest.json",
  openGraph: {
    title: "Hoppn Vendor Dashboard - Grow Your African Restaurant",
    description: "Join Minnesota's premier platform for authentic African cuisine.",
    url: "https://vendor.hoppn.com",
    siteName: "Hoppn Vendor Dashboard",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Hoppn Vendor Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hoppn Vendor Dashboard - Grow Your African Restaurant",
    description: "Join Minnesota's premier platform for authentic African cuisine.",
    images: ["/og-image.jpg"],
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
        className={`${inter.variable} ${montserrat.variable} ${openSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
