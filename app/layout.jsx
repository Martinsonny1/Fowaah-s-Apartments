import "./globals.css";
import { Header, Footer, FloatingActions } from "@/components/SiteChrome";

export const metadata = {
  title: "Fowaah's Apartments | Simply Luxury Living",
  description: "Fowaah's Apartments offers apartments for rent and sale in Accra, Kumasi and Cape Coast, plus practical guides for renting and living in Ghana.",
  metadataBase: new URL("https://fowaah-s-apartments.vercel.app"),
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  themeColor: "#081C4D",
  verification: {
    google: "frio7EW58gLOEyMBzaHPAbsMzaJakt1RXSUoYcU8NN4",
  },
  openGraph: {
    title: "Fowaah's Apartments | Simply Luxury Living",
    description: "Apartments for rent and sale in Accra, Kumasi and Cape Coast, Ghana.",
    url: "https://fowaah-s-apartments.vercel.app",
    siteName: "Fowaah's Apartments",
    locale: "en_GH",
    type: "website",
    images: [{ url: "/social-preview.png", width: 1200, height: 630, alt: "Fowaah's Apartments - Simply Luxury Living" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fowaah's Apartments | Simply Luxury Living",
    description: "Apartments for rent and sale in Accra, Kumasi and Cape Coast, Ghana.",
    images: ["/social-preview.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <FloatingActions />
        <Footer />
      </body>
    </html>
  );
}