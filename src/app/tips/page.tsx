'use client';
import { useState } from 'react';
import Navbar from '@/components/Navbar';

export default function TipsPage() {
  const [lang, setLang] = useState<'en' | 'ur'>('en');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <Navbar lang={lang} setLang={setLang} />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-black mb-6 text-rose-600">Emergency Safety Guidelines</h1>
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-rose-500 mb-1">1. Move to Crowded Areas</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">If you sense danger, immediately head toward well-lit public spaces, shops, or family areas.</p>
          </div>
          <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold text-rose-500 mb-1">2. Keep Your Phone Ready</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300">Keep the SafeHer SOS app open or use the disguise calculator mode if someone is actively watching you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}