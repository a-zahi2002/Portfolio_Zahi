import { supabase } from '../lib/supabase';
import type { StorageBucket } from '../types/cms';

/**
 * Service for interacting with Supabase Storage.
 * Handles upload, delete, and public URL retrieval.
 */
export const storageService = {
  /**
   * Upload a file to the specified bucket.
   * Returns the public URL of the uploaded file.
   */
  async upload(
    bucket: StorageBucket,
    file: File,
    path?: string
  ): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = path ?? `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  },

  /**
   * Delete a file from storage by its public URL.
   * Extracts the storage path from the URL.
   */
  async deleteByUrl(bucket: StorageBucket, publicUrl: string): Promise<void> {
    // Extract path after /storage/v1/object/public/{bucket}/
    const urlParts = publicUrl.split(`/storage/v1/object/public/${bucket}/`);
    if (urlParts.length < 2) throw new Error('Could not parse storage path from URL');

    const storagePath = decodeURIComponent(urlParts[1]);
    const { error } = await supabase.storage.from(bucket).remove([storagePath]);
    if (error) throw error;
  },

  /**
   * Delete a file by its storage path directly.
   */
  async deleteByPath(bucket: StorageBucket, storagePath: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([storagePath]);
    if (error) throw error;
  },

  /**
   * Get a public URL for a storage path.
   */
  getPublicUrl(bucket: StorageBucket, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  /**
   * List all files in a bucket (for media library).
   */
  async list(bucket: StorageBucket, folder?: string) {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder, { limit: 100, sortBy: { column: 'created_at', order: 'desc' } });

    if (error) throw error;
    return data ?? [];
  },
};
