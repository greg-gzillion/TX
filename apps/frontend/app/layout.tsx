import { WalletProvider } from '@/hooks/useWallet';
import Link from 'next/link';
import UniversalWalletButton from '@/components/shared/UniversalWalletButton';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';

export const metadata = {
  title: 'Phoenix Precious Metals Exchange',
  description: 'Professional precious metals trading on Coreum blockchain',
  openGraph: {
    title: 'PhoenixPME - Peer-to-Peer Precious Metals Exchange',
    description: 'Trade gold, silver, platinum, and palladium directly with 1.1% fees',
    images: ['/Phoenix-sketch002.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhoenixPME',
    description: 'Peer-to-peer precious metals trading',
    images: ['/Phoenix-sketch002.png'],
  },
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
              <div className="flex items-center gap-6">
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
        <Analytics />
        
        {/* Google Analytics using script tags */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FXD292BQT8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FXD292BQT8');
          `}
        </Script>
      </body>
    </html>
  );
}
