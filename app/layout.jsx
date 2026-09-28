import "./globals.css";
import { Header, Footer, FloatingActions } from "@/components/SiteChrome";

export const metadata = {
  title: "Fowaah's Apartments | Simply Luxury Living",
  description: "Luxury apartments for rent and sale in Accra, Kumasi and Cape Coast.",
};

export default function RootLayout({children}) {
  return <html lang="en"><body><Header/><main>{children}</main><FloatingActions/><Footer/></body></html>;
}