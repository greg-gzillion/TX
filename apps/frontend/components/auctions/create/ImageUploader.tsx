'use client';

import { useState } from 'react';
import { useToast } from '@/lib/contexts/ToastContext';

interface UploadedImage {
  ipfsHash: string;
  url: string;
  file: File;
}

export default function ImageUploader({ onImagesChange }: { onImagesChange: (images: UploadedImage[]) => void }) {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    setUploading(true);
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      
      const newImages = data.uploads.map((upload: any, index: number) => ({
        ipfsHash: upload.ipfsHash,
        url: upload.url,
        file: Array.from(files)[index]
      }));
      
      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange(updatedImages);
      
      showToast(`✅ ${newImages.length} image(s) uploaded to IPFS`, 'success');
    } catch (error) {
      console.error('Upload error:', error);
      showToast('❌ Failed to upload images', 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = images.filter((_, i) => i !== indexToRemove);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Item Photos (up to 5)
      </label>
      
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-amber-500 transition">
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <div className="flex text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500"
            >
              <span>Upload to IPFS</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                multiple
                accept="image/*"
                disabled={uploading || images.length >= 5}
                onChange={(e) => handleUpload(e.target.files)}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each (max 5)</p>
          <p className="text-xs text-green-600 mt-1">
            🚀 Stored on IPFS - Decentralized & Permanent
          </p>
        </div>
      </div>

      {uploading && (
        <div className="text-center py-2">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-amber-600 border-t-transparent"></div>
          <span className="ml-2 text-sm text-gray-600">Uploading to IPFS...</span>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-5 gap-2 mt-4">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={img.url}
                alt={`Upload ${idx + 1}`}
                className="w-full h-20 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-[8px] p-1 rounded-b-lg truncate opacity-0 group-hover:opacity-100 transition">
                IPFS: {img.ipfsHash.slice(0, 8)}...
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
