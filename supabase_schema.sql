-- Exposure Explorers – Supabase schema, helper functions, RLS policies, and storage setup
-- Run in Supabase SQL editor (execute in full). Idempotent for tables; policies use drop-and-create for compatibility.

-- Extensions
create extension if not exists pgcrypto;

-- USERS (profile shadow of auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ROLES and USER_ROLES
create table if not exists public.roles (
  id serial primary key,
  name text unique not null
);

create table if not exists public.user_roles (
  user_id uuid not null references public.users(id) on delete cascade,
  role_id int not null references public.roles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

-- Helper: is_admin(uid)
create or replace function public.is_admin(uid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = uid and r.name = 'admin'
  );
$$;

-- IMAGES
create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  storage_path text unique not null,
  public_url text not null,
  title text,
  description text,
  width int,
  height int,
  taken_at timestamptz,
  uploaded_by uuid references public.users(id) on delete set null,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_images_public_created on public.images(is_public, created_at desc);

-- ALBUMS
create table if not exists public.albums (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  cover_image_id uuid references public.images(id) on delete set null,
  is_public boolean not null default true,
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Trigger to auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists trg_albums_updated_at on public.albums;
create trigger trg_albums_updated_at
before update on public.albums
for each row execute function public.set_updated_at();

-- ALBUM_IMAGES (join)
create table if not exists public.album_images (
  album_id uuid not null references public.albums(id) on delete cascade,
  image_id uuid not null references public.images(id) on delete cascade,
  position int not null default 0,
  created_at timestamptz not null default now(),
  primary key (album_id, image_id)
);
create index if not exists idx_album_images_album_pos on public.album_images(album_id, position);

-- TAGS and IMAGE_TAGS
create table if not exists public.tags (
  id serial primary key,
  name text unique not null
);

create table if not exists public.image_tags (
  image_id uuid not null references public.images(id) on delete cascade,
  tag_id int not null references public.tags(id) on delete cascade,
  primary key (image_id, tag_id)
);

-- EVENTS (simplified structure)
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  month_year text not null, -- Format: "Dec 24", "Jan 25", etc.
  cover_image_id uuid references public.images(id) on delete set null,
  created_by uuid references public.users(id) on delete set null,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- event_images table removed to avoid relationship conflicts
-- We only use cover_image_id for single cover image per event

-- TEAM MEMBERS
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role_title text,
  bio text,
  photo_image_id uuid references public.images(id) on delete set null,
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_team_members_order on public.team_members(order_index);

-- RLS enablement
alter table public.users enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;
alter table public.images enable row level security;
alter table public.albums enable row level security;
alter table public.album_images enable row level security;
alter table public.tags enable row level security;
alter table public.image_tags enable row level security;
alter table public.events enable row level security;
alter table public.event_images enable row level security;
alter table public.team_members enable row level security;

-- USERS policies
drop policy if exists users_select_self on public.users;
create policy users_select_self on public.users
for select using (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists users_insert_self on public.users;
create policy users_insert_self on public.users
for insert with check (auth.uid() = id or public.is_admin(auth.uid()));

drop policy if exists users_update_self on public.users;
create policy users_update_self on public.users
for update using (auth.uid() = id or public.is_admin(auth.uid())) with check (auth.uid() = id or public.is_admin(auth.uid()));

-- ROLES policies (admin only except select)
drop policy if exists roles_select_all on public.roles;
create policy roles_select_all on public.roles for select using (true);

drop policy if exists roles_admin_ins on public.roles;
create policy roles_admin_ins on public.roles for insert with check (public.is_admin(auth.uid()));

drop policy if exists roles_admin_upd on public.roles;
create policy roles_admin_upd on public.roles for update using (public.is_admin(auth.uid()));

drop policy if exists roles_admin_del on public.roles;
create policy roles_admin_del on public.roles for delete using (public.is_admin(auth.uid()));

-- USER_ROLES policies (admin only except select own)
drop policy if exists user_roles_select on public.user_roles;
create policy user_roles_select on public.user_roles for select using (public.is_admin(auth.uid()) or user_id = auth.uid());

drop policy if exists user_roles_admin_ins on public.user_roles;
create policy user_roles_admin_ins on public.user_roles for insert with check (public.is_admin(auth.uid()));

drop policy if exists user_roles_admin_upd on public.user_roles;
create policy user_roles_admin_upd on public.user_roles for update using (public.is_admin(auth.uid()));

drop policy if exists user_roles_admin_del on public.user_roles;
create policy user_roles_admin_del on public.user_roles for delete using (public.is_admin(auth.uid()));

-- IMAGES policies
drop policy if exists images_select_public on public.images;
create policy images_select_public on public.images
for select using (is_public = true or uploaded_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists images_insert_own on public.images;
create policy images_insert_own on public.images
for insert with check (uploaded_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists images_update_own on public.images;
create policy images_update_own on public.images
for update using (uploaded_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists images_delete_own on public.images;
create policy images_delete_own on public.images
for delete using (uploaded_by = auth.uid() or public.is_admin(auth.uid()));

-- ALBUMS policies
drop policy if exists albums_select_public on public.albums;
create policy albums_select_public on public.albums
for select using (is_public = true or created_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists albums_insert_own on public.albums;
create policy albums_insert_own on public.albums
for insert with check (created_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists albums_update_own on public.albums;
create policy albums_update_own on public.albums
for update using (created_by = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists albums_delete_own on public.albums;
create policy albums_delete_own on public.albums
for delete using (created_by = auth.uid() or public.is_admin(auth.uid()));

-- ALBUM_IMAGES follows albums/images access
drop policy if exists album_images_sel on public.album_images;
create policy album_images_sel on public.album_images for select using (
  exists (select 1 from public.albums a where a.id = album_id and (a.is_public = true or a.created_by = auth.uid() or public.is_admin(auth.uid())))
);

drop policy if exists album_images_ins on public.album_images;
create policy album_images_ins on public.album_images for insert with check (
  exists (select 1 from public.albums a where a.id = album_id and (a.created_by = auth.uid() or public.is_admin(auth.uid())))
);

drop policy if exists album_images_upd on public.album_images;
create policy album_images_upd on public.album_images for update using (
  exists (select 1 from public.albums a where a.id = album_id and (a.created_by = auth.uid() or public.is_admin(auth.uid())))
);

drop policy if exists album_images_del on public.album_images;
create policy album_images_del on public.album_images for delete using (
  exists (select 1 from public.albums a where a.id = album_id and (a.created_by = auth.uid() or public.is_admin(auth.uid())))
);

-- TAGS and IMAGE_TAGS (public read; admin manage)
drop policy if exists tags_select on public.tags;
create policy tags_select on public.tags for select using (true);

drop policy if exists tags_admin_ins on public.tags;
create policy tags_admin_ins on public.tags for insert with check (public.is_admin(auth.uid()));

drop policy if exists tags_admin_upd on public.tags;
create policy tags_admin_upd on public.tags for update using (public.is_admin(auth.uid()));

drop policy if exists tags_admin_del on public.tags;
create policy tags_admin_del on public.tags for delete using (public.is_admin(auth.uid()));

drop policy if exists image_tags_sel on public.image_tags;
create policy image_tags_sel on public.image_tags for select using (true);

drop policy if exists image_tags_admin_ins on public.image_tags;
create policy image_tags_admin_ins on public.image_tags for insert with check (public.is_admin(auth.uid()));

drop policy if exists image_tags_admin_upd on public.image_tags;
create policy image_tags_admin_upd on public.image_tags for update using (public.is_admin(auth.uid()));

drop policy if exists image_tags_admin_del on public.image_tags;
create policy image_tags_admin_del on public.image_tags for delete using (public.is_admin(auth.uid()));

-- EVENTS and EVENT_IMAGES (public read; admin/editor manage)
-- Create helper: is_editor(uid)
create or replace function public.is_editor(uid uuid)
returns boolean language sql stable as $$
  select exists (
    select 1
    from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = uid and r.name in ('admin','editor')
  );
$$;

drop policy if exists events_select on public.events;
create policy events_select on public.events for select using (true);

drop policy if exists events_edit on public.events;
create policy events_edit on public.events for all using (public.is_editor(auth.uid())) with check (public.is_editor(auth.uid()));

drop policy if exists event_images_select on public.event_images;
create policy event_images_select on public.event_images for select using (true);

drop policy if exists event_images_edit on public.event_images;
create policy event_images_edit on public.event_images for all using (public.is_editor(auth.uid())) with check (public.is_editor(auth.uid()));

-- TEAM MEMBERS (public read; admin manage)
drop policy if exists team_members_select on public.team_members;
create policy team_members_select on public.team_members for select using (true);

drop policy if exists team_members_admin_ins on public.team_members;
create policy team_members_admin_ins on public.team_members for insert with check (public.is_admin(auth.uid()));

drop policy if exists team_members_admin_upd on public.team_members;
create policy team_members_admin_upd on public.team_members for update using (public.is_admin(auth.uid()));

drop policy if exists team_members_admin_del on public.team_members;
create policy team_members_admin_del on public.team_members for delete using (public.is_admin(auth.uid()));

-- Seed default roles
insert into public.roles(name)
select x.name from (values ('admin'), ('editor'), ('viewer')) as x(name)
where not exists (select 1 from public.roles r where r.name = x.name);

-- STORAGE: create bucket and policies
-- Note: Buckets are managed via storage schema; use RPCs or dashboard for creation.
DO $$ BEGIN
  PERFORM 1 FROM storage.buckets WHERE id = 'images';
  IF NOT FOUND THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);
  END IF;
END $$;

-- Storage policies (public read; auth upload; admin delete)
drop policy if exists storage_objects_read_public on storage.objects;
create policy storage_objects_read_public on storage.objects
for select using (bucket_id = 'images');

drop policy if exists storage_objects_insert_auth on storage.objects;
create policy storage_objects_insert_auth on storage.objects
for insert to authenticated with check (
  bucket_id = 'images'
);

drop policy if exists storage_objects_update_owner_admin on storage.objects;
create policy storage_objects_update_owner_admin on storage.objects
for update to authenticated using (
  bucket_id = 'images'
);

drop policy if exists storage_objects_delete_admin on storage.objects;
create policy storage_objects_delete_admin on storage.objects
for delete to authenticated using (
  bucket_id = 'images' and public.is_admin(auth.uid())
);

-- Helpful views (without SECURITY DEFINER to avoid security warnings)
-- Drop existing views if they have SECURITY DEFINER
drop view if exists public.public_events cascade;
drop view if exists public.public_gallery cascade;

-- Create public_events view (safe, without SECURITY DEFINER)
create view public.public_events as
select 
  e.id, 
  e.title, 
  e.description, 
  e.month_year,
  e.created_at,
  e.updated_at,
  i.public_url as cover_image_url,
  i.title as cover_image_title,
  i.description as cover_image_description
from public.events e
left join public.images i on i.id = e.cover_image_id
where e.is_public = true
order by e.created_at desc;

-- Create public_gallery view (safe, without SECURITY DEFINER)
create view public.public_gallery as
select 
  id, 
  public_url as url, 
  title, 
  description, 
  created_at,
  width,
  height
from public.images
where is_public = true
order by created_at desc;

-- Grant appropriate permissions to the views
grant select on public.public_events to authenticated, anon;
grant select on public.public_gallery to authenticated, anon;
