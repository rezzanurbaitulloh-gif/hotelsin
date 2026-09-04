-- HotelsIn Remaining Seed Data — guests, reservations, offers, F&B, spa, experiences, gallery, journal, operations
DO $$
DECLARE
  prop_id UUID;
  rt_ocean UUID; rt_garden UUID; rt_cliff UUID; rt_estate UUID; rt_jungle UUID;
  room_or101 UUID; room_or102 UUID; room_gv201 UUID; room_cv301 UUID;
  guest_ids UUID[] := '{}';
  g UUID;
  r_id UUID;
  today DATE := CURRENT_DATE;
  i INT;
BEGIN
  SELECT id INTO prop_id FROM properties LIMIT 1;
  SELECT id INTO rt_ocean FROM room_types WHERE property_id=prop_id AND name->>'en'='Ocean Residence';
  SELECT id INTO rt_garden FROM room_types WHERE property_id=prop_id AND name->>'en'='Garden Villa';
  SELECT id INTO rt_cliff FROM room_types WHERE property_id=prop_id AND name->>'en'='Cliff Villa';
  SELECT id INTO rt_estate FROM room_types WHERE property_id=prop_id AND name->>'en'='Private Estate';
  SELECT id INTO rt_jungle FROM room_types WHERE property_id=prop_id AND name->>'en'='Jungle Loft';
  SELECT id INTO room_or101 FROM rooms WHERE room_number='OR-101';
  SELECT id INTO room_or102 FROM rooms WHERE room_number='OR-102';
  SELECT id INTO room_gv201 FROM rooms WHERE room_number='GV-201';
  SELECT id INTO room_cv301 FROM rooms WHERE room_number='CV-301';

  -- Guests (30)
  INSERT INTO guests (property_id, first_name, last_name, email, phone, city, country, nationality, vip_status, preferences) VALUES
    (prop_id, 'Elena', 'Marinova', 'elena.m@example.com', '+33 6 12 34 56 78', 'Paris', 'France', 'French', true, '{"pillow":"firm","diet":"vegetarian"}'),
    (prop_id, 'Kenji', 'Tanaka', 'kenji.t@example.com', '+81 90 1234 5678', 'Tokyo', 'Japan', 'Japanese', true, '{"pillow":"soft"}'),
    (prop_id, 'Amara', 'Okafor', 'amara.o@example.com', '+234 801 234 5678', 'Lagos', 'Nigeria', 'Nigerian', false, '{}'),
    (prop_id, 'Oliver', 'Bennett', 'oliver.b@example.com', '+44 7700 900123', 'London', 'United Kingdom', 'British', false, '{}'),
    (prop_id, 'Sofia', 'Hernandez', 'sofia.h@example.com', '+34 612 345 678', 'Madrid', 'Spain', 'Spanish', true, '{}'),
    (prop_id, 'Liam', 'OConnor', 'liam.o@example.com', '+353 87 123 4567', 'Dublin', 'Ireland', 'Irish', false, '{}'),
    (prop_id, 'Mei', 'Chen', 'mei.c@example.com', '+86 138 0013 8000', 'Shanghai', 'China', 'Chinese', false, '{}'),
    (prop_id, 'Arjun', 'Patel', 'arjun.p@example.com', '+91 98765 43210', 'Mumbai', 'India', 'Indian', false, '{}'),
    (prop_id, 'Isabella', 'Rossi', 'isabella.r@example.com', '+39 320 123 4567', 'Milan', 'Italy', 'Italian', true, '{}'),
    (prop_id, 'Maya', 'Suryani', 'maya.suryani@example.com', '+62 812 3456 7890', 'Denpasar', 'Indonesia', 'Indonesian', false, '{}'),
    (prop_id, 'David', 'Kim', 'david.kim@example.com', '+1 415 555 0123', 'San Francisco', 'United States', 'American', false, '{}'),
    (prop_id, 'Aisha', 'Al-Rashid', 'aisha.ar@example.com', '+971 50 123 4567', 'Dubai', 'United Arab Emirates', 'Emirati', true, '{}'),
    (prop_id, 'Noah', 'Andersen', 'noah.a@example.com', '+45 12 34 56 78', 'Copenhagen', 'Denmark', 'Danish', false, '{}'),
    (prop_id, 'Chloe', 'Williams', 'chloe.w@example.com', '+61 412 345 678', 'Sydney', 'Australia', 'Australian', false, '{}'),
    (prop_id, 'Hiroshi', 'Yamada', 'hiroshi.y@example.com', '+81 80 9876 5432', 'Kyoto', 'Japan', 'Japanese', false, '{}'),
    (prop_id, 'Fatima', 'El Amrani', 'fatima.e@example.com', '+212 6 12 34 56 78', 'Marrakech', 'Morocco', 'Moroccan', false, '{}'),
    (prop_id, 'Ethan', 'Thompson', 'ethan.t@example.com', '+1 212 555 0199', 'New York', 'United States', 'American', true, '{}'),
    (prop_id, 'Nadia', 'Putri', 'nadia.putri@example.com', '+62 813 9876 5432', 'Jakarta', 'Indonesia', 'Indonesian', false, '{}'),
    (prop_id, 'Alex', 'Petrov', 'alex.p@example.com', '+7 916 123 4567', 'Moscow', 'Russia', 'Russian', false, '{}'),
    (prop_id, 'Luna', 'Fernandez', 'luna.f@example.com', '+54 11 1234 5678', 'Buenos Aires', 'Argentina', 'Argentinian', false, '{}'),
    (prop_id, 'Omar', 'Hassan', 'omar.h@example.com', '+20 100 123 4567', 'Cairo', 'Egypt', 'Egyptian', false, '{}'),
    (prop_id, 'Grace', 'Lee', 'grace.lee@example.com', '+65 9123 4567', 'Singapore', 'Singapore', 'Singaporean', true, '{}'),
    (prop_id, 'Marco', 'Bianchi', 'marco.b@example.com', '+39 333 987 6543', 'Rome', 'Italy', 'Italian', false, '{}'),
    (prop_id, 'Yuki', 'Sato', 'yuki.s@example.com', '+81 70 1234 5678', 'Osaka', 'Japan', 'Japanese', false, '{}'),
    (prop_id, 'Ava', 'Johnson', 'ava.j@example.com', '+1 310 555 0142', 'Los Angeles', 'United States', 'American', false, '{}'),
    (prop_id, 'Ravi', 'Kumar', 'ravi.k@example.com', '+91 98101 23456', 'Delhi', 'India', 'Indian', false, '{}'),
    (prop_id, 'Emma', 'Wilson', 'emma.w@example.com', '+44 7911 123456', 'Edinburgh', 'United Kingdom', 'British', false, '{}'),
    (prop_id, 'Budi', 'Santoso', 'budi.santoso@example.com', '+62 811 2222 3333', 'Surabaya', 'Indonesia', 'Indonesian', false, '{}'),
    (prop_id, 'Zara', 'Ahmed', 'zara.ahmed@example.com', '+92 300 123 4567', 'Karachi', 'Pakistan', 'Pakistani', false, '{}'),
    (prop_id, 'Lucas', 'Silva', 'lucas.silva@example.com', '+55 11 98765 4321', 'São Paulo', 'Brazil', 'Brazilian', true, '{}');

  SELECT array_agg(id) INTO guest_ids FROM guests WHERE property_id=prop_id;

  -- Offers (10+)
  INSERT INTO offers (property_id, name, description, discount_type, discount_value, min_nights, applicable_room_type_ids, valid_from, valid_to, is_active, image_url, terms) VALUES
    (prop_id, '{"en":"Long Stay — 7 for 5","id":"Long Stay — 7 untuk 5"}','{"en":"Stay seven nights, pay for five. For slow travelers who want to disappear for a while.","id":"Menginap tujuh malam, bayar lima. Untuk pelancong yang ingin menghilang sejenak."}','percentage', 28.57, 7, ARRAY[rt_garden, rt_jungle], today - 30, today + 90, true, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80','{"en":"Min 7 nights, non-refundable, book 14 days ahead","id":"Min 7 malam, non-refundable, pesan 14 hari sebelumnya"}'),
    (prop_id, '{"en":"Romantic Escape","id":"Pelarian Romantis"}','{"en":"Three nights in Garden Villa with private floating breakfast, couples spa and sunset river cruise.","id":"Tiga malam di Garden Villa dengan floating breakfast, spa pasangan dan kapal sunset."}','percentage', 15, 3, ARRAY[rt_garden, rt_cliff], today - 10, today + 60, true, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80','{"en":"Includes breakfast, spa and cruise","id":"Termasuk sarapan, spa dan kapal"}'),
    (prop_id, '{"en":"Wellness Retreat","id":"Retret Wellness"}','{"en":"Five nights with daily yoga, healing treatments and nutrition consultation.","id":"Lima malam dengan yoga harian, perawatan healing dan konsultasi nutrisi."}','fixed', 300, 5, ARRAY[rt_garden, rt_jungle, rt_cliff], today - 20, today + 120, true, 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80','{"en":"Wellness inclusion package","id":"Paket inklusi wellness"}'),
    (prop_id, '{"en":"Family Sanctuary","id":"Sanctuary Keluarga"}','{"en":"Ocean Residence for families — interconnecting? Dedicated kids program and family chef.","id":"Ocean Residence untuk keluarga — program anak dan chef keluarga."}','percentage', 10, 4, ARRAY[rt_ocean, rt_estate], today - 5, today + 90, true, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80','{"en":"Family package, kids eat free","id":"Paket keluarga, anak makan gratis"}'),
    (prop_id, '{"en":"Seasonal Journey — Green Season","id":"Perjalanan Musim — Musim Hijau"}','{"en":"Celebrate Bali green season with complimentary experiences and spa credit.","id":"Rayakan musim hijau Bali dengan pengalaman gratis dan kredit spa."}','percentage', 20, 2, ARRAY[rt_garden, rt_cliff, rt_jungle], today - 15, today + 45, true, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80','{"en":"Green season special","id":"Spesial musim hijau"}'),
    (prop_id, '{"en":"Honeymoon Private Estate","id":"Bulan Madu Private Estate"}','{"en":"Seven nights buyout of Private Estate with vow renewal ceremony in jungle temple.","id":"Tujuh malam buyout Private Estate dengan upacara pembaruan janji di pura hutan."}','fixed', 1200, 7, ARRAY[rt_estate], today, today + 180, true, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80','{"en":"Private estate buyout special","id":"Spesial buyout estate"}'),
    (prop_id, '{"en":"Cultural Immersion","id":"Imersi Budaya"}','{"en":"Four nights with temple blessings, gamelan lessons and artisan village tours.","id":"Empat malam dengan pemberkatan pura, les gamelan dan tur desa pengrajin."}','percentage', 12, 4, ARRAY[rt_garden, rt_jungle], today - 10, today + 70, true, 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80','{"en":"Culture package","id":"Paket budaya"}'),
    (prop_id, '{"en":"Spa Sanctuary","id":"Sanctuary Spa"}','{"en":"Credit for our healing spa — boreh, lulur and chakra balancing.","id":"Kredit spa healing — boreh, lulur dan chakra balancing."}','fixed', 200, 2, ARRAY[rt_garden, rt_cliff, rt_ocean], today, today + 60, true, 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80','{"en":"Spa credit offer","id":"Penawaran kredit spa"}'),
    (prop_id, '{"en":"Early Bird — 14 Days","id":"Early Bird — 14 Hari"}','{"en":"Book 14 days ahead for savings on any villa.","id":"Pesan 14 hari sebelumnya untuk hemat di villa mana pun."}','percentage', 18, 2, ARRAY[rt_ocean, rt_garden, rt_cliff, rt_jungle, rt_estate], today - 30, today + 100, true, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80','{"en":"Advance purchase","id":"Pembelian di muka"}'),
    (prop_id, '{"en":"Returning Guest","id":"Tamu Kembali"}','{"en":"For those who return — additional benefits and private dinner in the rice terraces.","id":"Untuk yang kembali — benefit tambahan dan makan malam pribadi di sawah."}','percentage', 10, 2, ARRAY[rt_ocean, rt_garden, rt_cliff, rt_jungle, rt_estate], today - 30, today + 365, true, 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80','{"en":"Loyalty offer","id":"Penawaran loyalitas"}');

  -- Restaurants (5)
  INSERT INTO restaurants (property_id, name, description, cuisine, atmosphere, hours, images, is_active, sort_order) VALUES
    (prop_id, '{"en":"Ember & Earth","id":"Ember & Earth"}','{"en":"Wood-fired tasting menu built from volcanic soil. Eight courses, one table, no menu — just the island on a plate.","id":"Menu tasting kayu bakar dari tanah vulkanik. Delapan sajian, satu meja, tanpa menu — hanya pulau di atas piring."}','{"en":"Contemporary Balinese — wood fire","id":"Bali kontemporer — kayu bakar"}','{"en":"Intimate, open kitchen, valley view","id":"Intim, dapur terbuka, pemandangan lembah"}','{"en":"Dinner 18:00–22:00, closed Tue","id":"Makan malam 18:00–22:00, tutup Selasa"}', ARRAY['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80'], true, 1),
    (prop_id, '{"en":"Sayan Terrace","id":"Sayan Terrace"}','{"en":"All-day dining above the rice terraces. Wood-fired pizzas, fresh catches and island salads.","id":"Makan sepanjang hari di atas sawah. Pizza kayu bakar, hasil laut segar dan salad pulau."}','{"en":"Mediterranean — Indonesian","id":"Mediterania — Indonesia"}','{"en":"Open-air, breezy, family-friendly","id":"Terbuka, berangin, ramah keluarga"}','{"en":"06:30–22:30 daily","id":"06:30–22:30 setiap hari"}', ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'], true, 2),
    (prop_id, '{"en":"River Café","id":"River Café"}','{"en":"Casual café by the Ayung. Cold-pressed juices, smoothie bowls and light bites after rafting.","id":"Kafe kasual di tepi Ayung. Jus cold-pressed, smoothie bowl dan bites ringan setelah rafting."}','{"en":"Healthy café","id":"Kafe sehat"}','{"en":"Riverside, casual, barefoot","id":"Tepi sungai, kasual, barefoot"}','{"en":"08:00–17:00 daily","id":"08:00–17:00 setiap hari"}', ARRAY['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80'], true, 3),
    (prop_id, '{"en":"Jungle Bar","id":"Jungle Bar"}','{"en":"Sunset cocktails infused with arak, lemongrass and jungle honey. DJ on Fridays.","id":"Koktail sunset dengan arak, serai dan madu hutan. DJ setiap Jumat."}','{"en":"Cocktails — arak infusions","id":"Koktail — infusi arak"}','{"en":"Sunset, sounds, starlight","id":"Sunset, suara, cahaya bintang"}','{"en":"16:00–24:00 daily","id":"16:00–24:00 setiap hari"}', ARRAY['https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80'], true, 4),
    (prop_id, '{"en":"Private Dining","id":"Private Dining"}','{"en":"Chef at your villa — floating breakfasts, jungle banquets and candlelit terrace dinners.","id":"Chef di villa Anda — floating breakfast, jamuan hutan dan makan malam teras candlelit."}','{"en":"Bespoke — villa dining","id":"Bespoke — makan di villa"}','{"en":"Private, bespoke, anywhere","id":"Pribadi, bespoke, di mana saja"}','{"en":"On request","id":"Sesuai permintaan"}', ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80'], true, 5);

  -- Spa Services (10)
  INSERT INTO spa_services (property_id, name, description, duration_minutes, price, category, images, is_active, sort_order) VALUES
    (prop_id, '{"en":"Ayung Boreh Ritual","id":"Ritual Boreh Ayung"}','{"en":"Traditional Balinese spice scrub with turmeric, ginger and rice — followed by river-stone massage.","id":"Scrub rempah tradisional Bali dengan kunyit, jahe dan beras — dilanjut pijat batu sungai."}', 120, 180, 'Ritual', ARRAY['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'], true, 1),
    (prop_id, '{"en":"Chakra Balancing","id":"Chakra Balancing"}','{"en":"Energy healing with singing bowls and breathwork in our forest bale.","id":"Healing energi dengan mangkuk nyanyian dan breathwork di bale hutan."}', 90, 150, 'Healing', ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'], true, 2),
    (prop_id, '{"en":"Jungle Lulur","id":"Lulur Hutan"}','{"en":"Turmeric lulur polish and frangipani milk bath overlooking the valley.","id":"Polish lulur kunyit dan mandi susu frangipani menghadap lembah."}', 90, 140, 'Body', ARRAY['https://images.unsplash.com/photo-1545389336-cf090694435e?w=800&q=80'], true, 3),
    (prop_id, '{"en":"River Stone Massage","id":"Pijat Batu Sungai"}','{"en":"Deep tissue with warm stones collected from the Ayung.","id":"Deep tissue dengan batu hangat dari Ayung."}', 90, 160, 'Massage', ARRAY['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'], true, 4),
    (prop_id, '{"en":"Sunrise Yoga — Private","id":"Yoga Matahari Terbit — Private"}','{"en":"Private session at dawn on your villa deck with our resident teacher.","id":"Sesi private saat fajar di dek villa dengan guru kami."}', 75, 80, 'Yoga', ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'], true, 5),
    (prop_id, '{"en":"Sound Healing","id":"Sound Healing"}','{"en":"Gong bath at sunset in the jungle temple.","id":"Mandi gong saat sunset di pura hutan."}', 60, 90, 'Healing', ARRAY['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80'], true, 6),
    (prop_id, '{"en":"Couples Sanctuary","id":"Sanctuary Pasangan"}','{"en":"Side-by-side ritual for two with champagne and valley view bath.","id":"Ritual berdampingan untuk dua dengan sampanye dan bath pemandangan lembah."}', 150, 320, 'Ritual', ARRAY['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'], true, 7),
    (prop_id, '{"en":"Herbal Compress","id":"Kompres Herbal"}','{"en":"Warm herbal poultice massage with lemongrass and kaffir lime.","id":"Pijat kompres herbal hangat dengan serai dan jeruk purut."}', 90, 130, 'Massage', ARRAY['https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80'], true, 8),
    (prop_id, '{"en":"Detox Nutrition Consult","id":"Konsultasi Nutrisi Detox"}','{"en":"One-to-one with our nutritionist plus bespoke juice plan.","id":"Satu-satu dengan ahli nutrisi plus rencana jus bespoke."}', 60, 100, 'Wellness', ARRAY['https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80'], true, 9),
    (prop_id, '{"en":"Midnight Meditation","id":"Meditasi Tengah Malam"}','{"en":"Guided meditation under the stars, forest sounds only.","id":"Meditasi terpandu di bawah bintang, hanya suara hutan."}', 45, 60, 'Healing', ARRAY['https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80'], true, 10);

  -- Experiences (10+)
  INSERT INTO experiences (property_id, name, description, duration, price, category, images, is_active, sort_order) VALUES
    (prop_id, '{"en":"Dawn Temple Blessing","id":"Pemberkatan Pura Fajar"}','{"en":"Private blessing at Tirta Empul with our priest before sunrise. Sarong, offerings and holy water.","id":"Pemberkatan pribadi di Tirta Empul dengan pemangku sebelum fajar. Sarung, canang dan air suci."}','{"en":"4 hours","id":"4 jam"}', 120, 'Culture', ARRAY['https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80'], true, 1),
    (prop_id, '{"en":"Rice Terrace Cycling","id":"Bersepeda Sawah"}','{"en":"Easy ride through Sidemen terraces with picnic among the stalks.","id":"Bersepeda ringan melewati terasering Sidemen dengan piknik di antara batang padi."}','{"en":"3 hours","id":"3 jam"}', 85, 'Nature', ARRAY['https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80'], true, 2),
    (prop_id, '{"en":"Ayung River Rafting","id":"Arung Jeram Ayung"}','{"en":"Private raft with guide, through gorges and past hidden shrines.","id":"Raft pribadi dengan pemandu, melewati ngarai dan pura tersembunyi."}','{"en":"3.5 hours","id":"3,5 jam"}', 110, 'Adventure', ARRAY['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'], true, 3),
    (prop_id, '{"en":"Balinese Cooking — Market to Table","id":"Memasak Bali — Pasar ke Meja"}','{"en":"Morning market with chef, then cook lawar, sate lilit and jaja in your villa.","id":"Pasar pagi dengan chef, lalu masak lawar, sate lilit dan jaja di villa."}','{"en":"5 hours","id":"5 jam"}', 140, 'Culinary', ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'], true, 4),
    (prop_id, '{"en":"Private Balinese Feast in the Forest","id":"Pesta Bali Pribadi di Hutan"}','{"en":"Long table in the jungle, gamelan trio and starlight. Chef menu 7 courses.","id":"Meja panjang di hutan, trio gamelan dan cahaya bintang. Menu chef 7 hidangan."}','{"en":"4 hours","id":"4 jam"}', 180, 'Culinary', ARRAY['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80'], true, 5),
    (prop_id, '{"en":"Sunset River Cruise","id":"Kapal Sunset Sungai"}','{"en":"Small boat at golden hour, champagne and canapes with kingfisher sightings.","id":"Perahu kecil di golden hour, sampanye dan canape dengan kingfisher."}','{"en":"2 hours","id":"2 jam"}', 90, 'Romance', ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80'], true, 6),
    (prop_id, '{"en":"Weaver of Sidemen — Private Visit","id":"Penenun Sidemen — Kunjungan Pribadi"}','{"en":"Meet master weaver in her compound, try the backstrap loom, take home your textile.","id":"Temui penenun master di compound-nya, coba alat tenun gendong, bawa pulang tekstil Anda."}','{"en":"3 hours","id":"3 jam"}', 95, 'Culture', ARRAY['https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80'], true, 7),
    (prop_id, '{"en":"Jungle Trek — Hidden Waterfall","id":"Trek Hutan — Air Terjun Tersembunyi"}','{"en":"Guide-led trek to a falls known only to locals, swim and picnic.","id":"Trek dipandu ke air terjun yang hanya diketahui warga lokal, berenang dan piknik."}','{"en":"4 hours","id":"4 jam"}', 100, 'Nature', ARRAY['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80'], true, 8),
    (prop_id, '{"en":"Gamelan Lesson","id":"Les Gamelan"}','{"en":"Learn reyong and kendang with village musicians in the bale.","id":"Belajar reyong dan kendang dengan musisi desa di bale."}','{"en":"1.5 hours","id":"1,5 jam"}', 60, 'Culture', ARRAY['https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80'], true, 9),
    (prop_id, '{"en":"Starlight Cinema — Private","id":"Bioskop Starlight — Private"}','{"en":"Film under the stars in your villa garden, popcorn and nightcaps.","id":"Film di bawah bintang di taman villa, popcorn dan nightcap."}','{"en":"3 hours","id":"3 jam"}', 70, 'Romance', ARRAY['https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'], true, 10);

  -- Gallery (30)
  FOR i IN 1..30 LOOP
    INSERT INTO gallery_items (property_id, image_url, alt_text, caption, category, sort_order, is_active)
    VALUES (prop_id,
      'https://images.unsplash.com/photo-' || (CASE WHEN i % 5 =0 THEN '1571896349842-33c89424de2d' WHEN i %5=1 THEN '1520250497591-112f2f40a3f4' WHEN i %5=2 THEN '1582719478250-c89cae4dc85b' WHEN i %5=3 THEN '1566073771259-6a8506099945' ELSE '1600607687939-ce8a6c25118c' END) || '?w=800&q=80',
      ('{"en":"HotelsIn gallery '||i||'","id":"Galeri HotelsIn '||i||'"}')::jsonb,
      ('{"en":"Captured moment '||i||' — architecture and nature in harmony","id":"Momen '||i||' — arsitektur dan alam harmoni"}')::jsonb,
      (CASE WHEN i %3=0 THEN 'architecture' WHEN i %3=1 THEN 'nature' ELSE 'dining' END),
      i, true);
  END LOOP;

  -- Journal (10)
  INSERT INTO journal_posts (property_id, slug, title, excerpt, content, cover_image_url, author, category, tags, status, published_at) VALUES
    (prop_id, 'weaver-of-sidemen', '{"en":"The Weaver of Sidemen","id":"Penenun Sidemen"}','{"en":"In a compound where looms click like rain, one woman keeps a dying craft alive.","id":"Di compound di mana alat tenun berdetak seperti hujan, seorang wanita menjaga kerajinan yang sekarat."}','{"en":"Long-form story about Sidemen weaver — how natural dyes from mangosteen and indigo, the rhythm of the backstrap loom, and the village belief that cloth holds memory. Interview and portraits.","id":"Kisah panjang tentang penenun Sidemen — pewarna alami dari manggis dan indigo, ritme alat tenun gendong, kepercayaan desa bahwa kain menyimpan memori."}','https://images.unsplash.com/photo-1528164344705-47542687000d?w=800&q=80','Aria Kartika','Culture', ARRAY['culture','textile','bali'], 'PUBLISHED', today - 10),
    (prop_id, 'guide-to-balinese-offerings', '{"en":"A Guide to Balinese Offerings","id":"Panduan Canang Bali"}','{"en":"Why every morning begins with a small palm-leaf tray of flowers and what each color means.","id":"Mengapa setiap pagi dimulai dengan nampan daun palem berisi bunga dan apa arti setiap warna."}','{"en":"Explain canang sari — its structure, symbolism, placement and the quiet discipline of daily offering.","id":"Jelaskan canang sari — struktur, simbolisme, penempatan dan disiplin harian persembahan."}','https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80','Maya Suryani','Wellness', ARRAY['wellness','ritual'], 'PUBLISHED', today - 5),
    (prop_id, 'architecture-without-air-conditioning', '{"en":"Architecture Without Air Conditioning","id":"Arsitektur Tanpa AC"}','{"en":"How cross-ventilation, volcanic stone and deep eaves keep villas cool.","id":"Bagaimana ventilasi silang, batu vulkanik dan eaves dalam menjaga villa tetap sejuk."}','{"en":"Design essay on passive cooling, orientation and the decision to never install AC.","id":"Esai desain tentang pendinginan pasif, orientasi dan keputusan untuk tidak pernah memasang AC."}','https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80','Thomas Delacroix','Architecture', ARRAY['architecture','design'], 'PUBLISHED', today - 2),
    (prop_id, 'rice-terrace-seasons', '{"en":"Rice Terrace Seasons","id":"Musim Sawah"}','{"en":"Subak, the water temple system that UNESCO calls a cultural landscape.","id":"Subak, sistem pura air yang disebut UNESCO lanskap budaya."}','{"en":"Follow rice from nursery to harvest and the ceremonies that mark each stage.","id":"Ikuti padi dari persemaian ke panen dan upacara yang menandai tiap tahap."}','https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80','Ketut Wirama','Nature', ARRAY['nature','bali'], 'PUBLISHED', today - 12),
    (prop_id, 'volcanic-soil-menu', '{"en":"A Menu Grown from Volcanic Soil","id":"Menu dari Tanah Vulkanik"}','{"en":"Chef Wayan on why Kintamani oranges and Bedugul strawberries taste different.","id":"Chef Wayan tentang mengapa jeruk Kintamani dan stroberi Bedugul terasa berbeda."}','{"en":"Interview on terroir, soil and the sourcing map that covers the island.","id":"Wawancara tentang terroir, tanah dan peta sourcing yang mencakup pulau."}','https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80','Wayan Suardika','Culinary', ARRAY['culinary','chef'], 'PUBLISHED', today - 8),
    (prop_id, 'morning-gamelan', '{"en":"Morning Gamelan","id":"Gamelan Pagi"}','{"en":"The school across the river rehearses at 6am. Why we will never ask them to stop.","id":"Sekolah di seberang sungai latihan jam 6 pagi. Mengapa kami tak akan meminta mereka berhenti."}','{"en":"Reflection on sound, place and the choice to tune architecture to its acoustic environment.","id":"Refleksi tentang suara, tempat dan pilihan menyesuaikan arsitektur dengan lingkungan akustik."}','https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80','Aria Kartika','Culture', ARRAY['culture','sound'], 'PUBLISHED', today - 15),
    (prop_id, 'private-pool-ritual', '{"en":"The Private Pool Ritual","id":"Ritual Kolam Pribadi"}','{"en":"How we clean, heat and perfume each pool before your arrival.","id":"Bagaimana kami membersihkan, memanaskan dan memberi aroma tiap kolam sebelum kedatangan Anda."}','{"en":"Housekeeping essay on water, frangipani and the 4am preparation.","id":"Esai housekeeping tentang air, frangipani dan persiapan jam 4 pagi."}','https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80','Housekeeping Team','Hotel Stories', ARRAY['housekeeping'], 'PUBLISHED', today - 20),
    (prop_id, 'bali-green-season', '{"en":"Why Green Season is the Best Season","id":"Mengapa Musim Hijau Musim Terbaik"}','{"en":"Lush, quiet, affordable — and the light is better for photography.","id":"Subur, tenang, terjangkau — dan cahayanya lebih baik untuk fotografi."}','{"en":"Make the case for visiting Nov–Mar.","id":"Alasan mengunjungi Nov–Mar."}','https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80','Maya Suryani','Travel', ARRAY['travel','season'], 'PUBLISHED', today - 18),
    (prop_id, 'healing-boreh', '{"en":"Healing Boreh","id":"Healing Boreh"}','{"en":"The spice paste that warms, the massage that follows, and why locals swear by it.","id":"Pasta rempah yang menghangatkan, pijatan yang mengikuti, dan mengapa warga lokal bersumpah padanya."}','{"en":"Spa focus on boreh ingredients and technique.","id":"Fokus spa pada bahan dan teknik boreh."}','https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80','Spa Team','Wellness', ARRAY['wellness','spa'], 'PUBLISHED', today - 25),
    (prop_id, 'children-of-hotelsin', '{"en":"Children of HotelsIn","id":"Anak-anak HotelsIn"}','{"en":"Where staff children play after school — and how hospitality is a village.","id":"Di mana anak-anak staf bermain setelah sekolah — dan bagaimana hospitality adalah desa."}','{"en":"Portrait of community around the property.","id":"Potret komunitas di sekitar properti."}','https://images.unsplash.com/photo-1590736969955-71cc9496900f?w=800&q=80','Aria Kartika','Hotel Stories', ARRAY['people'], 'DRAFT', null);

  -- Reservations (30) with realistic dates
  FOR i IN 1..30 LOOP
    g := guest_ids[1 + (i % array_length(guest_ids,1))];
    IF i % 5 = 0 THEN
      INSERT INTO reservations (property_id, guest_id, room_id, room_type_id, check_in, check_out, nights, adults, children, status, source, room_rate, subtotal, tax_amount, fee_amount, discount_amount, total_amount, currency, confirmation_code)
      VALUES (prop_id, g, room_or101, rt_ocean, today - (i*2), today - (i*2) + 3, 3, 2, 0, 'CONFIRMED', 'DIRECT', 890, 2670, 293.7, 133.5, 0, 3097.2, 'USD', 'HI' || lpad(i::text,6,'0'));
    ELSIF i % 5 = 1 THEN
      INSERT INTO reservations (property_id, guest_id, room_id, room_type_id, check_in, check_out, nights, adults, children, status, source, room_rate, subtotal, tax_amount, fee_amount, discount_amount, total_amount, currency, confirmation_code)
      VALUES (prop_id, g, NULL, rt_garden, today + 5 + i, today + 8 + i, 3, 2, 1, 'PENDING', 'OTA', 520, 1560, 171.6, 78, 0, 1809.6, 'USD', 'HI' || lpad((i+100)::text,6,'0'));
    ELSIF i % 5 = 2 THEN
      INSERT INTO reservations (property_id, guest_id, room_id, room_type_id, check_in, check_out, nights, adults, children, status, source, room_rate, subtotal, tax_amount, fee_amount, discount_amount, total_amount, currency, confirmation_code, checked_in_at)
      VALUES (prop_id, g, room_gv201, rt_garden, today -1, today +2, 3, 2, 0, 'CHECKED_IN', 'DIRECT', 520, 1560, 171.6, 78, 200, 1609.6, 'USD', 'HI' || lpad((i+200)::text,6,'0'), now());
    ELSIF i % 5 = 3 THEN
      INSERT INTO reservations (property_id, guest_id, room_id, room_type_id, check_in, check_out, nights, adults, children, status, source, room_rate, subtotal, tax_amount, fee_amount, discount_amount, total_amount, currency, confirmation_code, cancelled_at, cancellation_reason)
      VALUES (prop_id, g, NULL, rt_cliff, today + 10 + i, today + 12 + i, 2, 2, 0, 'CANCELLED', 'DIRECT', 680, 1360, 149.6, 68, 0, 1577.6, 'USD', 'HI' || lpad((i+300)::text,6,'0'), now(), 'Change of plans');
    ELSE
      INSERT INTO reservations (property_id, guest_id, room_id, room_type_id, check_in, check_out, nights, adults, children, status, source, room_rate, subtotal, tax_amount, fee_amount, discount_amount, total_amount, currency, confirmation_code, checked_out_at)
      VALUES (prop_id, g, room_cv301, rt_cliff, today -10, today -7, 3, 2, 0, 'CHECKED_OUT', 'DIRECT', 680, 2040, 224.4, 102, 0, 2366.4, 'USD', 'HI' || lpad((i+400)::text,6,'0'), now());
    END IF;
  END LOOP;

  -- Transactions from reservations
  INSERT INTO transactions (property_id, reservation_id, guest_id, type, amount, currency, payment_method, status, reference)
  SELECT property_id, id, guest_id, 'ROOM_REVENUE', total_amount, currency, 'CARD', CASE WHEN status='CANCELLED' THEN 'REFUNDED' WHEN status IN ('CONFIRMED','CHECKED_IN','CHECKED_OUT') THEN 'COMPLETED' ELSE 'PENDING' END, confirmation_code FROM reservations WHERE status IN ('CONFIRMED','CHECKED_IN','CHECKED_OUT','CANCELLED') LIMIT 20;

  -- Housekeeping tasks
  INSERT INTO housekeeping_tasks (property_id, room_id, status, priority, notes)
  SELECT prop_id, id, (CASE WHEN status='DIRTY' THEN 'PENDING' WHEN status='CLEANING' THEN 'IN_PROGRESS' WHEN status='OCCUPIED' THEN 'PENDING' ELSE 'COMPLETED' END), 'NORMAL', 'Daily turnover' FROM rooms LIMIT 10;
  INSERT INTO housekeeping_tasks (property_id, room_id, status, priority, notes) VALUES (prop_id, room_gv201, 'PENDING', 'HIGH', 'VIP arrival preparation — frangipani turndown');

  -- Maintenance
  INSERT INTO maintenance_tasks (property_id, room_id, title, description, priority, status) VALUES
    (prop_id, (SELECT id FROM rooms WHERE room_number='GV-206'), 'AC filter replacement', 'Quarterly filter change and duct check', 'NORMAL', 'OPEN'),
    (prop_id, (SELECT id FROM rooms WHERE room_number='JL-505'), 'Pool pump noise', 'Inspect pump bearing', 'HIGH', 'IN_PROGRESS'),
    (prop_id, NULL, 'Garden path lighting', 'Replace 3 path lights near spa bale', 'LOW', 'OPEN'),
    (prop_id, (SELECT id FROM rooms WHERE room_number='CV-302'), 'Shower pressure low', 'Check pressure regulator', 'NORMAL', 'RESOLVED');

  -- Guest requests
  INSERT INTO guest_requests (property_id, guest_id, room_id, title, description, priority, status)
  VALUES
    (prop_id, guest_ids[1], room_or102, 'Extra blanket', 'Guest requests additional blanket for child', 'NORMAL', 'PENDING'),
    (prop_id, guest_ids[2], room_gv201, 'Anniversary cake', 'Surprise cake for anniversary dinner', 'HIGH', 'IN_PROGRESS'),
    (prop_id, guest_ids[3], room_cv301, 'Late checkout', 'Requests 14:00 checkout', 'NORMAL', 'RESOLVED'),
    (prop_id, guest_ids[4], NULL, 'Airport transfer — reschedule', 'Move pickup from 10:00 to 11:30', 'URGENT', 'PENDING');

  -- Page sections (homepage)
  INSERT INTO page_sections (property_id, page_id, section_key, section_type, content, sort_order, is_active) VALUES
    (prop_id, 'homepage', 'hero', 'hero', '{"en":{"headline":"A QUIETER WAY TO ARRIVE","subheadline":"A private sanctuary shaped by architecture, nature and time.","cta":"RESERVE YOUR STAY"},"id":{"headline":"CARA LEBIH TENANG UNTUK TIBA","subheadline":"Suaka pribadi yang dibentuk oleh arsitektur, alam dan waktu.","cta":"PESAN PENGINAPAN ANDA"}}', 1, true),
    (prop_id, 'homepage', 'brand_statement', 'text', '{"en":{"title":"Architecture that breathes with the landscape"},"id":{"title":"Arsitektur yang bernafas dengan lanskap"}}', 2, true);

  -- Users (admin) — note: supabase auth users separate; this is operational table
  INSERT INTO users (property_id, email, first_name, last_name, role, permissions, is_active) VALUES
    (prop_id, 'admin@hotelsin.com', 'Super', 'Admin', 'SUPER_ADMIN', ARRAY['rooms.read','rooms.create','rooms.update','rooms.delete','reservations.read','reservations.create','reservations.update','reservations.cancel','content.read','content.create','content.update','content.delete','content.publish','users.read','users.create','users.update','users.delete'], true),
    (prop_id, 'manager@hotelsin.com', 'Hotel', 'Manager', 'HOTEL_ADMIN', ARRAY['rooms.read','rooms.update','reservations.read','reservations.create','reservations.update','content.read','content.update'], true),
    (prop_id, 'frontdesk@hotelsin.com', 'Front', 'Desk', 'FRONT_DESK', ARRAY['reservations.read','reservations.create','reservations.update','guests.read','guests.create'], true),
    (prop_id, 'housekeeping@hotelsin.com', 'Housekeeping', 'Lead', 'HOUSEKEEPING', ARRAY['housekeeping.read','housekeeping.manage'], true),
    (prop_id, 'revenue@hotelsin.com', 'Revenue', 'Manager', 'REVENUE_MANAGER', ARRAY['revenue.read','revenue.manage','rooms.read'], true),
    (prop_id, 'content@hotelsin.com', 'Content', 'Manager', 'CONTENT_MANAGER', ARRAY['content.read','content.create','content.update','content.publish'], true);

END $$;
