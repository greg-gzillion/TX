import { AuctionList } from '../AuctionList';

export default function AuctionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Active Auctions</h1>
      <AuctionList />
    </div>
  );
}
