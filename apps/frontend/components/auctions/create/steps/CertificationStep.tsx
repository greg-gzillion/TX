'use client';

import CertificationInput from '@/components/shared/forms/inputs/CertificationInput';

interface CertificationStepProps {
  certification: any;
  onChange: (cert: any) => void;
  formType?: 'coin' | 'round' | 'bar' | 'jewelry' | 'other';
}

export default function CertificationStep({ certification, onChange, formType }: CertificationStepProps) {
  return (
    <section className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        3. Certification & Grading
        {formType && (
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({formType === 'coin' ? 'Numismatic' : 
              formType === 'round' ? 'Bullion' :
              formType === 'bar' ? 'Bar' :
              formType === 'jewelry' ? 'Jewelry' :
              'Item'})
          </span>
        )}
      </h2>
      
      <CertificationInput
        value={certification}
        onChange={onChange}
        context={formType}
      />
    </section>
  );
}
