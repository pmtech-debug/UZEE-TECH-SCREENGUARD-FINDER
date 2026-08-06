-- ============================================================
-- UZEE TECH ScreenGuard Finder — Supabase Database Schema
-- ============================================================
-- Run this SQL once in your Supabase project:
--   Supabase Dashboard → SQL Editor → New Query → Paste & Run
-- ============================================================

-- 1. Create the screenguards table
create table if not exists screenguards (
  id           text        primary key,
  box_number   text        not null unique,
  display_size text        not null default 'Unknown',
  title        text        not null default '',
  models       jsonb       not null default '[]'::jsonb,
  raw_text     text,
  category     text,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 2. Auto-update updated_at on every row change
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists screenguards_updated_at on screenguards;

create trigger screenguards_updated_at
  before update on screenguards
  for each row execute procedure update_updated_at_column();

-- 3. Enable Row Level Security
alter table screenguards enable row level security;

-- 4. Open read access (public search)
drop policy if exists "Public read access" on screenguards;
create policy "Public read access"
  on screenguards for select
  using (true);

-- 5. Open write access (admin panel — add auth policies here later)
drop policy if exists "Public write access" on screenguards;
create policy "Public write access"
  on screenguards for all
  using (true)
  with check (true);

-- 6. Useful index on box_number for fast lookups
create index if not exists idx_screenguards_box_number
  on screenguards (box_number);
