-- ============================================================
-- Portfolio CMS — Supabase Storage Bucket Policies
-- Run this AFTER creating storage buckets in Supabase Dashboard:
--   profile-images, project-images, certificates,
--   seo-assets, resumes, general-media
-- ============================================================

-- ============================================================
-- profile-images bucket
-- ============================================================
CREATE POLICY "Public read profile-images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'profile-images');

CREATE POLICY "Admin upload profile-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update profile-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete profile-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'profile-images' AND auth.role() = 'authenticated');

-- ============================================================
-- project-images bucket
-- ============================================================
CREATE POLICY "Public read project-images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Admin upload project-images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update project-images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete project-images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- ============================================================
-- certificates bucket
-- ============================================================
CREATE POLICY "Public read certificates"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'certificates');

CREATE POLICY "Admin upload certificates"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'certificates' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update certificates"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'certificates' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete certificates"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'certificates' AND auth.role() = 'authenticated');

-- ============================================================
-- seo-assets bucket
-- ============================================================
CREATE POLICY "Public read seo-assets"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'seo-assets');

CREATE POLICY "Admin upload seo-assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'seo-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update seo-assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'seo-assets' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete seo-assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'seo-assets' AND auth.role() = 'authenticated');

-- ============================================================
-- resumes bucket
-- ============================================================
CREATE POLICY "Public read resumes"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'resumes');

CREATE POLICY "Admin upload resumes"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update resumes"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete resumes"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- ============================================================
-- general-media bucket
-- ============================================================
CREATE POLICY "Public read general-media"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'general-media');

CREATE POLICY "Admin upload general-media"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'general-media' AND auth.role() = 'authenticated');

CREATE POLICY "Admin update general-media"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'general-media' AND auth.role() = 'authenticated');

CREATE POLICY "Admin delete general-media"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'general-media' AND auth.role() = 'authenticated');
