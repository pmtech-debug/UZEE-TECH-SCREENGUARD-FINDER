-- ============================================================
-- UZEE TECH ScreenGuard Finder — Supabase Database Schema
-- Normalized 1-to-Many Schema (boxes & models)
-- ============================================================
-- Run this SQL once in your Supabase project:
--   Supabase Dashboard → SQL Editor → New Query → Paste & Run
-- ============================================================

-- Drop old tables if migrating from previous flat schema
drop table if exists screenguards cascade;

-- 1. Create boxes table
create table if not exists boxes (
  id           text        primary key,
  box_number   text        not null unique,
  display_size text        not null default 'Unknown',
  title        text        not null default '',
  raw_text     text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- 2. Create models table (child table with foreign key to boxes)
create table if not exists models (
  id          uuid        primary key default gen_random_uuid(),
  box_id      text        not null references boxes(id) on delete cascade,
  model_name  text        not null,
  created_at  timestamptz not null default now()
);

-- 3. Auto-update updated_at trigger for boxes
create or replace function update_updated_at_column()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists boxes_updated_at on boxes;

create trigger boxes_updated_at
  before update on boxes
  for each row execute procedure update_updated_at_column();

-- 4. Enable Row Level Security (RLS)
alter table boxes enable row level security;
alter table models enable row level security;

-- 5. RLS Policies
drop policy if exists "Public read boxes" on boxes;
create policy "Public read boxes"
  on boxes for select
  using (true);

drop policy if exists "Public write boxes" on boxes;
create policy "Public write boxes"
  on boxes for all
  using (true)
  with check (true);

drop policy if exists "Public read models" on models;
create policy "Public read models"
  on models for select
  using (true);

drop policy if exists "Public write models" on models;
create policy "Public write models"
  on models for all
  using (true)
  with check (true);

-- 6. Performance Indexes
create index if not exists idx_boxes_box_number on boxes (box_number);
create index if not exists idx_models_box_id on models (box_id);
create index if not exists idx_models_model_name on models (model_name);
