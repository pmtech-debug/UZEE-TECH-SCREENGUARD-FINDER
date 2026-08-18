import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

def validate_130_inventory():
    print("=" * 60)
    print("STARTING AUTOMATED 130-BOX INVENTORY VALIDATION")
    print("=" * 60)
    
    errors = []
    
    # 1. Load JSON dataset
    json_path = 'src/data/screenguards.json'
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
    except Exception as e:
        print(f"FAILED to load {json_path}: {e}")
        sys.exit(1)
        
    boxes = json_data.get('boxes', [])
    
    # Check total box count
    if len(boxes) != 130:
        errors.append(f"Expected exactly 130 boxes in JSON, found {len(boxes)}")
    else:
        print("✓ Exactly 130 Box Numbers in JSON")
        
    # Check Box Numbers sequence BOX 001 to BOX 130
    box_numbers = [b['boxNumber'] for b in boxes]
    expected_numbers = [f"BOX {i:03d}" for i in range(1, 131)]
    
    if box_numbers != expected_numbers:
        errors.append(f"Box number sequence mismatch! Mismatches: {set(box_numbers) ^ set(expected_numbers)}")
    else:
        print("✓ Box Numbers sequence BOX 001 through BOX 130 verified")
        
    # Check duplicate Box Numbers
    if len(box_numbers) != len(set(box_numbers)):
        errors.append("Duplicate Box Numbers found in JSON dataset!")
    else:
        print("✓ No duplicate Box Numbers")
        
    # Check no accidental old Box 01-106 format or 107-263 leftover records
    for b in boxes:
        if not re.match(r'^BOX \d{3}$', b['boxNumber']):
            errors.append(f"Invalid Box Number format: {b['boxNumber']}")
        num = int(b['boxNumber'].split()[1])
        if num < 1 or num > 130:
            errors.append(f"Out of range Box Number: {b['boxNumber']}")
    print("✓ No accidental old format or out-of-range box records")
    
    # Check empty boxes
    empty_box_numbers = [b['boxNumber'] for b in boxes if len(b['compatibleModels']) == 0]
    expected_empty = ['BOX 096', 'BOX 122', 'BOX 129']
    if empty_box_numbers != expected_empty:
        errors.append(f"Empty boxes mismatch! Expected {expected_empty}, found {empty_box_numbers}")
    else:
        print("✓ Empty boxes remain empty (BOX 096, BOX 122, BOX 129)")
        
    # Check duplicates within a box
    for b in boxes:
        models = b['compatibleModels']
        if len(models) != len(set(models)):
            errors.append(f"Duplicate models found inside {b['boxNumber']}")
    print("✓ No duplicate models within any box")
    
    # Check Display Sizes
    display_sizes = {b['boxNumber']: b['displaySize'] for b in boxes}
    if display_sizes['BOX 001'] != '4.7"':
        errors.append(f"BOX 001 display size mismatch: expected 4.7\", got {display_sizes['BOX 001']}")
    if display_sizes['BOX 002'] != '5.5"':
        errors.append(f"BOX 002 display size mismatch: expected 5.5\", got {display_sizes['BOX 002']}")
    if display_sizes['BOX 019'] != '6.3"':
        errors.append(f"BOX 019 display size mismatch: expected 6.3\", got {display_sizes['BOX 019']}")
    if display_sizes['BOX 020'] != '6.9"':
        errors.append(f"BOX 020 display size mismatch: expected 6.9\", got {display_sizes['BOX 020']}")
    if display_sizes['BOX 049'] != '6.67"':
        errors.append(f"BOX 049 display size mismatch: expected 6.67\", got {display_sizes['BOX 049']}")
    print("✓ Display Sizes match supplied inventory list specifications")
    
    # 2. Check SQL file parity
    sql_path = 'seed-data.sql'
    try:
        with open(sql_path, 'r', encoding='utf-8') as f:
            sql_content = f.read()
    except Exception as e:
        print(f"FAILED to load {sql_path}: {e}")
        sys.exit(1)
        
    # Extract boxes from SQL
    sql_boxes = re.findall(r"\('box-\d{3}', '(BOX \d{3})'", sql_content)
    if len(sql_boxes) != 130:
        errors.append(f"Expected 130 boxes in seed-data.sql, found {len(sql_boxes)}")
    else:
        print("✓ Exactly 130 boxes in seed-data.sql")
        
    # Extract model rows from SQL
    sql_models_section = sql_content.split("INSERT INTO models (box_id, model_name) VALUES")[1]
    sql_models = re.findall(r"\('(box-\d{3})', '(.*?)'\)", sql_models_section)
    json_total_models = sum(len(b['compatibleModels']) for b in boxes)
    
    if len(sql_models) != json_total_models:
        errors.append(f"Model count mismatch between JSON ({json_total_models}) and SQL ({len(sql_models)})")
    else:
        print(f"✓ Complete JSON and SQL parity ({json_total_models} model relationships)")
        
    print("=" * 60)
    if errors:
        print(f"VALIDATION FAILED WITH {len(errors)} ERRORS:")
        for err in errors:
            print(f"  ❌ {err}")
        sys.exit(1)
    else:
        print("🎉 ALL VALIDATION CHECKS PASSED SUCCESSFULLY!")
        print("=" * 60)

if __name__ == '__main__':
    validate_130_inventory()
