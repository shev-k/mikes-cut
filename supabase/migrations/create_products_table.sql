-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read products
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT USING (true);

-- Only admins can insert, update, delete products
CREATE POLICY "Admins can insert products" ON products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update products" ON products
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete products" ON products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Insert existing products from the hardcoded array
INSERT INTO products (name, category, price, image, description) VALUES
('PRIME RIBEYE STEAK', 'steaks', 45.99, '/premium-raw-ribeye-steak-on-dark-background.jpg', 'Hand-selected 16oz prime ribeye, aged to perfection'),
('TOMAHAWK STEAK', 'steaks', 89.99, '/large-tomahawk-steak-on-dark-rustic-background.jpg', 'Massive 32oz bone-in ribeye for the serious carnivore'),
('NEW YORK STRIP', 'steaks', 38.99, '/new-york-strip-steak-on-dark-wooden-board.jpg', 'Classic 14oz strip steak with perfect marbling'),
('FILET MIGNON', 'steaks', 52.99, '/tender-filet-mignon-on-dark-slate-plate.jpg', 'Tender 8oz center-cut filet, butter soft'),
('PROFESSIONAL CHARCOAL GRILL', 'grills', 599.99, '/professional-charcoal-grill-on-dark-background.jpg', 'Heavy-duty charcoal grill for serious grilling'),
('CAST IRON GRILL SET', 'grills', 249.99, '/cast-iron-grill-grates-and-tools-on-dark-backgrou.jpg', 'Professional-grade cast iron grates and tools'),
('BUTCHER''S KNIFE SET', 'grills', 179.99, '/professional-butcher-knives-on-dark-leather.jpg', 'Premium steel knives for meat preparation'),
('SMOKING WOOD CHIPS', 'grills', 34.99, '/assorted-wood-chips-for-smoking-on-dark-backgroun.jpg', 'Variety pack of premium smoking woods'),
('BEARD OIL - SANDALWOOD', 'grooming', 29.99, '/luxury-mens-grooming-products-beard-oil-on-dark-wo.jpg', 'Premium beard oil with sandalwood and cedar'),
('STRAIGHT RAZOR KIT', 'grooming', 89.99, '/professional-straight-razor-kit-on-dark-leather.jpg', 'Professional straight razor with leather strop'),
('POMADE - STRONG HOLD', 'grooming', 24.99, '/mens-hair-pomade-on-dark-wooden-surface.jpg', 'Water-based pomade with all-day hold'),
('GROOMING TOOL SET', 'grooming', 64.99, '/mens-grooming-tools-scissors-comb-on-dark-backgro.jpg', 'Complete grooming kit with scissors, comb, and brush');
