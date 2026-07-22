'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AuthPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } }
        });
        if (error) throw error;
        
        setSuccessMsg('Account created successfully! Please sign in.');
        setIsSignUp(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });
        
        if (error) throw error;
        
        if (!data || !data.session) {
          throw new Error('Invalid login credentials or email not confirmed.');
        }

        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      setErrorMsg(err.message || 'Authentication failed. Please check your details.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: 'sans-serif', backgroundColor: '#090712', color: '#f5f3ff' }}>
      
      <style>{`
        @keyframes shakeAnim {
          0% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-10px); }
          80% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
        .shake-box {
          animation: ${shake ? 'shakeAnim 0.5s ease-in-out' : 'none'};
        }
      `}</style>

      {/* Left Banner Section */}
      <div style={{ flex: 1, background: 'linear-gradient(135deg, #1e1b4b 0%, #090712 100%)', padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', color: '#fff', borderRight: '1px solid #2e1065' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '28px' }}>🛡️</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>SafeHer Ecosystem</span>
        </div>
        <div>
          <h1 style={{ fontSize: '40px', fontWeight: '800', lineHeight: '1.2', marginBottom: '20px', color: '#f5f3ff' }}>
            Advanced Personal Security & Emergency Response.
          </h1>
          <p style={{ fontSize: '15px', color: '#c4b5fd', lineHeight: '1.6', maxWidth: '450px' }}>
            Instant GPS broadcasting, automated background voice recording, shake-detection triggers, and trusted circle protection built for your safety.
          </p>
        </div>
        <div style={{ fontSize: '12px', color: '#a78bfa' }}>
          © 2026 SafeHer Security Systems. All rights reserved.
        </div>
      </div>

      {/* Right Form Section */}
      <div style={{ width: '480px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', backgroundColor: '#13111c' }}>
        <div className="shake-box" style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', margin: '0 0 8px 0' }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p style={{ fontSize: '13px', color: '#c4b5fd', margin: 0 }}>
              {isSignUp ? 'Enter your details to register safely' : 'Please sign in to access your dashboard'}
            </p>
          </div>

          {errorMsg && <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(239,68,68,0.15)', color: '#fca5a5', borderRadius: '10px', fontSize: '12px', border: '1px solid rgba(239,68,68,0.3)' }}>{errorMsg}</div>}
          {successMsg && <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(139,92,246,0.2)', color: '#c4b5fd', borderRadius: '10px', fontSize: '12px', border: '1px solid rgba(139,92,246,0.4)' }}>{successMsg}</div>}

          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {isSignUp && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#c4b5fd', marginBottom: '6px' }}>Full Name</label>
                <input type="text" placeholder="Mahnoor Fatima" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#090712', border: '1px solid #2e1065', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            )}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#c4b5fd', marginBottom: '6px' }}>Email Address</label>
              <input type="email" placeholder="name@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#090712', border: '1px solid #2e1065', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#c4b5fd', marginBottom: '6px' }}>Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#090712', border: '1px solid #2e1065', color: '#fff', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <button type="submit" disabled={loading} style={{ marginTop: '10px', width: '100%', backgroundColor: '#7c3aed', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 14px rgba(124,58,237,0.4)' }}>
              {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <button onClick={() => { setIsSignUp(!isSignUp); setErrorMsg(''); setSuccessMsg(''); }} style={{ background: 'none', border: 'none', color: '#a78bfa', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}