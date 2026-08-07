import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Load JSON
with open('src/data/screenguards.json', 'r', encoding='utf-8') as f:
    json_data = json.load(f)

json_boxes = json_data['boxes']
print(f"✅ JSON Total Boxes: {len(json_boxes)}")

# Check duplicates and model count in JSON
json_box_numbers = [b['boxNumber'] for b in json_boxes]
assert len(json_box_numbers) == len(set(json_box_numbers)), "Duplicate box numbers found in JSON!"
print(f"✅ Unique Box Numbers in JSON: {len(set(json_box_numbers))}")

json_models_count = sum(len(b['compatibleModels']) for b in json_boxes)
print(f"✅ Total Compatible Models in JSON: {json_models_count}")

duplicates = [b['boxNumber'] for b in json_boxes if len(b['compatibleModels']) != len(set(b['compatibleModels']))]
assert len(duplicates) == 0, f"Duplicate models in JSON: {duplicates}"
print("✅ No duplicate models inside any box in JSON")

# Parse SQL
with open('seed-data.sql', 'r', encoding='utf-8') as f:
    sql_text = f.read()

# Extract boxes values block
boxes_match = re.search(r"INSERT INTO boxes \(id, box_number, display_size, title, raw_text\)\s*VALUES\s*(.*?);", sql_text, re.DOTALL)
assert boxes_match, "Could not parse INSERT INTO boxes in seed-data.sql"

box_rows = re.findall(r"\('([^']+)',\s*'([^']+)',\s*'([^']+)',\s*'([^']*)',\s*'([^']*)'\)", boxes_match.group(1))
print(f"✅ SQL Total Boxes parsed: {len(box_rows)}")
assert len(box_rows) == 106, f"Expected 106 boxes in SQL, got {len(box_rows)}"

# Extract models values block
models_match = re.search(r"INSERT INTO models \(box_id, model_name\)\s*VALUES\s*(.*?);", sql_text, re.DOTALL)
assert models_match, "Could not parse INSERT INTO models in seed-data.sql"

model_rows = re.findall(r"\('([^']+)',\s*'([^']+)'\)", models_match.group(1))
print(f"✅ SQL Total Models parsed: {len(model_rows)}")

# Verify 1:1 Parity
json_map = {b['id']: b for b in json_boxes}
sql_box_map = {r[0]: {'boxNumber': r[1], 'displaySize': r[2], 'title': r[3], 'rawText': r[4]} for r in box_rows}

assert len(json_map) == len(sql_box_map), "Mismatch in box count between JSON and SQL"

mismatches = 0
for bid, jbox in json_map.items():
    sbox = sql_box_map[bid]
    if (jbox['boxNumber'] != sbox['boxNumber'] or
        (jbox.get('displaySize') or 'Unknown') != sbox['displaySize'] or
        jbox['title'] != sbox['title'] or
        (jbox.get('rawText') or '') != sbox['rawText']):
        print(f"❌ Box Mismatch for {bid}:")
        print(f"   JSON: {jbox}")
        print(f"   SQL:  {sbox}")
        mismatches += 1

assert mismatches == 0, f"Found {mismatches} box attribute mismatches!"

# Check models parity
sql_models_by_box = {}
for box_id, model_name in model_rows:
    sql_models_by_box.setdefault(box_id, []).append(model_name)

model_mismatches = 0
for bid, jbox in json_map.items():
    jmodels = jbox['compatibleModels']
    smodels = sql_models_by_box.get(bid, [])
    if jmodels != smodels:
        print(f"❌ Model Mismatch for {bid}:")
        print(f"   JSON ({len(jmodels)}): {jmodels}")
        print(f"   SQL  ({len(smodels)}): {smodels}")
        model_mismatches += 1

assert model_mismatches == 0, f"Found {model_mismatches} model list mismatches!"

print("\n🎉 PARITY VERIFICATION PASSED PERFECTLY!")
print("JSON and SQL contain identical 106 Boxes and identical Compatible Models!")
