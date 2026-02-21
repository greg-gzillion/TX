// components/auctions/list/AuctionCard.tsx
import { Auction } from '@/lib/contract/phoenix-escrow';

interface Props {
  auction: Auction;
  onBid?: (id: number) => void;
}

export default function AuctionCard({ auction, onBid }: Props) {
  const metadata = JSON.parse(auction.description);
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-2xl mr-2">
            {metadata.item.metalType === 'Gold' && '🥇'}
            {metadata.item.metalType === 'Silver' && '🥈'}
            {metadata.item.metalType === 'Platinum' && '⚪'}
            {metadata.item.metalType === 'Palladium' && '⚫'}
          </span>
          <h3 className="text-lg font-semibold">{metadata.item.metalType} {metadata.item.formType}</h3>
        </div>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
          {auction.status}
        </span>
      </div>
      
      <div className="mt-2 space-y-1 text-sm text-gray-600">
        <p>Weight: {metadata.item.weight} {metadata.item.weightUnit}</p>
        <p>Purity: {parseFloat(metadata.item.purity) * 100}%</p>
        {metadata.item.serialNumber && <p>Serial: {metadata.item.serialNumber}</p>}
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">Current Bid</p>
          <p className="text-xl font-bold">
            {auction.current_bid 
              ? `${(parseInt(auction.current_bid) / 1_000_000).toFixed(2)} CORE`
              : `${(parseInt(auction.starting_price) / 1_000_000).toFixed(2)} CORE (start)'`
            }
          </p>
        </div>
        <button 
          onClick={() => onBid?.(auction.id)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Place Bid
        </button>
      </div>
    </div>
  );
}
