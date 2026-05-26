import { supabase } from '../lib/supabase';
import type { SeoPage } from '../types/cms';

export const seoService = {
  async getByRoute(route: string): Promise<SeoPage | null> {
    const { data, error } = await supabase
      .from('seo_pages')
      .select('*')
      .eq('route', route)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getAll(): Promise<SeoPage[]> {
    const { data, error } = await supabase
      .from('seo_pages')
      .select('*')
      .order('route', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async upsert(page: Omit<SeoPage, 'id' | 'created_at' | 'updated_at'>): Promise<SeoPage> {
    const { data, error } = await supabase
      .from('seo_pages')
      .upsert(page, { onConflict: 'route' })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('seo_pages').delete().eq('id', id);
    if (error) throw error;
  },
};
