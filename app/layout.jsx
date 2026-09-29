import "./globals.css";
import { Header, Footer, FloatingActions } from "@/components/SiteChrome";

export const metadata = {
  title: "Fowaah's Apartments | Simply Luxury Living",
  description: "Luxury apartments for rent and sale in Accra, Kumasi and Cape Coast.",
  verification: {
    google: "frio7EW58gLOEyMBzaHPAbsMzaJakt1RXSUoYcU8NN4",
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