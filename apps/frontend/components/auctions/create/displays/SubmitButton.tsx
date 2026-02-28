'use client';

interface SubmitButtonProps {
  isSubmitting: boolean;
}

export default function SubmitButton({ isSubmitting }: SubmitButtonProps) {
  const handleClick = () => {
    // Track auction creation attempt
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'create_auction_click', {
        event_category: 'engagement',
        event_label: 'create_auction_button',
        value: 1
      });
      console.log('📊 GA Event: create_auction_click');
    }
  };

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">🚀 Ready to List!</h3>
          <p className="text-sm text-gray-600 mt-1">
            Your listing is complete
          </p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          onClick={handleClick}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-xl transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Creating...' : 'Create Test Auction →'}
        </button>
      </div>
	<div className="mt-4 pt-4 border-t border-green-200">
        <p className="text-xs text-gray-600">
          💡 TESTUSD are test tokens with no real value. 
          March 6 is a new TX testnet will launch — that's when REAL testing begins! 🧪
        </p>
      </div>      
    </div>
  );
}
