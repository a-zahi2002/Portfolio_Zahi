import { supabase } from '../lib/supabase';
import type { CMSCertificate, CertificateFormData } from '../types/cms';

export const certificatesService = {
  async getVisible(): Promise<CMSCertificate[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('visible', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getAll(): Promise<CMSCertificate[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getById(id: string): Promise<CMSCertificate | null> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(cert: CertificateFormData): Promise<CMSCertificate> {
    const { data, error } = await supabase
      .from('certificates')
      .insert(cert)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<CertificateFormData>): Promise<CMSCertificate> {
    const { data, error } = await supabase
      .from('certificates')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) throw error;
  },

  async reorder(items: { id: string; order_index: number }[]): Promise<void> {
    const updates = items.map(({ id, order_index }) =>
      supabase.from('certificates').update({ order_index }).eq('id', id)
    );
    await Promise.all(updates);
  },

  async toggleVisibility(id: string, visible: boolean): Promise<void> {
    const { error } = await supabase
      .from('certificates')
      .update({ visible })
      .eq('id', id);
    if (error) throw error;
  },
};
