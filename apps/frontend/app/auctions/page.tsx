import AuctionList from '@/components/auctions/list/AuctionList';
import Link from 'next/link';

export default function AuctionsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🏛️ Active Auctions</h1>
        <Link
          href="/auctions/create"
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition shadow-md flex items-center gap-2"
        >
          <span className="text-xl">+</span> Create Auction
        </Link>
      </div>
      <AuctionList />
    </div>
  );
}
