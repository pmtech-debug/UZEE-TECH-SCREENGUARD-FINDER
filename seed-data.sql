-- ============================================================
-- UZEE TECH ScreenGuard Finder -- Seed Data
-- All 106 compatibility boxes
-- Run this AFTER running schema.sql in Supabase SQL Editor
-- ============================================================

INSERT INTO screenguards (id, box_number, display_size, title, models, raw_text)
VALUES
  ('box-1', 'BOX 01', 'Unknown', 'IPHONE 6 PLUS/IP 6S PLUS', '["iPhone 6 PLUS", "Apple iPhone 6 PLUS", "iPhone 6S PLUS", "Apple iPhone 6S PLUS"]'::jsonb, 'IPHONE 6 PLUS/IP 6S PLUS'),
  ('box-2', 'BOX 02', 'Unknown', 'SAM A05S/M14 4G/F14 4G', '["Samsung A05S", "Galaxy A05S", "Samsung M14 4G", "Galaxy M14 4G", "Samsung F14 4G", "Galaxy F14 4G"]'::jsonb, 'SAM A05S/M14 4G/F14 4G'),
  ('box-3', 'BOX 03', 'Unknown', 'IPHONE 7/IP 8', '["iPhone 7", "Apple iPhone 7", "iPhone 8", "Apple iPhone 8"]'::jsonb, 'IPHONE 7/IP 8'),
  ('box-4', 'BOX 04', 'Unknown', 'SAM A12/A02/A02S/A02 5G/A03/A03S/A03 CORE/A04/A04S/A04 CORE/A04 E/A13 4G/5G/A23 4G/5G/A32 5G/M02 4G/M02S/M04 4G/M12/M13 4G/5G/M13 INDIA/M23 5G/M32 5G/M33 5G/F02S 4G/F04 4G/F12 4G/F13 4G/F23 5G', '["Samsung A12", "Galaxy A12", "Samsung A02", "Galaxy A02", "Samsung A02S", "Galaxy A02S", "Samsung A02 5G", "Galaxy A02 5G", "Samsung A03", "Galaxy A03", "Samsung A03S", "Galaxy A03S", "Samsung A03 CORE", "Galaxy A03 CORE", "Samsung A04", "Galaxy A04", "Samsung A04S", "Galaxy A04S", "Samsung A04 CORE", "Galaxy A04 CORE", "Samsung A04 E", "Galaxy A04 E", "Samsung A13 4G", "Galaxy A13 4G", "Samsung 5G", "Galaxy 5G", "Samsung A23 4G", "Galaxy A23 4G", "Samsung A32 5G", "Galaxy A32 5G", "Samsung M02 4G", "Galaxy M02 4G", "Samsung M02S", "Galaxy M02S", "Samsung M04 4G", "Galaxy M04 4G", "Samsung M12", "Galaxy M12", "Samsung M13 4G", "Galaxy M13 4G", "Samsung M13 INDIA", "Galaxy M13 INDIA", "Samsung M23 5G", "Galaxy M23 5G", "Samsung M32 5G", "Galaxy M32 5G", "Samsung M33 5G", "Galaxy M33 5G", "Samsung F02S 4G", "Galaxy F02S 4G", "Samsung F04 4G", "Galaxy F04 4G", "Samsung F12 4G", "Galaxy F12 4G", "Samsung F13 4G", "Galaxy F13 4G", "Samsung F23 5G", "Galaxy F23 5G"]'::jsonb, 'SAM A12/A02/A02S/A02 5G/A03/A03S/A03 CORE/A04/A04S/A04 CORE/A04 E/A13
4G/5G/A23 4G/5G/A32 5G/M02 4G/M02S/M04 4G/M12/M13 4G/5G/M13
INDIA/M23 5G/M32 5G/M33 5G/F02S 4G/F04 4G/F12 4G/F13 4G/F23 5G'),
  ('box-5', 'BOX 05', 'Unknown', 'IPHONE 7 PLUS/IP 8 PLUS', '["iPhone 7 PLUS", "Apple iPhone 7 PLUS", "iPhone 8 PLUS", "Apple iPhone 8 PLUS"]'::jsonb, 'IPHONE 7 PLUS/IP 8 PLUS'),
  ('box-6', 'BOX 06', 'Unknown', 'IPHONE X/XS/IP 11 PRO', '["iPhone X", "Apple iPhone X", "iPhone XS", "Apple iPhone XS", "iPhone 11 PRO", "Apple iPhone 11 PRO"]'::jsonb, 'IPHONE X/XS/IP 11 PRO'),
  ('box-7', 'BOX 07', 'Unknown', 'IPHONE XR 6.1/IP 11', '["iPhone XR 6.1", "Apple iPhone XR 6.1", "iPhone 11", "Apple iPhone 11"]'::jsonb, 'IPHONE XR 6.1/IP 11'),
  ('box-8', 'BOX 08', 'Unknown', 'SAM A14 4G/A14 5G/M14 5G/F14 5G', '["Samsung A14 4G", "Galaxy A14 4G", "Samsung A14 5G", "Galaxy A14 5G", "Samsung M14 5G", "Galaxy M14 5G", "Samsung F14 5G", "Galaxy F14 5G"]'::jsonb, 'SAM A14 4G/A14 5G/M14 5G/F14 5G'),
  ('box-9', 'BOX 09', 'Unknown', 'IPHONE XS MAX/IP 11 PRO MAX', '["iPhone XS MAX", "Apple iPhone XS MAX", "iPhone 11 PRO MAX", "Apple iPhone 11 PRO MAX"]'::jsonb, 'IPHONE XS MAX/IP 11 PRO MAX'),
  ('box-10', 'BOX 10', 'Unknown', 'SAM A15 4G/A15 5G/A25 5G/SAM A24 4G/ M34 5G/F34 5G/F15/M15', '["Samsung A15 4G", "Galaxy A15 4G", "Samsung A15 5G", "Galaxy A15 5G", "Samsung A25 5G", "Galaxy A25 5G", "Samsung A24 4G", "Galaxy A24 4G", "Samsung M34 5G", "Galaxy M34 5G", "Samsung F34 5G", "Galaxy F34 5G", "Samsung F15", "Galaxy F15", "Samsung M15", "Galaxy M15"]'::jsonb, 'SAM A15 4G/A15 5G/A25 5G/SAM A24 4G/ M34 5G/F34 5G/F15/M15'),
  ('box-11', 'BOX 11', 'Unknown', 'IPHONE 12/IP 12 PRO', '["iPhone 12", "Apple iPhone 12", "iPhone 12 PRO", "Apple iPhone 12 PRO"]'::jsonb, 'IPHONE 12/IP 12 PRO'),
  ('box-12', 'BOX 12', 'Unknown', 'SAM A16 4G/A16 5G/A17 5G/A26/M16/M17 5G/M36/F16/F17/F36', '["Samsung A16 4G", "Galaxy A16 4G", "Samsung A16 5G", "Galaxy A16 5G", "Samsung A17 5G", "Galaxy A17 5G", "Samsung A26", "Galaxy A26", "Samsung M16", "Galaxy M16", "Samsung M17 5G", "Galaxy M17 5G", "Samsung M36", "Galaxy M36", "Samsung F16", "Galaxy F16", "Samsung F17", "Galaxy F17", "Samsung F36", "Galaxy F36"]'::jsonb, 'SAM A16 4G/A16 5G/A17 5G/A26/M16/M17 5G/M36/F16/F17/F36'),
  ('box-13', 'BOX 13', 'Unknown', 'IPHONE 12 PRO MAX', '["iPhone 12 PRO MAX", "Apple iPhone 12 PRO MAX"]'::jsonb, 'IPHONE 12 PRO MAX'),
  ('box-14', 'BOX 14', 'Unknown', 'SAM A22 5G/F42 5G', '["Samsung A22 5G", "Galaxy A22 5G", "Samsung F42 5G", "Galaxy F42 5G"]'::jsonb, 'SAM A22 5G/F42 5G'),
  ('box-15', 'BOX 15', 'Unknown', 'IPHONE 13 /IP 13 PRO/IP 14 6.1/IP 16E/IP 17E', '["iPhone 13", "Apple iPhone 13", "iPhone 13 PRO", "Apple iPhone 13 PRO", "iPhone 14 6.1", "Apple iPhone 14 6.1", "iPhone 16E", "Apple iPhone 16E", "iPhone 17E", "Apple iPhone 17E"]'::jsonb, 'IPHONE 13 /IP 13 PRO/IP 14 6.1/IP 16E/IP 17E'),
  ('box-16', 'BOX 16', 'Unknown', 'SAM A30/A50/A20/A30S/A50S/M10S/M21/M21S/M21 2021/M30/M30S/M31/M31 PRIME/F41', '["Samsung A30", "Galaxy A30", "Samsung A50", "Galaxy A50", "Samsung A20", "Galaxy A20", "Samsung A30S", "Galaxy A30S", "Samsung A50S", "Galaxy A50S", "Samsung M10S", "Galaxy M10S", "Samsung M21", "Galaxy M21", "Samsung M21S", "Galaxy M21S", "Samsung M21 2021", "Galaxy M21 2021", "Samsung M30", "Galaxy M30", "Samsung M30S", "Galaxy M30S", "Samsung M31", "Galaxy M31", "Samsung M31 PRIME", "Galaxy M31 PRIME", "Samsung F41", "Galaxy F41"]'::jsonb, 'SAM A30/A50/A20/A30S/A50S/M10S/M21/M21S/M21 2021/M30/M30S/M31/M31
PRIME/F41'),
  ('box-17', 'BOX 17', 'Unknown', 'IPHONE 13 PRO MAX/IP 14 PLUS', '["iPhone 13 PRO MAX", "Apple iPhone 13 PRO MAX", "iPhone 14 PLUS", "Apple iPhone 14 PLUS"]'::jsonb, 'IPHONE 13 PRO MAX/IP 14 PLUS'),
  ('box-18', 'BOX 18', 'Unknown', 'SAM A31/A32 4G/A33 5G/A22 4G/F22 4G/M22 4G/M32 4G', '["Samsung A31", "Galaxy A31", "Samsung A32 4G", "Galaxy A32 4G", "Samsung A33 5G", "Galaxy A33 5G", "Samsung A22 4G", "Galaxy A22 4G", "Samsung F22 4G", "Galaxy F22 4G", "Samsung M22 4G", "Galaxy M22 4G", "Samsung M32 4G", "Galaxy M32 4G"]'::jsonb, 'SAM A31/A32 4G/A33 5G/A22 4G/F22 4G/M22 4G/M32 4G'),
  ('box-19', 'BOX 19', 'Unknown', 'IPHONE 14 PRO', '["iPhone 14 PRO", "Apple iPhone 14 PRO"]'::jsonb, 'IPHONE 14 PRO'),
  ('box-20', 'BOX 20', 'Unknown', 'SAM A34 5G', '["Samsung A34 5G", "Galaxy A34 5G"]'::jsonb, 'SAM A34 5G'),
  ('box-21', 'BOX 21', 'Unknown', 'IPHONE 14 PRO MAX', '["iPhone 14 PRO MAX", "Apple iPhone 14 PRO MAX"]'::jsonb, 'IPHONE 14 PRO MAX'),
  ('box-22', 'BOX 22', 'Unknown', 'SAM A35 5G/A55 5G/M35 5G', '["Samsung A35 5G", "Galaxy A35 5G", "Samsung A55 5G", "Galaxy A55 5G", "Samsung M35 5G", "Galaxy M35 5G"]'::jsonb, 'SAM A35 5G/A55 5G/M35 5G'),
  ('box-23', 'BOX 23', 'Unknown', 'IPHONE 15/IP 16 6.1', '["iPhone 15", "Apple iPhone 15", "iPhone 16 6.1", "Apple iPhone 16 6.1"]'::jsonb, 'IPHONE 15/IP 16 6.1'),
  ('box-24', 'BOX 24', 'Unknown', 'SAM A51/A51 5G/A52/A52S 5G/A53 5G/M31S/S20FE/S20FE 5G/S20FE 2022', '["Samsung A51", "Galaxy A51", "Samsung A51 5G", "Galaxy A51 5G", "Samsung A52", "Galaxy A52", "Samsung A52S 5G", "Galaxy A52S 5G", "Samsung A53 5G", "Galaxy A53 5G", "Samsung M31S", "Galaxy M31S", "Samsung S20FE", "Galaxy S20FE", "Samsung S20FE 5G", "Galaxy S20FE 5G", "Samsung S20FE 2022", "Galaxy S20FE 2022"]'::jsonb, 'SAM A51/A51 5G/A52/A52S 5G/A53 5G/M31S/S20FE/S20FE 5G/S20FE 2022'),
  ('box-25', 'BOX 25', 'Unknown', 'IPHONE 15 PLUS/IP 16 PLUS 6.7', '["iPhone 15 PLUS", "Apple iPhone 15 PLUS", "iPhone 16 PLUS 6.7", "Apple iPhone 16 PLUS 6.7"]'::jsonb, 'IPHONE 15 PLUS/IP 16 PLUS 6.7'),
  ('box-26', 'BOX 26', 'Unknown', 'SAM A54 5G/S23 FE 5G', '["Samsung A54 5G", "Galaxy A54 5G", "Samsung S23 FE 5G", "Galaxy S23 FE 5G"]'::jsonb, 'SAM A54 5G/S23 FE 5G'),
  ('box-27', 'BOX 27', 'Unknown', 'IPHONE 15 PRO 6.1', '["iPhone 15 PRO 6.1", "Apple iPhone 15 PRO 6.1"]'::jsonb, 'IPHONE 15 PRO 6.1'),
  ('box-28', 'BOX 28', 'Unknown', 'SAM A70/A70S/A42 5G/M42 5G', '["Samsung A70", "Galaxy A70", "Samsung A70S", "Galaxy A70S", "Samsung A42 5G", "Galaxy A42 5G", "Samsung M42 5G", "Galaxy M42 5G"]'::jsonb, 'SAM A70/A70S/A42 5G/M42 5G'),
  ('box-29', 'BOX 29', 'Unknown', 'IPHONE 15 PRO MAX 6.7', '["iPhone 15 PRO MAX 6.7", "Apple iPhone 15 PRO MAX 6.7"]'::jsonb, 'IPHONE 15 PRO MAX 6.7'),
  ('box-30', 'BOX 30', 'Unknown', 'SAM A71/A71 5G/A73 5G/A81/A91/M51/M52 5G/M53 5G/M54 5G/M62/F54 5G/F62/S10 LITE / NOTE 10 LITE', '["Samsung A71", "Galaxy A71", "Samsung A71 5G", "Galaxy A71 5G", "Samsung A73 5G", "Galaxy A73 5G", "Samsung A81", "Galaxy A81", "Samsung A91", "Galaxy A91", "Samsung M51", "Galaxy M51", "Samsung M52 5G", "Galaxy M52 5G", "Samsung M53 5G", "Galaxy M53 5G", "Samsung M54 5G", "Galaxy M54 5G", "Samsung M62", "Galaxy M62", "Samsung F54 5G", "Galaxy F54 5G", "Samsung F62", "Galaxy F62", "Samsung S10 LITE", "Galaxy S10 LITE", "Samsung NOTE 10 LITE", "Galaxy NOTE 10 LITE"]'::jsonb, 'SAM A71/A71 5G/A73 5G/A81/A91/M51/M52 5G/M53 5G/M54 5G/M62/F54
5G/F62/S10 LITE / NOTE 10 LITE'),
  ('box-31', 'BOX 31', 'Unknown', 'IPHONE 16 PRO /IP 17 6.3 (THICK GLUE)380胶', '["iPhone 16 PRO", "Apple iPhone 16 PRO", "iPhone 17 6.3", "Apple iPhone 17 6.3"]'::jsonb, 'IPHONE 16 PRO /IP 17 6.3 (THICK GLUE)380胶'),
  ('box-32', 'BOX 32', 'Unknown', 'SAM J4 PLUS/J6 PLUS/J4 CORE', '["Samsung J4 PLUS", "Galaxy J4 PLUS", "Samsung J6 PLUS", "Galaxy J6 PLUS", "Samsung J4 CORE", "Galaxy J4 CORE"]'::jsonb, 'SAM J4 PLUS/J6 PLUS/J4 CORE'),
  ('box-33', 'BOX 33', 'Unknown', 'IPHONE 16 PRO MAX 6.9 (THICK GLUE)380胶', '["iPhone 16 PRO MAX 6.9", "Apple iPhone 16 PRO MAX 6.9"]'::jsonb, 'IPHONE 16 PRO MAX 6.9 (THICK GLUE)380胶'),
  ('box-34', 'BOX 34', 'Unknown', 'SAM S21FE 5G', '["Samsung S21FE 5G", "Galaxy S21FE 5G"]'::jsonb, 'SAM S21FE 5G'),
  ('box-35', 'BOX 35', 'Unknown', 'IPHONE 17 AIR 6.6(THICK GLUE)380胶', '["iPhone 17 AIR 6.6", "Apple iPhone 17 AIR 6.6"]'::jsonb, 'IPHONE 17 AIR 6.6(THICK GLUE)380胶'),
  ('box-36', 'BOX 36', 'Unknown', 'SAM A27/ A36 5G/A37/A56 5G/A57/M36 5G/M47 5G/M56 5G/F56 5G/SAM S24FE 5G/SAM S25FE 新图纸', '["Samsung A27", "Galaxy A27", "Samsung A36 5G", "Galaxy A36 5G", "Samsung A37", "Galaxy A37", "Samsung A56 5G", "Galaxy A56 5G", "Samsung A57", "Galaxy A57", "Samsung M36 5G", "Galaxy M36 5G", "Samsung M47 5G", "Galaxy M47 5G", "Samsung M56 5G", "Galaxy M56 5G", "Samsung F56 5G", "Galaxy F56 5G", "Samsung S24FE 5G", "Galaxy S24FE 5G", "Samsung S25FE", "Galaxy S25FE"]'::jsonb, 'SAM A27/ A36 5G/A37/A56 5G/A57/M36 5G/M47 5G/M56 5G/F56 5G/SAM S24FE
5G/SAM S25FE 新图纸'),
  ('box-37', 'BOX 37', 'Unknown', 'IPHONE 17 PRO 6.3 (THICK GLUE)380胶', '["iPhone 17 PRO 6.3", "Apple iPhone 17 PRO 6.3"]'::jsonb, 'IPHONE 17 PRO 6.3 (THICK GLUE)380胶'),
  ('box-38', 'BOX 38', 'Unknown', 'SAM Z FOLD4/FOLD 5', '["Samsung Z FOLD4", "Galaxy Z FOLD4", "Samsung FOLD 5", "Galaxy FOLD 5"]'::jsonb, 'SAM Z FOLD4/FOLD 5'),
  ('box-39', 'BOX 39', 'Unknown', 'IPHONE 17 PRO MAX 6.9 (THICK GLUE)380胶', '["iPhone 17 PRO MAX 6.9", "Apple iPhone 17 PRO MAX 6.9"]'::jsonb, 'IPHONE 17 PRO MAX 6.9 (THICK GLUE)380胶'),
  ('box-40', 'BOX 40', 'Unknown', 'SAM Z FOLD 6', '["Samsung Z FOLD 6", "Galaxy Z FOLD 6"]'::jsonb, 'SAM Z FOLD 6'),
  ('box-41', 'BOX 41', 'Unknown', 'IPHONE 18 PRO 6.3 (THICK GLUE)390胶', '["iPhone 18 PRO 6.3", "Apple iPhone 18 PRO 6.3"]'::jsonb, 'IPHONE 18 PRO 6.3 (THICK GLUE)390胶'),
  ('box-42', 'BOX 42', 'Unknown', 'SAM Z FOLD 7', '["Samsung Z FOLD 7", "Galaxy Z FOLD 7"]'::jsonb, 'SAM Z FOLD 7'),
  ('box-43', 'BOX 43', 'Unknown', 'IPHONE 18 PRO MAX 6.9 (THICK GLUE)390胶', '["iPhone 18 PRO MAX 6.9", "Apple iPhone 18 PRO MAX 6.9"]'::jsonb, 'IPHONE 18 PRO MAX 6.9 (THICK GLUE)390胶'),
  ('box-44', 'BOX 44', 'Unknown', 'SAM Ｚ FOLD 8 WIDE', '["Samsung Ｚ FOLD 8 WIDE", "Galaxy Ｚ FOLD 8 WIDE"]'::jsonb, 'SAM Ｚ FOLD 8 WIDE'),
  ('box-45', 'BOX 45', 'Unknown', 'REDMI 10C/RM 10(INDIA)/RM 10 POWER/RM 11A/RM 12C/RM A3/RM A3X', '["Redmi 10C", "Xiaomi Redmi 10C", "Redmi 10", "Xiaomi Redmi 10", "INDIA", "Redmi 10 POWER", "Xiaomi Redmi 10 POWER", "Redmi 11A", "Xiaomi Redmi 11A", "Redmi 12C", "Xiaomi Redmi 12C", "Redmi A3", "Xiaomi Redmi A3", "Redmi A3X", "Xiaomi Redmi A3X"]'::jsonb, 'REDMI 10C/RM 10(INDIA)/RM 10 POWER/RM 11A/RM 12C/RM
A3/RM A3X'),
  ('box-46', 'BOX 46', 'Unknown', 'SAM Z FOLD 8 ULTRA', '["Samsung Z FOLD 8 ULTRA", "Galaxy Z FOLD 8 ULTRA"]'::jsonb, 'SAM Z FOLD 8 ULTRA'),
  ('box-47', 'BOX 47', 'Unknown', 'REDMI 10 PRIME /RM 10/RM NOTE 10 5G/RM NOTE 10T 5G/RM NOTE 11 4G（2021)/RM NOTE 11SE 5G', '["Redmi 10 PRIME", "Xiaomi Redmi 10 PRIME", "Redmi 10", "Xiaomi Redmi 10", "Redmi NOTE 10 5G", "Xiaomi Redmi NOTE 10 5G", "Redmi NOTE 10T 5G", "Xiaomi Redmi NOTE 10T 5G", "Redmi NOTE 11 4G（2021)", "Xiaomi Redmi NOTE 11 4G（2021)", "Redmi NOTE 11SE 5G", "Xiaomi Redmi NOTE 11SE 5G"]'::jsonb, 'REDMI 10 PRIME /RM 10/RM NOTE 10 5G/RM NOTE 10T 5G/RM
NOTE 11 4G（2021)/RM NOTE 11SE 5G'),
  ('box-48', 'BOX 48', 'Unknown', 'SAM A20S(REDMI 9)', '["Samsung A20S", "Galaxy A20S", "REDMI 9", "Xiaomi Redmi 9"]'::jsonb, 'SAM A20S(REDMI 9)'),
  ('box-49', 'BOX 49', 'Unknown', 'SAM A05/A06 4G/A06 5G/A07 5G/M05/M06/M07 4G/M17E/F07E 5G/F05/F06 5G/F07 4G(REDMI 13C)', '["Samsung A05", "Galaxy A05", "Samsung A06 4G", "Galaxy A06 4G", "Samsung A06 5G", "Galaxy A06 5G", "Samsung A07 5G", "Galaxy A07 5G", "Samsung M05", "Galaxy M05", "Samsung M06", "Galaxy M06", "Samsung M07 4G", "Galaxy M07 4G", "Samsung M17E", "Galaxy M17E", "Samsung F07E 5G", "Galaxy F07E 5G", "Samsung F05", "Galaxy F05", "Samsung F06 5G", "Galaxy F06 5G", "Samsung F07 4G", "Galaxy F07 4G", "REDMI 13C", "Xiaomi Redmi 13C"]'::jsonb, 'SAM A05/A06 4G/A06 5G/A07 5G/M05/M06/M07 4G/M17E/F07E 5G/F05/F06
5G/F07 4G(REDMI 13C)'),
  ('box-50', 'BOX 50', 'Unknown', 'REDMI 12 4G/RM 12 5G/RM 13 4G/RM 13 5G/RM 13X 4G/RM NOTE 12R/RM NOTE 13R', '["Redmi 12 4G", "Xiaomi Redmi 12 4G", "Redmi 12 5G", "Xiaomi Redmi 12 5G", "Redmi 13 4G", "Xiaomi Redmi 13 4G", "Redmi 13 5G", "Xiaomi Redmi 13 5G", "Redmi 13X 4G", "Xiaomi Redmi 13X 4G", "Redmi NOTE 12R", "Xiaomi Redmi NOTE 12R", "Redmi NOTE 13R", "Xiaomi Redmi NOTE 13R"]'::jsonb, 'REDMI 12 4G/RM 12 5G/RM 13 4G/RM 13 5G/RM 13X 4G/RM NOTE
12R/RM NOTE 13R'),
  ('box-51', 'BOX 51', 'Unknown', 'SAM A72/A80/A90/M55/M55S/C55/F55 (REDMI K30)', '["Samsung A72", "Galaxy A72", "Samsung A80", "Galaxy A80", "Samsung A90", "Galaxy A90", "Samsung M55", "Galaxy M55", "Samsung M55S", "Galaxy M55S", "Samsung C55", "Galaxy C55", "Samsung F55", "Galaxy F55", "REDMI K30", "Xiaomi Redmi K30"]'::jsonb, 'SAM A72/A80/A90/M55/M55S/C55/F55 (REDMI K30)'),
  ('box-52', 'BOX 52', 'Unknown', 'REDMI 13C 4G/RM 13C 5G/RM 13R', '["Redmi 13C 4G", "Xiaomi Redmi 13C 4G", "Redmi 13C 5G", "Xiaomi Redmi 13C 5G", "Redmi 13R", "Xiaomi Redmi 13R"]'::jsonb, 'REDMI 13C 4G/RM 13C 5G/RM 13R'),
  ('box-53', 'BOX 53', 'Unknown', 'SAM A10S/M10/M20/A10/M01S(VIVO Y90)', '["Samsung A10S", "Galaxy A10S", "Samsung M10", "Galaxy M10", "Samsung M20", "Galaxy M20", "Samsung A10", "Galaxy A10", "Samsung M01S", "Galaxy M01S", "VIVO Y90", "Vivo Y90"]'::jsonb, 'SAM A10S/M10/M20/A10/M01S(VIVO Y90)'),
  ('box-54', 'BOX 54', 'Unknown', 'REDMI 14C 4G/RM 14C 5G/RM 14R 5G/RM 17C/RM A3 PRO 4G/RM A4 5G/RM A5 4G (Global)/RM A7 4G', '["Redmi 14C 4G", "Xiaomi Redmi 14C 4G", "Redmi 14C 5G", "Xiaomi Redmi 14C 5G", "Redmi 14R 5G", "Xiaomi Redmi 14R 5G", "Redmi 17C", "Xiaomi Redmi 17C", "Redmi A3 PRO 4G", "Xiaomi Redmi A3 PRO 4G", "Redmi A4 5G", "Xiaomi Redmi A4 5G", "Redmi A5 4G", "Xiaomi Redmi A5 4G", "Global", "Redmi A7 4G", "Xiaomi Redmi A7 4G"]'::jsonb, 'REDMI 14C 4G/RM 14C 5G/RM 14R 5G/RM 17C/RM A3 PRO 4G/RM
A4 5G/RM A5 4G (Global)/RM A7 4G'),
  ('box-55', 'BOX 55', 'Unknown', 'SAM A11/M11(OPPO F11 PRO)', '["Samsung A11", "Galaxy A11", "Samsung M11", "Galaxy M11", "OPPO F11 PRO"]'::jsonb, 'SAM A11/M11(OPPO F11 PRO)'),
  ('box-56', 'BOX 56', 'Unknown', 'REDMI 15 4G (Global) /RM 15 5G (Global)', '["Redmi 15 4G", "Xiaomi Redmi 15 4G", "Global", "Redmi 15 5G", "Xiaomi Redmi 15 5G"]'::jsonb, 'REDMI 15 4G (Global) /RM 15 5G (Global)'),
  ('box-57', 'BOX 57', 'Unknown', 'SAM F52 5G/A21S (OPPO A53 4G)', '["Samsung F52 5G", "Galaxy F52 5G", "Samsung A21S", "Galaxy A21S", "OPPO A53 4G"]'::jsonb, 'SAM F52 5G/A21S (OPPO A53 4G)'),
  ('box-58', 'BOX 58', 'Unknown', 'REDMI 15C 4G (Global)/RM 15C 5G(Global)/RM 15A 5G/RM 17 5G/RM R70/RM R70M/RM A7 PRO 4G/RM A7 PRO 5G', '["Redmi 15C 4G", "Xiaomi Redmi 15C 4G", "Global", "Redmi 15C 5G", "Xiaomi Redmi 15C 5G", "Redmi 15A 5G", "Xiaomi Redmi 15A 5G", "Redmi 17 5G", "Xiaomi Redmi 17 5G", "Redmi R70", "Xiaomi Redmi R70", "Redmi R70M", "Xiaomi Redmi R70M", "Redmi A7 PRO 4G", "Xiaomi Redmi A7 PRO 4G", "Redmi A7 PRO 5G", "Xiaomi Redmi A7 PRO 5G"]'::jsonb, 'REDMI 15C 4G (Global)/RM 15C 5G(Global)/RM 15A 5G/RM 17 5G/RM
R70/RM R70M/RM A7 PRO 4G/RM A7 PRO 5G'),
  ('box-59', 'BOX 59', 'Unknown', 'SAM S21(玻璃0.25MM)', '["Samsung S21", "Galaxy S21"]'::jsonb, 'SAM S21(玻璃0.25MM)'),
  ('box-60', 'BOX 60', 'Unknown', 'REDMI 15C 4G(EU)', '["Redmi 15C 4G", "Xiaomi Redmi 15C 4G", "EU"]'::jsonb, 'REDMI 15C 4G(EU)'),
  ('box-61', 'BOX 61', 'Unknown', 'SAM S21 PLUS(玻璃0.25MM)', '["Samsung S21 PLUS", "Galaxy S21 PLUS"]'::jsonb, 'SAM S21 PLUS(玻璃0.25MM)'),
  ('box-62', 'BOX 62', 'Unknown', 'REDMI 15 4G(EU)/RM 15 5G(EU)', '["Redmi 15 4G", "Xiaomi Redmi 15 4G", "EU", "Redmi 15 5G", "Xiaomi Redmi 15 5G"]'::jsonb, 'REDMI 15 4G(EU)/RM 15 5G(EU)'),
  ('box-63', 'BOX 63', 'Unknown', 'SAM S22/S23(玻璃0.25MM)', '["Samsung S22", "Galaxy S22", "Samsung S23", "Galaxy S23"]'::jsonb, 'SAM S22/S23(玻璃0.25MM)'),
  ('box-64', 'BOX 64', 'Unknown', 'REDMI 9/RM 9 PRIME', '["Redmi 9", "Xiaomi Redmi 9", "Redmi 9 PRIME", "Xiaomi Redmi 9 PRIME"]'::jsonb, 'REDMI 9/RM 9 PRIME'),
  ('box-65', 'BOX 65', 'Unknown', 'SAM S22 PLUS/S23 PLUS(玻璃0.25MM)', '["Samsung S22 PLUS", "Galaxy S22 PLUS", "Samsung S23 PLUS", "Galaxy S23 PLUS"]'::jsonb, 'SAM S22 PLUS/S23 PLUS(玻璃0.25MM)'),
  ('box-66', 'BOX 66', 'Unknown', 'REDMI 9A/RM 9C/RM 9i/RM 9 ACTIV/RM 10A 4G', '["Redmi 9A", "Xiaomi Redmi 9A", "Redmi 9C", "Xiaomi Redmi 9C", "Redmi 9i", "Xiaomi Redmi 9i", "Redmi 9 ACTIV", "Xiaomi Redmi 9 ACTIV", "Redmi 10A 4G", "Xiaomi Redmi 10A 4G"]'::jsonb, 'REDMI 9A/RM 9C/RM 9i/RM 9 ACTIV/RM 10A 4G'),
  ('box-67', 'BOX 67', 'Unknown', 'SAM S24/SAM S25(玻璃0.25MM)', '["Samsung S24", "Galaxy S24", "Samsung S25", "Galaxy S25"]'::jsonb, 'SAM S24/SAM S25(玻璃0.25MM)'),
  ('box-68', 'BOX 68', 'Unknown', 'REDMI A5 4G (EU)', '["Redmi A5 4G", "Xiaomi Redmi A5 4G", "EU"]'::jsonb, 'REDMI A5 4G (EU)'),
  ('box-69', 'BOX 69', 'Unknown', 'SAM S24 PLUS/SAM S25 PLUS(玻璃0.25MM)', '["Samsung S24 PLUS", "Galaxy S24 PLUS", "Samsung S25 PLUS", "Galaxy S25 PLUS"]'::jsonb, 'SAM S24 PLUS/SAM S25 PLUS(玻璃0.25MM)'),
  ('box-70', 'BOX 70', 'Unknown', 'REDMI K30/RM 5G/RM K30S/RM K30 PRO/RM NOTE 9S/RM NOTE 9 PRO/RM NOTE 9 PRO MAX/RM NOTE 10 LITE', '["Redmi K30", "Xiaomi Redmi K30", "Redmi 5G", "Xiaomi Redmi 5G", "Redmi K30S", "Xiaomi Redmi K30S", "Redmi K30 PRO", "Xiaomi Redmi K30 PRO", "Redmi NOTE 9S", "Xiaomi Redmi NOTE 9S", "Redmi NOTE 9 PRO", "Xiaomi Redmi NOTE 9 PRO", "Redmi NOTE 9 PRO MAX", "Xiaomi Redmi NOTE 9 PRO MAX", "Redmi NOTE 10 LITE", "Xiaomi Redmi NOTE 10 LITE"]'::jsonb, 'REDMI K30/RM 5G/RM K30S/RM K30 PRO/RM NOTE 9S/RM NOTE 9
PRO/RM NOTE 9 PRO MAX/RM NOTE 10 LITE'),
  ('box-71', 'BOX 71', 'Unknown', 'SAM S24 ULTRA(玻璃0.25MM)', '["Samsung S24 ULTRA", "Galaxy S24 ULTRA"]'::jsonb, 'SAM S24 ULTRA(玻璃0.25MM)'),
  ('box-72', 'BOX 72', 'Unknown', 'REDMI K70/RM K70E/RM K70 PRO/RM K70 ULTRA/RM K80/RM K80 PRO', '["Redmi K70", "Xiaomi Redmi K70", "Redmi K70E", "Xiaomi Redmi K70E", "Redmi K70 PRO", "Xiaomi Redmi K70 PRO", "Redmi K70 ULTRA", "Xiaomi Redmi K70 ULTRA", "Redmi K80", "Xiaomi Redmi K80", "Redmi K80 PRO", "Xiaomi Redmi K80 PRO"]'::jsonb, 'REDMI K70/RM K70E/RM K70 PRO/RM K70 ULTRA/RM K80/RM K80
PRO'),
  ('box-73', 'BOX 73', 'Unknown', 'SAM S25 ULTRA(玻璃0.25MM)', '["Samsung S25 ULTRA", "Galaxy S25 ULTRA"]'::jsonb, 'SAM S25 ULTRA(玻璃0.25MM)'),
  ('box-74', 'BOX 74', 'Unknown', 'REDMI NOTE 10S/RM NOTE 10 4G /RM NOTE 11（2022)/RM NOTE 11S 2022/RM NOTE 11SE(INDIA)/RM NOTE 12S', '["Redmi NOTE 10S", "Xiaomi Redmi NOTE 10S", "Redmi NOTE 10 4G", "Xiaomi Redmi NOTE 10 4G", "Redmi NOTE 11（2022)", "Xiaomi Redmi NOTE 11（2022)", "Redmi NOTE 11S 2022", "Xiaomi Redmi NOTE 11S 2022", "Redmi NOTE 11SE", "Xiaomi Redmi NOTE 11SE", "INDIA", "Redmi NOTE 12S", "Xiaomi Redmi NOTE 12S"]'::jsonb, 'REDMI NOTE 10S/RM NOTE 10 4G /RM NOTE 11（2022)/RM NOTE
11S 2022/RM NOTE 11SE(INDIA)/RM NOTE 12S'),
  ('box-75', 'BOX 75', 'Unknown', 'SAM S25 EDGE 5G(玻璃0.25MM)', '["Samsung S25 EDGE 5G", "Galaxy S25 EDGE 5G"]'::jsonb, 'SAM S25 EDGE 5G(玻璃0.25MM)'),
  ('box-76', 'BOX 76', 'Unknown', 'SAM S26/S26 PRO(玻璃0.25MM)', '["Samsung S26", "Galaxy S26", "Samsung S26 PRO", "Galaxy S26 PRO"]'::jsonb, 'SAM S26/S26 PRO(玻璃0.25MM)'),
  ('box-77', 'BOX 77', 'Unknown', 'SAM S26 PLUS/S26 EDGE(玻璃0.25MM)', '["Samsung S26 PLUS", "Galaxy S26 PLUS", "Samsung S26 EDGE", "Galaxy S26 EDGE"]'::jsonb, 'SAM S26 PLUS/S26 EDGE(玻璃0.25MM)'),
  ('box-78', 'BOX 78', 'Unknown', 'REDMI NOTE 10 PRO/RM NOTE 10 PRO MAX/RM NOTE 11 PRO/RM NOTE 11 PRO+/RM NOTE 11E PRO/RM NOTE 13 4G/RM NOTE 14 (GLOBAL) 4G/RM NOTE 14 (GLOBAL) 5G/RM NOTE 14 (CHINA)/NOTE 14 SE/RM K40/RM K40S/RM K40 PRO+/RM K40 PRO/RM K50/RM K50 PRO/RM K60E', '["Redmi NOTE 10 PRO", "Xiaomi Redmi NOTE 10 PRO", "Redmi NOTE 10 PRO MAX", "Xiaomi Redmi NOTE 10 PRO MAX", "Redmi NOTE 11 PRO", "Xiaomi Redmi NOTE 11 PRO", "Redmi NOTE 11 PRO+", "Xiaomi Redmi NOTE 11 PRO+", "Redmi NOTE 11E PRO", "Xiaomi Redmi NOTE 11E PRO", "Redmi NOTE 13 4G", "Xiaomi Redmi NOTE 13 4G", "Redmi NOTE 14 (GLOBAL) 4G", "Xiaomi Redmi NOTE 14 (GLOBAL) 4G", "Redmi NOTE 14 (GLOBAL) 5G", "Xiaomi Redmi NOTE 14 (GLOBAL) 5G", "Redmi NOTE 14", "Xiaomi Redmi NOTE 14", "CHINA", "Redmi NOTE 14 SE", "Xiaomi Redmi NOTE 14 SE", "Redmi K40", "Xiaomi Redmi K40", "Redmi K40S", "Xiaomi Redmi K40S", "Redmi K40 PRO+", "Xiaomi Redmi K40 PRO+", "Redmi K40 PRO", "Xiaomi Redmi K40 PRO", "Redmi K50", "Xiaomi Redmi K50", "Redmi K50 PRO", "Xiaomi Redmi K50 PRO", "Redmi K60E", "Xiaomi Redmi K60E"]'::jsonb, 'REDMI NOTE 10 PRO/RM NOTE 10 PRO MAX/RM NOTE 11 PRO/RM
NOTE 11 PRO+/RM NOTE 11E PRO/RM NOTE 13 4G/RM NOTE 14
(GLOBAL) 4G/RM NOTE 14 (GLOBAL) 5G/RM NOTE 14 (CHINA)/NOTE
14 SE/RM K40/RM K40S/RM K40 PRO+/RM K40 PRO/RM K50/RM K50
PRO/RM K60E'),
  ('box-79', 'BOX 79', 'Unknown', 'SAM S26 ULTRA(玻璃0.25MM)', '["Samsung S26 ULTRA", "Galaxy S26 ULTRA"]'::jsonb, 'SAM S26 ULTRA(玻璃0.25MM)'),
  ('box-80', 'BOX 80', 'Unknown', 'REDMI NOTE 11 5G（China）/RM NOTE 11S 5G/RM NOTE 11T 5G', '["Redmi NOTE 11 5G（China）", "Xiaomi Redmi NOTE 11 5G（China）", "Redmi NOTE 11S 5G", "Xiaomi Redmi NOTE 11S 5G", "Redmi NOTE 11T 5G", "Xiaomi Redmi NOTE 11T 5G"]'::jsonb, 'REDMI NOTE 11 5G（China）/RM NOTE 11S 5G/RM NOTE 11T 5G'),
  ('box-81', 'BOX 81', 'Unknown', 'OPPO A53 4G/A11S/A32 4G/A33 2020/A36 4G/A53S 4G/A54 4G/A55 4G/A76 4G/A92S 5G/A96 4G/K10 CHINA/K10X 5G', '["OPPO A53 4G", "OPPO A11S", "OPPO A32 4G", "OPPO A33 2020", "OPPO A36 4G", "OPPO A53S 4G", "OPPO A54 4G", "OPPO A55 4G", "OPPO A76 4G", "OPPO A92S 5G", "OPPO A96 4G", "OPPO K10 CHINA", "OPPO K10X 5G"]'::jsonb, 'OPPO A53 4G/A11S/A32 4G/A33 2020/A36 4G/A53S 4G/A54 4G/A55 4G/A76
4G/A92S 5G/A96 4G/K10 CHINA/K10X 5G'),
  ('box-82', 'BOX 82', 'Unknown', 'REDMI NOTE 11T PRO/RM NOTE 11T PRO+/RM NOTE 12T PRO/RM K50i', '["Redmi NOTE 11T PRO", "Xiaomi Redmi NOTE 11T PRO", "Redmi NOTE 11T PRO+", "Xiaomi Redmi NOTE 11T PRO+", "Redmi NOTE 12T PRO", "Xiaomi Redmi NOTE 12T PRO", "Redmi K50i", "Xiaomi Redmi K50i"]'::jsonb, 'REDMI NOTE 11T PRO/RM NOTE 11T PRO+/RM NOTE 12T PRO/RM
K50i'),
  ('box-83', 'BOX 83', 'Unknown', 'OPPO A91/OP A73 4G/OP F15/OP F17/OP RENO 3 4G', '["OPPO A91", "OPPO A73 4G", "OPPO F15", "OPPO F17", "OPPO RENO 3 4G"]'::jsonb, 'OPPO A91/OP A73 4G/OP F15/OP F17/OP RENO 3 4G'),
  ('box-84', 'BOX 84', 'Unknown', 'REDMI NOTE 12 4G/RM NOTE 12 5G/RM NOTE 12R PRO', '["Redmi NOTE 12 4G", "Xiaomi Redmi NOTE 12 4G", "Redmi NOTE 12 5G", "Xiaomi Redmi NOTE 12 5G", "Redmi NOTE 12R PRO", "Xiaomi Redmi NOTE 12R PRO"]'::jsonb, 'REDMI NOTE 12 4G/RM NOTE 12 5G/RM NOTE 12R PRO'),
  ('box-85', 'BOX 85', 'Unknown', 'OPPO F11 PRO/OP K3/OP REAL X', '["OPPO F11 PRO", "OPPO K3", "OPPO REAL X"]'::jsonb, 'OPPO F11 PRO/OP K3/OP REAL X'),
  ('box-86', 'BOX 86', 'Unknown', 'REDMI NOTE 13 PRO 5G/RM TURBO 3/RM TURBO 4', '["Redmi NOTE 13 PRO 5G", "Xiaomi Redmi NOTE 13 PRO 5G", "Redmi TURBO 3", "Xiaomi Redmi TURBO 3", "Redmi TURBO 4", "Xiaomi Redmi TURBO 4"]'::jsonb, 'REDMI NOTE 13 PRO 5G/RM TURBO 3/RM TURBO 4'),
  ('box-87', 'BOX 87', 'Unknown', 'OPPO F29 5G', '["OPPO F29 5G"]'::jsonb, 'OPPO F29 5G'),
  ('box-88', 'BOX 88', 'Unknown', 'REDMI NOTE 6 PRO', '["Redmi NOTE 6 PRO", "Xiaomi Redmi NOTE 6 PRO"]'::jsonb, 'REDMI NOTE 6 PRO'),
  ('box-89', 'BOX 89', 'Unknown', 'OP F31 PRO+ 5G/OP A6 MAX /OP A6 GT/OP K13 TURBO/OP K13 TURBO PRO/FIND X9 ULTRA 5G', '["OPPO F31 PRO+ 5G", "OPPO A6 MAX", "OPPO A6 GT", "OPPO K13 TURBO", "OPPO K13 TURBO PRO", "OPPO FIND X9 ULTRA 5G"]'::jsonb, 'OP F31 PRO+ 5G/OP A6 MAX /OP A6 GT/OP K13 TURBO/OP K13 TURBO PRO/FIND X9
ULTRA 5G'),
  ('box-90', 'BOX 90', 'Unknown', 'REDMI NOTE 8', '["Redmi NOTE 8", "Xiaomi Redmi NOTE 8"]'::jsonb, 'REDMI NOTE 8'),
  ('box-91', 'BOX 91', 'Unknown', 'OPPO FIND X8/X8S+', '["OPPO FIND X8", "OPPO X8S+"]'::jsonb, 'OPPO FIND X8/X8S+'),
  ('box-92', 'BOX 92', 'Unknown', 'REDMI NOTE 8 PRO/RM NOTE 9 4G/RM 9 POWER/RM 9T', '["Redmi NOTE 8 PRO", "Xiaomi Redmi NOTE 8 PRO", "Redmi NOTE 9 4G", "Xiaomi Redmi NOTE 9 4G", "Redmi 9 POWER", "Xiaomi Redmi 9 POWER", "Redmi 9T", "Xiaomi Redmi 9T"]'::jsonb, 'REDMI NOTE 8 PRO/RM NOTE 9 4G/RM 9 POWER/RM 9T'),
  ('box-93', 'BOX 93', 'Unknown', 'OPPO FIND X8S', '["OPPO FIND X8S"]'::jsonb, 'OPPO FIND X8S'),
  ('box-94', 'BOX 94', 'Unknown', 'REDMI TURBO 4 PRO 5G/RM K80 ULTRA/NOTE 15 PRO(CHINA) /NOTE 15 PRO 5G(GIobaI)/RM TURBO 5 MAX/RM K90 MAX 5G（XIAOMI POC F7 5G）', '["Redmi TURBO 4 PRO 5G", "Xiaomi Redmi TURBO 4 PRO 5G", "Redmi K80 ULTRA", "Xiaomi Redmi K80 ULTRA", "Redmi NOTE 15 PRO", "Xiaomi Redmi NOTE 15 PRO", "CHINA", "Redmi NOTE 15 PRO 5G", "Xiaomi Redmi NOTE 15 PRO 5G", "GIobaI", "Redmi TURBO 5 MAX", "Xiaomi Redmi TURBO 5 MAX", "Redmi K90 MAX 5G（XIAOMI POC F7 5G）", "Xiaomi Redmi K90 MAX 5G（XIAOMI POC F7 5G）"]'::jsonb, 'REDMI TURBO 4 PRO 5G/RM K80 ULTRA/NOTE 15 PRO(CHINA) /NOTE
15 PRO 5G(GIobaI)/RM TURBO 5 MAX/RM K90 MAX 5G（XIAOMI
POC F7 5G）'),
  ('box-95', 'BOX 95', 'Unknown', 'OPPO RENO 13 5G国际版 /OP RENO 13 CHINA /RENO 14 5G/RENO 14F 5G/RENO 15 国外版/RENO 15 5G(INDIA)/RENO 15C/RENO 15FS/RENO 15F/OP RENO 15C INDIA/RENO16 F/RENO16 FS/OP F31 5G/F31 PRO 5G/OPPO A6 (CHINA)/A6 PRO CHINA/A6 PRO 4G/A6 PRO 5G/ OP A6 PRO/OP A6S PRO /OP F33 5G/F33 PRO 5G国际 版', '["OPPO RENO 13 5G国际版", "OPPO RENO 13 CHINA", "OPPO RENO 14 5G", "OPPO RENO 14F 5G", "OPPO RENO 15 国外版", "OPPO RENO 15 5G", "INDIA", "OPPO RENO 15C", "OPPO RENO 15FS", "OPPO RENO 15F", "OPPO RENO 15C INDIA", "OPPO RENO16 F", "OPPO RENO16 FS", "OPPO F31 5G", "OPPO F31 PRO 5G", "OPPO A6", "CHINA", "OPPO A6 PRO CHINA", "OPPO A6 PRO 4G", "OPPO A6 PRO 5G", "OPPO A6 PRO", "OPPO A6S PRO", "OPPO F33 5G", "OPPO F33 PRO 5G国际 版"]'::jsonb, 'OPPO RENO 13 5G国际版 /OP RENO 13 CHINA /RENO 14 5G/RENO 14F 5G/RENO 15
国外版/RENO 15 5G(INDIA)/RENO 15C/RENO 15FS/RENO 15F/OP RENO 15C
INDIA/RENO16 F/RENO16 FS/OP F31 5G/F31 PRO 5G/OPPO A6 (CHINA)/A6 PRO
CHINA/A6 PRO 4G/A6 PRO 5G/ OP A6 PRO/OP A6S PRO /OP F33 5G/F33 PRO 5G国际
版'),
  ('box-96', 'BOX 96', 'Unknown', 'REDMI 11 PRIME 4G/RM 11 PRIME 5G/RM A1/RM A1+/RM A2/RM A2+/RM 10 5G/RM 10X 5G/RM 10X PRO 5G/RM 10 PRIME+5G/RM NOTE 11E/RM NOTE 11R 5G（REAL 5)', '["Redmi 11 PRIME 4G", "Xiaomi Redmi 11 PRIME 4G", "Redmi 11 PRIME 5G", "Xiaomi Redmi 11 PRIME 5G", "Redmi A1", "Xiaomi Redmi A1", "Redmi A1+", "Xiaomi Redmi A1+", "Redmi A2", "Xiaomi Redmi A2", "Redmi A2+", "Xiaomi Redmi A2+", "Redmi 10 5G", "Xiaomi Redmi 10 5G", "Redmi 10X 5G", "Xiaomi Redmi 10X 5G", "Redmi 10X PRO 5G", "Xiaomi Redmi 10X PRO 5G", "Redmi 10 PRIME+5G", "Xiaomi Redmi 10 PRIME+5G", "Redmi NOTE 11E", "Xiaomi Redmi NOTE 11E", "Redmi NOTE 11R 5G（REAL 5)", "Xiaomi Redmi NOTE 11R 5G（REAL 5)"]'::jsonb, 'REDMI 11 PRIME 4G/RM 11 PRIME 5G/RM A1/RM A1+/RM A2/RM
A2+/RM 10 5G/RM 10X 5G/RM 10X PRO 5G/RM 10 PRIME+5G/RM
NOTE 11E/RM NOTE 11R 5G（REAL 5)'),
  ('box-97', 'BOX 97', 'Unknown', 'OPPO RENO 14 PRO 5G', '["OPPO RENO 14 PRO 5G"]'::jsonb, 'OPPO RENO 14 PRO 5G'),
  ('box-98', 'BOX 98', 'Unknown', 'OPPO RENO 15 5G(CHINA)/OP RENO 15 PRO MINI/OP RENO 15 PRO国外版/RENO 16/RENO 16 PRO', '["OPPO RENO 15 5G", "CHINA", "OPPO RENO 15 PRO MINI", "OPPO RENO 15 PRO国外版", "OPPO RENO 16", "OPPO RENO 16 PRO"]'::jsonb, 'OPPO RENO 15 5G(CHINA)/OP RENO 15 PRO MINI/OP RENO 15 PRO国外版/RENO
16/RENO 16 PRO'),
  ('box-99', 'BOX 99', 'Unknown', 'RM K9O PRO MAX(XM 17 PRO MAX)', '["Redmi K9O PRO MAX", "Xiaomi Redmi K9O PRO MAX", "XM 17 PRO MAX", "Xiaomi 17 PRO MAX"]'::jsonb, 'RM K9O PRO MAX(XM 17 PRO MAX)'),
  ('box-100', 'BOX 100', 'Unknown', 'OPPO FIND X9/FIND X9S/HONOR MAGIC 8', '["OPPO FIND X9", "OPPO FIND X9S", "Honor MAGIC 8"]'::jsonb, 'OPPO FIND X9/FIND X9S/HONOR MAGIC 8'),
  ('box-101', 'BOX 101', 'Unknown', 'REDMI NOTE 10 5G (REAL 6）', '["Redmi NOTE 10 5G (REAL 6）", "Xiaomi Redmi NOTE 10 5G (REAL 6）"]'::jsonb, 'REDMI NOTE 10 5G (REAL 6）'),
  ('box-102', 'BOX 102', 'Unknown', 'OP A6C 4G(GLOBAL) (REALME C83 5G)', '["OPPO A6C 4G", "GLOBAL) (REALME C83 5G"]'::jsonb, 'OP A6C 4G(GLOBAL) (REALME C83 5G)'),
  ('box-103', 'BOX 103', 'Unknown', 'REDMI K60/RM K60 PRO ( REAL GT2 PRO)', '["Redmi K60", "Xiaomi Redmi K60", "Redmi K60 PRO", "Xiaomi Redmi K60 PRO", "REAL GT2 PRO", "Realme GT2 PRO"]'::jsonb, 'REDMI K60/RM K60 PRO ( REAL GT2 PRO)'),
  ('box-104', 'BOX 104', 'Unknown', 'OP FIND X9S PRO 5G(1+15T)', '["OPPO FIND X9S PRO 5G", "1+15T"]'::jsonb, 'OP FIND X9S PRO 5G(1+15T)'),
  ('box-105', 'BOX 105', 'Unknown', 'REDMI K90/RM TURBO 5/(XM POC F8 PRO)', '["Redmi K90", "Xiaomi Redmi K90", "Redmi TURBO 5", "Xiaomi Redmi TURBO 5", "Redmi", "Xiaomi Redmi", "XM POC F8 PRO", "Xiaomi POC F8 PRO"]'::jsonb, 'REDMI K90/RM TURBO 5/(XM POC F8 PRO)'),
  ('box-106', 'BOX 106', 'Unknown', 'OPPO A6 4G/A6 5G/A6X 4G/A6X 5G/C85 4G/OP A6S 4G/A6S 5G /OP A6T 4G/OP A6T 5G/OP A6T PRO 4G/OP A6C/ A6 PRO INDIA/OP K14X 5G/VO T5X 5G (REALME 15X (INDIA)/REALME C85)', '["OPPO A6 4G", "OPPO A6 5G", "OPPO A6X 4G", "OPPO A6X 5G", "OPPO C85 4G", "OPPO A6S 4G", "OPPO A6S 5G", "OPPO A6T 4G", "OPPO A6T 5G", "OPPO A6T PRO 4G", "OPPO A6C", "OPPO A6 PRO INDIA", "OPPO K14X 5G", "Vivo T5X 5G", "REALME 15X (INDIA", "Realme 15X (INDIA", "Realme C85)"]'::jsonb, 'OPPO A6 4G/A6 5G/A6X 4G/A6X 5G/C85 4G/OP A6S 4G/A6S 5G /OP A6T 4G/OP A6T
5G/OP A6T PRO 4G/OP A6C/ A6 PRO INDIA/OP K14X 5G/VO T5X 5G (REALME 15X
(INDIA)/REALME C85)')
ON CONFLICT (id) DO UPDATE SET
  box_number   = EXCLUDED.box_number,
  display_size = EXCLUDED.display_size,
  title        = EXCLUDED.title,
  models       = EXCLUDED.models,
  raw_text     = EXCLUDED.raw_text,
  updated_at   = now();

-- Verify: should return 106
SELECT COUNT(*) AS total_boxes FROM screenguards;