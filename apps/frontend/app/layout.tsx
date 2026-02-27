import { WalletProvider } from '@/hooks/useWallet';
import Link from 'next/link';
import UniversalWalletButton from '@/components/shared/UniversalWalletButton';

export const metadata = {
  title: 'Phoenix Precious Metals Exchange',
  description: 'Professional precious metals trading on Coreum blockchain',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f9fafb' }}>
        <WalletProvider>
          <nav className="border-b bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
              <div className="flex gap-6">
                <Link href="/" className="font-bold text-xl text-amber-600">PhoenixPME</Link>
                <Link href="/sandbox" className="text-purple-600 hover:text-purple-800">🧪 Sandbox</Link>
                <Link href="/auctions" className="text-gray-600 hover:text-gray-900">Auctions</Link>
                <Link href="/auctions/create" className="text-gray-600 hover:text-gray-900">Create</Link>
              </div>
              <UniversalWalletButton />
            </div>
          </nav>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}
