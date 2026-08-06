import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/screenguards.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

boxes = data['boxes']

lines = []
lines.append('-- ============================================================')
lines.append('-- UZEE TECH ScreenGuard Finder -- Seed Data')
lines.append('-- Normalized 1-to-Many Schema (boxes & models)')
lines.append('-- Run this AFTER running schema.sql in Supabase SQL Editor')
lines.append('-- ============================================================')
lines.append('')
lines.append('-- Clear existing data')
lines.append('TRUNCATE TABLE models, boxes CASCADE;')
lines.append('')

# Insert into boxes
lines.append('-- 1. Insert boxes')
lines.append('INSERT INTO boxes (id, box_number, display_size, title, raw_text)')
lines.append('VALUES')

box_rows = []
model_rows = []

for b in boxes:
    bid = b['id'].replace("'", "''")
    box_number = b['boxNumber'].replace("'", "''")
    display_size = (b.get('displaySize') or 'Unknown').replace("'", "''")
    title = b.get('title', '').replace("'", "''")
    raw_text = (b.get('rawText') or '').replace("'", "''")
    box_rows.append(f"  ('{bid}', '{box_number}', '{display_size}', '{title}', '{raw_text}')")

    for model in b.get('compatibleModels', []):
        m_escaped = model.replace("'", "''")
        model_rows.append(f"  ('{bid}', '{m_escaped}')")

lines.append(',\n'.join(box_rows) + ';')
lines.append('')

# Insert into models
lines.append('-- 2. Insert models')
lines.append('INSERT INTO models (box_id, model_name)')
lines.append('VALUES')
lines.append(',\n'.join(model_rows) + ';')
lines.append('')

lines.append('-- Verify counts')
lines.append('SELECT')
lines.append('  (SELECT COUNT(*) FROM boxes) AS total_boxes,')
lines.append('  (SELECT COUNT(*) FROM models) AS total_models;')

sql = '\n'.join(lines)
with open('seed-data.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

print(f'Done: seed-data.sql with {len(boxes)} boxes and {len(model_rows)} models')
