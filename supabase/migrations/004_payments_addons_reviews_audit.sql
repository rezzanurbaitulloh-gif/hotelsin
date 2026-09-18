-- Migration 004: payments hardening, add-ons, reviews, audit logs, daily closures
-- Adds tables + columns needed for Midtrans, upsells, guest reviews, audit trail, night audit

-- 1. Reservations: payment + rate plan + addons linkage
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS rate_plan_name TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS addons_total DECIMAL(12, 2) NOT NULL DEFAULT 0;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS payment_order_id TEXT;
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;
CREATE INDEX IF NOT EXISTS idx_reservations_payment_order ON reservations(payment_order_id);

-- 2. Transactions: snap token storage
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS snap_token TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS snap_redirect_url TEXT;

-- 3. Add-ons catalogue (upsells: breakfast, transfer, spa, late checkout, extra bed, romantic dinner)
CREATE TABLE IF NOT EXISTS addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  name JSONB NOT NULL,
  description JSONB NOT NULL DEFAULT '{"en":"","id":""}',
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  price_unit VARCHAR(20) NOT NULL DEFAULT 'per_stay' CHECK (price_unit IN ('per_night', 'per_stay', 'per_person', 'per_person_night')),
  category VARCHAR(50),
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_addons_property ON addons(property_id, is_active);

-- 4. Reservation <-> addons line items
CREATE TABLE IF NOT EXISTS reservation_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  addon_id UUID NOT NULL REFERENCES addons(id) ON DELETE CASCADE,
  qty INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  total DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reservation_addons_res ON reservation_addons(reservation_id);

-- 5. Guest reviews (moderated)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES reservations(id) ON DELETE SET NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  guest_name VARCHAR(200) NOT NULL DEFAULT 'Tamu',
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reviews_property_status ON reviews(property_id, status, created_at);

-- 6. Admin audit log
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  actor_email VARCHAR(255),
  actor_role VARCHAR(30),
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(100),
  entity_id TEXT,
  detail JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_property_date ON audit_logs(property_id, created_at);

-- 7. Night audit daily closures (idempotent snapshots)
CREATE TABLE IF NOT EXISTS daily_closures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  rooms_total INTEGER NOT NULL DEFAULT 0,
  rooms_occupied INTEGER NOT NULL DEFAULT 0,
  occupancy_pct DECIMAL(5, 2) NOT NULL DEFAULT 0,
  room_revenue DECIMAL(14, 2) NOT NULL DEFAULT 0,
  other_revenue DECIMAL(14, 2) NOT NULL DEFAULT 0,
  total_revenue DECIMAL(14, 2) NOT NULL DEFAULT 0,
  adr DECIMAL(12, 2) NOT NULL DEFAULT 0,
  revpar DECIMAL(12, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(property_id, date)
);

-- 8. Seed add-ons for existing property
DO $$
DECLARE
  prop_id UUID;
BEGIN
  SELECT id INTO prop_id FROM properties LIMIT 1;
  IF prop_id IS NULL THEN RETURN; END IF;
  IF EXISTS (SELECT 1 FROM addons WHERE property_id = prop_id LIMIT 1) THEN RETURN; END IF;

  INSERT INTO addons (property_id, name, description, price, price_unit, category, sort_order) VALUES
    (prop_id, '{"en":"Daily Breakfast for Two","id":"Sarapan Harian untuk Dua"}', '{"en":"Floating or terrace breakfast with tropical fruits, eggs any style, and Balinese coffee.","id":"Sarapan apung atau teras dengan buah tropis, telur, dan kopi Bali."}', 35, 'per_night', 'Dining', 1),
    (prop_id, '{"en":"Airport Transfer (One Way)","id":"Antar-Jemput Bandara (Sekali Jalan)"}', '{"en":"Private car with driver, Ngurah Rai Airport to villa, cold towels included.","id":"Mobil pribadi dengan sopir, Bandara Ngurah Rai ke villa, handuk dingin included."}', 45, 'per_stay', 'Transport', 2),
    (prop_id, '{"en":"60-Minute Balinese Massage","id":"Pijat Bali 60 Menit"}', '{"en":"Traditional massage in your villa or spa bale.","id":"Pijat tradisional di villa atau bale spa."}', 50, 'per_person', 'Spa', 3),
    (prop_id, '{"en":"Late Check-out (until 14:00)","id":"Late Check-out (hingga 14:00)"}', '{"en":"Keep your villa until 2 PM, subject to availability.","id":"Pertahankan villa hingga jam 2 siang, sesuai ketersediaan."}', 40, 'per_stay', 'Stay', 4),
    (prop_id, '{"en":"Extra Bed","id":"Tempat Tidur Tambahan"}', '{"en":"Single extra bed with linen, per night.","id":"Tempat tidur single tambahan dengan linen, per malam."}', 45, 'per_night', 'Stay', 5),
    (prop_id, '{"en":"Romantic Candlelit Dinner","id":"Makan Malam Romantis"}', '{"en":"Private 4-course dinner on your terrace with guitarist.","id":"Makan malam pribadi 4 hidangan di teras dengan gitaris."}', 120, 'per_stay', 'Dining', 6),
    (prop_id, '{"en":"Floating Breakfast Upgrade","id":"Upgrade Floating Breakfast"}', '{"en":"Signature pool floating breakfast tray for two.","id":"Nampan sarapan apung khas untuk dua orang."}', 25, 'per_stay', 'Dining', 7);
END $$;

-- 9. RLS disabled for demo parity (same as other tables)
ALTER TABLE addons DISABLE ROW LEVEL SECURITY;
ALTER TABLE reservation_addons DISABLE ROW LEVEL SECURITY;
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_closures DISABLE ROW LEVEL SECURITY;
