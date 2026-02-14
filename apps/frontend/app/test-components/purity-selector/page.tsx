'use client';

import { useState } from 'react';
import PuritySelector from '../../PuritySelector';
export default function TestPuritySelector() {
  const [value, setValue] = useState(0.999);
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test PuritySelector</h1>
      <PuritySelector metalType="Gold" value={value} onChange={setValue} />
      <p className="mt-4">Purity: {value}</p>
    </div>
  );
}
