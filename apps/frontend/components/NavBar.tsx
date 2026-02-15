"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-blue-700">
              PhoenixPME
            </Link>
            
            <div className="hidden md:flex space-x-6">
              <Link 
                href="/" 
                className={`hover:text-blue-600 ${pathname === '/' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
              >
                Home
              </Link>
              <Link 
                href="/auctions" 
                className={`hover:text-blue-600 ${pathname === '/auctions' ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
              >
                Browse Auctions
              </Link>
              <Link 
                href="/auctions/new" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                + New Listing
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
