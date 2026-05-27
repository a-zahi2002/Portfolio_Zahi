import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, X, FileText, Loader2, Image as ImageIcon } from 'lucide-react';
import { storageService } from '../../../services/storageService';
import type { StorageBucket } from '../../../types/cms';
import toast from 'react-hot-toast';

interface FileUploaderProps {
  bucket: StorageBucket;
  currentUrl?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  previewClassName?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  bucket,
  currentUrl,
  onUpload,
  onRemove,
  accept = 'application/pdf,image/*',
  maxSizeMB = 10,
  label = 'Upload file',
  previewClassName = 'h-48',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(currentUrl || '');
  const [isPdf, setIsPdf] = useState<boolean>(currentUrl?.toLowerCase().endsWith('.pdf') || false);

  useEffect(() => {
    if (!isUploading) {
      setPreview(currentUrl || '');
      setIsPdf(currentUrl?.toLowerCase().endsWith('.pdf') || false);
    }
  }, [currentUrl, isUploading]);

  const handleFile = useCallback(async (file: File) => {
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File must be smaller than ${maxSizeMB}MB`);
      return;
    }

    const isFilePdf = file.type === 'application/pdf';
    const isImage = file.type.startsWith('image/');

    if (!isFilePdf && !isImage) {
      toast.error('Only PDF and image files are supported');
      return;
    }

    // Optimistic preview
    let objectUrl = '';
    if (isImage) {
      objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview('pdf');
    }
    
    setIsPdf(isFilePdf);
    setIsUploading(true);

    try {
      const publicUrl = await storageService.upload(bucket, file);
      onUpload(publicUrl);
      toast.success('File uploaded successfully');
    } catch (err: unknown) {
      setPreview(currentUrl || '');
      setIsPdf(currentUrl?.toLowerCase().endsWith('.pdf') || false);
      toast.error(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    }
  }, [bucket, currentUrl, maxSizeMB, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview('');
    setIsPdf(false);
    onRemove?.();
    if (inputRef.current) inputRef.current.value = '';
  };

  if (preview) {
    return (
      <div className={`relative rounded-xl overflow-hidden border border-gray-300 dark:border-white/10 ${previewClassName} bg-gray-50 dark:bg-charcoal-900 flex items-center justify-center`}>
        {isPdf ? (
          <div className="flex flex-col items-center justify-center text-charcoal-900 dark:text-white p-4 text-center">
             <FileText className="w-12 h-12 text-red-500 mb-2" />
             <span className="text-sm font-medium truncate max-w-full">PDF Document Attached</span>
          </div>
        ) : (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white backdrop-blur transition-colors"
          >
            <Upload className="w-4 h-4" />
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-500/60 hover:bg-red-500/80 rounded-full text-white backdrop-blur transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {isUploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div
      onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`
        relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed
        cursor-pointer transition-all duration-200 ${previewClassName}
        ${isDragging
          ? 'border-accent-cyan/60 bg-accent-cyan/5'
          : 'border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5'
        }
      `}
    >
      {isUploading ? (
        <Loader2 className="w-8 h-8 text-accent-cyan animate-spin" />
      ) : (
        <>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-500" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="text-xs text-gray-400 mt-1">
              Drag & drop or click — Max {maxSizeMB}MB (PDF or Image)
            </p>
          </div>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
};

export default FileUploader;
