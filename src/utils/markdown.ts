import { marked } from 'marked';
import DOMPurify from 'dompurify';

// Configure marked options to support line breaks and GitHub Flavored Markdown
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * Safely parses markdown to HTML and sanitizes it.
 * @param md Raw markdown string
 */
export const parseMarkdown = (md: string): string => {
  if (!md) return '';
  try {
    const rawHtml = marked.parse(md) as string;
    return DOMPurify.sanitize(rawHtml);
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return md; // Fallback to raw string
  }
};
