-- ============================================================================
-- HMART Seed Data: Synthetic but realistic catalog for an Indian grocery &
-- household essentials store.
-- ============================================================================

begin;

-- ─── Categories ─────────────────────────────────────────────────────────────

insert into public.categories (id, name, slug, description, sort_order, is_active)
values
  ('ca000001-0000-0000-0000-000000000001', 'Fruits & Vegetables', 'fruits-vegetables', 'Farm-fresh fruits, leafy greens, and seasonal vegetables.', 1, true),
  ('ca000001-0000-0000-0000-000000000002', 'Dairy, Bread & Eggs', 'dairy-bread-eggs', 'Milk, curd, paneer, eggs, butter, and fresh bakery bread.', 2, true),
  ('ca000001-0000-0000-0000-000000000003', 'Snacks & Munchies', 'snacks-munchies', 'Chips, namkeen, biscuits, and ready-to-eat snacks.', 3, true),
  ('ca000001-0000-0000-0000-000000000004', 'Cold Drinks & Juices', 'cold-drinks-juices', 'Soft drinks, juices, coconut water, and energy drinks.', 4, true),
  ('ca000001-0000-0000-0000-000000000005', 'Breakfast & Instant Food', 'breakfast-instant-food', 'Oats, cornflakes, noodles, pasta, and ready-to-cook mixes.', 5, true),
  ('ca000001-0000-0000-0000-000000000006', 'Atta, Rice & Dal', 'atta-rice-dal', 'Wheat flour, basmati rice, pulses, and whole grains.', 6, true),
  ('ca000001-0000-0000-0000-000000000007', 'Tea, Coffee & Health Drinks', 'tea-coffee-health-drinks', 'Tea leaves, coffee powder, green tea, and malt beverages.', 7, true),
  ('ca000001-0000-0000-0000-000000000008', 'Cleaning & Household', 'cleaning-household', 'Detergent, floor cleaners, dishwash, and mops.', 8, true),
  ('ca000001-0000-0000-0000-000000000009', 'Personal Care', 'personal-care', 'Soaps, shampoo, toothpaste, skincare, and grooming essentials.', 9, true),
  ('ca000001-0000-0000-0000-00000000000a', 'Baby Care', 'baby-care', 'Diapers, baby food, wipes, and infant toiletries.', 10, true),
  ('ca000001-0000-0000-0000-00000000000b', 'Stationery & Office', 'stationery-office', 'Pens, notebooks, files, tape, and printer paper.', 11, true),
  ('ca000001-0000-0000-0000-00000000000c', 'Safety & PPE', 'safety-ppe', 'Masks, gloves, sanitizers, first-aid kits, and safety goggles.', 12, true)
on conflict (id) do nothing;

-- ─── Products ───────────────────────────────────────────────────────────────

insert into public.products (id, primary_category_id, name, slug, description, brand, status)
values
  ('aa000001-0000-0000-0000-000000000001', 'ca000001-0000-0000-0000-000000000001', 'Fresh Banana (Dozen)', 'fresh-banana-dozen', 'Premium Robusta bananas, hand-picked for ripeness. Naturally sweet and rich in potassium.', 'Fresho', 'active'),
  ('aa000001-0000-0000-0000-000000000002', 'ca000001-0000-0000-0000-000000000001', 'Organic Tomato 500g', 'organic-tomato-500g', 'Firm red tomatoes grown without pesticides. Great for curries, salads, and sauces.', 'Organic Tattva', 'active'),
  ('aa000001-0000-0000-0000-000000000003', 'ca000001-0000-0000-0000-000000000001', 'Baby Spinach 200g', 'baby-spinach-200g', 'Tender baby spinach leaves, pre-washed and ready to eat or cook.', 'Fresho', 'active'),
  ('aa000001-0000-0000-0000-000000000004', 'ca000001-0000-0000-0000-000000000002', 'Amul Toned Milk 1L', 'amul-toned-milk-1l', 'Pasteurized toned milk with 3% fat. Rich in calcium, ideal for daily use.', 'Amul', 'active'),
  ('aa000001-0000-0000-0000-000000000005', 'ca000001-0000-0000-0000-000000000002', 'White Bread 400g', 'white-bread-400g', 'Soft and fresh sandwich bread sliced for convenience. No preservatives.', 'Harvest Gold', 'active'),
  ('aa000001-0000-0000-0000-000000000006', 'ca000001-0000-0000-0000-000000000002', 'Farm Eggs (Pack of 12)', 'farm-eggs-pack-12', 'Free-range brown eggs, protein-packed and fresh from the farm.', 'Natures Basket', 'active'),
  ('aa000001-0000-0000-0000-000000000007', 'ca000001-0000-0000-0000-000000000003', 'Lays Classic Salted 52g', 'lays-classic-salted-52g', 'Crispy golden potato chips lightly salted for the perfect crunch.', 'Lays', 'active'),
  ('aa000001-0000-0000-0000-000000000008', 'ca000001-0000-0000-0000-000000000003', 'Haldiram Aloo Bhujia 400g', 'haldiram-aloo-bhujia-400g', 'Traditional Indian namkeen made with besan and potato. Crispy and addictive.', 'Haldirams', 'active'),
  ('aa000001-0000-0000-0000-000000000009', 'ca000001-0000-0000-0000-000000000003', 'Parle-G Gold Biscuits 100g', 'parle-g-gold-100g', 'Premium glucose biscuits with extra milk and wheat. A timeless Indian snack.', 'Parle', 'active'),
  ('aa000001-0000-0000-0000-00000000000a', 'ca000001-0000-0000-0000-000000000004', 'Coca-Cola 750ml', 'coca-cola-750ml', 'Classic cola refreshment. Serve chilled for best taste.', 'Coca-Cola', 'active'),
  ('aa000001-0000-0000-0000-00000000000b', 'ca000001-0000-0000-0000-000000000004', 'Real Mixed Fruit Juice 1L', 'real-mixed-fruit-juice-1l', 'No added sugar fruit juice blend with mango, pineapple, and apple.', 'Real', 'active'),
  ('aa000001-0000-0000-0000-00000000000c', 'ca000001-0000-0000-0000-000000000004', 'Paper Boat Aam Panna 200ml', 'paper-boat-aam-panna-200ml', 'Traditional raw mango drink. Tangy, sweet, and refreshing.', 'Paper Boat', 'active'),
  ('aa000001-0000-0000-0000-00000000000d', 'ca000001-0000-0000-0000-000000000005', 'Kelloggs Corn Flakes 475g', 'kelloggs-corn-flakes-475g', 'Crispy golden flakes of corn, iron-fortified. Perfect breakfast with cold milk.', 'Kelloggs', 'active'),
  ('aa000001-0000-0000-0000-00000000000e', 'ca000001-0000-0000-0000-000000000005', 'Maggi 2-Minute Noodles (Pack of 4)', 'maggi-2-min-noodles-4pk', 'Instant masala noodles everyone loves. Ready in 2 minutes.', 'Maggi', 'active'),
  ('aa000001-0000-0000-0000-00000000000f', 'ca000001-0000-0000-0000-000000000005', 'Quaker Oats 1kg', 'quaker-oats-1kg', 'Rolled whole-grain oats. High in fibre and heart-healthy.', 'Quaker', 'active'),
  ('aa000001-0000-0000-0000-000000000010', 'ca000001-0000-0000-0000-000000000006', 'Aashirvaad Atta 5kg', 'aashirvaad-atta-5kg', 'Whole wheat flour milled from the finest grains. Soft rotis every time.', 'Aashirvaad', 'active'),
  ('aa000001-0000-0000-0000-000000000011', 'ca000001-0000-0000-0000-000000000006', 'India Gate Basmati Rice 1kg', 'india-gate-basmati-1kg', 'Long-grain aged basmati rice. Fluffy texture ideal for biryani and pulao.', 'India Gate', 'active'),
  ('aa000001-0000-0000-0000-000000000012', 'ca000001-0000-0000-0000-000000000006', 'Toor Dal 1kg', 'toor-dal-1kg', 'Split pigeon peas, unpolished. Cooks evenly, rich earthy flavour.', 'Tata Sampann', 'active'),
  ('aa000001-0000-0000-0000-000000000013', 'ca000001-0000-0000-0000-000000000007', 'Tata Tea Gold 500g', 'tata-tea-gold-500g', '15% long leaves for a rich aroma. Indias most trusted tea brand.', 'Tata Tea', 'active'),
  ('aa000001-0000-0000-0000-000000000014', 'ca000001-0000-0000-0000-000000000007', 'Nescafe Classic 100g', 'nescafe-classic-100g', 'Instant coffee granules with a bold roasted flavour. Just add hot water.', 'Nescafe', 'active'),
  ('aa000001-0000-0000-0000-000000000015', 'ca000001-0000-0000-0000-000000000007', 'Bournvita 500g Jar', 'bournvita-500g-jar', 'Chocolate health drink fortified with vitamins D and B12.', 'Cadbury', 'active'),
  ('aa000001-0000-0000-0000-000000000016', 'ca000001-0000-0000-0000-000000000008', 'Surf Excel Matic Liquid 1L', 'surf-excel-matic-1l', 'Front-load washing machine detergent liquid. Tough stain removal in cold water.', 'Surf Excel', 'active'),
  ('aa000001-0000-0000-0000-000000000017', 'ca000001-0000-0000-0000-000000000008', 'Lizol Floor Cleaner 500ml', 'lizol-floor-cleaner-500ml', 'Disinfectant floor cleaner kills 99.9% germs. Citrus fragrance.', 'Lizol', 'active'),
  ('aa000001-0000-0000-0000-000000000018', 'ca000001-0000-0000-0000-000000000008', 'Vim Dishwash Bar 200g', 'vim-dishwash-bar-200g', 'Lemon power for sparkling clean utensils. Cuts through grease easily.', 'Vim', 'active'),
  ('aa000001-0000-0000-0000-000000000019', 'ca000001-0000-0000-0000-000000000009', 'Dove Beauty Bar 100g', 'dove-beauty-bar-100g', 'Moisturizing beauty bar with 1/4 cream. Gentle enough for daily face and body use.', 'Dove', 'active'),
  ('aa000001-0000-0000-0000-00000000001a', 'ca000001-0000-0000-0000-000000000009', 'Head & Shoulders Shampoo 340ml', 'head-shoulders-shampoo-340ml', 'Anti-dandruff shampoo with zinc pyrithione. Cool menthol variant.', 'Head & Shoulders', 'active'),
  ('aa000001-0000-0000-0000-00000000001b', 'ca000001-0000-0000-0000-000000000009', 'Colgate MaxFresh Toothpaste 150g', 'colgate-maxfresh-150g', 'Gel toothpaste with cooling crystals for long-lasting fresh breath.', 'Colgate', 'active'),
  ('aa000001-0000-0000-0000-00000000001c', 'ca000001-0000-0000-0000-00000000000a', 'Pampers Diapers Medium (Pack of 20)', 'pampers-diapers-medium-20', 'Ultra-soft diapers with 12-hour absorption. Gentle on baby skin.', 'Pampers', 'active'),
  ('aa000001-0000-0000-0000-00000000001d', 'ca000001-0000-0000-0000-00000000000a', 'Cerelac Stage 2 Wheat Apple 300g', 'cerelac-wheat-apple-300g', 'Iron-fortified baby cereal for 8+ months. Easy to digest.', 'Nestle', 'active'),
  ('aa000001-0000-0000-0000-00000000001e', 'ca000001-0000-0000-0000-00000000000a', 'Johnson Baby Wipes (Pack of 80)', 'johnson-baby-wipes-80', 'Clinically mild wipes free from alcohol, parabens, and dyes.', 'Johnsons', 'active'),
  ('aa000001-0000-0000-0000-00000000001f', 'ca000001-0000-0000-0000-00000000000b', 'Classmate Notebook 180 Pages', 'classmate-notebook-180pg', 'Single-line ruled long notebook. Smooth writing paper, durable cover.', 'Classmate', 'active'),
  ('aa000001-0000-0000-0000-000000000020', 'ca000001-0000-0000-0000-00000000000b', 'Cello Pinpoint Ball Pen (Pack of 10)', 'cello-pinpoint-pen-10pk', 'Fine tip 0.7mm blue ball pens. Smooth ink flow, comfortable grip.', 'Cello', 'active'),
  ('aa000001-0000-0000-0000-000000000021', 'ca000001-0000-0000-0000-00000000000b', 'Fevicol MR 200g', 'fevicol-mr-200g', 'White adhesive for paper, craft, and school projects. Non-toxic.', 'Fevicol', 'active'),
  ('aa000001-0000-0000-0000-000000000022', 'ca000001-0000-0000-0000-00000000000c', 'N95 Face Mask (Pack of 5)', 'n95-mask-pack-5', '5-layer filtration masks with nose clip. BIS certified for PM2.5 protection.', 'Venus', 'active'),
  ('aa000001-0000-0000-0000-000000000023', 'ca000001-0000-0000-0000-00000000000c', 'Dettol Hand Sanitizer 200ml', 'dettol-sanitizer-200ml', 'Kills 99.9% germs without water. Original fragrance.', 'Dettol', 'active'),
  ('aa000001-0000-0000-0000-000000000024', 'ca000001-0000-0000-0000-00000000000c', 'First Aid Kit (Basic)', 'first-aid-kit-basic', 'Compact kit with bandages, antiseptic cream, cotton, and scissors.', 'Savlon', 'active')
on conflict (id) do nothing;

-- ─── Product Variants (SKU, price, unit) ────────────────────────────────────
-- Schema: id, product_id, sku, unit, price, is_active
-- (pack_size, compare_at_price, tax_rate, min_order_quantity, weight_grams, attributes are optional)

insert into public.product_variants (id, product_id, sku, unit, price, is_active)
values
  ('bb000001-0000-0000-0000-000000000001', 'aa000001-0000-0000-0000-000000000001', 'FRU-BAN-DZN', '1 dozen', 49.00, true),
  ('bb000001-0000-0000-0000-000000000002', 'aa000001-0000-0000-0000-000000000002', 'FRU-TOM-500', '500 g', 42.00, true),
  ('bb000001-0000-0000-0000-000000000003', 'aa000001-0000-0000-0000-000000000003', 'FRU-SPN-200', '200 g', 55.00, true),
  ('bb000001-0000-0000-0000-000000000004', 'aa000001-0000-0000-0000-000000000004', 'DAI-MLK-1L', '1 L', 68.00, true),
  ('bb000001-0000-0000-0000-000000000005', 'aa000001-0000-0000-0000-000000000005', 'DAI-BRD-400', '400 g', 45.00, true),
  ('bb000001-0000-0000-0000-000000000006', 'aa000001-0000-0000-0000-000000000006', 'DAI-EGG-12', '12 pcs', 96.00, true),
  ('bb000001-0000-0000-0000-000000000007', 'aa000001-0000-0000-0000-000000000007', 'SNK-LAY-52', '52 g', 20.00, true),
  ('bb000001-0000-0000-0000-000000000008', 'aa000001-0000-0000-0000-000000000008', 'SNK-HAL-400', '400 g', 160.00, true),
  ('bb000001-0000-0000-0000-000000000009', 'aa000001-0000-0000-0000-000000000009', 'SNK-PRL-100', '100 g', 15.00, true),
  ('bb000001-0000-0000-0000-00000000000a', 'aa000001-0000-0000-0000-00000000000a', 'DRK-COK-750', '750 ml', 45.00, true),
  ('bb000001-0000-0000-0000-00000000000b', 'aa000001-0000-0000-0000-00000000000b', 'DRK-REL-1L', '1 L', 110.00, true),
  ('bb000001-0000-0000-0000-00000000000c', 'aa000001-0000-0000-0000-00000000000c', 'DRK-PBT-200', '200 ml', 30.00, true),
  ('bb000001-0000-0000-0000-00000000000d', 'aa000001-0000-0000-0000-00000000000d', 'BRK-KEL-475', '475 g', 195.00, true),
  ('bb000001-0000-0000-0000-00000000000e', 'aa000001-0000-0000-0000-00000000000e', 'BRK-MAG-4PK', '4 x 70 g', 56.00, true),
  ('bb000001-0000-0000-0000-00000000000f', 'aa000001-0000-0000-0000-00000000000f', 'BRK-QKR-1KG', '1 kg', 210.00, true),
  ('bb000001-0000-0000-0000-000000000010', 'aa000001-0000-0000-0000-000000000010', 'GRN-ATA-5KG', '5 kg', 285.00, true),
  ('bb000001-0000-0000-0000-000000000011', 'aa000001-0000-0000-0000-000000000011', 'GRN-RIC-1KG', '1 kg', 195.00, true),
  ('bb000001-0000-0000-0000-000000000012', 'aa000001-0000-0000-0000-000000000012', 'GRN-DAL-1KG', '1 kg', 155.00, true),
  ('bb000001-0000-0000-0000-000000000013', 'aa000001-0000-0000-0000-000000000013', 'TEA-TAT-500', '500 g', 290.00, true),
  ('bb000001-0000-0000-0000-000000000014', 'aa000001-0000-0000-0000-000000000014', 'TEA-NES-100', '100 g', 245.00, true),
  ('bb000001-0000-0000-0000-000000000015', 'aa000001-0000-0000-0000-000000000015', 'TEA-BVT-500', '500 g', 260.00, true),
  ('bb000001-0000-0000-0000-000000000016', 'aa000001-0000-0000-0000-000000000016', 'CLN-SRF-1L', '1 L', 225.00, true),
  ('bb000001-0000-0000-0000-000000000017', 'aa000001-0000-0000-0000-000000000017', 'CLN-LZL-500', '500 ml', 115.00, true),
  ('bb000001-0000-0000-0000-000000000018', 'aa000001-0000-0000-0000-000000000018', 'CLN-VIM-200', '200 g', 25.00, true),
  ('bb000001-0000-0000-0000-000000000019', 'aa000001-0000-0000-0000-000000000019', 'PER-DOV-100', '100 g', 65.00, true),
  ('bb000001-0000-0000-0000-00000000001a', 'aa000001-0000-0000-0000-00000000001a', 'PER-HNS-340', '340 ml', 350.00, true),
  ('bb000001-0000-0000-0000-00000000001b', 'aa000001-0000-0000-0000-00000000001b', 'PER-CLG-150', '150 g', 99.00, true),
  ('bb000001-0000-0000-0000-00000000001c', 'aa000001-0000-0000-0000-00000000001c', 'BBY-PMP-M20', '20 pcs', 499.00, true),
  ('bb000001-0000-0000-0000-00000000001d', 'aa000001-0000-0000-0000-00000000001d', 'BBY-CRL-300', '300 g', 275.00, true),
  ('bb000001-0000-0000-0000-00000000001e', 'aa000001-0000-0000-0000-00000000001e', 'BBY-JWP-80', '80 pcs', 185.00, true),
  ('bb000001-0000-0000-0000-00000000001f', 'aa000001-0000-0000-0000-00000000001f', 'STA-CLM-180', '180 pages', 60.00, true),
  ('bb000001-0000-0000-0000-000000000020', 'aa000001-0000-0000-0000-000000000020', 'STA-CEL-10P', '10 pcs', 80.00, true),
  ('bb000001-0000-0000-0000-000000000021', 'aa000001-0000-0000-0000-000000000021', 'STA-FEV-200', '200 g', 45.00, true),
  ('bb000001-0000-0000-0000-000000000022', 'aa000001-0000-0000-0000-000000000022', 'SAF-N95-5PK', '5 pcs', 199.00, true),
  ('bb000001-0000-0000-0000-000000000023', 'aa000001-0000-0000-0000-000000000023', 'SAF-DET-200', '200 ml', 99.00, true),
  ('bb000001-0000-0000-0000-000000000024', 'aa000001-0000-0000-0000-000000000024', 'SAF-FAK-BSC', '1 kit', 349.00, true)
on conflict (id) do nothing;

-- ─── Inventory Location ─────────────────────────────────────────────────────
-- Schema: id, code, name, address(jsonb), is_active

insert into public.inventory_locations (id, code, name, is_active)
values
  ('dd000001-0000-0000-0000-000000000001', 'WH-MAIN', 'Main Warehouse', true),
  ('dd000001-0000-0000-0000-000000000002', 'WH-COLD', 'Cold Storage Unit', true)
on conflict (id) do nothing;

-- ─── Inventory Stock ────────────────────────────────────────────────────────
-- Schema: variant_id, location_id, quantity_on_hand, quantity_reserved, reorder_level
-- PK is (variant_id, location_id)

insert into public.inventory (variant_id, location_id, quantity_on_hand, quantity_reserved, reorder_level)
values
  ('bb000001-0000-0000-0000-000000000001', 'dd000001-0000-0000-0000-000000000001', 120, 0, 20),
  ('bb000001-0000-0000-0000-000000000002', 'dd000001-0000-0000-0000-000000000001', 85, 0, 15),
  ('bb000001-0000-0000-0000-000000000003', 'dd000001-0000-0000-0000-000000000001', 60, 0, 10),
  ('bb000001-0000-0000-0000-000000000004', 'dd000001-0000-0000-0000-000000000002', 200, 0, 30),
  ('bb000001-0000-0000-0000-000000000005', 'dd000001-0000-0000-0000-000000000001', 75, 0, 15),
  ('bb000001-0000-0000-0000-000000000006', 'dd000001-0000-0000-0000-000000000002', 150, 0, 25),
  ('bb000001-0000-0000-0000-000000000007', 'dd000001-0000-0000-0000-000000000001', 300, 0, 50),
  ('bb000001-0000-0000-0000-000000000008', 'dd000001-0000-0000-0000-000000000001', 90, 0, 15),
  ('bb000001-0000-0000-0000-000000000009', 'dd000001-0000-0000-0000-000000000001', 250, 0, 40),
  ('bb000001-0000-0000-0000-00000000000a', 'dd000001-0000-0000-0000-000000000001', 180, 0, 30),
  ('bb000001-0000-0000-0000-00000000000b', 'dd000001-0000-0000-0000-000000000001', 100, 0, 20),
  ('bb000001-0000-0000-0000-00000000000c', 'dd000001-0000-0000-0000-000000000001', 200, 0, 40),
  ('bb000001-0000-0000-0000-00000000000d', 'dd000001-0000-0000-0000-000000000001', 65, 0, 10),
  ('bb000001-0000-0000-0000-00000000000e', 'dd000001-0000-0000-0000-000000000001', 400, 0, 60),
  ('bb000001-0000-0000-0000-00000000000f', 'dd000001-0000-0000-0000-000000000001', 55, 0, 10),
  ('bb000001-0000-0000-0000-000000000010', 'dd000001-0000-0000-0000-000000000001', 40, 0, 8),
  ('bb000001-0000-0000-0000-000000000011', 'dd000001-0000-0000-0000-000000000001', 70, 0, 12),
  ('bb000001-0000-0000-0000-000000000012', 'dd000001-0000-0000-0000-000000000001', 90, 0, 15),
  ('bb000001-0000-0000-0000-000000000013', 'dd000001-0000-0000-0000-000000000001', 80, 0, 12),
  ('bb000001-0000-0000-0000-000000000014', 'dd000001-0000-0000-0000-000000000001', 95, 0, 15),
  ('bb000001-0000-0000-0000-000000000015', 'dd000001-0000-0000-0000-000000000001', 70, 0, 10),
  ('bb000001-0000-0000-0000-000000000016', 'dd000001-0000-0000-0000-000000000001', 45, 0, 8),
  ('bb000001-0000-0000-0000-000000000017', 'dd000001-0000-0000-0000-000000000001', 110, 0, 20),
  ('bb000001-0000-0000-0000-000000000018', 'dd000001-0000-0000-0000-000000000001', 200, 0, 35),
  ('bb000001-0000-0000-0000-000000000019', 'dd000001-0000-0000-0000-000000000001', 150, 0, 25),
  ('bb000001-0000-0000-0000-00000000001a', 'dd000001-0000-0000-0000-000000000001', 60, 0, 10),
  ('bb000001-0000-0000-0000-00000000001b', 'dd000001-0000-0000-0000-000000000001', 130, 0, 20),
  ('bb000001-0000-0000-0000-00000000001c', 'dd000001-0000-0000-0000-000000000001', 50, 0, 8),
  ('bb000001-0000-0000-0000-00000000001d', 'dd000001-0000-0000-0000-000000000001', 40, 0, 8),
  ('bb000001-0000-0000-0000-00000000001e', 'dd000001-0000-0000-0000-000000000001', 75, 0, 12),
  ('bb000001-0000-0000-0000-00000000001f', 'dd000001-0000-0000-0000-000000000001', 200, 0, 30),
  ('bb000001-0000-0000-0000-000000000020', 'dd000001-0000-0000-0000-000000000001', 300, 0, 50),
  ('bb000001-0000-0000-0000-000000000021', 'dd000001-0000-0000-0000-000000000001', 150, 0, 25),
  ('bb000001-0000-0000-0000-000000000022', 'dd000001-0000-0000-0000-000000000001', 100, 0, 15),
  ('bb000001-0000-0000-0000-000000000023', 'dd000001-0000-0000-0000-000000000001', 180, 0, 25),
  ('bb000001-0000-0000-0000-000000000024', 'dd000001-0000-0000-0000-000000000001', 35, 0, 5)
on conflict (variant_id, location_id) do nothing;

commit;
