import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');

// Parse .env if present
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (key === 'VITE_SUPABASE_URL' && !supabaseUrl) supabaseUrl = value;
      if (key === 'VITE_SUPABASE_ANON_KEY' && !supabaseAnonKey) supabaseAnonKey = value;
    }
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing!');
  process.exit(1);
}

const targetUrl = `${supabaseUrl}/rest/v1/site_settings?select=id&limit=1`;
console.log(`📡 Pinging Supabase Database REST API at ${targetUrl} ...`);

try {
  const res = await fetch(targetUrl, {
    method: 'GET',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
    },
  });

  console.log(`HTTP Status: ${res.status} ${res.statusText}`);

  if (res.ok) {
    console.log('✅ Supabase ping successful! Database active.');
  } else {
    const text = await res.text();
    console.error(`❌ Ping returned failure response:`, text);
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Network error while pinging Supabase:', err);
  process.exit(1);
}
