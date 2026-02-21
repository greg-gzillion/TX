'use client';
import { useState } from 'react';
import ImageUploader from '@/components/shared/forms/inputs/ImageUploader';

export default function TestImageUpload() {
  const [images, setImages] = useState<string[]>([]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Image Uploader</h1>
      <ImageUploader 
        images={images.map((url, i) => ({ id: i, url, file: null }))} 
        onChange={(newImages) => setImages(newImages.map(img => img.url))}
      />
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Uploaded Images:</h2>
        <pre className="bg-gray-100 p-4 rounded">
          {JSON.stringify(images, null, 2)}
        </pre>
      </div>
    </div>
  );
}
