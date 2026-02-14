'use client';
import { useState } from 'react';
import ImageUpload from '../../ImageUpload';

export default function TestImageUpload() {
  const [images, setImages] = useState<string[]>([]);
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">ImageUpload Test</h1>
      <ImageUpload 
        onImagesChange={setImages}
        maxImages={5}
      />
      <div className="mt-4">
        <p>Images uploaded: {images.length}</p>
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            {images.map((img, idx) => (
              <img key={idx} src={img} className="w-full h-24 object-cover rounded" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
