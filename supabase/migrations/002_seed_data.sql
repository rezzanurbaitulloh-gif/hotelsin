-- HotelsIn Full Seed Data — realistic luxury hospitality content
DO $$
DECLARE
  prop_id UUID;
  rt_ocean UUID; rt_garden UUID; rt_cliff UUID; rt_estate UUID; rt_jungle UUID;
BEGIN
  -- Insert property
  INSERT INTO properties (name, tagline, description, address, city, country, phone, email, website, latitude, longitude, logo_url, hero_image_url, gallery_images)
  VALUES
  (
    '{"en": "HotelsIn", "id": "HotelsIn"}'::jsonb,
    '{"en": "A QUIETER WAY TO ARRIVE", "id": "CARA LEBIH TENANG UNTUK TIBA"}'::jsonb,
    '{"en": "A private sanctuary shaped by architecture, nature and time. Twenty villas hidden within a valley of rice terraces and ancient forest above the Ayung River in Ubud.", "id": "Suaka pribadi yang dibentuk oleh arsitektur, alam, dan waktu. Dua puluh vila tersembunyi di lembah sawah dan hutan purba di atas Sungai Ayung di Ubud."}'::jsonb,
    '{"en": "Jalan Raya Ubud No. 88, Sayan", "id": "Jalan Raya Ubud No. 88, Sayan"}'::jsonb,
    '{"en": "Ubud", "id": "Ubud"}'::jsonb,
    '{"en": "Indonesia", "id": "Indonesia"}'::jsonb,
    '+62 361 975 888',
    'reservations@hotelsin.com',
    'https://hotelsin.com',
    -8.5069,
    115.2625,
    '/images/logo.svg',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80&auto=format&fit=crop',
    ARRAY['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80']
  ) RETURNING id INTO prop_id;

  -- Amenities
  INSERT INTO amenities (name, icon, category) VALUES
    ('{"en":"Private Pool","id":"Kolam Pribadi"}','waves','wellness'),
    ('{"en":"Outdoor Shower","id":"Shower Outdoor"}','droplets','wellness'),
    ('{"en":"King Bed","id":"King Bed"}','bed','comfort'),
    ('{"en":"Valley View","id":"Pemandangan Lembah"}','mountain','view'),
    ('{"en":"Butler Service","id":"Layanan Butler"}','concierge','service'),
    ('{"en":"Minibar","id":"Minibar"}','wine','dining'),
    ('{"en":"Espresso Machine","id":"Mesin Espresso"}','coffee','dining'),
    ('{"en":"Bath Soak","id":"Berendam"}','bath','wellness'),
    ('{"en":"Yoga Deck","id":"Dek Yoga"}','lotus','wellness'),
    ('{"en":"Fire Pit","id":"Api Unggun"}','flame','outdoor');

  -- Room Types (5)
  INSERT INTO room_types (property_id, name, description, short_description, base_price, max_occupancy, size_sqm, bed_type, images, is_active, sort_order) VALUES
    (prop_id, '{"en":"Ocean Residence","id":"Ocean Residence"}','{"en":"Our most expansive residence, perched at the valley edge with 180-degree jungle and river views. Four bedrooms, private infinity pool, chef kitchen and dedicated butler pavilion.","id":"Residensi terluas kami di tepi lembah dengan panorama hutan dan sungai 180 derajat. Empat kamar, kolam infinity pribadi, dapur chef dan paviliun butler."}','{"en":"Four-bedroom valley-edge sanctuary","id":"Sanctuary tepi lembah empat kamar"}', 890, 8, 380, '{"en":"4 King Beds","id":"4 King Bed"}', ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80','https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'], true, 1),
    (prop_id, '{"en":"Garden Villa","id":"Garden Villa"}','{"en":"Nested within frangipani and banana groves, Garden Villa is our most intimate retreat. One bedroom, open-air living pavilion, 12m pool and outdoor shower beneath the stars.","id":"Tersembunyi di antara frangipani dan pisang, Garden Villa adalah retret paling intim."}','{"en":"Intimate one-bedroom hideaway","id":"Persembunyian intim satu kamar"}', 520, 2, 210, '{"en":"1 King Bed","id":"1 King Bed"}', ARRAY['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'], true, 2),
    (prop_id, '{"en":"Cliff Villa","id":"Cliff Villa"}','{"en":"Cantilevered over the Ayung gorge, Cliff Villa feels suspended above the canopy. Two bedrooms, double-height living space and a 16m cliff-edge pool.","id":"Menggantung di atas ngarai Ayung, Cliff Villa terasa melayang di atas kanopi."}','{"en":"Two-bedroom cantilevered over the gorge","id":"Dua kamar menggantung di ngarai"}', 680, 4, 290, '{"en":"2 King Beds","id":"2 King Bed"}', ARRAY['https://images.unsplash.com/photo-1578683010236-d716f649c0d8?w=1200&q=80','https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80'], true, 3),
    (prop_id, '{"en":"Private Estate","id":"Private Estate"}','{"en":"A complete private estate — three standalone pavilions, 25m lap pool, cinema bale, spa bale and full staff including chef, butler and host.","id":"Estate pribadi lengkap — tiga paviliun, kolam 25m, bale cinema, bale spa dan staf penuh."}','{"en":"Three-pavilion private estate with full staff","id":"Estate tiga paviliun dengan staf penuh"}', 1450, 6, 520, '{"en":"3 King Beds","id":"3 King Bed"}', ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'], true, 4),
    (prop_id, '{"en":"Jungle Loft","id":"Jungle Loft"}','{"en":"A contemporary loft tucked into the hillside forest. Floor-to-ceiling glass, mezzanine bedroom, writer desk and jungle-facing soaking tub.","id":"Loft kontemporer di hutan bukit. Kaca setinggi plafon, mezzanine, meja penulis dan bath menghadap hutan."}','{"en":"Contemporary loft for the creative traveler","id":"Loft kontemporer untuk pelancong kreatif"}', 420, 2, 140, '{"en":"1 King Bed","id":"1 King Bed"}', ARRAY['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80'], true, 5)
  ;

  SELECT id INTO rt_ocean FROM room_types WHERE property_id=prop_id AND name->>'en'='Ocean Residence';
  SELECT id INTO rt_garden FROM room_types WHERE property_id=prop_id AND name->>'en'='Garden Villa';
  SELECT id INTO rt_cliff FROM room_types WHERE property_id=prop_id AND name->>'en'='Cliff Villa';
  SELECT id INTO rt_estate FROM room_types WHERE property_id=prop_id AND name->>'en'='Private Estate';
  SELECT id INTO rt_jungle FROM room_types WHERE property_id=prop_id AND name->>'en'='Jungle Loft';

  -- Rooms (21)
  INSERT INTO rooms (property_id, room_type_id, room_number, floor, status) VALUES
    (prop_id, rt_ocean, 'OR-101', 1, 'AVAILABLE'), (prop_id, rt_ocean, 'OR-102', 1, 'OCCUPIED'), (prop_id, rt_ocean, 'OR-103', 1, 'RESERVED'), (prop_id, rt_ocean, 'OR-104', 2, 'AVAILABLE'),
    (prop_id, rt_garden, 'GV-201', 1, 'AVAILABLE'), (prop_id, rt_garden, 'GV-202', 1, 'CLEANING'), (prop_id, rt_garden, 'GV-203', 1, 'AVAILABLE'), (prop_id, rt_garden, 'GV-204', 1, 'DIRTY'), (prop_id, rt_garden, 'GV-205', 2, 'AVAILABLE'), (prop_id, rt_garden, 'GV-206', 2, 'MAINTENANCE'),
    (prop_id, rt_cliff, 'CV-301', 1, 'AVAILABLE'), (prop_id, rt_cliff, 'CV-302', 1, 'OCCUPIED'), (prop_id, rt_cliff, 'CV-303', 2, 'AVAILABLE'), (prop_id, rt_cliff, 'CV-304', 2, 'RESERVED'),
    (prop_id, rt_estate, 'PE-401', 1, 'AVAILABLE'), (prop_id, rt_estate, 'PE-402', 1, 'AVAILABLE'),
    (prop_id, rt_jungle, 'JL-501', 1, 'AVAILABLE'), (prop_id, rt_jungle, 'JL-502', 1, 'AVAILABLE'), (prop_id, rt_jungle, 'JL-503', 2, 'CLEANING'), (prop_id, rt_jungle, 'JL-504', 2, 'AVAILABLE'), (prop_id, rt_jungle, 'JL-505', 2, 'OUT_OF_SERVICE');
END $$;
