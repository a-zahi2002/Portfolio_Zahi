import { supabase } from '../lib/supabase';
import type { ContactInfo } from '../types/cms';

export const contactService = {
  async get(): Promise<ContactInfo | null> {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .single();

    if (error) throw error;
    return data;
  },

  async update(updates: Partial<Omit<ContactInfo, 'id' | 'created_at' | 'updated_at'>>): Promise<ContactInfo> {
    const { data: existing } = await supabase.from('contact_info').select('id').single();
    if (!existing) throw new Error('Contact info row not found. Run seed.sql first.');

    const { data, error } = await supabase
      .from('contact_info')
      .update(updates)
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
