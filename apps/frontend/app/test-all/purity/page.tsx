'use client';
import PuritySelector from '../../PuritySelector';
export default function Test() {
  return (
    <div className="p-4">
      <h1>PuritySelector Test</h1>
      <PuritySelector metalType="Gold" value={0.999} onChange={() => {}} />
    </div>
  );
}
