'use client';

import { CoinSpec } from '../types';
import { coinReferences } from '../data/references';

interface CoinDetailsDisplayProps {
  coin: CoinSpec;
}

export const CoinDetailsDisplay = ({ coin }: CoinDetailsDisplayProps) => {
  const reference = coinReferences[coin.name];

  return (
    <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-bold text-gray-900">{coin.name}</h5>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
          {coin.years}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500">Weight:</span>
          <span className="ml-2 font-mono font-medium">{coin.weight}g</span>
        </div>
        <div>
          <span className="text-gray-500">Purity:</span>
          <span className="ml-2 font-mono font-medium">{(coin.purity * 100).toFixed(1)}%</span>
        </div>
        <div>
          <span className="text-gray-500">Diameter:</span>
          <span className="ml-2 font-mono">{coin.diameter}mm</span>
        </div>
        <div>
          <span className="text-gray-500">Thickness:</span>
          <span className="ml-2 font-mono">{coin.thickness}mm</span>
        </div>
      </div>
      
      {reference && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h6 className="font-semibold text-blue-900 text-xs mb-2">📚 Reference Data</h6>
          {reference.notes && (
            <p className="text-xs text-blue-700 mb-2">{reference.notes}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {reference.pcgsUrl && (
              <a 
                href={reference.pcgsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View on PCGS →
              </a>
            )}
            {reference.ngcUrl && (
              <a 
                href={reference.ngcUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs px-2 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
              >
                View on NGC →
              </a>
            )}
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-600 mt-3 pt-2 border-t border-gray-100">
        <span className="font-medium">Composition:</span> {coin.composition}
      </p>
      
      {coin.designer && (
        <p className="text-xs text-gray-600 mt-1">
          <span className="font-medium">Designer:</span> {coin.designer}
        </p>
      )}
      
      {coin.notes && (
        <p className="text-xs text-amber-600 mt-2 italic">
          📝 {coin.notes}
        </p>
      )}
    </div>
  );
};
