import { supabase } from '../lib/supabase';
import type { AboutSection } from '../types/cms';

export const aboutService = {
  async get(): Promise<AboutSection | null> {
    const { data, error } = await supabase
      .from('about_section')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async update(updates: Partial<Omit<AboutSection, 'id' | 'created_at' | 'updated_at'>>): Promise<AboutSection> {
    const { data: existing } = await supabase.from('about_section').select('id').single();
    if (!existing) throw new Error('About section row not found. Run seed.sql first.');

    const { data, error } = await supabase
      .from('about_section')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
