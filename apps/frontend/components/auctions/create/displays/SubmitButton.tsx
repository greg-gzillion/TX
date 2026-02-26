'use client';

interface SubmitButtonProps {
  isSandbox: boolean;
  isSubmitting: boolean;
}

export default function SubmitButton({ isSandbox, isSubmitting }: SubmitButtonProps) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Ready to List</h3>
          <p className="text-sm text-gray-600">
            {isSandbox 
              ? 'Test listing - no real funds' 
              : 'Testnet coming soon. Use sandbox mode for testing.'}
          </p>
        </div>
        {!isSandbox ? (
          <div className="px-8 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed">
            Testnet Pending
          </div>
        ) : (
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Creating...' : 'Create Test Auction'}
          </button>
        )}
      </div>
    </div>
  );
}
