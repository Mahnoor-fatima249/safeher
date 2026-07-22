'use client';
import { useState, useRef } from 'react';
import CalculatorDisguise from './CalculatorDisguise';

export default function SOSButton() {
  const [isSosActive, setIsSosActive] = useState(false);
  const [isDisguised, setIsDisguised] = useState(false);
  const [statusLog, setStatusLog] = useState('');
  
  const watchIdRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const triggerSOS = async () => {
    setIsSosActive(true);
    setStatusLog('Activating automated emergency sequences...');

    // 1. Play local siren alarm loop
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
      gainNode.gain.setValueAtTime(1, audioContextRef.current.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      oscillator.start();
    } catch (e) {
      console.error('Audio siren error:', e);
    }

    // 2. Open phone dialer with 15 pre-filled (Pakistan Emergency Police Number)
    // Note: Due to OS security limits, direct auto-dialing without user interaction is blocked; 
    // a click action or standard tel: link redirects the dialer instantly.
    window.location.href = 'tel:15';

    // 3. Initiate Live GPS Geolocation Tracking Loop
    if ('geolocation' in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const mapLink = `https://maps.google.com/?q=${lat},${lon}`;
          
          setStatusLog(`Location locked: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);

          // Automatically dispatch SMS payload through Twilio API backend route
          try {
            await fetch('/api/send-sms', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ mapLink })
            });
          } catch (err) {
            console.error('SMS trigger failed:', err);
          }
        },
        (error) => {
          setStatusLog(`GPS Error: ${error.message}`);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    // 4. Start Background Silent Media Recording (Audio/Video Evidence)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks: Blob[] = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('recording', blob, `sos-${Date.now()}.webm`);
        
        // Upload evidence chunk securely to Supabase Storage bucket
        await fetch('/api/upload-media', {
          method: 'POST',
          body: formData
        });
      };

      mediaRecorderRef.current.start(5000); // Record chunks every 5 seconds for real-time saving
    } catch (err) {
      console.warn('Media recording permission denied or unavailable:', err);
    }
  };

  const stopSOS = () => {
    setIsSosActive(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setStatusLog('SOS deactivated safely.');
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {isDisguised && <CalculatorDisguise onExit={() => setIsDisguised(false)} />}

      <div className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl text-center border border-rose-100 dark:border-slate-700">
        <h2 className="text-2xl font-black mb-2 text-rose-600 dark:text-rose-400">Emergency SOS</h2>
        <p className="text-xs text-slate-500 mb-6">Pressing this instantly dispatches alerts, logs live GPS, and records evidence.</p>

        {!isSosActive ? (
          <button
            onClick={triggerSOS}
            className="w-48 h-48 bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-700 hover:to-red-600 text-white font-black text-2xl rounded-full shadow-2xl transition transform active:scale-95 flex items-center justify-center mx-auto border-8 border-rose-200 dark:border-rose-900"
          >
            SOS
          </button>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-red-100 text-red-700 font-bold rounded-xl animate-pulse">
              🚨 ALERT BROADCASTING ACTIVE 🚨
            </div>
            <p className="text-xs font-mono text-slate-600">{statusLog}</p>
            <button
              onClick={stopSOS}
              className="w-full bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-xl font-bold"
            >
              Cancel / Stop SOS
            </button>
          </div>
        )}

        <button
          onClick={() => setIsDisguised(true)}
          className="mt-8 text-xs font-semibold text-indigo-600 dark:text-indigo-400 underline block mx-auto"
        >
          Activate Disguise Mode (Calculator Screen)
        </button>
      </div>
    </div>
  );
}