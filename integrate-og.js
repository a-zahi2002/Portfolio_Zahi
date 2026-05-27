import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

async function run() {
  const envPath = '.env';
  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found. Make sure you are in the project root.');
  }
  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      env[parts[0].trim()] = parts.slice(1).join('=').trim();
    }
  });

  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing in .env');
  }

  const imagePath = 'public/assets/og-image.png';
  if (!fs.existsSync(imagePath)) {
    throw new Error(`OG Image not found at ${imagePath}`);
  }
  const imageBuffer = fs.readFileSync(imagePath);
  const fileSize = imageBuffer.length;
  console.log(`Successfully read local OG Image: ${imagePath} (${(fileSize / 1024).toFixed(1)} KB)`);

  let email = process.env.SUPABASE_ADMIN_EMAIL;
  let password = process.env.SUPABASE_ADMIN_PASSWORD;

  process.argv.forEach(val => {
    if (val.startsWith('--email=')) {
      email = val.split('=')[1];
    }
    if (val.startsWith('--password=')) {
      password = val.split('=')[1];
    }
  });

  if (!email || !password) {
    console.error('\nError: Admin credentials are required to upload and update database.');
    console.error('Please run the script with arguments:');
    console.error('  node integrate-og.js --email="your@email.com" --password="yourpassword"\n');
    return;
  }

  console.log('\nAuthenticating with Supabase...');
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (authError) {
    throw new Error(`Authentication failed: ${authError.message}`);
  }

  const userId = authData.user.id;
  console.log(`Successfully authenticated! User ID: ${userId}`);

  await supabase.auth.setSession({
    access_token: authData.session.access_token,
    refresh_token: authData.session.refresh_token
  });

  const storagePath = 'og-image.png';
  const bucketName = 'seo-assets';
  console.log(`Uploading image to '${bucketName}' bucket as '${storagePath}'...`);
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(storagePath, imageBuffer, {
      contentType: 'image/png',
      upsert: true
    });

  if (uploadError) {
    throw new Error(`Failed to upload image to storage: ${uploadError.message}`);
  }
  console.log('Image uploaded successfully!');

  const { data: urlData } = supabase.storage
    .from(bucketName)
    .getPublicUrl(storagePath);
  
  const publicUrl = urlData.publicUrl;
  console.log('Public URL generated:', publicUrl);

  console.log('\nUpdating site_settings table...');
  const { data: settingsData, error: settingsFetchError } = await supabase
    .from('site_settings')
    .select('*');

  if (settingsFetchError) {
    console.error('Failed to fetch site_settings:', settingsFetchError.message);
  } else if (settingsData.length === 0) {
    console.log('No rows in site_settings. Inserting new row...');
    const { error: insertError } = await supabase
      .from('site_settings')
      .insert({ og_image: publicUrl });
    if (insertError) console.error('Insert failed:', insertError.message);
    else console.log('Successfully inserted OG URL into site_settings.');
  } else {
    const rowId = settingsData[0].id;
    console.log(`Updating existing site_settings row (ID: ${rowId})...`);
    const { error: updateError } = await supabase
      .from('site_settings')
      .update({ og_image: publicUrl })
      .eq('id', rowId);
    if (updateError) console.error('Update failed:', updateError.message);
    else console.log('Successfully updated OG URL in site_settings.');
  }

  console.log('\nUpdating seo_pages table for route "/"...');
  const { data: seoData, error: seoFetchError } = await supabase
    .from('seo_pages')
    .select('*')
    .eq('route', '/');

  if (seoFetchError) {
    console.error('Failed to fetch seo_pages:', seoFetchError.message);
  } else if (seoData.length === 0) {
    console.log('No seo_page for route "/". Inserting one...');
    const { error: insertSeoError } = await supabase
      .from('seo_pages')
      .insert({
        route: '/',
        title: 'A. Zahi Faleel – Portfolio',
        description: 'A. Zahi Faleel - Web Developer & Tech Explorer.',
        og_image: publicUrl,
        og_title: 'A. Zahi Faleel – Portfolio',
        og_description: 'A. Zahi Faleel - Web Developer & Tech Explorer.'
      });
    if (insertSeoError) console.error('Insert failed:', insertSeoError.message);
    else console.log('Successfully created "/" SEO page with OG URL.');
  } else {
    const rowId = seoData[0].id;
    console.log(`Updating existing seo_page for "/" (ID: ${rowId})...`);
    const { error: updateSeoError } = await supabase
      .from('seo_pages')
      .update({ og_image: publicUrl })
      .eq('id', rowId);
    if (updateSeoError) console.error('Update failed:', updateSeoError.message);
    else console.log('Successfully updated OG URL in seo_pages for "/".');
  }

  console.log('\nRegistering asset in media_library...');
  const { data: mediaData, error: mediaFetchError } = await supabase
    .from('media_library')
    .select('*')
    .eq('storage_path', storagePath)
    .eq('bucket', bucketName);

  if (mediaFetchError) {
    console.error('Failed to fetch media_library:', mediaFetchError.message);
  } else if (mediaData.length === 0) {
    console.log('Registering new media asset...');
    const { error: mediaInsertError } = await supabase
      .from('media_library')
      .insert({
        filename: 'og-image.png',
        original_name: 'og-image.png',
        storage_path: storagePath,
        bucket: bucketName,
        public_url: publicUrl,
        file_size: fileSize,
        mime_type: 'image/png',
        uploaded_by: userId,
        alt_text: 'A. Zahi Faleel Personal Brand OG Image'
      });
    if (mediaInsertError) console.error('Insert failed:', mediaInsertError.message);
    else console.log('Successfully registered in media_library.');
  } else {
    console.log('Media asset already registered. Updating record details...');
    const rowId = mediaData[0].id;
    const { error: mediaUpdateError } = await supabase
      .from('media_library')
      .update({
        public_url: publicUrl,
        file_size: fileSize,
        mime_type: 'image/png',
        uploaded_by: userId
      })
      .eq('id', rowId);
    if (mediaUpdateError) console.error('Update failed:', mediaUpdateError.message);
    else console.log('Successfully updated media_library record.');
  }

  console.log('\nOpen Graph (OG) integration completed successfully!');
}

run().catch(err => {
  console.error('\nError: ' + err.message);
});
