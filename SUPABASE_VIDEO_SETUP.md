# Fowaah Apartments — Video Tour Supabase Setup

The website now supports short apartment walkthrough videos recorded directly on a phone.

## 1. Run the SQL

### Existing Fowaah Supabase project
Open **Supabase → SQL Editor → New query**, paste the contents of:

`supabase/video_migration.sql`

and click **Run**.

### New Supabase project
Run `supabase/schema.sql` instead. It already includes the video table, bucket and policies.

The SQL is designed to be safe to run more than once.

## 2. What the SQL creates

### Database
`public.apartment_videos`

- `apartment_id` — links the video to the apartment
- `video_url` — public Storage URL
- `storage_path` — exact Supabase Storage path, used when replacing/deleting
- `poster_url` — optional poster image
- `caption` — short video description
- `duration_seconds` — maximum 30 seconds
- `sort_order` — reserved for future multiple-video support

The current admin UI intentionally supports **one video per apartment**. The table is structured so multiple videos can be supported later by removing the unique constraint and expanding the admin UI.

### Storage
A public bucket named:

`apartment-videos`

Allowed types:

- `video/mp4`
- `video/quicktime`
- `video/webm`

Maximum file size: **50 MB**.

## 3. Storage security

Public visitors can watch videos from published apartments because the bucket is public.

Only authenticated Fowaah admins/editors can upload, replace or delete video files through the Storage policies.

The database table also prevents public visitors from reading video records belonging to unpublished apartments.

## 4. How to upload from a phone

1. Open the Fowaah admin page on your phone.
2. Edit an apartment or create a new one.
3. Find **Video Tour**.
4. Tap **Choose Video**.
5. Select your phone recording.
6. Use a recording around **10–30 seconds**.
7. Keep it below **50 MB**.
8. Save the apartment.

The video will then appear automatically on:

- the Fowaah homepage video-tour section;
- apartment cards as a **VIDEO TOUR** badge;
- the individual apartment page;
- the video-tour filter.

## 5. Recommended recording

A simple continuous walkthrough works best:

**Entrance → living room → kitchen → bedroom → bathroom → balcony/view**

Record in daylight and move slowly. Vertical phone video is supported and is not aggressively cropped.

## 6. Important performance note

This version uploads the original phone video to Supabase Storage. It validates the duration and file size in the browser, but it does **not** perform server-side video transcoding.

For now, keep recordings short and reasonably compressed. Automatic 720p transcoding/H.264 conversion can be added later with a dedicated video-processing service if the library of videos becomes large.
