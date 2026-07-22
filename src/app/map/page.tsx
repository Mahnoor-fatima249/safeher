'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';

// Dynamically import Leaflet map component to prevent SSR window reference crashes
const PoliceMap = dynamic(() => import('@/components/PoliceMap'), { ssr: false });

export default function MapPage() {
  const [lang, setLang] = useState<'en' | 'ur'>('en');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <Navbar lang={lang} setLang={setLang} />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-black mb-4 text-rose-600">Nearest Police Stations</h1>
        <PoliceMap />
      </div>
    </div>
  );
}