'use client';

import { useState } from 'react';
import SerialNumberInput from '../../SerialNumberInput';
export default function TestSerialInput() {
  const [value, setValue] = useState('');
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test SerialNumberInput</h1>
      <SerialNumberInput value={value} onChange={setValue} />
      <p className="mt-4">Serial: {value}</p>
    </div>
  );
}
