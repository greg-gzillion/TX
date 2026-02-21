"use client";

import { useState } from 'react';
import FormTypeSelector from '@/components/shared/forms/inputs/FormTypeSelector';
import PuritySelector from '@/components/shared/forms/inputs/PuritySelector';
import SerialNumberInput from '@/components/shared/forms/inputs/SerialNumberInput';

export default function TestForm() {
  const [formType, setFormType] = useState<'coin' | 'round' | 'bar' | 'jewelry' | 'other'>('coin');
  const [purity, setPurity] = useState(0.999);
  const [serialNumber, setSerialNumber] = useState('');

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Test Phase 2 Components</h1>
      
      <div className="space-y-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">FormTypeSelector</h2>
          <FormTypeSelector value={formType} onChange={setFormType} />
          <p className="mt-2 text-sm text-gray-600">Selected: {formType}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">PuritySelector</h2>
          <PuritySelector metalType="Gold" value={purity} onChange={setPurity} />
          <p className="mt-2 text-sm text-gray-600">Selected purity: {purity}</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">SerialNumberInput</h2>
          <SerialNumberInput value={serialNumber} onChange={setSerialNumber} />
          <p className="mt-2 text-sm text-gray-600">Serial: {serialNumber || '(empty)'}</p>
        </div>
      </div>
    </div>
  );
}
