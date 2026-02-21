'use client';
import PuritySelector from '@/components/shared/forms/inputs/PuritySelector';
export default function Test() {
  return (
    <div className="p-4">
      <h1>PuritySelector Test</h1>
      <PuritySelector metalType="Gold" value={0.999} onChange={() => {}} />
    </div>
  );
}
