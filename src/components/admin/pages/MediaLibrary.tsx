import React, { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Upload, Trash2, Copy, Check, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { storageService } from '../../../services/storageService';
import { mediaService } from '../../../services/mediaService';
import PageHeader from '../ui/PageHeader';
import ConfirmDialog from '../ui/ConfirmDialog';
import { Skeleton } from '../ui/Skeleton';
import type { MediaAsset, StorageBucket } from '../../../types/cms';

const BUCKETS: { label: string; bucket: StorageBucket }[] = [
  { label: 'Profile Images', bucket: 'profile-images' },
  { label: 'Project Images', bucket: 'project-images' },
  { label: 'Certificates', bucket: 'certificates' },
  { label: 'General Media', bucket: 'general-media' },
  { label: 'SEO Assets', bucket: 'seo-assets' },
  { label: 'Resumes', bucket: 'resumes' },
];

const MediaLibrary: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedBucket, setSelectedBucket] = useState<StorageBucket>('general-media');
  const [deleteTarget, setDeleteTarget] = useState<MediaAsset | null>(null);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { data: assets, isLoading } = useQuery({
    queryKey: ['media_library'],
    queryFn: mediaService.getAll,
    staleTime: 0,
  });

  const deleteAsset = useMutation({
    mutationFn: async (asset: MediaAsset) => {
      await storageService.deleteByUrl(asset.bucket as StorageBucket, asset.public_url);
      await mediaService.delete(asset.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['media_library'] }),
  });

  const handleUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const publicUrl = await storageService.upload(selectedBucket, file);
      await mediaService.trackUpload({
        filename: file.name,
        original_name: file.name,
        storage_path: publicUrl.split(`${selectedBucket}/`)[1] ?? file.name,
        bucket: selectedBucket,
        public_url: publicUrl,
        file_size: file.size,
        mime_type: file.type,
      });
      queryClient.invalidateQueries({ queryKey: ['media_library'] });
      toast.success('File uploaded!');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }, [selectedBucket, queryClient]);

  const copyUrl = (asset: MediaAsset) => {
    navigator.clipboard.writeText(asset.public_url);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('URL copied!');
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteAsset.mutateAsync(deleteTarget);
      toast.success('File deleted');
      setDeleteTarget(null);
    } catch {
      toast.error('Failed to delete file');
    }
  };

  const filteredAssets = (assets ?? []).filter(a => a.bucket === selectedBucket);
  const formatSize = (bytes: number) => bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)}KB` : `${(bytes / 1024 / 1024).toFixed(1)}MB`;

  return (
    <div>
      <PageHeader
        title="Media Library"
        description="Upload and manage all media assets"
        action={
          <label className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-accent-cyan text-charcoal-950 rounded-xl cursor-pointer hover:bg-accent-cyan/90 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
            {uploading ? <span className="w-4 h-4 border-2 border-charcoal-950 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
            {uploading ? 'Uploading…' : 'Upload File'}
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        }
      />

      {/* Bucket selector */}
      <div className="flex gap-2 flex-wrap mb-6">
        {BUCKETS.map(({ label, bucket }) => (
          <button
            key={bucket}
            onClick={() => setSelectedBucket(bucket)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
              selectedBucket === bucket
                ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30'
                : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 hover:text-charcoal-900 dark:text-white border border-gray-200 dark:border-white/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ImageIcon className="w-12 h-12 text-gray-700 mb-4" />
          <p className="text-gray-500 text-sm">No files in this bucket yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map(asset => (
            <div key={asset.id} className="group relative bg-white dark:bg-charcoal-800/40 border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden hover:border-gray-300 dark:border-white/10 transition-all">
              <div className="aspect-square">
                {asset.mime_type.startsWith('image/') ? (
                  <img src={asset.public_url} alt={asset.alt_text || asset.original_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-charcoal-900 text-gray-600">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => copyUrl(asset)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-charcoal-900 dark:text-white backdrop-blur transition-colors">
                  {copiedId === asset.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={() => setDeleteTarget(asset)} className="p-2 bg-red-500/40 hover:bg-red-500/60 rounded-full text-charcoal-900 dark:text-white backdrop-blur transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2 border-t border-gray-200 dark:border-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{asset.original_name}</p>
                <p className="text-xs text-gray-600">{formatSize(asset.file_size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete File"
        message={`Permanently delete "${deleteTarget?.original_name}"? This will remove it from storage.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteAsset.isPending}
      />
    </div>
  );
};

export default MediaLibrary;
