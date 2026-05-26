import { supabase } from '../lib/supabase';
import type { MediaAsset, StorageBucket } from '../types/cms';

export const mediaService = {
  async getAll(): Promise<MediaAsset[]> {
    const { data, error } = await supabase
      .from('media_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  },

  async create(asset: Omit<MediaAsset, 'id' | 'created_at'>): Promise<MediaAsset> {
    const { data, error } = await supabase
      .from('media_library')
      .insert(asset)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('media_library').delete().eq('id', id);
    if (error) throw error;
  },

  async updateAltText(id: string, alt_text: string): Promise<void> {
    const { error } = await supabase
      .from('media_library')
      .update({ alt_text })
      .eq('id', id);
    if (error) throw error;
  },

  /** Track an uploaded file in the media library */
  async trackUpload(params: {
    filename: string;
    original_name: string;
    storage_path: string;
    bucket: StorageBucket;
    public_url: string;
    file_size: number;
    mime_type: string;
  }): Promise<MediaAsset> {
    const { data: { user } } = await supabase.auth.getUser();

    return mediaService.create({
      ...params,
      alt_text: '',
      uploaded_by: user?.id ?? null,
    });
  },
};
