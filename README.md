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

## Video Tours — phone upload

This version adds a direct **Video Tour** workflow for short apartment walkthroughs recorded on a phone.

### What it does
- Admin can upload one MP4, MOV or WebM video per apartment.
- Recommended length is **10–30 seconds**; videos longer than 30 seconds are rejected.
- Maximum upload size is 50 MB.
- Videos are stored in the Supabase `apartment-videos` public bucket.
- The database stores the video URL, storage path, duration and caption in `apartment_videos`.
- Video tours appear on the homepage, apartment cards and individual apartment pages.
- The apartment listing filters include **Video tour available** and keep filters in the URL.
- Replacing or deleting a video also removes the old Storage object when possible.

### Supabase setup
1. Open your Supabase project.
2. Go to **SQL Editor**.
3. If this is an existing Fowaah project, run `supabase/video_migration.sql`.
4. If setting up from scratch, `supabase/schema.sql` already contains the video table, bucket and policies.
5. Confirm that Storage contains a public bucket called `apartment-videos`.
6. Make sure your admin user exists in `public.profiles` with role `admin` or `editor`.

### Uploading a video from your phone
1. Sign in to `/admin`.
2. Add a new apartment or edit an existing one.
3. Scroll to **Video Tour**.
4. Tap **Choose Video** and select the phone recording.
5. Keep the recording to 10–30 seconds and under 50 MB.
6. Save the apartment. The video uploads to Supabase and becomes available on the public listing.

### Recommended filming format
Record one smooth walkthrough: entrance → living room → kitchen → bedroom → bathroom → balcony/view. Daylight and steady movement work best. The website does not require YouTube or Vimeo.

### Important hosting note
The current implementation stores the original uploaded video in Supabase Storage and enforces a 50 MB upload limit. It does **not** transcode/compress the file server-side. For best performance, record short 720p/1080p clips and keep them small. Automatic transcoding can be added later with a dedicated video-processing service.
