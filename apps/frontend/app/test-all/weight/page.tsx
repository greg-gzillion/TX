'use client';
import WeightInput from '../../WeightInput';
export default function Test() {
  return (
    <div className="p-4">
      <h1>WeightInput Test</h1>
      <WeightInput 
        weight={1} 
        unit="troy_oz" 
        onWeightChange={() => {}} 
        onUnitChange={() => {}} 
      />
    </div>
  );
}
