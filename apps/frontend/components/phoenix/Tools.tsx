'use client';

import Image from 'next/image';

export default function Tools() {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        📊 Developer Tools
      </h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <Image
          src="/excel-shortcuts.jpg"
          alt="Excel keyboard shortcuts cheat sheet"
          width={1200}
          height={800}
          className="w-full h-auto"
          priority
        />
      </div>
      <p className="text-xs text-gray-400 text-center mt-2">
        Quick reference for spreadsheet power users
      </p>
    </div>
  );
}
