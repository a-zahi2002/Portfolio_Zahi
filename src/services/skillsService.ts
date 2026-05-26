import { supabase } from '../lib/supabase';
import type { CMSSkill, SkillFormData } from '../types/cms';

export const skillsService = {
  async getVisible(): Promise<CMSSkill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .eq('visible', true)
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getAll(): Promise<CMSSkill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async create(skill: SkillFormData): Promise<CMSSkill> {
    const { data, error } = await supabase
      .from('skills')
      .insert(skill)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<SkillFormData>): Promise<CMSSkill> {
    const { data, error } = await supabase
      .from('skills')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
  },

  async reorder(items: { id: string; display_order: number }[]): Promise<void> {
    const updates = items.map(({ id, display_order }) =>
      supabase.from('skills').update({ display_order }).eq('id', id)
    );
    await Promise.all(updates);
  },
};
