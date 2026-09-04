import { createClient } from '@supabase/supabase-js';
const url = 'https://wympfqmmhdnqavwslqsv.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bXBmcW1taGRucWF2d3NscXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODA1NTg3OSwiZXhwIjoyMTAzNjMxODc5fQ.vshcqVkgN96wuWFdtCGS9P8CkT0FuDffoKp4Rc31EBk';
const supabase = createClient(url, key);
const { data: props } = await supabase.from('properties').select('id').limit(1);
const prop_id = props[0].id;
console.log('prop', prop_id);

// Storage buckets
for (const bucket of ['hotel-images','gallery']) {
  const { data, error } = await supabase.storage.createBucket(bucket, { public: true });
  console.log(`bucket ${bucket}:`, error ? error.message : 'created');
  if (error && error.message.includes('already exists')) {
    console.log('bucket already exists');
  }
}
// Also try list
const { data: buckets } = await supabase.storage.listBuckets();
console.log('buckets', buckets?.map(b=>b.name));

// Seed site_settings via property_settings
const socialLinks = [
  { platform: 'instagram', url: 'https://instagram.com/hotelsin', enabled: true, order: 1 },
  { platform: 'facebook', url: 'https://facebook.com/hotelsin', enabled: true, order: 2 },
  { platform: 'x', url: 'https://x.com/hotelsin', enabled: true, order: 3 },
  { platform: 'youtube', url: 'https://youtube.com/@hotelsin', enabled: true, order: 4 },
  { platform: 'tiktok', url: 'https://tiktok.com/@hotelsin', enabled: true, order: 5 },
  { platform: 'linkedin', url: 'https://linkedin.com/company/hotelsin', enabled: false, order: 6 },
  { platform: 'pinterest', url: 'https://pinterest.com/hotelsin', enabled: false, order: 7 },
  { platform: 'tripadvisor', url: 'https://tripadvisor.com/hotelsin', enabled: true, order: 8 },
  { platform: 'booking', url: 'https://booking.com/hotel/hotelsin', enabled: true, order: 9 },
  { platform: 'whatsapp', url: 'https://wa.me/62361975888', enabled: true, order: 10 },
  { platform: 'telegram', url: 'https://t.me/hotelsin', enabled: false, order: 11 },
  { platform: 'threads', url: 'https://threads.net/@hotelsin', enabled: false, order: 12 },
  { platform: 'snapchat', url: 'https://snapchat.com/add/hotelsin', enabled: false, order: 13 },
  { platform: 'spotify', url: 'https://open.spotify.com/hotelsin', enabled: false, order: 14 },
  { platform: 'behance', url: 'https://behance.net/hotelsin', enabled: false, order: 15 },
  { platform: 'dribbble', url: 'https://dribbble.com/hotelsin', enabled: false, order: 16 },
  { platform: 'medium', url: 'https://medium.com/@hotelsin', enabled: false, order: 17 },
  { platform: 'email', url: 'mailto:reservations@hotelsin.com', enabled: true, order: 18 },
];

const settings = [
  { key: 'social_links', value: socialLinks },
  { key: 'maps', value: { lat: -8.5069, lng: 115.2625, zoom: 15, markerTitle: 'HotelsIn Ubud', style: 'osm' } },
  { key: 'floating_wa', value: { enabled: true, phone: '+62 361 975 888', message: 'Halo HotelsIn, saya ingin bertanya tentang ketersediaan villa.', side: 'right', position: 'bottom', offset: 20, color: '#25D366' } },
  { key: 'theme', value: { default: 'light', allowToggle: true } },
  { key: 'footer', value: { contact: '+62 361 975 888', address: 'Jalan Raya Ubud No. 88, Sayan, Ubud, Bali 80571', email: 'reservations@hotelsin.com' } },
  { key: 'navigation', value: [
    { label: {en:'STAY',id:'MENGINAP'}, href:'/stay', order:1, visible:true },
    { label: {en:'DINE',id:'MAKAN'}, href:'/dine', order:2, visible:true },
    { label: {en:'WELLNESS',id:'KESEHATAN'}, href:'/wellness', order:3, visible:true },
    { label: {en:'EXPERIENCES',id:'PENGALAMAN'}, href:'/experiences', order:4, visible:true },
    { label: {en:'PROPERTY',id:'PROPERTI'}, href:'/property', order:5, visible:true },
    { label: {en:'OFFERS',id:'PAKET'}, href:'/offers', order:6, visible:true },
    { label: {en:'JOURNAL',id:'JURNAL'}, href:'/journal', order:7, visible:true },
  ]},
];

for (const s of settings) {
  const { error } = await supabase.from('property_settings').upsert({ property_id: prop_id, key: s.key, value: s.value }, { onConflict: 'property_id,key' });
  console.log(`seed ${s.key}:`, error ? error.message : 'ok');
}
console.log('done');
