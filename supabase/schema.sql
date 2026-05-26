-- ============================================================
-- Portfolio CMS — Supabase Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: site_settings (singleton row)
-- ============================================================
CREATE TABLE IF NOT EXISTS site_settings (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title   TEXT NOT NULL DEFAULT 'A. Zahi Faleel',
  tagline      TEXT NOT NULL DEFAULT 'Portfolio',
  seo_description TEXT DEFAULT 'A. Zahi Faleel – Web Developer & Tech Explorer.',
  og_image     TEXT DEFAULT '',
  resume_url   TEXT DEFAULT '',
  favicon_url  TEXT DEFAULT '',
  maintenance_mode BOOLEAN DEFAULT FALSE,
  copyright_text TEXT DEFAULT '© 2025 A. Zahi Faleel. All rights reserved.',
  brand_name   TEXT DEFAULT 'A.ZAHI',
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: hero_section (singleton row)
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_section (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  heading         TEXT NOT NULL DEFAULT 'A. Zahi',
  heading_highlight TEXT NOT NULL DEFAULT 'Faleel',
  subheading      TEXT NOT NULL DEFAULT 'Building immersive Digital Experiences with robust engineering and elegant design.',
  cta_text        TEXT NOT NULL DEFAULT 'Explore Work',
  cta_scroll_target TEXT NOT NULL DEFAULT 'projects',
  availability_status BOOLEAN DEFAULT TRUE,
  availability_label TEXT DEFAULT 'OPEN TO WORK',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: about_section (singleton row)
-- ============================================================
CREATE TABLE IF NOT EXISTS about_section (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL DEFAULT 'About',
  title_highlight TEXT NOT NULL DEFAULT 'Me',
  bio_primary     TEXT NOT NULL DEFAULT 'I am a passionate Creative Developer dedicated to building immersive web experiences. My work bridges the gap between robust engineering and elegant design, ensuring every pixel serves a purpose.',
  bio_secondary   TEXT NOT NULL DEFAULT 'With a strong foundation in modern web technologies, I focus on performance, accessibility, and creating interfaces that feel "alive" through subtle interactions and 3D elements.',
  profile_image_url TEXT DEFAULT './assets/profile.jpg',
  availability_status BOOLEAN DEFAULT TRUE,
  availability_label TEXT DEFAULT 'OPEN TO WORK',
  highlights      JSONB DEFAULT '[{"icon":"Code","title":"Clean Code","subtitle":"Scalable & Maintainable"},{"icon":"Zap","title":"Performance","subtitle":"Lightning Fast Loads"}]',
  stats           JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: projects
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  technologies    TEXT[] DEFAULT '{}',
  category        TEXT DEFAULT 'Web',
  github_url      TEXT DEFAULT '',
  live_url        TEXT DEFAULT '',
  thumbnail_url   TEXT DEFAULT '',
  gallery_images  TEXT[] DEFAULT '{}',
  featured        BOOLEAN DEFAULT FALSE,
  visible         BOOLEAN DEFAULT TRUE,
  order_index     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: certificates
-- ============================================================
CREATE TABLE IF NOT EXISTS certificates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title           TEXT NOT NULL,
  issuer          TEXT NOT NULL DEFAULT '',
  issue_date      DATE,
  credential_url  TEXT DEFAULT '',
  image_url       TEXT DEFAULT '',
  category        TEXT DEFAULT 'General',
  featured        BOOLEAN DEFAULT FALSE,
  visible         BOOLEAN DEFAULT TRUE,
  order_index     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: skills
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  category        TEXT DEFAULT 'General',
  icon            TEXT DEFAULT '',
  color           TEXT DEFAULT '#ffffff',
  proficiency     INTEGER DEFAULT 80 CHECK (proficiency BETWEEN 0 AND 100),
  visible         BOOLEAN DEFAULT TRUE,
  display_order   INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: experiences
-- ============================================================
CREATE TABLE IF NOT EXISTS experiences (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company         TEXT NOT NULL,
  role            TEXT NOT NULL,
  start_date      TEXT NOT NULL DEFAULT '',
  end_date        TEXT DEFAULT 'Present',
  description     TEXT DEFAULT '',
  technologies    TEXT[] DEFAULT '{}',
  visible         BOOLEAN DEFAULT TRUE,
  order_index     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: education
-- ============================================================
CREATE TABLE IF NOT EXISTS education (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution     TEXT NOT NULL,
  degree          TEXT NOT NULL,
  start_date      TEXT NOT NULL DEFAULT '',
  end_date        TEXT DEFAULT 'Present',
  description     TEXT DEFAULT '',
  visible         BOOLEAN DEFAULT TRUE,
  order_index     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: contact_info (singleton row)
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_info (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email           TEXT NOT NULL DEFAULT '',
  phone           TEXT DEFAULT '',
  location        TEXT DEFAULT '',
  section_eyebrow TEXT DEFAULT 'What''s Next?',
  section_heading TEXT DEFAULT 'Let''s build something',
  section_heading_highlight TEXT DEFAULT 'extraordinary.',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: social_links
-- ============================================================
CREATE TABLE IF NOT EXISTS social_links (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform        TEXT NOT NULL,
  url             TEXT NOT NULL DEFAULT '',
  icon            TEXT DEFAULT '',
  visible         BOOLEAN DEFAULT TRUE,
  order_index     INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: seo_pages
-- ============================================================
CREATE TABLE IF NOT EXISTS seo_pages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  route           TEXT UNIQUE NOT NULL DEFAULT '/',
  title           TEXT NOT NULL DEFAULT '',
  description     TEXT DEFAULT '',
  keywords        TEXT DEFAULT '',
  og_image        TEXT DEFAULT '',
  og_title        TEXT DEFAULT '',
  og_description  TEXT DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: media_library
-- ============================================================
CREATE TABLE IF NOT EXISTS media_library (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename        TEXT NOT NULL,
  original_name   TEXT NOT NULL,
  storage_path    TEXT NOT NULL,
  bucket          TEXT NOT NULL,
  public_url      TEXT NOT NULL,
  file_size       BIGINT DEFAULT 0,
  mime_type       TEXT DEFAULT '',
  alt_text        TEXT DEFAULT '',
  uploaded_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all mutable tables
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hero_section_updated_at
  BEFORE UPDATE ON hero_section FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_about_section_updated_at
  BEFORE UPDATE ON about_section FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certificates_updated_at
  BEFORE UPDATE ON certificates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_education_updated_at
  BEFORE UPDATE ON education FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON contact_info FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at
  BEFORE UPDATE ON social_links FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_pages_updated_at
  BEFORE UPDATE ON seo_pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY — Enable on all tables
-- ============================================================
ALTER TABLE site_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_section       ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_section      ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills             ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences        ENABLE ROW LEVEL SECURITY;
ALTER TABLE education          ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_info       ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links       ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library      ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES — Public READ (anon), Authenticated WRITE
-- ============================================================

-- site_settings
CREATE POLICY "Public read site_settings"       ON site_settings FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admin write site_settings"       ON site_settings FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- hero_section
CREATE POLICY "Public read hero_section"        ON hero_section FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admin write hero_section"        ON hero_section FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- about_section
CREATE POLICY "Public read about_section"       ON about_section FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admin write about_section"       ON about_section FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- projects
CREATE POLICY "Public read visible projects"    ON projects FOR SELECT TO anon USING (visible = TRUE);
CREATE POLICY "Admin read all projects"         ON projects FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin write projects"            ON projects FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- certificates
CREATE POLICY "Public read visible certs"       ON certificates FOR SELECT TO anon USING (visible = TRUE);
CREATE POLICY "Admin read all certs"            ON certificates FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin write certs"               ON certificates FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- skills
CREATE POLICY "Public read visible skills"      ON skills FOR SELECT TO anon USING (visible = TRUE);
CREATE POLICY "Admin read all skills"           ON skills FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin write skills"              ON skills FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- experiences
CREATE POLICY "Public read visible experiences" ON experiences FOR SELECT TO anon USING (visible = TRUE);
CREATE POLICY "Admin read all experiences"      ON experiences FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin write experiences"         ON experiences FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- education
CREATE POLICY "Public read visible education"   ON education FOR SELECT TO anon USING (visible = TRUE);
CREATE POLICY "Admin read all education"        ON education FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin write education"           ON education FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- contact_info
CREATE POLICY "Public read contact_info"        ON contact_info FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admin write contact_info"        ON contact_info FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- social_links
CREATE POLICY "Public read visible socials"     ON social_links FOR SELECT TO anon USING (visible = TRUE);
CREATE POLICY "Admin read all socials"          ON social_links FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY "Admin write socials"             ON social_links FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- seo_pages
CREATE POLICY "Public read seo_pages"           ON seo_pages FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY "Admin write seo_pages"           ON seo_pages FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');

-- media_library
CREATE POLICY "Admin full access media_library" ON media_library FOR ALL TO authenticated USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');
