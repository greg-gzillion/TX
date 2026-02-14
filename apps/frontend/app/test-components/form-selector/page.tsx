'use client';

import { useState } from 'react';
import FormTypeSelector from '../../FormTypeSelector';
export default function TestFormSelector() {
  const [value, setValue] = useState<'coin' | 'round' | 'bar' | 'jewelry' | 'other'>('coin');
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test FormTypeSelector</h1>
      <FormTypeSelector value={value} onChange={setValue} />
      <p className="mt-4">Selected: {value}</p>
    </div>
  );
}
