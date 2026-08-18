-- ============================================================
-- UZEE TECH ScreenGuard Finder — Supabase Database Schema
-- Phase 2: Normalized Schema + Inventory Management System
-- ============================================================

-- 1. Create boxes table
CREATE TABLE IF NOT EXISTS boxes (
  id                   TEXT        PRIMARY KEY,
  box_number           TEXT        NOT NULL,
  display_size         TEXT        NOT NULL DEFAULT 'Unknown',
  title                TEXT        NOT NULL DEFAULT '',
  raw_text             TEXT,
  category             TEXT        DEFAULT 'Super-D',
  notes                TEXT,
  source               TEXT,
  verification         TEXT,
  stock_quantity       INTEGER     NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  stock_count_verified BOOLEAN     NOT NULL DEFAULT false,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure inventory columns exist if table was previously created
ALTER TABLE boxes ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0);
ALTER TABLE boxes ADD COLUMN IF NOT EXISTS stock_count_verified BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE boxes ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Super-D';
ALTER TABLE boxes ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE boxes ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE boxes ADD COLUMN IF NOT EXISTS verification TEXT;

-- 2. Create models table (child table with foreign key to boxes)
CREATE TABLE IF NOT EXISTS models (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  box_id      TEXT        NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
  model_name  TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create inventory_transactions table (log of all stock events)
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id          TEXT        NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
  transaction_type  TEXT        NOT NULL CHECK (transaction_type IN ('SALE', 'RESTOCK', 'ADJUSTMENT', 'INITIAL_STOCK')),
  quantity_change   INTEGER     NOT NULL,
  previous_quantity INTEGER     NOT NULL,
  new_quantity      INTEGER     NOT NULL,
  box_number        TEXT        NOT NULL,
  note              TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create purchase_list table (purchase ordering queue)
CREATE TABLE IF NOT EXISTS purchase_list (
  id                 UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id           TEXT        NOT NULL REFERENCES boxes(id) ON DELETE CASCADE,
  requested_quantity INTEGER     NOT NULL DEFAULT 1 CHECK (requested_quantity > 0),
  status             TEXT        NOT NULL DEFAULT 'NEEDS ORDER' CHECK (status IN ('NEEDS ORDER', 'ORDERED', 'RECEIVED', 'CANCELLED')),
  note               TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Auto-update updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS boxes_updated_at ON boxes;
CREATE TRIGGER boxes_updated_at
  BEFORE UPDATE ON boxes
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS purchase_list_updated_at ON purchase_list;
CREATE TRIGGER purchase_list_updated_at
  BEFORE UPDATE ON purchase_list
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE models ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_list ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies
DROP POLICY IF EXISTS "Public read boxes" ON boxes;
CREATE POLICY "Public read boxes" ON boxes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public write boxes" ON boxes;
CREATE POLICY "Public write boxes" ON boxes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read models" ON models;
CREATE POLICY "Public read models" ON models FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public write models" ON models;
CREATE POLICY "Public write models" ON models FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read inventory_transactions" ON inventory_transactions;
CREATE POLICY "Public read inventory_transactions" ON inventory_transactions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public write inventory_transactions" ON inventory_transactions;
CREATE POLICY "Public write inventory_transactions" ON inventory_transactions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public read purchase_list" ON purchase_list;
CREATE POLICY "Public read purchase_list" ON purchase_list FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public write purchase_list" ON purchase_list;
CREATE POLICY "Public write purchase_list" ON purchase_list FOR ALL USING (true) WITH CHECK (true);

-- 8. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_boxes_box_number ON boxes (box_number);
CREATE INDEX IF NOT EXISTS idx_models_box_id ON models (box_id);
CREATE INDEX IF NOT EXISTS idx_models_model_name ON models (model_name);
CREATE INDEX IF NOT EXISTS idx_inventory_group_id ON inventory_transactions (group_id);
CREATE INDEX IF NOT EXISTS idx_purchase_group_id ON purchase_list (group_id);

