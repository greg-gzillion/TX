import { WalletProvider } from '@/hooks/useWallet';
import Link from 'next/link';
import UniversalWalletButton from '@/components/shared/UniversalWalletButton';
import { Analytics } from '@vercel/analytics/react';
import Script from 'next/script';
import GoogleAnalyticsTracker from '@/components/GoogleAnalyticsTracker';

const siteUrl = process.env.NODE_ENV === 'production' 
  ? 'https://phoenix-frontend-seven.vercel.app'
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Phoenix Precious Metals Exchange',
  description: 'Professional precious metals trading on Coreum blockchain',
  openGraph: {
    title: 'PhoenixPME - Peer-to-Peer Precious Metals Exchange',
    description: 'Trade gold, silver, platinum, and palladium directly with 1.1% fees',
    url: siteUrl,
    siteName: 'PhoenixPME',
    images: [
      {
        url: '/Phoenix-sketch002.png',
        width: 1200,
        height: 630,
        alt: 'PhoenixPME - Precious Metals Exchange',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhoenixPME',
    description: 'Peer-to-peer precious metals trading',
    images: ['/Phoenix-sketch002.png'],
    creator: '@gzillion_zil',
    site: '@gzillion_zil',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/Phoenix-rising001.png" />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#f9fafb' }}>
        {/* Google Analytics Scripts */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FXD292BQT8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FXD292BQT8', {
              page_path: window.location.pathname,
              send_page_view: true
            });
            console.log('📊 Google Analytics initialized');
          `}
        </Script>

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
        
        {/* Analytics Trackers */}
        <Analytics />
        <GoogleAnalyticsTracker />
      </body>
    </html>
  );
}
