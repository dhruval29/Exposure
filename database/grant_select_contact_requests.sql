-- Grant SELECT on contact requests to authenticated users so Admin UI can read
alter table if exists public.event_contact_requests enable row level security;

do $$ begin
  create policy "Allow select for authenticated" on public.event_contact_requests
  for select to authenticated using (true);
exception when others then null; end $$;

-- Optional: you can tighten this later to only allow admins by
-- replacing `using (true)` with a check like `(auth.jwt() ->> 'email') in (select email from public.admins)`

