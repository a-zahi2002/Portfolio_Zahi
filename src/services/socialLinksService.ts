import { supabase } from '../lib/supabase';
import type { SocialLink, SocialLinkFormData } from '../types/cms';

export const socialLinksService = {
  async getVisible(): Promise<SocialLink[]> {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('visible', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getAll(): Promise<SocialLink[]> {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async create(link: SocialLinkFormData): Promise<SocialLink> {
    const { data, error } = await supabase
      .from('social_links')
      .insert(link)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<SocialLinkFormData>): Promise<SocialLink> {
    const { data, error } = await supabase
      .from('social_links')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('social_links').delete().eq('id', id);
    if (error) throw error;
  },

  async reorder(items: { id: string; order_index: number }[]): Promise<void> {
    const updates = items.map(({ id, order_index }) =>
      supabase.from('social_links').update({ order_index }).eq('id', id)
    );
    await Promise.all(updates);
  },
};
