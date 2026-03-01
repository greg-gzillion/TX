'use client';

import { CoinSpec } from '../types';
import { mintageData } from '../data/mintage';

interface CoinDetailsDisplayProps {
  coin: CoinSpec;
}

export const CoinDetailsDisplay = ({ coin }: CoinDetailsDisplayProps) => {
  const mintage = mintageData[coin.name];

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
      
      {mintage && (
        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <h6 className="font-semibold text-amber-900 text-xs mb-2">📊 Mintage & Rarity</h6>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">Total Minted:</span>
              <span className="ml-2 font-mono font-medium">{mintage.total.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-600">Rarity:</span>
              <span className={`ml-2 font-medium ${
                mintage.rarity === 'Common' ? 'text-green-600' :
                mintage.rarity === 'Scarce' ? 'text-yellow-600' :
                mintage.rarity === 'Rare' ? 'text-orange-600' :
                'text-red-600'
              }`}>
                {mintage.rarity}
              </span>
            </div>
            {mintage.estimatedSurvival && (
              <div className="col-span-2">
                <span className="text-gray-600">Estimated Surviving:</span>
                <span className="ml-2 font-mono">{mintage.estimatedSurvival.toLocaleString()}</span>
                <span className="text-gray-500 text-[10px] ml-1">
                  ({((mintage.estimatedSurvival / mintage.total) * 100).toFixed(1)}%)
                </span>
              </div>
            )}
          </div>
          {mintage.notes && (
            <p className="text-xs text-gray-600 mt-2 italic">
              📝 {mintage.notes}
            </p>
          )}
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
