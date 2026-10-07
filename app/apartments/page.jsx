import {Suspense} from "react"; import Filters from "@/components/Filters"; import {getPublishedApartments} from "@/lib/apartments";
export const metadata={
  title:"Apartments for Rent & Sale in Ghana | Fowaah's Apartments",
  description:"Explore apartments for rent and sale across Accra, Kumasi and Cape Coast. Compare locations, bedrooms, amenities and contact Fowaah's Apartments.",
  alternates:{canonical:"https://fowaah-s-apartments.vercel.app/apartments"},
  openGraph:{title:"Apartments for Rent & Sale in Ghana | Fowaah's Apartments",description:"Explore apartments for rent and sale across Accra, Kumasi and Cape Coast.",url:"https://fowaah-s-apartments.vercel.app/apartments",type:"website",images:[{url:"/social-preview.png",width:1200,height:630,alt:"Fowaah's Apartments"}]},
};
export const revalidate=60;
export default async function Apartments(){const apartments=await getPublishedApartments();return <div className="container py-12"><h1 className="section-title">OUR <span>APARTMENTS</span></h1><p className="muted mt-2 mb-9">Explore luxury homes for rent and sale across Accra, Kumasi and Cape Coast.</p><Suspense fallback={<div>Loading apartments...</div>}><Filters apartments={apartments}/></Suspense></div>}
