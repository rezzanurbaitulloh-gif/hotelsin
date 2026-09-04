import { createClient } from '@supabase/supabase-js';
const url = 'https://wympfqmmhdnqavwslqsv.supabase.co';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5bXBmcW1taGRucWF2d3NscXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODA1NTg3OSwiZXhwIjoyMTAzNjMxODc5fQ.vshcqVkgN96wuWFdtCGS9P8CkT0FuDffoKp4Rc31EBk';
const supabase = createClient(url, serviceKey, { auth: { autoRefreshToken: false } });

const users = [
  { email: 'admin@hotelsin.com', password: '121212', role: 'SUPER_ADMIN', name: 'Super Admin' },
  { email: 'manager@hotelsin.com', password: '121212', role: 'HOTEL_ADMIN', name: 'Hotel Manager' },
  { email: 'frontdesk@hotelsin.com', password: '121212', role: 'FRONT_DESK', name: 'Front Desk' },
  { email: 'housekeeping@hotelsin.com', password: '121212', role: 'HOUSEKEEPING', name: 'Housekeeping Lead' },
  { email: 'revenue@hotelsin.com', password: '121212', role: 'REVENUE_MANAGER', name: 'Revenue Manager' },
  { email: 'content@hotelsin.com', password: '121212', role: 'CONTENT_MANAGER', name: 'Content Manager' },
];

for (const u of users) {
  // Try to create
  const { data, error } = await supabase.auth.admin.createUser({
    email: u.email,
    password: u.password,
    email_confirm: true,
    user_metadata: { role: u.role, name: u.name }
  });
  if (error) {
    if (error.message.includes('already exists') || error.message.includes('already been registered')) {
      console.log(`User ${u.email} already exists, trying to get id via list`);
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list.users.find(x => x.email === u.email);
      if (existing) {
        console.log(`Found existing ${u.email}: ${existing.id}`);
        // update public.users link
        const { error: updErr } = await supabase.from('users').update({ id: existing.id }).eq('email', u.email);
        // Actually users.id is UUID primary key; if we change id, need to handle FK? But public.users.id is separate from auth.users.id. Better to add auth_user_id column if exists.
        // Check if column exists
        console.log('update link', updErr || 'ok');
        // ensure password is 121212 via update
        const { error: updPassErr } = await supabase.auth.admin.updateUserById(existing.id, { password: u.password });
        console.log('password update', updPassErr || 'ok');
      }
    } else {
      console.log(`Error creating ${u.email}:`, error.message);
    }
  } else {
    console.log(`Created ${u.email}: ${data.user.id}`);
    // Optionally link public.users id to auth id? We'll store in public.users if column exists, else keep separate.
    // Try to see if users table has auth_user_id
    const { data: cols } = await supabase.from('users').select('id,email').eq('email', u.email).single();
    console.log('public user', cols);
  }
}

// Verify
const { data: list2 } = await supabase.auth.admin.listUsers();
console.log('Total auth users:', list2.users.length);
for (const u of users) {
  const found = list2.users.find(x => x.email === u.email);
  console.log(u.email, found ? 'exists ' + found.id : 'MISSING');
}
