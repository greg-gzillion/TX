'use client';
import FormTypeSelector from '@/components/shared/forms/inputs/FormTypeSelector';
export default function Test() {
  return (
    <div className="p-4">
      <h1>FormTypeSelector Test</h1>
      <FormTypeSelector value="coin" onChange={() => {}} />
    </div>
  );
}
