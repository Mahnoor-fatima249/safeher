'use client';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function Navbar({ lang, setLang }: { lang: 'en' | 'ur', setLang: (l: 'en' | 'ur') => void }) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <nav className="bg-rose-600 text-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <Link href="/dashboard" className="font-extrabold text-xl tracking-wider hover:opacity-90 transition">
          SafeHer
        </Link>
        <div className="hidden md:flex space-x-6 text-sm font-medium">
          <Link href="/dashboard" className="hover:text-rose-200 transition">Dashboard</Link>
          <Link href="/contacts" className="hover:text-rose-200 transition">Contacts</Link>
          <Link href="/map" className="hover:text-rose-200 transition">Police Map</Link>
          <Link href="/tips" className="hover:text-rose-200 transition">Safety Tips</Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
          className="bg-rose-700 hover:bg-rose-800 px-3 py-1.5 rounded-lg text-xs font-bold uppercase border border-rose-400 transition cursor-pointer"
        >
          {lang === 'en' ? 'اردو' : 'English'}
        </button>
        <button 
          onClick={handleLogout} 
          className="bg-rose-900 hover:bg-rose-950 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
        >
          Exit
        </button>
      </div>
    </nav>
  );
}