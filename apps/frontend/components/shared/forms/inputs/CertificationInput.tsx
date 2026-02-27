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
  context?: string;
}

export default function CertificationInput({ value, onChange, context }: CertificationInputProps) {
  const [isCustom, setIsCustom] = useState(false);

  // Different options based on item type
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
    bar: [
      { value: 'Assay Card', label: 'Assay Card' },
      { value: 'Serial Number', label: 'Serial Number' },
      { value: 'Original Packaging', label: 'Original Packaging' },
      { value: 'Other', label: 'Other' },
    ],
    jewelry: [
      { value: 'Hallmark', label: 'Hallmark' },
      { value: "Maker's Mark", label: "Maker's Mark" },
      { value: 'Appraisal', label: 'Appraisal' },
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

  const currentServices = context ? gradingServices[context as keyof typeof gradingServices] : gradingServices.coin;

  return (
    <div className="space-y-4">
      {/* Main toggle - adapts to context */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="hasCertification"
          checked={value?.isGraded || value?.hasAssay || value?.hasHallmarks || false}
          onChange={(e) => {
            if (context === 'bar') {
              onChange({ ...value, hasAssay: e.target.checked });
            } else if (context === 'jewelry') {
              onChange({ ...value, hasHallmarks: e.target.checked });
            } else {
              onChange({ ...value, isGraded: e.target.checked });
            }
          }}
          className="rounded border-gray-300"
        />
        <label htmlFor="hasCertification" className="text-sm font-medium text-gray-700">
          {context === 'bar' ? 'This bar has assay / certification' :
           context === 'jewelry' ? 'This item has hallmarks / maker marks' :
           context === 'round' ? 'This round is certified' :
           'This coin is professionally graded'}
        </label>
      </div>

      {(value?.isGraded || value?.hasAssay || value?.hasHallmarks) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
          {/* Service selection - context-aware */}
          {context !== 'jewelry' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {context === 'bar' ? 'Certification Type' : 'Grading Service'}
              </label>
              <select
                value={value?.service || ''}
                onChange={(e) => onChange({ ...value, service: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select...</option>
                {currentServices?.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Grade - only for coins/rounds */}
          {(context === 'coin' || context === 'round') && value?.isGraded && (
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
          )}

          {/* Certification / Serial Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {context === 'bar' ? 'Serial / Assay Number' :
               context === 'jewelry' ? 'Hallmark / Maker Mark' :
               'Certification Number'}
            </label>
            <input
              type="text"
              value={value?.certNumber || value?.assayNumber || value?.hallmarks || ''}
              onChange={(e) => {
                if (context === 'bar') {
                  onChange({ ...value, assayNumber: e.target.value });
                } else if (context === 'jewelry') {
                  onChange({ ...value, hallmarks: e.target.value });
                } else {
                  onChange({ ...value, certNumber: e.target.value });
                }
              }}
              placeholder={context === 'bar' ? "e.g., 123456" :
                          context === 'jewelry' ? "e.g., 14k, 925, Tiffany" :
                          "e.g., 12345678"}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Condition description - for jewelry/other */}
          {(context === 'jewelry' || context === 'other') && (
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
          )}
        </div>
      )}

      {/* Raw/Uncertified option - different for each type */}
      {!value?.isGraded && !value?.hasAssay && !value?.hasHallmarks && (
        <div className="mt-2 p-3 bg-gray-100 rounded-md">
          <p className="text-sm text-gray-600">
            {context === 'bar' ? '📦 This bar will be listed as uncertified.' :
             context === 'jewelry' ? '💎 This item will be listed without hallmarks.' :
             context === 'round' ? '⭕ This round will be listed as raw/unslabbed.' :
             '🪙 This coin will be listed as raw/un-graded.'}
          </p>
          {(context === 'coin' || context === 'round') && (
            <p className="text-xs text-gray-500 mt-1">
              Describe the condition in your listing description.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
