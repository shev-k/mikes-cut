-- First, ensure categories exist in your database
-- Run this SQL in your Supabase SQL Editor to transfer existing products

-- Insert categories (if they don't already exist)
INSERT INTO categories (name, slug) VALUES
('Steaks', 'steaks'),
('Grills & Tools', 'grills'),
('Grooming', 'grooming')
ON CONFLICT DO NOTHING;

-- Now insert all the existing products
-- Get the category IDs and insert products

INSERT INTO products (name, category_id, price, image_url, description)
SELECT 
  'PRIME RIBEYE STEAK',
  (SELECT id FROM categories WHERE slug = 'steaks'),
  45.99,
  '/premium-raw-ribeye-steak-on-dark-background.jpg',
  'Hand-selected 16oz prime ribeye, aged to perfection'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PRIME RIBEYE STEAK');

INSERT INTO products (name, category_id, price, image_url, description)
SELECT 
  'TOMAHAWK STEAK',
  (SELECT id FROM categories WHERE slug = 'steaks'),
  89.99,
  '/large-tomahawk-steak-on-dark-rustic-background.jpg',
  'Massive 32oz bone-in ribeye for the serious carnivore'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'TOMAHAWK STEAK');

INSERT INTO products (name, category_id, price, image_url, description)
SELECT 
  'NEW YORK STRIP',
  (SELECT id FROM categories WHERE slug = 'steaks'),
  38.99,
  '/new-york-strip-steak-on-dark-wooden-board.jpg',
  'Classic 14oz strip steak with perfect marbling'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'NEW YORK STRIP');

INSERT INTO products (name, category_id, price, image_url, description)
SELECT 
  'FILET MIGNON',
  (SELECT id FROM categories WHERE slug = 'steaks'),
  52.99,
  '/tender-filet-mignon-on-dark-slate-plate.jpg',
  'Tender 8oz center-cut filet, butter soft'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'FILET MIGNON');

INSERT INTO products (name, category_id, price, image_url, description)
SELECT 
  'PROFESSIONAL CHARCOAL GRILL',
  (SELECT id FROM categories WHERE slug = 'grills'),
  599.99,
  '/professional-charcoal-grill-on-dark-background.jpg',
  'Heavy-duty charcoal grill for serious grilling'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'PROFESSIONAL CHARCOAL GRILL');

INSERT INTO products (name, category_id, price, image_url, description)
SELECT 
  'CAST IRON GRILL SET',
  (SELECT id FROM categories WHERE slug = 'grills'),
  249.99,
  '/cast-iron-grill-grates-and-tools-on-dark-backgrou.jpg',
  'Professional-grade cast iron grates and tools'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'CAST IRON GRILL SET');

INSERT INTO products (name, category_id, price, image_url, description)
SELECT 
  'BUTCHER''S KNIFE SET',
  (SELECT id FROM categories WHERE slug = 'grills'),
  179.99,
  '/professional-butcher-knives-on-dark-leather.jpg',
  'Premium steel knives for meat preparation'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'BUTCHER''S KNIFE SET');

INSERT INTO products (name, category_id, price, image_url, description)
SELECT 
  'SMOKING WOOD CHIPS',
  (SELECT id FROM categories WHERE slug = 'grills'),
  34.99,
  '/assorted-wood-chips-for-smoking-on-dark-backgroun.jpg',
  'Variety pack of premium smoking woods'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'SMOKING WOOD CHIPS');

INSERT INTO products (name, category_id, price, image_url, description)
SELECT 
  'BEARD OIL - SANDALWOOD',
  (SELECT id FROM categories WHERE slug = 'grooming'),
  29.99,
  '/luxury-mens-grooming-products-beard-oil-on-dark-wo.jpg',
  'Premium beard oil with sandalwood and cedar'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'BEARD OIL - SANDALWOOD');

INSERT INTO products (name, category_id, price, image_url, description)
SELECT 
  'STRAIGHT RAZOR KIT',
  (SELECT id FROM categories WHERE slug = 'grooming'),
  89.99,
  '/professional-straight-razor-kit-on-dark-leather.jpg',
  'Professional straight razor with leather strop'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'STRAIGHT RAZOR KIT');

INSERT INTO products (name, category_id, price, image_url, description)
SELECT 
  'POMADE - STRONG HOLD',
  (SELECT id FROM categories WHERE slug = 'grooming'),
  24.99,
  '/mens-hair-pomade-on-dark-wooden-surface.jpg',
  'Water-based pomade with all-day hold'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'POMADE - STRONG HOLD');

INSERT INTO products (name, category_id, price, image_url, description)
SELECT 
  'GROOMING TOOL SET',
  (SELECT id FROM categories WHERE slug = 'grooming'),
  64.99,
  '/mens-grooming-tools-scissors-comb-on-dark-backgro.jpg',
  'Complete grooming kit with scissors, comb, and brush'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name = 'GROOMING TOOL SET');
