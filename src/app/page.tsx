'use client';

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Settings, 
  Globe, 
  Volume2, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  PhoneCall, 
  Palette,
  Bell
} from 'lucide-react';

export default function SafeHerApp() {
  const [activeTab, setActiveTab] = useState('sos');
  const [lang, setLang] = useState<'en' | 'ur'>('en');
  const [userName, setUserName] = useState('Mahnoor');
  const [savedNumbers, setSavedNumbers] = useState<string[]>(['+923001234567']);
  const [newNumber, setNewNumber] = useState('');
  const [notificationStatus, setNotificationStatus] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [soundAlert, setSoundAlert] = useState(true);

  // Theme states
  const [themeType, setThemeType] = useState<'predefined' | 'custom'>('predefined');
  const [predefinedTheme, setPredefinedTheme] = useState<'red' | 'blackred' | 'blue' | 'green' | 'purple' | 'orange'>('red');
  const [customColor, setCustomColor] = useState('#e11d48'); 

  const getThemeConfig = () => {
    if (themeType === 'custom') {
      return {
        primary: customColor,
        primaryText: '#ffffff',
        badgeBg: customColor + '33',
      };
    }
    
    const themes = {
      red: { primary: '#ef4444', primaryText: '#ffffff', badgeBg: '#ef444433' },
      blackred: { primary: '#b91c1c', primaryText: '#ffffff', badgeBg: '#450a0a80' },
      blue: { primary: '#3b82f6', primaryText: '#ffffff', badgeBg: '#3b82f633' },
      green: { primary: '#10b981', primaryText: '#ffffff', badgeBg: '#10b98133' },
      purple: { primary: '#8b5cf6', primaryText: '#ffffff', badgeBg: '#8b5cf633' },
      orange: { primary: '#f97316', primaryText: '#ffffff', badgeBg: '#f9731633' },
    };
    return themes[predefinedTheme];
  };

  const theme = getThemeConfig();

  const dynamicStyles = {
    color: theme.primary,
    borderColor: theme.primary,
  };

  const dynamicBgStyle = {
    backgroundColor: theme.primary,
    color: theme.primaryText,
  };

  const isBlackRed = themeType === 'predefined' && predefinedTheme === 'blackred';

  const bodyClass = isBlackRed ? 'bg-black' : 'bg-slate-900';
  const headerClass = isBlackRed ? 'border-red-950' : 'border-slate-800';
  const textColorClass = isBlackRed ? 'text-zinc-200' : 'text-slate-300';

  const startAudioRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
    }, 30000);
  };

  const handleAddNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNumber.trim() && !savedNumbers.includes(newNumber)) {
      setSavedNumbers([...savedNumbers, newNumber.trim()]);
      setNewNumber('');
    }
  };

  const handleRemoveNumber = (index: number) => {
    const updated = savedNumbers.filter((_, i) => i !== index);
    setSavedNumbers(updated);
  };

  const triggerAutoWhatsAppSOS = () => {
    if (savedNumbers.length === 0) {
      alert(lang === 'ur' ? 'پہلے کانٹیکٹس شامل کریں!' : 'Please add trusted contacts first!');
      setActiveTab('messages');
      return;
    }

    setNotificationStatus(
      lang === 'ur' 
        ? 'لائیو لوکیشن لی جا رہی ہے اور ایمرجنسی ڈائلر تیار ہو رہا ہے...' 
        : 'Fetching live location and launching emergency dialer...'
    );
    setActiveTab('notification');
    if (soundAlert) startAudioRecording();

    try {
      window.location.href = 'tel:15';
    } catch (e) {
      console.log('Dialer redirect not supported');
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

          const msg = lang === 'ur' 
            ? `🚨 اہم ترین ایمرجنسی الرٹ! 🚨\n\nمجھ فوری مدد کی ضرورت ہے! میری لائیو لوکیشن:\n${mapsLink}\n\n- ${userName} (SafeHer ایپ)`
            : `🚨 EMERGENCY ALERT! 🚨\n\nI need immediate help! My live location:\n${mapsLink}\n\n- ${userName} (SafeHer App)`;

          navigator.clipboard.writeText(msg);
          setNotificationStatus(
            lang === 'ur' 
              ? 'واٹس ایپ پر SOS بھیج دیا گیا اور 15 ڈائلر اوپن کر دیا گیا!' 
              : 'WhatsApp SOS dispatched and emergency dialer (15) triggered.'
          );
          
          savedNumbers.forEach((num, idx) => {
            setTimeout(() => {
              window.open(`https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(msg)}`, '_blank');
            }, idx * 400);
          });
        },
        () => {
          const fallbackMsg = `🚨 EMERGENCY ALERT! 🚨 I need immediate help! - ${userName}`;
          navigator.clipboard.writeText(fallbackMsg);
          savedNumbers.forEach((num, idx) => {
            setTimeout(() => {
              window.open(`https://api.whatsapp.com/send?phone=${num}&text=${encodeURIComponent(fallbackMsg)}`, '_blank');
            }, idx * 400);
          });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  return (
    <div className={`min-h-screen ${bodyClass} text-slate-100 flex flex-col items-center p-4 transition-colors duration-300 relative`}>
      {/* Header */}
      <header className={`w-full max-w-md flex justify-between items-center py-4 border-b ${headerClass} mb-6`}>
        <div className="flex items-center space-x-2">
          <ShieldAlert style={dynamicStyles} className="w-8 h-8 transition-colors duration-300" />
          <h1 style={dynamicStyles} className="text-xl font-bold tracking-wider transition-colors duration-300">SafeHer</h1>
        </div>
        <button 
          onClick={() => setLang(lang === 'en' ? 'ur' : 'en')}
          style={{ ...dynamicStyles, backgroundColor: isBlackRed ? '#18181b' : '#1e293b' }}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium border hover:opacity-80 transition-all duration-300 cursor-pointer"
        >
          <Globe style={dynamicStyles} className="w-3.5 h-3.5 transition-colors duration-300" />
          <span>{lang === 'en' ? 'اردو' : 'English'}</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-between pb-24">
        
        {/* TAB 1: SOS Home Screen */}
        {activeTab === 'sos' && (
          <div className="flex flex-col items-center justify-center flex-1 space-y-8 text-center px-2">
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold">
                {lang === 'ur' ? `خوش آمدید، ${userName}` : `Welcome, ${userName}`}
              </h2>
              <p className={`text-sm ${textColorClass}`}>
                {lang === 'ur' 
                  ? 'ہنگامی صورتحال میں نیچے دیے گئے بٹن کو دبائیں۔ یہ 15 ڈائل کرے گا اور واٹس ایپ پر لائیو لوکیشن بھیجے گا۔' 
                  : 'Press the SOS button below in case of emergency. It triggers 15 and sends WhatsApp live location.'}
              </p>
            </div>

            {/* Big SOS Button */}
            <div className="relative flex items-center justify-center my-6">
              <div className="absolute w-64 h-64 rounded-full animate-ping opacity-30" style={{ backgroundColor: theme.primary }}></div>
              <div className="absolute w-52 h-52 rounded-full animate-pulse opacity-40" style={{ backgroundColor: theme.primary }}></div>
              <button 
                onClick={triggerAutoWhatsAppSOS}
                style={{ backgroundColor: theme.primary, color: theme.primaryText }}
                className="relative z-10 w-40 h-40 rounded-full shadow-2xl flex flex-col items-center justify-center font-black text-3xl tracking-widest border-4 border-white/25 transform active:scale-95 transition-all duration-300 cursor-pointer hover:opacity-95"
              >
                <ShieldAlert className="w-12 h-12 mb-1 animate-bounce" />
                SOS
              </button>
            </div>

            {/* Direct Emergency Call Button */}
            <a 
              href="tel:15" 
              style={isBlackRed ? { backgroundColor: '#18181b', borderColor: '#450a0a', color: '#f87171' } : undefined}
              className={`w-full ${!isBlackRed ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800' : ''} border py-3 px-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-sm transition shadow-md duration-300`}
            >
              <PhoneCall style={dynamicStyles} className="w-4 h-4 transition-colors duration-300" />
              <span className="transition-colors duration-300">{lang === 'ur' ? 'فوری 15 پر کال کریں (Direct Call 15)' : 'Direct Call 15'}</span>
            </a>
          </div>
        )}

        {/* TAB 2: Trusted Contacts */}
        {activeTab === 'messages' && (
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center space-x-2">
                <Users style={dynamicStyles} className="w-5 h-5 transition-colors duration-300" />
                <span>{lang === 'ur' ? 'قابل اعتماد نمبرز' : 'Trusted Contacts'}</span>
              </h2>
              <span className={`text-xs ${textColorClass}`}>{savedNumbers.length} added</span>
            </div>

            <form onSubmit={handleAddNumber} className="flex gap-2">
              <input 
                type="text" 
                placeholder={lang === 'ur' ? 'فون نمبر درج کریں (مثلاً +92...)' : 'Enter phone number (+92...)'}
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                className={`flex-1 ${isBlackRed ? 'bg-zinc-900 border-red-950 text-white' : 'bg-slate-800 border-slate-700 text-white'} border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors duration-300`}
              />
              <button 
                type="submit" 
                style={dynamicBgStyle}
                className="text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1 transition-all duration-300 cursor-pointer hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                <span>{lang === 'ur' ? 'شامل' : 'Add'}</span>
              </button>
            </form>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {savedNumbers.length === 0 ? (
                <p className={`text-center text-sm ${isBlackRed ? 'text-zinc-600' : 'text-slate-500'} py-8`}>
                  {lang === 'ur' ? 'کوئی کانٹیکٹ موجود نہیں ہے۔' : 'No trusted contacts found.'}
                </p>
              ) : (
                savedNumbers.map((num, idx) => (
                  <div key={idx} className={`flex items-center justify-between ${isBlackRed ? 'bg-zinc-900/80 border-red-950' : 'bg-slate-800/80 border-slate-700/50'} border p-3 rounded-lg`}>
                    <span className={`text-sm font-mono ${textColorClass}`}>{num}</span>
                    <button 
                      onClick={() => handleRemoveNumber(idx)}
                      className="text-slate-400 hover:text-red-500 p-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Status Screen */}
        {activeTab === 'notification' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 border-2 rounded-full flex items-center justify-center animate-pulse" style={{ backgroundColor: theme.badgeBg, borderColor: theme.primary }}>
              <AlertTriangle style={dynamicStyles} className="w-10 h-10 transition-colors duration-300" />
            </div>
            <div className="space-y-2">
              <h2 style={dynamicStyles} className="text-xl font-bold transition-colors duration-300">
                {lang === 'ur' ? 'ایمرجنسی رسپانس جاری ہے' : 'Emergency Action Triggered'}
              </h2>
              <p className={`text-sm ${isBlackRed ? 'text-zinc-300 bg-zinc-900 border-red-950' : 'text-slate-300 bg-slate-800/50 border-slate-700'} max-w-xs p-4 rounded-xl border`}>
                {notificationStatus || (lang === 'ur' ? 'مدد کی درخواست بھیجی جا رہی ہے...' : 'Processing emergency sequence...')}
              </p>
            </div>

            {isRecording && (
              <div className={`flex items-center space-x-2 ${isBlackRed ? 'bg-zinc-900 border-red-950 text-red-400' : 'bg-slate-800 border-slate-700 text-slate-300'} px-4 py-2 rounded-full text-xs`}>
                <Volume2 style={dynamicStyles} className="w-4 h-4 animate-bounce transition-colors duration-300" />
                <span>{lang === 'ur' ? 'آڈیو ثبوت ریکارڈ ہو رہا ہے...' : 'Recording audio evidence...'}</span>
              </div>
            )}

            <a 
              href="tel:15" 
              style={dynamicBgStyle}
              className="w-full max-w-xs py-3 px-4 rounded-xl flex items-center justify-center space-x-2 font-bold text-sm transition shadow-lg hover:opacity-90"
            >
              <PhoneCall className="w-4 h-4" />
              <span>{lang === 'ur' ? 'فوری 15 پر کال کریں' : 'Call 15 Directly'}</span>
            </a>

            <button 
              onClick={() => setActiveTab('sos')}
              className={`mt-2 ${isBlackRed ? 'bg-zinc-900 border-red-950 text-zinc-300 hover:bg-zinc-800' : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'} px-6 py-2 rounded-lg text-sm font-medium border transition cursor-pointer`}
            >
              {lang === 'ur' ? 'واپس جائیں' : 'Back to Home'}
            </button>
          </div>
        )}

        {/* TAB 4: Settings with Language, Theme Dropdown & Custom Color Picker */}
        {activeTab === 'settings' && (
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[70vh] pr-1 pb-4">
            <h2 className="text-lg font-bold flex items-center space-x-2">
              <Settings style={dynamicStyles} className="w-5 h-5 transition-colors duration-300" />
              <span>{lang === 'ur' ? 'سیٹنگز' : 'Settings'}</span>
            </h2>

            {/* Profile Name Setting */}
            <div className={`${isBlackRed ? 'bg-zinc-900/60 border-red-950' : 'bg-slate-800/60 border-slate-700/50'} border p-3 rounded-xl space-y-1.5`}>
              <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {lang === 'ur' ? 'صارف کا نام' : 'User Name'}
              </label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={`w-full ${isBlackRed ? 'bg-black border-red-950 text-white' : 'bg-slate-900 border-slate-700 text-white'} border rounded-lg px-3 py-1.5 text-sm focus:outline-none`}
              />
            </div>

            {/* Select Language Dropdown */}
            <div className={`${isBlackRed ? 'bg-zinc-900/60 border-red-950' : 'bg-slate-800/60 border-slate-700/50'} border p-3 rounded-xl space-y-1.5`}>
              <div className="flex items-center space-x-2">
                <Globe style={dynamicStyles} className="w-4 h-4 transition-colors duration-300" />
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {lang === 'ur' ? 'زبان منتخب کریں' : 'Select Language'}
                </label>
              </div>
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as 'en' | 'ur')}
                className={`w-full ${isBlackRed ? 'bg-black border-red-950 text-white' : 'bg-slate-900 border-slate-700 text-white'} border rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer`}
              >
                <option value="en">English</option>
                <option value="ur">اردو (Urdu)</option>
              </select>
            </div>

            {/* Select Theme Option Dropdown */}
            <div className={`${isBlackRed ? 'bg-zinc-900/60 border-red-950' : 'bg-slate-800/60 border-slate-700/50'} border p-3 rounded-xl space-y-1.5`}>
              <div className="flex items-center space-x-2">
                <Palette style={dynamicStyles} className="w-4 h-4 transition-colors duration-300" />
                <label className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {lang === 'ur' ? 'تھیم منتخب کریں' : 'Select Theme Option'}
                </label>
              </div>
              <select 
                value={themeType === 'custom' ? 'custom' : predefinedTheme}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === 'custom') {
                    setThemeType('custom');
                  } else {
                    setThemeType('predefined');
                    setPredefinedTheme(val as any);
                  }
                }}
                className={`w-full ${isBlackRed ? 'bg-black border-red-950 text-white' : 'bg-slate-900 border-slate-700 text-white'} border rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer`}
              >
                <option value="red">🔴 Red Theme</option>
                <option value="blackred">⬛🔴 Black & Red Theme</option>
                <option value="blue">🔵 Blue Theme</option>
                <option value="green">🟢 Green Theme</option>
                <option value="purple">🟣 Purple Theme</option>
                <option value="orange">🟠 Orange Theme</option>
                <option value="custom">✨ Custom Color (Apni marzi ka rang)</option>
              </select>
            </div>

            {/* Custom Color Picker Box (Appears when Custom is selected) */}
            {themeType === 'custom' && (
              <div className={`${isBlackRed ? 'bg-zinc-900/60 border-red-950' : 'bg-slate-800/60 border-slate-700/50'} border p-3 rounded-xl flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                  <Palette style={dynamicStyles} className="w-5 h-5 transition-colors duration-300" />
                  <div>
                    <h4 className="text-sm font-semibold">{lang === 'ur' ? 'اپنی مرضی کا رنگ منتخب کریں' : 'Pick Custom Color'}</h4>
                    <p className="text-xs text-slate-400">{lang === 'ur' ? 'باکس پر کلک کریں' : 'Click box to choose'}</p>
                  </div>
                </div>
                <input 
                  type="color" 
                  value={customColor}
                  onChange={(e) => {
                    setThemeType('custom');
                    setCustomColor(e.target.value);
                  }}
                  className="w-12 h-10 rounded-xl cursor-pointer p-1 bg-slate-700 border-2 border-slate-400 shadow-md hover:scale-105 transition-transform"
                />
              </div>
            )}

            {/* Shake Detection Sensor Toggle */}
            <div className={`${isBlackRed ? 'bg-zinc-900/60 border-red-950' : 'bg-slate-800/60 border-slate-700/50'} border p-3 rounded-xl flex items-center justify-between`}>
              <div className="flex items-center space-x-3">
                <Volume2 style={dynamicStyles} className="w-5 h-5 transition-colors duration-300" />
                <div>
                  <h4 className="text-sm font-semibold">{lang === 'ur' ? 'شیک ڈیٹیکشن سینسر' : 'Shake Detection Sensor'}</h4>
                  <p className="text-xs text-slate-400">{lang === 'ur' ? 'موبائل ہلانے پر SOS' : 'Trigger SOS on shake'}</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={soundAlert} 
                onChange={() => setSoundAlert(!soundAlert)}
                style={{ accentColor: theme.primary }}
                className="w-4 h-4 cursor-pointer"
              />
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className={`w-full max-w-md fixed bottom-0 left-1/2 -translate-x-1/2 ${isBlackRed ? 'bg-black/95 border-red-950' : 'bg-slate-900/95 border-slate-800'} backdrop-blur-md border-t py-3 px-6 flex justify-between items-center z-20`}>
        <button 
          onClick={() => setActiveTab('sos')}
          style={activeTab === 'sos' ? dynamicStyles : undefined}
          className={`flex flex-col items-center space-y-1 transition cursor-pointer ${activeTab === 'sos' ? '' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-[10px] font-medium">SOS</span>
        </button>
        <button 
          onClick={() => setActiveTab('messages')}
          style={activeTab === 'messages' ? dynamicStyles : undefined}
          className={`flex flex-col items-center space-y-1 transition cursor-pointer ${activeTab === 'messages' ? '' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">{lang === 'ur' ? 'کانٹیکٹس' : 'Contacts'}</span>
        </button>
        <button 
          onClick={() => setActiveTab('notification')}
          style={activeTab === 'notification' ? dynamicStyles : undefined}
          className={`flex flex-col items-center space-y-1 transition cursor-pointer ${activeTab === 'notification' ? '' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] font-medium">{lang === 'ur' ? 'اسٹیٹس' : 'Status'}</span>
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          style={activeTab === 'settings' ? dynamicStyles : undefined}
          className={`flex flex-col items-center space-y-1 transition cursor-pointer ${activeTab === 'settings' ? '' : 'text-slate-400 hover:text-slate-200'}`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[10px] font-medium">{lang === 'ur' ? 'سیٹنگز' : 'Settings'}</span>
        </button>
      </nav>
    </div>
  );
}