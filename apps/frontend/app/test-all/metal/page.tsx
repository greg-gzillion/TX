'use client';
import MetalSelector from '@/components/shared/forms/inputs/../MetalSelector';
export default function Test() {
  return (
    <div className="p-4">
      <h1>MetalSelector Test</h1>
      <MetalSelector value="Gold" onChange={() => {}} />
    </div>
  );
}
