-- Drop existing policies first (if re-running)
DROP POLICY IF EXISTS "Anyone can view menu categories" ON menu_categories;
DROP POLICY IF EXISTS "Anyone can view menu items" ON menu_items;
DROP POLICY IF EXISTS "Admins can insert menu categories" ON menu_categories;
DROP POLICY IF EXISTS "Admins can update menu categories" ON menu_categories;
DROP POLICY IF EXISTS "Admins can delete menu categories" ON menu_categories;
DROP POLICY IF EXISTS "Admins can insert menu items" ON menu_items;
DROP POLICY IF EXISTS "Admins can update menu items" ON menu_items;
DROP POLICY IF EXISTS "Admins can delete menu items" ON menu_items;
DROP POLICY IF EXISTS "Anyone can create reservations" ON reservations;
DROP POLICY IF EXISTS "Admins can view reservations" ON reservations;
DROP POLICY IF EXISTS "Admins can update reservations" ON reservations;
DROP POLICY IF EXISTS "Admins can delete reservations" ON reservations;

-- Drop tables if they exist
DROP TABLE IF EXISTS menu_items CASCADE;
DROP TABLE IF EXISTS menu_categories CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;

-- Menu categories table
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Menu items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  is_sold_out BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Reservations table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  guests INTEGER NOT NULL CHECK (guests >= 1 AND guests <= 20),
  reservation_date DATE NOT NULL,
  reservation_time TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Public read access for menu
CREATE POLICY "Anyone can view menu categories" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view menu items" ON menu_items FOR SELECT USING (true);

-- Only authenticated users (admins) can modify menu
CREATE POLICY "Admins can insert menu categories" ON menu_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update menu categories" ON menu_categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete menu categories" ON menu_categories FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert menu items" ON menu_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update menu items" ON menu_items FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete menu items" ON menu_items FOR DELETE USING (auth.role() = 'authenticated');

-- Anyone can create reservations, only admins can view/modify
CREATE POLICY "Anyone can create reservations" ON reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view reservations" ON reservations FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update reservations" ON reservations FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete reservations" ON reservations FOR DELETE USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_reservations_date_time ON reservations (reservation_date, reservation_time);
CREATE INDEX idx_menu_items_category ON menu_items (category_id);
