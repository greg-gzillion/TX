"use client";

interface FilterTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
  const tabs = [
    { id: "all", label: "All Metals", emoji: "🏛️" },
    { id: "gold", label: "Gold", emoji: "🥇" },
    { id: "silver", label: "Silver", emoji: "🥈" },
    { id: "platinum", label: "Platinum", emoji: "🔷" },
    { id: "palladium", label: "Palladium", emoji: "🔶" },
  ];

  return (
    <div className="flex space-x-2 border-b border-gray-200 pb-2 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap flex items-center space-x-2
            ${
              activeTab === tab.id
                ? "bg-amber-100 text-amber-900 border-b-2 border-amber-500"
                : "text-gray-600 hover:bg-gray-100"
            }`}
        >
          <span>{tab.emoji}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
