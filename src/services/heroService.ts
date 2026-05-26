import { supabase } from '../lib/supabase';
import type { HeroSection } from '../types/cms';

export const heroService = {
  /** Fetch the single hero section row */
  async get(): Promise<HeroSection | null> {
    const { data, error } = await supabase
      .from('hero_section')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  /** Update the hero section (upsert pattern for singleton) */
  async update(updates: Partial<Omit<HeroSection, 'id' | 'created_at' | 'updated_at'>>): Promise<HeroSection> {
    // Get the existing row ID first
    const { data: existing } = await supabase.from('hero_section').select('id').single();

    if (!existing) throw new Error('Hero section row not found. Run seed.sql first.');

    const { data, error } = await supabase
      .from('hero_section')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
