import json, sys
sys.stdout.reconfigure(encoding='utf-8')

with open('src/data/screenguards.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

boxes = data['boxes']

lines = []
lines.append('-- ============================================================')
lines.append('-- UZEE TECH ScreenGuard Finder -- Seed Data')
lines.append('-- All 106 compatibility boxes')
lines.append('-- Run this AFTER running schema.sql in Supabase SQL Editor')
lines.append('-- ============================================================')
lines.append('')
lines.append('INSERT INTO screenguards (id, box_number, display_size, title, models, raw_text)')
lines.append('VALUES')

rows = []
for b in boxes:
    bid = b['id'].replace("'", "''")
    box_number = b['boxNumber'].replace("'", "''")
    display_size = (b.get('displaySize') or 'Unknown').replace("'", "''")
    title = b.get('title', '').replace("'", "''")
    models_json = json.dumps(b.get('compatibleModels', []), ensure_ascii=False).replace("'", "''")
    raw_text = (b.get('rawText') or '').replace("'", "''")
    rows.append(f"  ('{bid}', '{box_number}', '{display_size}', '{title}', '{models_json}'::jsonb, '{raw_text}')")

lines.append(',\n'.join(rows))
lines.append('ON CONFLICT (id) DO UPDATE SET')
lines.append('  box_number   = EXCLUDED.box_number,')
lines.append('  display_size = EXCLUDED.display_size,')
lines.append('  title        = EXCLUDED.title,')
lines.append('  models       = EXCLUDED.models,')
lines.append('  raw_text     = EXCLUDED.raw_text,')
lines.append('  updated_at   = now();')
lines.append('')
lines.append('-- Verify: should return 106')
lines.append('SELECT COUNT(*) AS total_boxes FROM screenguards;')

sql = '\n'.join(lines)
with open('seed-data.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

print(f'Done: seed-data.sql with {len(boxes)} rows')
