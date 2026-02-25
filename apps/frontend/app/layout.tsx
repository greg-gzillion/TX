import { WalletProvider } from '../lib/wallet-context';
import Link from 'next/link';

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
          <nav className="border-b">
            <div className="max-w-7xl mx-auto px-4 py-3 flex gap-6">
              <Link href="/" className="font-bold">PhoenixPME</Link>
              <Link href="/sandbox" className="text-blue-600">🧪 Sandbox</Link>
              <Link href="/auctions">Auctions</Link>
              <Link href="/create">Create</Link>
            </div>
          </nav>
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}// force fresh deploy Tue Feb 24 06:37:19 PM MST 2026
