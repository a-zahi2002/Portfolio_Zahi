import { supabase } from '../lib/supabase';
import type { CMSProject, ProjectFormData } from '../types/cms';

export const projectsService = {
  /** Public: fetch only visible projects ordered by index */
  async getVisible(): Promise<CMSProject[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('visible', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  /** Admin: fetch ALL projects including hidden */
  async getAll(): Promise<CMSProject[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<CMSProject | null> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(project: ProjectFormData): Promise<CMSProject> {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<ProjectFormData>): Promise<CMSProject> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  /** Bulk update order_index for drag-drop reordering */
  async reorder(items: { id: string; order_index: number }[]): Promise<void> {
    const updates = items.map(({ id, order_index }) =>
      supabase.from('projects').update({ order_index }).eq('id', id)
    );
    await Promise.all(updates);
  },

  /** Toggle visibility */
  async toggleVisibility(id: string, visible: boolean): Promise<void> {
    const { error } = await supabase
      .from('projects')
      .update({ visible })
      .eq('id', id);
    if (error) throw error;
  },
};
