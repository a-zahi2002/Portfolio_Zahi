import { supabase } from '../lib/supabase';
import type { Education, EducationFormData } from '../types/cms';

export const educationService = {
  /** Fetch visible education items sorted by order_index */
  async getVisible(): Promise<Education[]> {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('visible', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  /** Fetch all education items (including hidden) sorted by order_index */
  async getAll(): Promise<Education[]> {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<Education | null> {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(education: EducationFormData): Promise<Education> {
    const { data, error } = await supabase
      .from('education')
      .insert(education)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<EducationFormData>): Promise<Education> {
    const { data, error } = await supabase
      .from('education')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('education').delete().eq('id', id);
    if (error) throw error;
  },

  async toggleVisibility(id: string, visible: boolean): Promise<void> {
    const { error } = await supabase
      .from('education')
      .update({ visible })
      .eq('id', id);
    if (error) throw error;
  },

  /** Bulk update order_index for drag-drop sorting */
  async reorder(items: { id: string; order_index: number }[]): Promise<void> {
    const updates = items.map(({ id, order_index }) =>
      supabase.from('education').update({ order_index }).eq('id', id)
    );
    await Promise.all(updates);
  },
};
