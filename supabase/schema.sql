-- Fowaah's Apartments: database schema
-- Supabase dashboard -> SQL Editor -> New query -> paste this whole file -> Run.
-- Safe to run more than once.

create extension if not exists pgcrypto;

-- ───────────── Tables ─────────────

create table if not exists public.apartments (
  id            text primary key,
  title         text not null check (char_length(title) between 3 and 150),
  city          text not null check (char_length(city) between 2 and 60),
  neighbourhood text not null check (char_length(neighbourhood) between 2 and 80),
  listing_type  text not null check (listing_type in ('Rent', 'Sale')),
  property_type text not null check (char_length(property_type) between 1 and 40),
  price         bigint not null check (price >= 0),
  price_period  text not null check (price_period in ('month', 'year', 'night', 'sale')),
  bedrooms      int not null default 1 check (bedrooms between 0 and 50),
  bathrooms     int not null default 1 check (bathrooms between 0 and 50),
  size_m2       int not null default 0 check (size_m2 >= 0),
  furnished     boolean not null default false,
  parking       int not null default 0 check (parking >= 0),
  status        text not null default 'Draft'
                check (status in ('Draft', 'Pending Review', 'Published', 'Rented', 'Sold', 'Archived')),
  featured      boolean not null default false,
  description   text not null default '',
  amenities     text[] not null default '{}',
  images        text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists apartments_status_idx on public.apartments (status, created_at desc);

create table if not exists public.enquiries (
  id             uuid primary key default gen_random_uuid(),
  apartment_id   text references public.apartments (id) on delete set null,
  name           text not null check (char_length(name) between 1 and 120),
  phone          text not null check (char_length(phone) between 5 and 40),
  email          text not null check (char_length(email) between 3 and 200),
  preferred_date date,
  message        text not null check (char_length(message) between 1 and 2000),
  status         text not null default 'New'
                 check (status in ('New', 'Contacted', 'Viewing Scheduled', 'Closed')),
  created_at     timestamptz not null default now()
);

create index if not exists enquiries_created_idx on public.enquiries (created_at desc);

-- Only people listed here can use the admin dashboard.
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  email      text,
  role       text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

-- ───────────── Helpers ─────────────

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists apartments_set_updated_at on public.apartments;
create trigger apartments_set_updated_at
  before update on public.apartments
  for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- ───────────── Table privileges ─────────────

grant usage on schema public to anon, authenticated;
grant select on public.apartments to anon, authenticated;
grant insert, update, delete on public.apartments to authenticated;
grant insert on public.enquiries to anon, authenticated;
grant select, update, delete on public.enquiries to authenticated;
grant select on public.profiles to authenticated;

-- ───────────── Row Level Security ─────────────

alter table public.apartments enable row level security;
alter table public.enquiries  enable row level security;
alter table public.profiles   enable row level security;

-- apartments: the public sees only Published listings; admins see and manage everything
drop policy if exists "Public can view published apartments" on public.apartments;
create policy "Public can view published apartments" on public.apartments
  for select to anon, authenticated using (status = 'Published');

drop policy if exists "Admins can view all apartments" on public.apartments;
create policy "Admins can view all apartments" on public.apartments
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins can add apartments" on public.apartments;
create policy "Admins can add apartments" on public.apartments
  for insert to authenticated with check (public.is_admin());

drop policy if exists "Admins can edit apartments" on public.apartments;
create policy "Admins can edit apartments" on public.apartments
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete apartments" on public.apartments;
create policy "Admins can delete apartments" on public.apartments
  for delete to authenticated using (public.is_admin());

-- enquiries: anyone can send one; only admins can read or manage them
drop policy if exists "Anyone can send an enquiry" on public.enquiries;
create policy "Anyone can send an enquiry" on public.enquiries
  for insert to anon, authenticated with check (status = 'New');

drop policy if exists "Admins can read enquiries" on public.enquiries;
create policy "Admins can read enquiries" on public.enquiries
  for select to authenticated using (public.is_admin());

drop policy if exists "Admins can update enquiries" on public.enquiries;
create policy "Admins can update enquiries" on public.enquiries
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admins can delete enquiries" on public.enquiries;
create policy "Admins can delete enquiries" on public.enquiries
  for delete to authenticated using (public.is_admin());

-- profiles: a signed-in user can read only their own row. Rows are added by you, in SQL.
drop policy if exists "Users can read their own profile" on public.profiles;
create policy "Users can read their own profile" on public.profiles
  for select to authenticated using (id = auth.uid());

-- ───────────── Image storage ─────────────

insert into storage.buckets (id, name, public)
values ('apartment-images', 'apartment-images', true)
on conflict (id) do nothing;

drop policy if exists "Admins can view apartment images" on storage.objects;
create policy "Admins can view apartment images" on storage.objects
  for select to authenticated
  using (bucket_id = 'apartment-images' and public.is_admin());

drop policy if exists "Admins can upload apartment images" on storage.objects;
create policy "Admins can upload apartment images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'apartment-images' and public.is_admin());

drop policy if exists "Admins can change apartment images" on storage.objects;
create policy "Admins can change apartment images" on storage.objects
  for update to authenticated
  using (bucket_id = 'apartment-images' and public.is_admin());

drop policy if exists "Admins can delete apartment images" on storage.objects;
create policy "Admins can delete apartment images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'apartment-images' and public.is_admin());



-- ───────────── Apartment video tours ─────────────
-- One short video tour per apartment for the current admin workflow.
create table if not exists public.apartment_videos (
  id               uuid primary key default gen_random_uuid(),
  apartment_id     text not null unique references public.apartments (id) on delete cascade,
  video_url        text not null,
  storage_path     text,
  poster_url       text,
  caption          text,
  duration_seconds int check (duration_seconds is null or (duration_seconds > 0 and duration_seconds <= 30)),
  sort_order       int not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists apartment_videos_apartment_idx on public.apartment_videos (apartment_id);

create or replace function public.set_apartment_video_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists apartment_videos_set_updated_at on public.apartment_videos;
create trigger apartment_videos_set_updated_at
  before update on public.apartment_videos
  for each row execute function public.set_apartment_video_updated_at();

grant select on public.apartment_videos to anon, authenticated;
grant insert, update, delete on public.apartment_videos to authenticated;

alter table public.apartment_videos enable row level security;

drop policy if exists "Public can view apartment videos" on public.apartment_videos;
create policy "Public can view apartment videos" on public.apartment_videos
  for select to anon, authenticated
  using (exists (select 1 from public.apartments a where a.id = apartment_id and a.status = 'Published'));

drop policy if exists "Admins can manage apartment videos" on public.apartment_videos;
create policy "Admins can manage apartment videos" on public.apartment_videos
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'apartment-videos',
  'apartment-videos',
  true,
  52428800,
  array['video/mp4','video/quicktime','video/webm']
)
on conflict (id) do update set
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = array['video/mp4','video/quicktime','video/webm'];

drop policy if exists "Admins can view apartment videos storage" on storage.objects;
create policy "Admins can view apartment videos storage" on storage.objects
  for select to authenticated
  using (bucket_id = 'apartment-videos' and public.is_admin());

drop policy if exists "Admins can upload apartment videos" on storage.objects;
create policy "Admins can upload apartment videos" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'apartment-videos' and public.is_admin());

drop policy if exists "Admins can change apartment videos" on storage.objects;
create policy "Admins can change apartment videos" on storage.objects
  for update to authenticated
  using (bucket_id = 'apartment-videos' and public.is_admin())
  with check (bucket_id = 'apartment-videos' and public.is_admin());

drop policy if exists "Admins can delete apartment videos" on storage.objects;
create policy "Admins can delete apartment videos" on storage.objects
  for delete to authenticated
  using (bucket_id = 'apartment-videos' and public.is_admin());

-- ───────────── Make yourself an admin (run AFTER this file) ─────────────
-- 1. Authentication -> Users -> Add user -> enter your email + password (tick "Auto Confirm User").
-- 2. Run this, with your email:
--
--   insert into public.profiles (id, email, role)
--   select id, email, 'admin' from auth.users where email = 'YOUR-EMAIL@example.com'
--   on conflict (id) do update set role = 'admin';
