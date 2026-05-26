import React, { useEffect } from 'react';
import { useSeoPage } from '../hooks/cms/useSeoPage';
import { useSiteSettings } from '../hooks/cms/useSiteSettings';

interface SEOHeadProps {
  route: string;
}

/**
 * Dynamically updates <head> meta tags using data from Supabase.
 * Falls back to site_settings defaults if no page-specific data exists.
 */
const SEOHead: React.FC<SEOHeadProps> = ({ route }) => {
  const { data: page } = useSeoPage(route);
  const { data: settings } = useSiteSettings();

  useEffect(() => {
    const title = page?.title || settings?.site_title || 'Portfolio';
    const description = page?.description || settings?.seo_description || '';
    const ogTitle = page?.og_title || title;
    const ogDesc = page?.og_description || description;
    const ogImage = page?.og_image || settings?.og_image || '';

    // Update document title
    document.title = title;

    // Helper to set or create meta tag
    const setMeta = (attr: string, attrValue: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${attrValue}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', ogTitle);
    setMeta('property', 'og:description', ogDesc);
    if (ogImage) setMeta('property', 'og:image', ogImage);

    // Keywords
    if (page?.keywords) setMeta('name', 'keywords', page.keywords);
  }, [page, settings]);

  return null;
};

export default SEOHead;
