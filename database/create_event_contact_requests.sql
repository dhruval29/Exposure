-- Create table to store contact requests for event coverage
create table if not exists public.event_contact_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamp with time zone default now() not null,
  name text not null,
  phone text not null,
  email text not null,
  event_about text,
  event_when text
);

-- Optional: enable RLS and allow inserts for anon (adjust as needed)
alter table public.event_contact_requests enable row level security;

do $$ begin
  create policy "Allow inserts for anon" on public.event_contact_requests
  for insert to anon with check (true);
exception when others then null; end $$;


