import CreateAuctionForm from '../../CreateAuctionForm';

export default function CreateAuctionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Auction</h1>
      <CreateAuctionForm />
    </div>
  );
}
