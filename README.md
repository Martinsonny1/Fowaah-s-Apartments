# Fowaah's Apartments

Next.js site for Fowaah's Apartments, backed by Supabase (database, login, image storage).

## What uses Supabase
- Listings: public pages, search filters, detail pages and the sitemap read **Published** apartments from the `apartments` table.
- Enquiries: the enquiry form saves to the `enquiries` table (visible only in the admin).
- Admin (`/admin`): Supabase Auth login. Only people listed in the `profiles` table can enter. Add, edit, publish, feature and delete listings, upload images, and manage enquiries.
- Row Level Security enforces all of this in the database, not just in the UI.

## Setup
1. Create a project at supabase.com.
2. SQL Editor: run `supabase/schema.sql`, then `supabase/seed.sql` (the 9 starter listings).
3. Authentication > Users > Add user (tick Auto Confirm), then run in the SQL Editor:
   ```sql
   insert into public.profiles (id, email, role)
   select id, email, 'admin' from auth.users where email = 'YOUR-EMAIL@example.com';
   ```
4. Authentication > Sign In / Providers: switch off "Allow new users to sign up".
5. Copy `.env.example` to `.env.local` and fill in the project URL and anon/publishable key.
6. `npm install` then `npm run dev`, and open http://localhost:3000. Admin login: http://localhost:3000/admin
7. On Vercel add the same two variables (Settings > Environment Variables) and redeploy.

## Notes
- Public pages refresh every 60 seconds; admin changes also refresh them immediately.
- Never put the `service_role` / secret key in this project.
- Before launch: add rate limiting for the enquiry form and replace remaining Unsplash images with your own.
