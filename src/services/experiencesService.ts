import { supabase } from '../lib/supabase';
import type { Experience, ExperienceFormData } from '../types/cms';

export const experiencesService = {
  /** Fetch visible experiences sorted by order_index */
  async getVisible(): Promise<Experience[]> {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('visible', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  /** Fetch all experiences (including hidden) sorted by order_index */
  async getAll(): Promise<Experience[]> {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Experience | null> {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(experience: ExperienceFormData): Promise<Experience> {
    const { data, error } = await supabase
      .from('experiences')
      .insert(experience)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<ExperienceFormData>): Promise<Experience> {
    const { data, error } = await supabase
      .from('experiences')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('experiences').delete().eq('id', id);
    if (error) throw error;
  },

  async toggleVisibility(id: string, visible: boolean): Promise<void> {
    const { error } = await supabase
      .from('experiences')
      .update({ visible })
      .eq('id', id);
    if (error) throw error;
  },

  /** Bulk update order_index for drag-drop sorting */
  async reorder(items: { id: string; order_index: number }[]): Promise<void> {
    const updates = items.map(({ id, order_index }) =>
      supabase.from('experiences').update({ order_index }).eq('id', id)
    );
    await Promise.all(updates);
  },
};
