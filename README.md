# Fowaah's Apartments

Production-oriented Next.js starter for Fowaah's Apartments, based on the supplied website specification.

## Included
- Mobile-first public Home, Apartments, Apartment Detail, and About & Contact pages
- Responsive navigation and floating call/WhatsApp actions
- Ghana Cedi / USD display toggle
- Search and filters for city, listing type, bedrooms, budget, amenities and furnishing
- 9 seeded apartment examples (3 each for Accra, Kumasi and Cape Coast)
- Apartment detail gallery, enquiry form and WhatsApp/phone actions
- Admin dashboard UI at `/admin`
- Listing workflow UI: Draft → Pending Review → Published → Rented/Sold → Archived
- Enquiries inbox, content/settings, users and activity-log screens
- Local demo data fallback so the site runs immediately without Supabase
- Easy path to connect Supabase using `.env.local`

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Demo admin
The demo admin interface is available at `/admin`. It is intentionally a frontend demo when no backend is configured. For production, connect Supabase and enforce authentication/role checks server-side.

## Environment
Copy `.env.example` to `.env.local` and add Supabase credentials when implementing production persistence/auth/storage.

## Production hardening
Before launch, connect Supabase Auth + PostgreSQL + Storage, protect `/admin` with server-side role-based permissions, add rate limiting/anti-spam, HTTPS-only cookies, server-side input validation, audit logging, and real image uploads.
