'use client';

import SerialNumberInput from '@/components/shared/forms/inputs/SerialNumberInput';
import ImageUploader from '@/components/shared/forms/inputs/ImageUploader';

interface DetailsPhotosStepProps {
  serialNumber: string;
  setSerialNumber: (value: string) => void;
  images: any[];
  setImages: (images: any[]) => void;
  videoUrl: string;
  setVideoUrl: (value: string) => void;
}

export default function DetailsPhotosStep({
  serialNumber,
  setSerialNumber,
  images,
  setImages,
  videoUrl,
  setVideoUrl
}: DetailsPhotosStepProps) {
  return (
    <section className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">4. Details & Photos</h2>
      <div className="space-y-6">
        <div>
          <SerialNumberInput value={serialNumber} onChange={setSerialNumber} />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Photos
          </label>
          <ImageUploader 
            images={images}
            onChange={setImages}
          />
          <p className="text-xs text-gray-500 mt-2">
            Max 5 images, 2MB each. First image is the primary thumbnail.
          </p>
          
          {/* Pinata warning - user friendly */}
          {!process.env.NEXT_PUBLIC_PINATA_JWT && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-300 rounded-md">
              <p className="text-sm font-medium text-yellow-800">
                📸 Photo upload temporarily disabled
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Will be enabled at launch on March 6. For now, you can still create test listings.
              </p>
            </div>
          )}
        </div>

        {/* Video Option */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video URL (Optional)
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
          <p className="text-xs text-gray-500 mt-2">
            Add a YouTube or Vimeo link for a video demonstration
          </p>
        </div>
      </div>
    </section>
  );
}
