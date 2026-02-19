// components/sandbox/AuctionPlayground.tsx
export function AuctionPlayground({ wallet }) {
  const [mockAuctions] = useState([
    { id: 1, title: '1oz Gold Bar', price: 5004.80, seller: 'Robert', bids: 12 },
    { id: 2, title: '10oz Silver Bar', price: 780.40, seller: 'Alice', bids: 8 },
    { id: 3, title: '1oz Platinum Bar', price: 2094.00, seller: 'Charlie', bids: 5 },
  ]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Auction Playground</h2>
      <p className="text-gray-600 mb-6">
        Test auctions with mock data. Real contract integration coming March 6.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAuctions.map((auction) => (
          <div key={auction.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">{auction.title}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {auction.bids} bids
              </span>
            </div>
            <div className="text-2xl font-bold text-amber-600 mb-2">
              ${auction.price}
            </div>
            <div className="text-sm text-gray-500 mb-3">
              Seller: {auction.seller}
            </div>
            <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Place Bid (Test)
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">🎮 Try It Out</h3>
        <p className="text-sm text-gray-600 mb-3">
          Select a wallet above and test the auction flow:
        </p>
        <ol className="list-decimal ml-5 text-sm text-gray-600 space-y-1">
          <li>Choose a wallet (Robert, Alice, etc.)</li>
          <li>Click "Place Bid" on any auction</li>
          <li>Watch the bid counter increase</li>
          <li>Try creating your own auction</li>
        </ol>
      </div>
    </div>
  );
}