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
    // Canonical link tag
    let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', window.location.origin + window.location.pathname);

    // Favicon dynamically updated from site_settings or fallback to /favicon.ico
    const faviconUrl = settings?.favicon_url || '/favicon.ico';
    let faviconEl = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (!faviconEl) {
      faviconEl = document.createElement('link');
      faviconEl.setAttribute('rel', 'icon');
      document.head.appendChild(faviconEl);
    }
    faviconEl.setAttribute('href', faviconUrl);

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

    const isLocalAdmin = route.startsWith('/.admin') || window.location.pathname.startsWith('/.admin');
    if (isLocalAdmin) {
      setMeta('name', 'robots', 'noindex, nofollow');
      document.title = 'Admin Panel | Portfolio';
      
      // Clean up page metadata on admin pages to keep search engines clean
      const descEl = document.querySelector('meta[name="description"]');
      if (descEl) descEl.remove();
      const keywordsEl = document.querySelector('meta[name="keywords"]');
      if (keywordsEl) keywordsEl.remove();
      return;
    } else {
      // Remove robots meta tag to allow normal indexing for frontend pages
      const robotsEl = document.querySelector('meta[name="robots"]');
      if (robotsEl) {
        robotsEl.remove();
      }
    }

    const title = page?.title || settings?.site_title || 'Portfolio';
    const description = page?.description || settings?.seo_description || '';
    const ogTitle = page?.og_title || title;
    const ogDesc = page?.og_description || description;
    const ogImage = page?.og_image || settings?.og_image || '';

    // Update document title
    document.title = title;

    setMeta('name', 'description', description);
    setMeta('property', 'og:title', ogTitle);
    setMeta('property', 'og:description', ogDesc);
    if (ogImage) {
      setMeta('property', 'og:image', ogImage);
      setMeta('name', 'twitter:card', 'summary_large_image');
      setMeta('name', 'twitter:title', ogTitle);
      setMeta('name', 'twitter:description', ogDesc);
      setMeta('name', 'twitter:image', ogImage);
    }

    // Keywords
    if (page?.keywords) {
      setMeta('name', 'keywords', page.keywords);
    } else {
      const keywordsEl = document.querySelector('meta[name="keywords"]');
      if (keywordsEl) keywordsEl.remove();
    }
  }, [page, settings, route]);

  return null;
};

export default SEOHead;
