import { supabase } from '../lib/supabase';
import type { SiteSettings } from '../types/cms';

export const settingsService = {
  async get(): Promise<SiteSettings | null> {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async update(updates: Partial<Omit<SiteSettings, 'id' | 'created_at' | 'updated_at'>>): Promise<SiteSettings> {
    const { data: existing } = await supabase.from('site_settings').select('id').single();
    if (!existing) throw new Error('Site settings row not found. Run seed.sql first.');

    const { data, error } = await supabase
      .from('site_settings')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
