'use client';
import { useState } from 'react';
import CertificationInput from '../../CertificationInput';

export default function TestCertification() {
  const [cert, setCert] = useState({
    isGraded: false,
    service: undefined,
    grade: undefined,
    certNumber: undefined,
  });
  
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">CertificationInput Test</h1>
      <CertificationInput value={cert} onChange={setCert} />
      <pre className="mt-4 p-2 bg-gray-100 rounded">
        {JSON.stringify(cert, null, 2)}
      </pre>
    </div>
  );
}
