'use client';

import { Button } from '@/components/ui/Button';

interface AuctionCardProps {
  id: number;
  title: string;
  currentBid: number;
  timeLeft: string;
  bids: number;
  metal: 'gold' | 'silver' | 'platinum' | 'palladium';
  image?: string;
}

const metalColors = {
  gold: 'from-amber-400 to-yellow-600',
  silver: 'from-gray-300 to-gray-500',
  platinum: 'from-slate-300 to-slate-500',
  palladium: 'from-zinc-300 to-zinc-500'
};

const metalEmojis = {
  gold: '🥇',
  silver: '🥈',
  platinum: '🔷',
  palladium: '🔶'
};

export function AuctionCard({ id, title, currentBid, timeLeft, bids, metal }: AuctionCardProps) {
  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${metalColors[metal]}`} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl">{metalEmojis[metal]}</span>
          <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
            {metal.charAt(0).toUpperCase() + metal.slice(1)}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Current Bid</span>
            <span className="font-bold text-amber-600">${currentBid.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Time Left</span>
            <span className="font-medium text-gray-900">{timeLeft}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Bids</span>
            <span className="font-medium text-gray-900">{bids}</span>
          </div>
        </div>
        <Button 
          variant={metal === 'gold' ? 'gold' : 'primary'}
          fullWidth
          onClick={() => window.location.href = `/auctions/${id}`}
        >
          View Auction
        </Button>
      </div>
    </div>
  );
}
