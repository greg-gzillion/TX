'use client';

import CertificationInput from '@/components/shared/forms/inputs/CertificationInput';

interface CertificationStepProps {
  certification: any;
  onChange: (cert: any) => void;
}

export default function CertificationStep({ certification, onChange }: CertificationStepProps) {
  return (
    <section className="bg-white p-6 rounded-xl border shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">3. Certification & Grading</h2>
      <CertificationInput
        value={certification}
        onChange={onChange}
      />
    </section>
  );
}
