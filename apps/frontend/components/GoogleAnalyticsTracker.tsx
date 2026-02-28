'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function GoogleAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'G-FXD292BQT8', {
        page_path: pathname,
        page_title: document.title,
      });
      console.log('📊 GA Page View:', pathname);
    }
  }, [pathname]);

  return null;
}
