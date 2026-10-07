-- Fowaah Apartments: video-tour migration
-- Run this in Supabase SQL Editor after your existing schema.sql.
-- It is safe to run more than once.

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

-- If an earlier video table was created without these columns/constraints, bring it up to date.
alter table public.apartment_videos add column if not exists storage_path text;
alter table public.apartment_videos add column if not exists poster_url text;
alter table public.apartment_videos add column if not exists caption text;
alter table public.apartment_videos add column if not exists duration_seconds int;
alter table public.apartment_videos add column if not exists sort_order int not null default 0;
alter table public.apartment_videos add column if not exists created_at timestamptz not null default now();
alter table public.apartment_videos add column if not exists updated_at timestamptz not null default now();

-- One video per apartment for this admin workflow.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'apartment_videos_apartment_id_key'
      and conrelid = 'public.apartment_videos'::regclass
  ) then
    alter table public.apartment_videos add constraint apartment_videos_apartment_id_key unique (apartment_id);
  end if;
exception when duplicate_table then null;
end $$;

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
