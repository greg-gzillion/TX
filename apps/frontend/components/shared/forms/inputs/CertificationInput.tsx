'use client';

import { useState } from 'react';

interface CertificationInputProps {
  value: {
    isGraded: boolean;
    service?: string;
    grade?: string;
    certNumber?: string;
    hasAssay?: boolean;
    assayNumber?: string;
    hasHallmarks?: boolean;
    hallmarks?: string;
    condition?: string;
  };
  onChange: (value: any) => void;
  context?: string; // 'coin' | 'round' | 'bar' | 'jewelry' | 'other'
}

export default function CertificationInput({ value, onChange, context }: CertificationInputProps) {
  const [isCustom, setIsCustom] = useState(false);

  // If no context or context is 'other' (scrap), show nothing
  if (!context || context === 'other') {
    return null;
  }

  // For bars, show assay options
  if (context === 'bar') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hasAssay"
            checked={value?.hasAssay || false}
            onChange={(e) => onChange({ ...value, hasAssay: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="hasAssay" className="text-sm font-medium text-gray-700">
            This bar has assay / certification
          </label>
        </div>

        {value?.hasAssay && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certification Type
              </label>
              <select
                value={value?.service || ''}
                onChange={(e) => onChange({ ...value, service: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select...</option>
                <option value="Assay Card">Assay Card</option>
                <option value="Serial Number">Serial Number</option>
                <option value="Original Packaging">Original Packaging</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Serial / Assay Number
              </label>
              <input
                type="text"
                value={value?.assayNumber || ''}
                onChange={(e) => onChange({ ...value, assayNumber: e.target.value })}
                placeholder="e.g., 123456"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {!value?.hasAssay && (
          <div className="mt-2 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600">
              📦 This bar will be listed as uncertified.
            </p>
          </div>
        )}
      </div>
    );
  }

  // For jewelry, show hallmark options
  if (context === 'jewelry') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="hasHallmarks"
            checked={value?.hasHallmarks || false}
            onChange={(e) => onChange({ ...value, hasHallmarks: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="hasHallmarks" className="text-sm font-medium text-gray-700">
            This item has hallmarks / maker marks
          </label>
        </div>

        {value?.hasHallmarks && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hallmark / Maker Mark
              </label>
              <input
                type="text"
                value={value?.hallmarks || ''}
                onChange={(e) => onChange({ ...value, hallmarks: e.target.value })}
                placeholder="e.g., 14k, 925, Tiffany"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition Description
              </label>
              <textarea
                value={value?.condition || ''}
                onChange={(e) => onChange({ ...value, condition: e.target.value })}
                placeholder="Describe condition, wear, damage, etc."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {!value?.hasHallmarks && (
          <div className="mt-2 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600">
              💎 This item will be listed without hallmarks.
            </p>
          </div>
        )}
      </div>
    );
  }

  // For coins and rounds - show grading options
  if (context === 'coin' || context === 'round') {
    const gradingServices = {
      coin: [
        { value: 'PCGS', label: 'PCGS' },
        { value: 'NGC', label: 'NGC' },
        { value: 'ANACS', label: 'ANACS' },
        { value: 'ICG', label: 'ICG' },
        { value: 'Other', label: 'Other' },
      ],
      round: [
        { value: 'API', label: 'API' },
        { value: 'ICG', label: 'ICG' },
        { value: 'Other', label: 'Other' },
      ],
    };

    const gradeOptions = [
      { value: 'MS70', label: 'MS70 (Perfect)' },
      { value: 'MS69', label: 'MS69 (Near Perfect)' },
      { value: 'MS68', label: 'MS68' },
      { value: 'MS67', label: 'MS67' },
      { value: 'MS66', label: 'MS66' },
      { value: 'MS65', label: 'MS65' },
      { value: 'MS64', label: 'MS64' },
      { value: 'MS63', label: 'MS63' },
      { value: 'MS62', label: 'MS62' },
      { value: 'MS61', label: 'MS61' },
      { value: 'MS60', label: 'MS60' },
      { value: 'AU', label: 'AU (About Uncirculated)' },
      { value: 'XF', label: 'XF (Extremely Fine)' },
      { value: 'VF', label: 'VF (Very Fine)' },
      { value: 'F', label: 'F (Fine)' },
      { value: 'VG', label: 'VG (Very Good)' },
      { value: 'G', label: 'G (Good)' },
      { value: 'Poor', label: 'Poor / Damaged' },
    ];

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isGraded"
            checked={value?.isGraded || false}
            onChange={(e) => onChange({ ...value, isGraded: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="isGraded" className="text-sm font-medium text-gray-700">
            This {context === 'round' ? 'round' : 'coin'} is professionally graded
          </label>
        </div>

        {value?.isGraded && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grading Service
              </label>
              <select
                value={value?.service || ''}
                onChange={(e) => onChange({ ...value, service: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select...</option>
                {gradingServices[context].map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select
                value={value?.grade || ''}
                onChange={(e) => onChange({ ...value, grade: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select grade...</option>
                {gradeOptions.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Certification Number
              </label>
              <input
                type="text"
                value={value?.certNumber || ''}
                onChange={(e) => onChange({ ...value, certNumber: e.target.value })}
                placeholder="e.g., 12345678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}

        {!value?.isGraded && (
          <div className="mt-2 p-3 bg-gray-100 rounded-md">
            <p className="text-sm text-gray-600">
              🪙 This {context === 'round' ? 'round' : 'coin'} will be listed as raw/un-graded.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Describe the condition in your listing description.
            </p>
          </div>
        )}
      </div>
    );
  }

  // Default - show nothing
  return null;
}
