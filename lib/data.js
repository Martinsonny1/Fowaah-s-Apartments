// Apartment listings now live in Supabase (see lib/apartments.js).
export const BUSINESS = {
  name:"Fowaah's Apartments", phone:"0594 777 616", intl:"+233594777616",
  whatsapp:"https://wa.me/233594777616", snapchat:"https://www.snapchat.com/add/2xfowaah",
  email:"hello@fowaahsapartments.com"
};

const images = [
 "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80",
 "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=80",
 "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80",
 "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80",
 "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=80",
 "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=80"
];

export const locations = [
 {city:"Accra",desc:"City & Beachside",icon:"★",image:images[0]},
 {city:"Kumasi",desc:"Historic Family Living",icon:"⌕",image:images[3]},
 {city:"Cape Coast",desc:"Coastal Retreats",icon:"≈",image:images[5]}
];

export const testimonials = [
 {name:"Ama K.",city:"Accra",text:"The team made the viewing process simple and professional. The apartment matched the listing.",stars:5},
 {name:"Kwame D.",city:"Kumasi",text:"Responsive support and a smooth move-in experience.",stars:5},
 {name:"Nana A.",city:"Cape Coast",text:"A calm, beautiful place for our family holiday.",stars:5}
];

export function money(n,currency="GHS"){return currency==="USD" ? `$${Math.round(n/15).toLocaleString()}` : `GH₵ ${n.toLocaleString()}`}
