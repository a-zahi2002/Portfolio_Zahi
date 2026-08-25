export default async function handler(req, res) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://mrscuirlixazmazwysud.supabase.co';
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yc2N1aXJsaXhhem1hend5c3VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MDgxNjEsImV4cCI6MjA5NTM4NDE2MX0.t38jx74LsXlhjidmHaRm1K0ik1lJYwXXUnpMmlnpCu0';

  const targetUrl = `${supabaseUrl}/rest/v1/site_settings?select=id&limit=1`;

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    });

    const status = response.status;
    if (response.ok) {
      return res.status(200).json({
        success: true,
        status,
        message: 'Supabase database pinged successfully via Vercel Cron!',
        timestamp: new Date().toISOString(),
      });
    } else {
      const errorText = await response.text();
      return res.status(status).json({
        success: false,
        status,
        error: errorText,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}
