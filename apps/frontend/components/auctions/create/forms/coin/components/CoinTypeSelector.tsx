"use client";

import Select from "react-select";
import { CoinSpec } from "../types";

interface CoinTypeSelectorProps {
  coinCategories: Record<string, any>;
  coinOptions: any[];
  activeCategory: string;
  selectedCoin: CoinSpec | null;
  onCategoryClick: (e: React.MouseEvent, category: string) => void;
  onCoinSelect: (coin: CoinSpec | null) => void;
}

export const CoinTypeSelector = ({
  coinCategories,
  coinOptions,
  activeCategory,
  selectedCoin,
  onCategoryClick,
  onCoinSelect,
}: CoinTypeSelectorProps) => {
  return (
    <div className="mt-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-medium text-blue-800 mb-3 flex items-center gap-2">
        <span className="text-xl">💰</span>
        Coin Type / Series
      </h4>

      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(coinCategories).map((category) => (
          <button
            key={category}
            onClick={(e) => onCategoryClick(e, category)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition ${
              activeCategory === category
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-blue-700 border border-blue-300 hover:bg-blue-100"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <Select
        options={coinOptions}
        value={
          selectedCoin
            ? {
                value: selectedCoin,
                label: `${selectedCoin.name} (${selectedCoin.years})`,
              }
            : null
        }
        onChange={(selected) => onCoinSelect(selected?.value || null)}
        placeholder={`Select ${activeCategory || "coin"}...`}
        isSearchable
        className="react-select-container"
        classNamePrefix="react-select"
        isDisabled={coinOptions.length === 0}
      />
    </div>
  );
};
