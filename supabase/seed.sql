-- ============================================================================
-- HMART Seed Data: Full product catalog with hierarchical categories
-- Housekeeping, Stationery, Safety, Security, Office Pantry, Sports
-- ============================================================================

begin;

-- ─── Top-level Categories ───────────────────────────────────────────────────

insert into public.categories (id, name, slug, description, sort_order, is_active)
values
  ('ca000001-0000-0000-0000-000000000001', 'Housekeeping', 'housekeeping', 'Cleaning chemicals, tools, waste management, and PPE for facility maintenance.', 1, true),
  ('ca000001-0000-0000-0000-000000000002', 'Stationery', 'stationery', 'Writing tools, paper products, office supplies, and art materials.', 2, true),
  ('ca000001-0000-0000-0000-000000000003', 'Safety', 'safety', 'Personal protective equipment, industrial safety, and road safety gear.', 3, true),
  ('ca000001-0000-0000-0000-000000000004', 'Security', 'security', 'CCTV, smart locks, alarm systems, and surveillance equipment.', 4, true),
  ('ca000001-0000-0000-0000-000000000005', 'Office Pantry', 'office-pantry', 'Beverages, snacks, and refreshments for the workplace.', 5, true),
  ('ca000001-0000-0000-0000-000000000006', 'Sports', 'sports', 'Team sports, fitness equipment, protective gear, and apparel.', 6, true)
on conflict (id) do nothing;

-- ─── Sub-categories (parent_id references top-level) ────────────────────────

insert into public.categories (id, parent_id, name, slug, description, sort_order, is_active)
values
  -- Housekeeping subs
  ('ca000002-0000-0000-0000-000000000001', 'ca000001-0000-0000-0000-000000000001', 'Cleaning Chemicals & Solutions', 'cleaning-chemicals', 'Disinfectants, sanitizers, floor cleaners, and degreasers.', 1, true),
  ('ca000002-0000-0000-0000-000000000002', 'ca000001-0000-0000-0000-000000000001', 'Cleaning Tools & Equipment', 'cleaning-tools', 'Brooms, mops, brushes, vacuum cleaners, and trolleys.', 2, true),
  ('ca000002-0000-0000-0000-000000000003', 'ca000001-0000-0000-0000-000000000001', 'Waste Management', 'waste-management', 'Dustbins, trash bags, and toilet paper.', 3, true),
  ('ca000002-0000-0000-0000-000000000004', 'ca000001-0000-0000-0000-000000000001', 'Housekeeping PPE', 'housekeeping-ppe', 'Gloves and masks for cleaning staff.', 4, true),
  -- Stationery subs
  ('ca000002-0000-0000-0000-000000000005', 'ca000001-0000-0000-0000-000000000002', 'Writing Tools', 'writing-tools', 'Pens, pencils, markers, and highlighters.', 1, true),
  ('ca000002-0000-0000-0000-000000000006', 'ca000001-0000-0000-0000-000000000002', 'Paper Products', 'paper-products', 'Notebooks, envelopes, sticky notes, and letterheads.', 2, true),
  ('ca000002-0000-0000-0000-000000000007', 'ca000001-0000-0000-0000-000000000002', 'Office Supplies', 'office-supplies', 'Staplers, clips, tape, scissors, folders, and binders.', 3, true),
  ('ca000002-0000-0000-0000-000000000008', 'ca000001-0000-0000-0000-000000000002', 'Desk Accessories', 'desk-accessories', 'Pencil cases, sharpeners, erasers, and organizers.', 4, true),
  ('ca000002-0000-0000-0000-000000000009', 'ca000001-0000-0000-0000-000000000002', 'Art Supplies', 'art-supplies', 'Paints, brushes, crayons, and colored pencils.', 5, true),
  -- Safety subs
  ('ca000002-0000-0000-0000-00000000000a', 'ca000001-0000-0000-0000-000000000003', 'Personal Protective Equipment', 'personal-protective-equipment', 'Hard hats, goggles, respirators, safety shoes, and coveralls.', 1, true),
  ('ca000002-0000-0000-0000-00000000000b', 'ca000001-0000-0000-0000-000000000003', 'Industrial Safety', 'industrial-safety', 'Harnesses, fire extinguishers, smoke detectors, and spill kits.', 2, true),
  ('ca000002-0000-0000-0000-00000000000c', 'ca000001-0000-0000-0000-000000000003', 'Road Safety', 'road-safety', 'Traffic cones, barricade tape, reflective jackets, and first aid.', 3, true),
  -- Sports subs
  ('ca000002-0000-0000-0000-00000000000d', 'ca000001-0000-0000-0000-000000000006', 'Team Sports', 'team-sports', 'Football, basketball, volleyball, and cricket equipment.', 1, true),
  ('ca000002-0000-0000-0000-00000000000e', 'ca000001-0000-0000-0000-000000000006', 'Fitness', 'fitness', 'Dumbbells, yoga mats, resistance bands, and barbells.', 2, true),
  ('ca000002-0000-0000-0000-00000000000f', 'ca000001-0000-0000-0000-000000000006', 'Protective Gear', 'protective-gear', 'Sports helmets, pads, and mouth guards.', 3, true),
  ('ca000002-0000-0000-0000-000000000010', 'ca000001-0000-0000-0000-000000000006', 'Sports Apparel', 'sports-apparel', 'Jerseys, running shoes, and gym bags.', 4, true),
  -- Office Pantry subs
  ('ca000002-0000-0000-0000-000000000011', 'ca000001-0000-0000-0000-000000000005', 'Beverages', 'beverages', 'Coffee, tea, milk, water, and juices.', 1, true),
  ('ca000002-0000-0000-0000-000000000012', 'ca000001-0000-0000-0000-000000000005', 'Snacks', 'snacks', 'Protein bars, nuts, cookies, biscuits, and chips.', 2, true)
on conflict (id) do nothing;

-- ─── Products ───────────────────────────────────────────────────────────────

insert into public.products (id, primary_category_id, name, slug, description, brand, status)
values
  -- ═══ HOUSEKEEPING ═══
  -- Cleaning Chemicals
  ('aa000001-0000-0000-0000-000000000001', 'ca000002-0000-0000-0000-000000000001', 'Lizol Disinfectant Floor Cleaner 1L', 'lizol-disinfectant-1l', 'Kills 99.9% germs on floors. Citrus fragrance for lasting freshness.', 'Lizol', 'active'),
  ('aa000001-0000-0000-0000-000000000002', 'ca000002-0000-0000-0000-000000000001', 'Dettol Surface Sanitizer 500ml', 'dettol-surface-sanitizer-500ml', 'Multi-surface disinfectant spray. No rinse required.', 'Dettol', 'active'),
  ('aa000001-0000-0000-0000-000000000003', 'ca000002-0000-0000-0000-000000000001', 'Harpic Toilet Cleaner 750ml', 'harpic-toilet-cleaner-750ml', 'Thick formula clings to bowl surface. Removes tough stains and limescale.', 'Harpic', 'active'),
  ('aa000001-0000-0000-0000-000000000004', 'ca000002-0000-0000-0000-000000000001', 'Colin Glass Cleaner 500ml', 'colin-glass-cleaner-500ml', 'Streak-free shine on glass and mirrors. Ammonia-based formula.', 'Colin', 'active'),
  ('aa000001-0000-0000-0000-000000000005', 'ca000002-0000-0000-0000-000000000001', 'Odonil Room Freshener 250ml', 'odonil-room-freshener-250ml', 'Long-lasting fragrance blocks for bathrooms and small rooms.', 'Odonil', 'active'),
  -- Cleaning Tools
  ('aa000001-0000-0000-0000-000000000006', 'ca000002-0000-0000-0000-000000000002', 'Scotch-Brite Flat Mop Set', 'scotch-brite-flat-mop', 'Microfiber flat mop with bucket and wringer. 360-degree rotation.', 'Scotch-Brite', 'active'),
  ('aa000001-0000-0000-0000-000000000007', 'ca000002-0000-0000-0000-000000000002', 'Gala No Dust Broom', 'gala-no-dust-broom', 'Floor broom with long bristles for effective sweeping without dust clouds.', 'Gala', 'active'),
  ('aa000001-0000-0000-0000-000000000008', 'ca000002-0000-0000-0000-000000000002', 'Microfiber Cloth (Pack of 5)', 'microfiber-cloth-5pk', 'Super absorbent multi-purpose cleaning cloths. Machine washable.', 'Gala', 'active'),
  ('aa000001-0000-0000-0000-000000000009', 'ca000002-0000-0000-0000-000000000002', 'Spray Bottle 500ml (Pack of 3)', 'spray-bottle-3pk', 'Durable trigger spray bottles for cleaning solutions. Adjustable nozzle.', 'Generic', 'active'),
  -- Waste Management
  ('aa000001-0000-0000-0000-00000000000a', 'ca000002-0000-0000-0000-000000000003', 'Dustbin 60L Pedal Type', 'dustbin-60l-pedal', 'Stainless steel pedal dustbin with removable inner bucket.', 'Parasnath', 'active'),
  ('aa000001-0000-0000-0000-00000000000b', 'ca000002-0000-0000-0000-000000000003', 'Garbage Bags Large (Pack of 30)', 'garbage-bags-large-30pk', 'Heavy-duty biodegradable trash bags. 25x30 inch.', 'Ezee', 'active'),
  ('aa000001-0000-0000-0000-00000000000c', 'ca000002-0000-0000-0000-000000000003', 'Toilet Paper Roll (Pack of 12)', 'toilet-paper-12pk', 'Soft 2-ply toilet tissue rolls. 200 sheets each.', 'Origami', 'active'),
  -- Housekeeping PPE
  ('aa000001-0000-0000-0000-00000000000d', 'ca000002-0000-0000-0000-000000000004', 'Latex Gloves Medium (Pack of 50)', 'latex-gloves-50pk', 'Powder-free disposable latex gloves for cleaning tasks.', 'Safeguard', 'active'),
  ('aa000001-0000-0000-0000-00000000000e', 'ca000002-0000-0000-0000-000000000004', '3-Ply Face Mask (Pack of 50)', '3ply-mask-50pk', 'Disposable surgical masks with nose wire and ear loops.', 'Medi Plus', 'active'),

  -- ═══ STATIONERY ═══
  -- Writing Tools
  ('aa000001-0000-0000-0000-00000000000f', 'ca000002-0000-0000-0000-000000000005', 'Cello Pinpoint Ball Pen (Pack of 10)', 'cello-pinpoint-10pk', 'Fine tip 0.7mm blue ball pens. Smooth ink flow.', 'Cello', 'active'),
  ('aa000001-0000-0000-0000-000000000010', 'ca000002-0000-0000-0000-000000000005', 'Apsara Platinum Pencil (Pack of 10)', 'apsara-platinum-10pk', 'Extra-dark HB pencils with eraser tip. Break-resistant.', 'Apsara', 'active'),
  ('aa000001-0000-0000-0000-000000000011', 'ca000002-0000-0000-0000-000000000005', 'Camlin Permanent Marker (Pack of 4)', 'camlin-marker-4pk', 'Black permanent markers. Quick-dry, fade-resistant ink.', 'Camlin', 'active'),
  ('aa000001-0000-0000-0000-000000000012', 'ca000002-0000-0000-0000-000000000005', 'Luxor Highlighter Set (5 Colors)', 'luxor-highlighter-5pk', 'Chisel-tip fluorescent highlighters. Smudge-proof.', 'Luxor', 'active'),
  -- Paper Products
  ('aa000001-0000-0000-0000-000000000013', 'ca000002-0000-0000-0000-000000000006', 'Classmate Notebook 180 Pages', 'classmate-notebook-180pg', 'Single-line ruled long notebook. Smooth writing paper.', 'Classmate', 'active'),
  ('aa000001-0000-0000-0000-000000000014', 'ca000002-0000-0000-0000-000000000006', 'Yellow Sticky Notes 3x3 (Pack of 5)', 'sticky-notes-5pk', '100 sheets per pad. Re-stickable adhesive.', 'Oddy', 'active'),
  ('aa000001-0000-0000-0000-000000000015', 'ca000002-0000-0000-0000-000000000006', 'A4 White Envelopes (Pack of 50)', 'a4-envelopes-50pk', 'Self-seal white envelopes. 100 GSM paper.', 'Superfine', 'active'),
  -- Office Supplies
  ('aa000001-0000-0000-0000-000000000016', 'ca000002-0000-0000-0000-000000000007', 'Kangaro Stapler No.10', 'kangaro-stapler-no10', 'Desktop stapler with 20-sheet capacity. Includes 1000 pins.', 'Kangaro', 'active'),
  ('aa000001-0000-0000-0000-000000000017', 'ca000002-0000-0000-0000-000000000007', 'Scotch Tape 1-inch (Pack of 6)', 'scotch-tape-6pk', 'Crystal clear adhesive tape. 25m rolls.', '3M Scotch', 'active'),
  ('aa000001-0000-0000-0000-000000000018', 'ca000002-0000-0000-0000-000000000007', 'Paper Clips Assorted (Pack of 100)', 'paper-clips-100pk', 'Rust-free metal paper clips in assorted sizes.', 'Kangaroo', 'active'),
  ('aa000001-0000-0000-0000-000000000019', 'ca000002-0000-0000-0000-000000000007', 'Fevicol MR White Glue 200g', 'fevicol-mr-200g', 'Non-toxic white adhesive for paper and craft projects.', 'Fevicol', 'active'),

  -- ═══ SAFETY ═══
  -- PPE
  ('aa000001-0000-0000-0000-00000000001a', 'ca000002-0000-0000-0000-00000000000a', 'Karam Safety Helmet (White)', 'karam-helmet-white', 'ISI-certified industrial hard hat. Adjustable ratchet suspension.', 'Karam', 'active'),
  ('aa000001-0000-0000-0000-00000000001b', 'ca000002-0000-0000-0000-00000000000a', 'Venus Safety Goggles', 'venus-safety-goggles', 'Anti-fog polycarbonate lens. Chemical splash protection.', 'Venus', 'active'),
  ('aa000001-0000-0000-0000-00000000001c', 'ca000002-0000-0000-0000-00000000000a', '3M N95 Respirator Mask (Pack of 5)', '3m-n95-mask-5pk', '5-layer NIOSH-approved respirator. Valve for easy breathing.', '3M', 'active'),
  ('aa000001-0000-0000-0000-00000000001d', 'ca000002-0000-0000-0000-00000000000a', 'Mallcom Safety Shoes Size 9', 'mallcom-safety-shoes-9', 'Steel-toe work boots. Anti-slip, oil-resistant sole.', 'Mallcom', 'active'),
  ('aa000001-0000-0000-0000-00000000001e', 'ca000002-0000-0000-0000-00000000000a', 'Nitrile Gloves (Pack of 100)', 'nitrile-gloves-100pk', 'Powder-free, chemical-resistant disposable gloves.', 'Safeguard', 'active'),
  -- Industrial Safety
  ('aa000001-0000-0000-0000-00000000001f', 'ca000002-0000-0000-0000-00000000000b', 'ABC Fire Extinguisher 4kg', 'fire-extinguisher-4kg', 'Multi-purpose dry chemical extinguisher. ISI certified.', 'Ceasefire', 'active'),
  ('aa000001-0000-0000-0000-000000000020', 'ca000002-0000-0000-0000-00000000000b', 'Smoke Detector (Battery Operated)', 'smoke-detector-battery', 'Photoelectric smoke alarm with 9V battery. Loud 85dB alert.', 'Honeywell', 'active'),
  ('aa000001-0000-0000-0000-000000000021', 'ca000002-0000-0000-0000-00000000000b', 'Oil Spill Kit 20L', 'oil-spill-kit-20l', 'Absorbent pads, socks, and disposal bags for oil spills.', 'Brady', 'active'),
  -- Road Safety
  ('aa000001-0000-0000-0000-000000000022', 'ca000002-0000-0000-0000-00000000000c', 'Traffic Cone 750mm', 'traffic-cone-750mm', 'PVC reflective traffic cone. UV-stabilized, stackable.', 'Supreme', 'active'),
  ('aa000001-0000-0000-0000-000000000023', 'ca000002-0000-0000-0000-00000000000c', 'Reflective Safety Jacket (Fluorescent)', 'reflective-jacket', 'High-visibility vest with 2-inch reflective strips. One-size.', 'Laxmi', 'active'),
  ('aa000001-0000-0000-0000-000000000024', 'ca000002-0000-0000-0000-00000000000c', 'First Aid Kit (Workplace)', 'first-aid-kit-workplace', 'Wall-mountable kit with bandages, antiseptic, scissors, and more.', 'St John', 'active'),

  -- ═══ SECURITY ═══
  ('aa000001-0000-0000-0000-000000000025', 'ca000001-0000-0000-0000-000000000004', 'CP Plus Dome CCTV Camera 2MP', 'cpplus-dome-camera-2mp', 'Indoor dome camera with night vision. 1080p full HD.', 'CP Plus', 'active'),
  ('aa000001-0000-0000-0000-000000000026', 'ca000001-0000-0000-0000-000000000004', 'Godrej Smart Lock (Biometric)', 'godrej-smart-lock', 'Fingerprint + PIN digital door lock. Battery backup.', 'Godrej', 'active'),
  ('aa000001-0000-0000-0000-000000000027', 'ca000001-0000-0000-0000-000000000004', 'Hikvision 4-Channel DVR System', 'hikvision-4ch-dvr', '4-channel DVR with 1TB HDD. Remote mobile viewing.', 'Hikvision', 'active'),
  ('aa000001-0000-0000-0000-000000000028', 'ca000001-0000-0000-0000-000000000004', 'Motion Sensor Alarm', 'motion-sensor-alarm', 'Infrared PIR motion detector. 120-degree coverage, 8m range.', 'Securico', 'active'),
  ('aa000001-0000-0000-0000-000000000029', 'ca000001-0000-0000-0000-000000000004', 'Walkie Talkie Set (Pair)', 'walkie-talkie-pair', 'Long-range 5km UHF radio set. Rechargeable batteries included.', 'Motorola', 'active'),

  -- ═══ OFFICE PANTRY ═══
  -- Beverages
  ('aa000001-0000-0000-0000-00000000002a', 'ca000002-0000-0000-0000-000000000011', 'Nescafe Classic Coffee 200g', 'nescafe-classic-200g', 'Instant coffee with bold roasted flavour. 100% pure coffee.', 'Nescafe', 'active'),
  ('aa000001-0000-0000-0000-00000000002b', 'ca000002-0000-0000-0000-000000000011', 'Tata Tea Premium 500g', 'tata-tea-premium-500g', 'Strong CTC tea with 15% long leaves for rich flavour.', 'Tata Tea', 'active'),
  ('aa000001-0000-0000-0000-00000000002c', 'ca000002-0000-0000-0000-000000000011', 'Amul Taaza Milk 1L', 'amul-taaza-milk-1l', 'Homogenized toned milk. Fresh daily, ideal for tea and coffee.', 'Amul', 'active'),
  ('aa000001-0000-0000-0000-00000000002d', 'ca000002-0000-0000-0000-000000000011', 'Bisleri Water 1L (Pack of 12)', 'bisleri-water-12pk', 'Purified drinking water. 10-step purification process.', 'Bisleri', 'active'),
  ('aa000001-0000-0000-0000-00000000002e', 'ca000002-0000-0000-0000-000000000011', 'Real Mixed Fruit Juice 1L', 'real-juice-1l', 'No added sugar fruit juice blend. Rich in vitamins.', 'Real', 'active'),
  -- Snacks
  ('aa000001-0000-0000-0000-00000000002f', 'ca000002-0000-0000-0000-000000000012', 'Yoga Bar Protein Bar (Pack of 6)', 'yoga-bar-protein-6pk', '20g protein per bar. Almond fudge flavour. No preservatives.', 'Yoga Bar', 'active'),
  ('aa000001-0000-0000-0000-000000000030', 'ca000002-0000-0000-0000-000000000012', 'Happilo Almonds 200g', 'happilo-almonds-200g', 'Premium California almonds. Rich in Vitamin E and fiber.', 'Happilo', 'active'),
  ('aa000001-0000-0000-0000-000000000031', 'ca000002-0000-0000-0000-000000000012', 'Parle-G Gold Biscuits 1kg', 'parle-g-gold-1kg', 'Premium glucose biscuits with extra milk. Value pack.', 'Parle', 'active'),
  ('aa000001-0000-0000-0000-000000000032', 'ca000002-0000-0000-0000-000000000012', 'Lays Classic Salted 52g (Pack of 10)', 'lays-classic-10pk', 'Crispy potato chips. Perfect for tea-time snacking.', 'Lays', 'active'),

  -- ═══ SPORTS ═══
  -- Team Sports
  ('aa000001-0000-0000-0000-000000000033', 'ca000002-0000-0000-0000-00000000000d', 'Nivia Storm Football Size 5', 'nivia-storm-football-5', 'Machine-stitched PVC football. FIFA basic certified.', 'Nivia', 'active'),
  ('aa000001-0000-0000-0000-000000000034', 'ca000002-0000-0000-0000-00000000000d', 'Cosco Basketball Size 7', 'cosco-basketball-7', 'Composite leather outdoor basketball. Official size and weight.', 'Cosco', 'active'),
  ('aa000001-0000-0000-0000-000000000035', 'ca000002-0000-0000-0000-00000000000d', 'SG Cricket Bat (Kashmir Willow)', 'sg-cricket-bat-kashmir', 'Full-size Kashmir willow bat. Short handle, thick edges.', 'SG', 'active'),
  -- Fitness
  ('aa000001-0000-0000-0000-000000000036', 'ca000002-0000-0000-0000-00000000000e', 'Kore PVC Dumbbell Set 10kg', 'kore-dumbbell-10kg', 'PVC-coated dumbbells with anti-slip grip. 2x5kg set.', 'Kore', 'active'),
  ('aa000001-0000-0000-0000-000000000037', 'ca000002-0000-0000-0000-00000000000e', 'Boldfit Yoga Mat 6mm', 'boldfit-yoga-mat-6mm', 'Anti-slip EVA foam mat. Lightweight and portable.', 'Boldfit', 'active'),
  ('aa000001-0000-0000-0000-000000000038', 'ca000002-0000-0000-0000-00000000000e', 'Resistance Bands Set (5 Levels)', 'resistance-bands-5pk', 'Latex-free exercise bands. Light to extra-heavy.', 'Boldfit', 'active'),
  -- Protective Gear
  ('aa000001-0000-0000-0000-000000000039', 'ca000002-0000-0000-0000-00000000000f', 'Yonex Badminton Shoes Size 9', 'yonex-shoes-9', 'Non-marking sole with power cushion technology.', 'Yonex', 'active'),
  ('aa000001-0000-0000-0000-00000000003a', 'ca000002-0000-0000-0000-00000000000f', 'SG Cricket Helmet (Medium)', 'sg-cricket-helmet-m', 'Steel grille face guard. High-density foam padding.', 'SG', 'active')
on conflict (id) do nothing;

-- ─── Product Variants ───────────────────────────────────────────────────────

insert into public.product_variants (id, product_id, sku, unit, price, is_active)
values
  -- Housekeeping - Chemicals
  ('bb000001-0000-0000-0000-000000000001', 'aa000001-0000-0000-0000-000000000001', 'HK-LZL-1L', '1 L', 185.00, true),
  ('bb000001-0000-0000-0000-000000000002', 'aa000001-0000-0000-0000-000000000002', 'HK-DET-500', '500 ml', 215.00, true),
  ('bb000001-0000-0000-0000-000000000003', 'aa000001-0000-0000-0000-000000000003', 'HK-HRP-750', '750 ml', 125.00, true),
  ('bb000001-0000-0000-0000-000000000004', 'aa000001-0000-0000-0000-000000000004', 'HK-CLN-500', '500 ml', 99.00, true),
  ('bb000001-0000-0000-0000-000000000005', 'aa000001-0000-0000-0000-000000000005', 'HK-ODN-250', '250 ml', 75.00, true),
  -- Housekeeping - Tools
  ('bb000001-0000-0000-0000-000000000006', 'aa000001-0000-0000-0000-000000000006', 'HK-MOP-SET', '1 set', 1299.00, true),
  ('bb000001-0000-0000-0000-000000000007', 'aa000001-0000-0000-0000-000000000007', 'HK-BRM-001', '1 pc', 249.00, true),
  ('bb000001-0000-0000-0000-000000000008', 'aa000001-0000-0000-0000-000000000008', 'HK-MCF-5PK', '5 pcs', 199.00, true),
  ('bb000001-0000-0000-0000-000000000009', 'aa000001-0000-0000-0000-000000000009', 'HK-SPR-3PK', '3 pcs', 149.00, true),
  -- Waste Management
  ('bb000001-0000-0000-0000-00000000000a', 'aa000001-0000-0000-0000-00000000000a', 'HK-BIN-60L', '1 pc', 1850.00, true),
  ('bb000001-0000-0000-0000-00000000000b', 'aa000001-0000-0000-0000-00000000000b', 'HK-BAG-30P', '30 pcs', 120.00, true),
  ('bb000001-0000-0000-0000-00000000000c', 'aa000001-0000-0000-0000-00000000000c', 'HK-TPR-12P', '12 rolls', 320.00, true),
  -- Housekeeping PPE
  ('bb000001-0000-0000-0000-00000000000d', 'aa000001-0000-0000-0000-00000000000d', 'HK-GLV-50P', '50 pcs', 350.00, true),
  ('bb000001-0000-0000-0000-00000000000e', 'aa000001-0000-0000-0000-00000000000e', 'HK-MSK-50P', '50 pcs', 199.00, true),

  -- Stationery - Writing
  ('bb000001-0000-0000-0000-00000000000f', 'aa000001-0000-0000-0000-00000000000f', 'ST-PEN-10P', '10 pcs', 80.00, true),
  ('bb000001-0000-0000-0000-000000000010', 'aa000001-0000-0000-0000-000000000010', 'ST-PCL-10P', '10 pcs', 45.00, true),
  ('bb000001-0000-0000-0000-000000000011', 'aa000001-0000-0000-0000-000000000011', 'ST-MRK-4PK', '4 pcs', 160.00, true),
  ('bb000001-0000-0000-0000-000000000012', 'aa000001-0000-0000-0000-000000000012', 'ST-HLT-5PK', '5 pcs', 125.00, true),
  -- Stationery - Paper
  ('bb000001-0000-0000-0000-000000000013', 'aa000001-0000-0000-0000-000000000013', 'ST-NTB-180', '180 pages', 60.00, true),
  ('bb000001-0000-0000-0000-000000000014', 'aa000001-0000-0000-0000-000000000014', 'ST-STK-5PK', '5 pads', 110.00, true),
  ('bb000001-0000-0000-0000-000000000015', 'aa000001-0000-0000-0000-000000000015', 'ST-ENV-50P', '50 pcs', 180.00, true),
  -- Stationery - Office Supplies
  ('bb000001-0000-0000-0000-000000000016', 'aa000001-0000-0000-0000-000000000016', 'ST-STP-N10', '1 pc', 195.00, true),
  ('bb000001-0000-0000-0000-000000000017', 'aa000001-0000-0000-0000-000000000017', 'ST-TPE-6PK', '6 rolls', 210.00, true),
  ('bb000001-0000-0000-0000-000000000018', 'aa000001-0000-0000-0000-000000000018', 'ST-CLP-100', '100 pcs', 35.00, true),
  ('bb000001-0000-0000-0000-000000000019', 'aa000001-0000-0000-0000-000000000019', 'ST-FEV-200', '200 g', 45.00, true),

  -- Safety - PPE
  ('bb000001-0000-0000-0000-00000000001a', 'aa000001-0000-0000-0000-00000000001a', 'SF-HLM-WHT', '1 pc', 450.00, true),
  ('bb000001-0000-0000-0000-00000000001b', 'aa000001-0000-0000-0000-00000000001b', 'SF-GOG-001', '1 pc', 320.00, true),
  ('bb000001-0000-0000-0000-00000000001c', 'aa000001-0000-0000-0000-00000000001c', 'SF-N95-5PK', '5 pcs', 650.00, true),
  ('bb000001-0000-0000-0000-00000000001d', 'aa000001-0000-0000-0000-00000000001d', 'SF-SHO-S09', '1 pair', 2100.00, true),
  ('bb000001-0000-0000-0000-00000000001e', 'aa000001-0000-0000-0000-00000000001e', 'SF-NGL-100', '100 pcs', 550.00, true),
  -- Safety - Industrial
  ('bb000001-0000-0000-0000-00000000001f', 'aa000001-0000-0000-0000-00000000001f', 'SF-FEX-4KG', '4 kg', 1850.00, true),
  ('bb000001-0000-0000-0000-000000000020', 'aa000001-0000-0000-0000-000000000020', 'SF-SMK-001', '1 pc', 890.00, true),
  ('bb000001-0000-0000-0000-000000000021', 'aa000001-0000-0000-0000-000000000021', 'SF-SPL-20L', '1 kit', 3500.00, true),
  -- Safety - Road
  ('bb000001-0000-0000-0000-000000000022', 'aa000001-0000-0000-0000-000000000022', 'SF-CON-750', '1 pc', 350.00, true),
  ('bb000001-0000-0000-0000-000000000023', 'aa000001-0000-0000-0000-000000000023', 'SF-JKT-REF', '1 pc', 280.00, true),
  ('bb000001-0000-0000-0000-000000000024', 'aa000001-0000-0000-0000-000000000024', 'SF-FAK-WRK', '1 kit', 1250.00, true),

  -- Security
  ('bb000001-0000-0000-0000-000000000025', 'aa000001-0000-0000-0000-000000000025', 'SC-CAM-2MP', '1 pc', 2450.00, true),
  ('bb000001-0000-0000-0000-000000000026', 'aa000001-0000-0000-0000-000000000026', 'SC-LCK-BIO', '1 pc', 8999.00, true),
  ('bb000001-0000-0000-0000-000000000027', 'aa000001-0000-0000-0000-000000000027', 'SC-DVR-4CH', '1 set', 12500.00, true),
  ('bb000001-0000-0000-0000-000000000028', 'aa000001-0000-0000-0000-000000000028', 'SC-MOT-ALM', '1 pc', 750.00, true),
  ('bb000001-0000-0000-0000-000000000029', 'aa000001-0000-0000-0000-000000000029', 'SC-WLK-PAR', '1 pair', 3200.00, true),

  -- Office Pantry - Beverages
  ('bb000001-0000-0000-0000-00000000002a', 'aa000001-0000-0000-0000-00000000002a', 'OP-COF-200', '200 g', 420.00, true),
  ('bb000001-0000-0000-0000-00000000002b', 'aa000001-0000-0000-0000-00000000002b', 'OP-TEA-500', '500 g', 290.00, true),
  ('bb000001-0000-0000-0000-00000000002c', 'aa000001-0000-0000-0000-00000000002c', 'OP-MLK-1L', '1 L', 58.00, true),
  ('bb000001-0000-0000-0000-00000000002d', 'aa000001-0000-0000-0000-00000000002d', 'OP-WTR-12P', '12 x 1L', 240.00, true),
  ('bb000001-0000-0000-0000-00000000002e', 'aa000001-0000-0000-0000-00000000002e', 'OP-JUC-1L', '1 L', 110.00, true),
  -- Office Pantry - Snacks
  ('bb000001-0000-0000-0000-00000000002f', 'aa000001-0000-0000-0000-00000000002f', 'OP-BAR-6PK', '6 bars', 540.00, true),
  ('bb000001-0000-0000-0000-000000000030', 'aa000001-0000-0000-0000-000000000030', 'OP-ALM-200', '200 g', 320.00, true),
  ('bb000001-0000-0000-0000-000000000031', 'aa000001-0000-0000-0000-000000000031', 'OP-BSC-1KG', '1 kg', 150.00, true),
  ('bb000001-0000-0000-0000-000000000032', 'aa000001-0000-0000-0000-000000000032', 'OP-CHP-10P', '10 x 52g', 200.00, true),

  -- Sports - Team
  ('bb000001-0000-0000-0000-000000000033', 'aa000001-0000-0000-0000-000000000033', 'SP-FBL-S05', '1 pc', 699.00, true),
  ('bb000001-0000-0000-0000-000000000034', 'aa000001-0000-0000-0000-000000000034', 'SP-BBL-S07', '1 pc', 850.00, true),
  ('bb000001-0000-0000-0000-000000000035', 'aa000001-0000-0000-0000-000000000035', 'SP-BAT-KSH', '1 pc', 1450.00, true),
  -- Sports - Fitness
  ('bb000001-0000-0000-0000-000000000036', 'aa000001-0000-0000-0000-000000000036', 'SP-DMB-10K', '1 set', 999.00, true),
  ('bb000001-0000-0000-0000-000000000037', 'aa000001-0000-0000-0000-000000000037', 'SP-YGA-6MM', '1 pc', 499.00, true),
  ('bb000001-0000-0000-0000-000000000038', 'aa000001-0000-0000-0000-000000000038', 'SP-RBD-5PK', '5 bands', 450.00, true),
  -- Sports - Protective
  ('bb000001-0000-0000-0000-000000000039', 'aa000001-0000-0000-0000-000000000039', 'SP-SHO-S09', '1 pair', 3200.00, true),
  ('bb000001-0000-0000-0000-00000000003a', 'aa000001-0000-0000-0000-00000000003a', 'SP-HLM-CKT', '1 pc', 1800.00, true)
on conflict (id) do nothing;

-- ─── Inventory Location ─────────────────────────────────────────────────────

insert into public.inventory_locations (id, code, name, is_active)
values
  ('dd000001-0000-0000-0000-000000000001', 'WH-MAIN', 'Main Warehouse', true)
on conflict (id) do nothing;

-- ─── Inventory Stock ────────────────────────────────────────────────────────

insert into public.inventory (variant_id, location_id, quantity_on_hand, quantity_reserved, reorder_level)
values
  ('bb000001-0000-0000-0000-000000000001', 'dd000001-0000-0000-0000-000000000001', 150, 0, 20),
  ('bb000001-0000-0000-0000-000000000002', 'dd000001-0000-0000-0000-000000000001', 100, 0, 15),
  ('bb000001-0000-0000-0000-000000000003', 'dd000001-0000-0000-0000-000000000001', 120, 0, 15),
  ('bb000001-0000-0000-0000-000000000004', 'dd000001-0000-0000-0000-000000000001', 80, 0, 10),
  ('bb000001-0000-0000-0000-000000000005', 'dd000001-0000-0000-0000-000000000001', 200, 0, 30),
  ('bb000001-0000-0000-0000-000000000006', 'dd000001-0000-0000-0000-000000000001', 25, 0, 5),
  ('bb000001-0000-0000-0000-000000000007', 'dd000001-0000-0000-0000-000000000001', 60, 0, 10),
  ('bb000001-0000-0000-0000-000000000008', 'dd000001-0000-0000-0000-000000000001', 200, 0, 30),
  ('bb000001-0000-0000-0000-000000000009', 'dd000001-0000-0000-0000-000000000001', 150, 0, 25),
  ('bb000001-0000-0000-0000-00000000000a', 'dd000001-0000-0000-0000-000000000001', 15, 0, 3),
  ('bb000001-0000-0000-0000-00000000000b', 'dd000001-0000-0000-0000-000000000001', 300, 0, 50),
  ('bb000001-0000-0000-0000-00000000000c', 'dd000001-0000-0000-0000-000000000001', 180, 0, 25),
  ('bb000001-0000-0000-0000-00000000000d', 'dd000001-0000-0000-0000-000000000001', 400, 0, 60),
  ('bb000001-0000-0000-0000-00000000000e', 'dd000001-0000-0000-0000-000000000001', 500, 0, 80),
  ('bb000001-0000-0000-0000-00000000000f', 'dd000001-0000-0000-0000-000000000001', 350, 0, 50),
  ('bb000001-0000-0000-0000-000000000010', 'dd000001-0000-0000-0000-000000000001', 400, 0, 60),
  ('bb000001-0000-0000-0000-000000000011', 'dd000001-0000-0000-0000-000000000001', 200, 0, 30),
  ('bb000001-0000-0000-0000-000000000012', 'dd000001-0000-0000-0000-000000000001', 150, 0, 20),
  ('bb000001-0000-0000-0000-000000000013', 'dd000001-0000-0000-0000-000000000001', 250, 0, 35),
  ('bb000001-0000-0000-0000-000000000014', 'dd000001-0000-0000-0000-000000000001', 180, 0, 25),
  ('bb000001-0000-0000-0000-000000000015', 'dd000001-0000-0000-0000-000000000001', 100, 0, 15),
  ('bb000001-0000-0000-0000-000000000016', 'dd000001-0000-0000-0000-000000000001', 80, 0, 10),
  ('bb000001-0000-0000-0000-000000000017', 'dd000001-0000-0000-0000-000000000001', 300, 0, 40),
  ('bb000001-0000-0000-0000-000000000018', 'dd000001-0000-0000-0000-000000000001', 500, 0, 70),
  ('bb000001-0000-0000-0000-000000000019', 'dd000001-0000-0000-0000-000000000001', 200, 0, 30),
  ('bb000001-0000-0000-0000-00000000001a', 'dd000001-0000-0000-0000-000000000001', 60, 0, 10),
  ('bb000001-0000-0000-0000-00000000001b', 'dd000001-0000-0000-0000-000000000001', 75, 0, 10),
  ('bb000001-0000-0000-0000-00000000001c', 'dd000001-0000-0000-0000-000000000001', 100, 0, 15),
  ('bb000001-0000-0000-0000-00000000001d', 'dd000001-0000-0000-0000-000000000001', 30, 0, 5),
  ('bb000001-0000-0000-0000-00000000001e', 'dd000001-0000-0000-0000-000000000001', 250, 0, 35),
  ('bb000001-0000-0000-0000-00000000001f', 'dd000001-0000-0000-0000-000000000001', 20, 0, 3),
  ('bb000001-0000-0000-0000-000000000020', 'dd000001-0000-0000-0000-000000000001', 40, 0, 5),
  ('bb000001-0000-0000-0000-000000000021', 'dd000001-0000-0000-0000-000000000001', 15, 0, 3),
  ('bb000001-0000-0000-0000-000000000022', 'dd000001-0000-0000-0000-000000000001', 90, 0, 15),
  ('bb000001-0000-0000-0000-000000000023', 'dd000001-0000-0000-0000-000000000001', 120, 0, 20),
  ('bb000001-0000-0000-0000-000000000024', 'dd000001-0000-0000-0000-000000000001', 35, 0, 5),
  ('bb000001-0000-0000-0000-000000000025', 'dd000001-0000-0000-0000-000000000001', 40, 0, 5),
  ('bb000001-0000-0000-0000-000000000026', 'dd000001-0000-0000-0000-000000000001', 15, 0, 3),
  ('bb000001-0000-0000-0000-000000000027', 'dd000001-0000-0000-0000-000000000001', 10, 0, 2),
  ('bb000001-0000-0000-0000-000000000028', 'dd000001-0000-0000-0000-000000000001', 50, 0, 8),
  ('bb000001-0000-0000-0000-000000000029', 'dd000001-0000-0000-0000-000000000001', 20, 0, 3),
  ('bb000001-0000-0000-0000-00000000002a', 'dd000001-0000-0000-0000-000000000001', 90, 0, 12),
  ('bb000001-0000-0000-0000-00000000002b', 'dd000001-0000-0000-0000-000000000001', 80, 0, 10),
  ('bb000001-0000-0000-0000-00000000002c', 'dd000001-0000-0000-0000-000000000001', 200, 0, 30),
  ('bb000001-0000-0000-0000-00000000002d', 'dd000001-0000-0000-0000-000000000001', 50, 0, 8),
  ('bb000001-0000-0000-0000-00000000002e', 'dd000001-0000-0000-0000-000000000001', 70, 0, 10),
  ('bb000001-0000-0000-0000-00000000002f', 'dd000001-0000-0000-0000-000000000001', 60, 0, 8),
  ('bb000001-0000-0000-0000-000000000030', 'dd000001-0000-0000-0000-000000000001', 100, 0, 15),
  ('bb000001-0000-0000-0000-000000000031', 'dd000001-0000-0000-0000-000000000001', 40, 0, 5),
  ('bb000001-0000-0000-0000-000000000032', 'dd000001-0000-0000-0000-000000000001', 80, 0, 10),
  ('bb000001-0000-0000-0000-000000000033', 'dd000001-0000-0000-0000-000000000001', 30, 0, 5),
  ('bb000001-0000-0000-0000-000000000034', 'dd000001-0000-0000-0000-000000000001', 25, 0, 4),
  ('bb000001-0000-0000-0000-000000000035', 'dd000001-0000-0000-0000-000000000001', 20, 0, 3),
  ('bb000001-0000-0000-0000-000000000036', 'dd000001-0000-0000-0000-000000000001', 35, 0, 5),
  ('bb000001-0000-0000-0000-000000000037', 'dd000001-0000-0000-0000-000000000001', 50, 0, 8),
  ('bb000001-0000-0000-0000-000000000038', 'dd000001-0000-0000-0000-000000000001', 75, 0, 10),
  ('bb000001-0000-0000-0000-000000000039', 'dd000001-0000-0000-0000-000000000001', 20, 0, 3),
  ('bb000001-0000-0000-0000-00000000003a', 'dd000001-0000-0000-0000-000000000001', 15, 0, 3)
on conflict (variant_id, location_id) do nothing;

commit;
