// ============================================================
// CMS TypeScript Interfaces
// All data models that map directly to Supabase tables
// ============================================================

export interface SiteSettings {
  id: string;
  site_title: string;
  tagline: string;
  seo_description: string;
  og_image: string;
  resume_url: string;
  favicon_url: string;
  maintenance_mode: boolean;
  copyright_text: string;
  brand_name: string;
  created_at: string;
  updated_at: string;
}

export interface HeroSection {
  id: string;
  heading: string;
  heading_highlight: string;
  subheading: string;
  cta_text: string;
  cta_scroll_target: string;
  availability_status: boolean;
  availability_label: string;
  created_at: string;
  updated_at: string;
}

export interface HighlightCard {
  icon: string;
  title: string;
  subtitle: string;
}

export interface AboutSection {
  id: string;
  title: string;
  title_highlight: string;
  bio_primary: string;
  bio_secondary: string;
  profile_image_url: string;
  availability_status: boolean;
  availability_label: string;
  highlights: HighlightCard[];
  stats: Record<string, string>[];
  created_at: string;
  updated_at: string;
}

export interface CMSProject {
  id: string;
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  category: string;
  github_url: string;
  live_url: string;
  thumbnail_url: string;
  gallery_images: string[];
  featured: boolean;
  visible: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CMSCertificate {
  id: string;
  title: string;
  issuer: string;
  issue_date: string | null;
  credential_url: string;
  image_url: string;
  category: string;
  featured: boolean;
  visible: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface CMSSkill {
  id: string;
  name: string;
  category: string;
  icon: string;
  color: string;
  proficiency: number;
  visible: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
  technologies: string[];
  visible: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  start_date: string;
  end_date: string;
  description: string;
  visible: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface ContactInfo {
  id: string;
  email: string;
  phone: string;
  location: string;
  section_eyebrow: string;
  section_heading: string;
  section_heading_highlight: string;
  created_at: string;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string;
  visible: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface SeoPage {
  id: string;
  route: string;
  title: string;
  description: string;
  keywords: string;
  og_image: string;
  og_title: string;
  og_description: string;
  created_at: string;
  updated_at: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  original_name: string;
  storage_path: string;
  bucket: string;
  public_url: string;
  file_size: number;
  mime_type: string;
  alt_text: string;
  uploaded_by: string | null;
  created_at: string;
}

// ============================================================
// Storage bucket names
// ============================================================
export type StorageBucket =
  | 'profile-images'
  | 'project-images'
  | 'certificates'
  | 'seo-assets'
  | 'resumes'
  | 'general-media';

// ============================================================
// Admin form types (Omit DB-generated fields)
// ============================================================
export type ProjectFormData = Omit<CMSProject, 'id' | 'created_at' | 'updated_at'>;
export type CertificateFormData = Omit<CMSCertificate, 'id' | 'created_at' | 'updated_at'>;
export type SkillFormData = Omit<CMSSkill, 'id' | 'created_at' | 'updated_at'>;
export type SocialLinkFormData = Omit<SocialLink, 'id' | 'created_at' | 'updated_at'>;
export type ExperienceFormData = Omit<Experience, 'id' | 'created_at' | 'updated_at'>;
export type EducationFormData = Omit<Education, 'id' | 'created_at' | 'updated_at'>;
