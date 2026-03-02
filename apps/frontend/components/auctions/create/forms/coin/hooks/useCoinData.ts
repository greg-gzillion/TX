import { useState, useEffect } from 'react';
import { CoinSpec } from '@/components/auctions/create/forms/coin/types';
import { getCategorizedByCountryAndMetal } from '../data/specs';

export const useCoinData = (
  selectedCountry: any,
  metalType?: string
) => {
  const [coinCategories, setCoinCategories] = useState<Record<string, any>>({});
  const [coinOptions, setCoinOptions] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [selectedCoin, setSelectedCoin] = useState<CoinSpec | null>(null);

  useEffect(() => {
    console.log('🔍 useCoinData triggered:', { selectedCountry, metalType });
    
    if (selectedCountry?.value === 'USA' && metalType) {
      const categories = getCategorizedByCountryAndMetal('USA', metalType);
      console.log('📊 Categories loaded:', categories);
      setCoinCategories(categories);
      
      const firstCategory = Object.keys(categories)[0];
      setActiveCategory(firstCategory);
      
      if (firstCategory) {
        loadCategoryCoins(firstCategory, categories);
      }
    } else {
      setCoinCategories({});
      setCoinOptions([]);
      setActiveCategory('');
      setSelectedCoin(null);
    }
  }, [selectedCountry, metalType]);

  const loadCategoryCoins = (category: string, categories: any) => {
    const categoryValue = categories[category];
    
    if (Array.isArray(categoryValue)) {
      setCoinOptions(categoryValue.map((coin: CoinSpec) => ({
        value: coin,
        label: `${coin.name} (${coin.years}) - ${coin.weight}g, ${(coin.purity * 100).toFixed(1)}% pure`
      })));
    } else if (typeof categoryValue === 'object' && categoryValue !== null) {
      const allCoins: CoinSpec[] = [];
      Object.values(categoryValue).forEach(subCategory => {
        if (Array.isArray(subCategory)) {
          allCoins.push(...subCategory);
        }
      });
      
      setCoinOptions(allCoins.map(coin => ({
        value: coin,
        label: `${coin.name} (${coin.years}) - ${coin.weight}g, ${(coin.purity * 100).toFixed(1)}% pure`
      })));
    } else {
      setCoinOptions([]);
    }
  };

  const handleCategoryClick = (e: React.MouseEvent, category: string) => {
    e.preventDefault();
    setActiveCategory(category);
    loadCategoryCoins(category, coinCategories);
    setSelectedCoin(null);
  };

  const handleCoinSelect = (coin: CoinSpec | null) => {
    setSelectedCoin(coin);
  };

  return {
    coinCategories,
    coinOptions,
    activeCategory,
    selectedCoin,
    handleCategoryClick,
    handleCoinSelect,
    loadCategoryCoins
  };
};
