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

export const apartments = [
 {id:"accra-airport-1",title:"Executive Airport Residential Villa",city:"Accra",neighbourhood:"Airport Residential",listing_type:"Rent",property_type:"Townhouse",price:8500,price_period:"month",bedrooms:3,bathrooms:3,size_m2:210,furnished:true,parking:2,status:"Published",featured:true,description:"A calm, spacious luxury residence close to Accra's business district, with generous living areas, balconies and a landscaped compound.",amenities:["Swimming pool","24/7 security","Backup generator","Parking","Air conditioning","Wi-Fi"],images:[images[0],images[1],images[2]]},
 {id:"accra-east-legon-2",title:"Modern East Legon Residence",city:"Accra",neighbourhood:"East Legon",listing_type:"Sale",property_type:"3-Bed",price:1200000,price_period:"sale",bedrooms:3,bathrooms:3,size_m2:185,furnished:false,parking:2,status:"Published",featured:true,description:"Contemporary three-bedroom home designed for comfortable family living in a sought-after East Legon setting.",amenities:["Gym","CCTV","Parking","Balcony","Air conditioning"],images:[images[2],images[3],images[4]]},
 {id:"accra-labone-3",title:"Elegant Labone City Apartment",city:"Accra",neighbourhood:"Labone",listing_type:"Rent",property_type:"2-Bed",price:6500,price_period:"month",bedrooms:2,bathrooms:2,size_m2:130,furnished:true,parking:1,status:"Published",featured:true,description:"An elegant furnished apartment with modern finishes, natural light and easy access to restaurants, offices and the coast.",amenities:["24/7 security","Wi-Fi","Parking","CCTV"],images:[images[4],images[0],images[5]]},
 {id:"kumasi-nhyiaeso-1",title:"Nhyiaeso Family Haven",city:"Kumasi",neighbourhood:"Nhyiaeso",listing_type:"Rent",property_type:"4-Bed+",price:9000,price_period:"month",bedrooms:4,bathrooms:4,size_m2:260,furnished:true,parking:3,status:"Published",featured:true,description:"A generous family home in a quiet premium neighbourhood with room for entertaining and long stays.",amenities:["Backup generator","Parking","24/7 security","Air conditioning"],images:[images[1],images[3],images[5]]},
 {id:"kumasi-ahodwo-2",title:"Ahodwo Luxury Apartment",city:"Kumasi",neighbourhood:"Ahodwo",listing_type:"Sale",property_type:"3-Bed",price:980000,price_period:"sale",bedrooms:3,bathrooms:3,size_m2:175,furnished:false,parking:2,status:"Published",featured:false,description:"A polished three-bedroom residence with premium finishes and convenient access to central Kumasi.",amenities:["Gym","CCTV","Parking","Balcony"],images:[images[3],images[4],images[0]]},
 {id:"kumasi-asuoyeboa-3",title:"Private Asuoyeboa Retreat",city:"Kumasi",neighbourhood:"Asuoyeboa",listing_type:"Rent",property_type:"2-Bed",price:4200,price_period:"month",bedrooms:2,bathrooms:2,size_m2:115,furnished:true,parking:1,status:"Published",featured:false,description:"A comfortable furnished apartment suited to professionals and small families seeking a peaceful base in Kumasi.",amenities:["24/7 security","Parking","Wi-Fi"],images:[images[5],images[1],images[2]]},
 {id:"cape-fosu-1",title:"Fosu Lagoon Coastal Residence",city:"Cape Coast",neighbourhood:"Fosu Lagoon",listing_type:"Rent",property_type:"2-Bed",price:5000,price_period:"month",bedrooms:2,bathrooms:2,size_m2:125,furnished:true,parking:1,status:"Published",featured:true,description:"Relaxed coastal living near Fosu Lagoon, with bright interiors and an easy route to beaches and town.",amenities:["Sea view","Parking","Air conditioning","Wi-Fi"],images:[images[0],images[5],images[2]]},
 {id:"cape-elmina-2",title:"Elmina Road Heritage Villa",city:"Cape Coast",neighbourhood:"Elmina Road",listing_type:"Sale",property_type:"Townhouse",price:1100000,price_period:"sale",bedrooms:3,bathrooms:3,size_m2:220,furnished:false,parking:2,status:"Published",featured:false,description:"A spacious villa-style property positioned for coastal retreats and access to heritage destinations.",amenities:["Sea view","Parking","Backup generator","Balcony"],images:[images[2],images[4],images[1]]},
 {id:"cape-kotokuraba-3",title:"Cape Coast Garden Apartment",city:"Cape Coast",neighbourhood:"Kotokuraba",listing_type:"Rent",property_type:"1-Bed",price:3200,price_period:"month",bedrooms:1,bathrooms:1,size_m2:75,furnished:true,parking:1,status:"Published",featured:false,description:"A compact, tasteful apartment for short or long stays close to everyday amenities and the coast.",amenities:["Wi-Fi","Parking","Air conditioning"],images:[images[4],images[0],images[3]]}
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
export function findApartment(id){return apartments.find(a=>a.id===id)}
