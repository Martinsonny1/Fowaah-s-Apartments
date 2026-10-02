import {Suspense} from "react"; import Filters from "@/components/Filters"; import {getPublishedApartments} from "@/lib/apartments";
export const metadata={title:"Our Apartments | Fowaah's Apartments"};
export const revalidate=60;
export default async function Apartments(){const apartments=await getPublishedApartments();return <div className="container py-12"><h1 className="section-title">OUR <span>APARTMENTS</span></h1><p className="muted mt-2 mb-9">Explore luxury homes for rent and sale across Accra, Kumasi and Cape Coast.</p><Suspense fallback={<div>Loading apartments...</div>}><Filters apartments={apartments}/></Suspense></div>}
