'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

export default function SafeChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);

  // Chat sessions list
  const [sessions, setSessions] = useState<ChatSession[]>([
    { 
      id: '1', 
      title: 'Emergency & Police Help', 
      messages: [{ role: 'model', text: 'Hello! Main aapka SafeHer Police & Safety Assistant hoon. Aap emergency, greetings, ya safety ke baray mein kuch bhi pooch sakte hain!' }] 
    }
  ]);
  const [activeSessionId, setActiveSessionId] = useState<string>('1');

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession.messages, isOpen, activeSessionId]);

  const getOfflineKnowledgeAnswer = (query: string): string | null => {
    const q = query.toLowerCase();

    // 1. Greetings & General Conversation
    if (q.includes('salam') || q.includes('assalam o alaikum')) {
      if (q.includes('kaisay ho') || q.includes('kaise ho') || q.includes('how are you')) {
        return 'Walaikum Assalam! Main bilkul theek hoon aur aapki hifazat ke liye tayar hoon. Aap sunayein, aap kaise hain?';
      }
      return 'Walaikum Assalam! SafeHer Assistant mein aapka khair khamdhi hai. Aaj main aapki kya madad kar sakta hoon?';
    }
    if (q.includes('hello') || q.includes('hi ') || q.includes('hey ') || q.startsWith('hi') || q.startsWith('hey')) {
      return 'Hello! 👋 Ummeed hai aapka din acha ja raha ho. Aapko safety ya app ke baray mein kya maloomat chahiye?';
    }
    if (q.includes('kaise ho') || q.includes('kaisay ho') || q.includes('how are you')) {
      return 'Main aik AI assistant hoon aur bilkul theek hoon! Aap batayein, aapko kis kism ki madad ya information darkaar hai?';
    }
    if (q.includes('bye') || q.includes('allah hafiz') || q.includes('goodbye') || q.includes('khuda hafiz')) {
      return 'Allah Hafiz! Apna bohot khayal rakhein. Kisi bhi emergency mein SafeHer app hamesha aapke sath hai.';
    }
    if (q.includes('thank') || q.includes('shukriya') || q.includes('jazakallah')) {
      return 'Aapka bohat shukriya! Agar koi aur sawal ho ya madad chahiye ho toh zaroor batayiyega. Safe rahein!';
    }
    if (q.includes('who are you') || q.includes('aap kaun hain') || q.includes('apka naam kya hai')) {
      return 'Main SafeHer Assistant hoon, jo aapko emergency helplines, cyber crime reporting, aur self-defense tips فراہم karne ke liye banaya gaya hai.';
    }

    // 2. Emergency & Medical Helplines
    if (q.includes('police') || q.includes('helpline') || q.includes('15') || q.includes('emergency number')) {
      return '🚨 Pakistan mein emergency police helpline **15** hai. Iske ilawa Motorway Police ke liye **130** aur Rescue **1122** par bhi rabta kiya ja sakta hai.';
    }
    if (q.includes('1099') || q.includes('women helpline') || q.includes('complaint') || q.includes('aurat')) {
      return '📞 Aurton ke khilaf tashadud ya harassment ke khilaf government ki official helpline **1099** (Ministry of Human Rights) par 24/7 call kar sakte hain.';
    }
    if (q.includes('medical') || q.includes('ambulance') || q.includes('hospital') || q.includes('1122') || q.includes('tabiyat')) {
      return '🚑 Kisi bhi medical emergency ya achanak tabiyat kharab hone par foran **1122** (Rescue) par call karein.';
    }

    // 3. Cyber Crime & Harassment
    if (q.includes('cyber') || q.includes('blackmail') || q.includes('online harassment') || q.includes('fia') || q.includes('social media')) {
      return '💻 Agar koi online blackmail kare ya cyber harassment ho, toh FIA Cyber Crime Wing ki helpline **1991** par call karein ya complaints.fia.gov.pk par report darj karein.';
    }

    // 4. App Features & SOS
    if (q.includes('sos') || q.includes('whatsapp') || q.includes('help') || q.includes('madad') || q.includes('alert')) {
      return '🚨 SOS alert bhejnay ke liye dashboard par maujood "Send SOS to WhatsApp" button dabayein taake aapke trusted contacts ko emergency message aur location chalay jaye.';
    }
    if (q.includes('siren') || q.includes('alarm') || q.includes('awaaz')) {
      return '🔊 Aap dashboard ke "Sirens & Map" section se high-pitch police alarms ya sirens baja sakti hain taake aas-paas ke log mutasir hon aur madad mil sake.';
    }
    if (q.includes('calculator') || q.includes('disguise') || q.includes('chhipana')) {
      return '🧮 Calculator Disguise feature aapki app ko aik aam calculator mein tabdeel kar deta hai taake agar koi dekhe toh usay sirf calculator nazar aaye.';
    }
    if (q.includes('shake') || q.includes('sensor') || q.includes('hilona')) {
      return '📳 Shake Sensor ki madad se aap phone ko hila kar ya shake karke foran background audio recording aur emergency alerts trigger kar sakti hain.';
    }

    // 5. Self Defense & Safety Tips
    if (q.includes('self defense') || q.includes('bachao') || q.includes('tips') || q.includes('hifazat')) {
      return '🛡️ Self-Defense Tips: \n1) Hamesha roshan aur rushed raston par chalein.\n2) Phone par dekhte huway chalne se gurez karein.\n3) Khatray ki surat mein zoor se chillayein aur foran 15 milayein.';
    }
    if (q.includes('travel') || q.includes('safar') || q.includes('night') || q.includes('raat')) {
      return '🌙 Raat ke waqt safar karte waqt koshish karein ke kisi trusted driver ya family member ke sath hon, aur live location apnay kisi qareebi dost ke sath lazmi share karein.';
    }

    return null;
  };

  // Nayi chat shuru karne ka function
  const handleNewChat = () => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: `New Chat ${sessions.length + 1}`,
      messages: [{ role: 'model', text: 'Hello! Main aapka SafeHer Police & Safety Assistant hoon. Aap emergency, greetings, ya safety ke baray mein kuch bhi pooch sakte hain!' }]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
    setShowHistorySidebar(false);
  };

  const handleUserQuery = (queryText: string) => {
    if (!queryText.trim() || loading) return;
    const userMessage = queryText.trim();
    setInput('');

    const updatedMessages: Message[] = [...activeSession.messages, { role: 'user', text: userMessage }];

    // Update active session & auto-update title based on first query
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const isDefaultTitle = s.title.startsWith('New Chat') || s.title === 'Emergency & Police Help';
        return {
          ...s,
          messages: updatedMessages,
          title: isDefaultTitle ? userMessage.slice(0, 22) + '...' : s.title
        };
      }
      return s;
    }));
    
    setLoading(true);

    try {
      const localAnswer = getOfflineKnowledgeAnswer(userMessage);
      setTimeout(() => {
        const replyText = localAnswer || `Aapne poocha: "${userMessage}". SafeHer ke mutabiq hamesha apni hifazat ko pehlay rakhein. Kisi bhi emergency mein foran police helpline 15 par call karein ya dashboard se SOS send karein.`;
        
        setSessions(prev => prev.map(s => {
          if (s.id === activeSessionId) {
            return {
              ...s,
              messages: [...s.messages, { role: 'model', text: replyText }]
            };
          }
          return s;
        }));
        setLoading(false);
      }, 400);
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1000, fontFamily: 'sans-serif' }}>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} style={{ backgroundColor: '#7c3aed', color: '#fff', border: '2px solid #a78bfa', borderRadius: '50px', padding: '14px 22px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 6px 20px rgba(124,58,237,0.5)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>🛡️</span> Police & Safety Bot
        </button>
      )}

      {isOpen && (
        <div style={{ width: '400px', height: '600px', backgroundColor: '#13111c', border: '1px solid #2e1065', borderRadius: '20px', display: 'flex', overflow: 'hidden', boxShadow: '0 12px 35px rgba(9,7,18,0.7)', position: 'relative' }}>
          
          {/* Left Side: Chat History Sidebar */}
          <div style={{ width: showHistorySidebar ? '180px' : '0px', backgroundColor: '#0f0d17', borderRight: showHistorySidebar ? '1px solid #2e1065' : 'none', overflow: 'hidden', transition: 'width 0.3s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', zIndex: 10 }}>
            
            {/* History List Top */}
            <div style={{ padding: '12px 8px', overflowY: 'auto', flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#c4b5fd', marginBottom: '8px', paddingLeft: '4px', textTransform: 'uppercase' }}>Chat History</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sessions.map(s => {
                  const isActive = s.id === activeSessionId;
                  return (
                    <button 
                      key={s.id} 
                      onClick={() => { setActiveSessionId(s.id); setShowHistorySidebar(false); }}
                      style={{ 
                        textAlign: 'left', 
                        padding: '8px 10px', 
                        borderRadius: '8px', 
                        backgroundColor: isActive ? '#7c3aed' : 'transparent', 
                        color: isActive ? '#fff' : '#c4b5fd', 
                        border: 'none', 
                        fontSize: '11px', 
                        cursor: 'pointer', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis',
                        fontWeight: isActive ? 'bold' : 'normal'
                      }}
                    >
                      {s.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom New Chat Button inside Sidebar */}
            <div style={{ padding: '10px', borderTop: '1px solid #2e1065', backgroundColor: '#090712' }}>
              <button 
                onClick={handleNewChat} 
                style={{ width: '100%', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <span>+</span> New Chat
              </button>
            </div>
          </div>

          {/* Right Side: Main Chat Area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: '#13111c' }}>
            
            {/* Header */}
            <div style={{ backgroundColor: '#1e1b4b', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2e1065' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button 
                  onClick={() => setShowHistorySidebar(!showHistorySidebar)} 
                  title="Toggle History Sidebar" 
                  style={{ background: '#2e1065', border: '1px solid #7c3aed', borderRadius: '6px', color: '#c4b5fd', padding: '4px 8px', fontSize: '12px', cursor: 'pointer' }}
                >
                  {showHistorySidebar ? '◀' : '💬'}
                </button>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#7c3aed', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', border: '1px solid #a78bfa' }}>👮‍♀️</div>
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 'bold', color: '#f5f3ff', margin: 0, maxWidth: '130px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeSession.title}</h4>
                  <span style={{ fontSize: '9px', color: '#4ade80' }}>● Secure Session</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#c4b5fd', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div style={{ padding: '6px 10px', backgroundColor: '#090712', display: 'flex', gap: '6px', overflowX: 'auto', borderBottom: '1px solid #2e1065' }}>
              {['👋 Assalam-o-Alaikum', '🚨 Police 15', '📞 Women Helpline 1099', '💻 Cyber Crime (FIA)', '🛡️ Self-Defense'].map((chip) => (
                <button key={chip} onClick={() => handleUserQuery(chip.replace(/^[^\w\s]+/, '').trim())} style={{ backgroundColor: '#1e1b4b', color: '#c4b5fd', border: '1px solid #7c3aed', borderRadius: '10px', padding: '3px 8px', fontSize: '10px', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages Body */}
            <div style={{ flex: 1, padding: '14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', backgroundColor: '#090712' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url("https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.04, pointerEvents: 'none' }} />

              {activeSession.messages.map((msg, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', position: 'relative', zIndex: 1 }}>
                  <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: msg.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px', backgroundColor: msg.role === 'user' ? '#7c3aed' : '#1e1b4b', color: '#f5f3ff', fontSize: '12px', lineHeight: '1.4', border: msg.role === 'model' ? '1px solid #2e1065' : 'none', whiteSpace: 'pre-line' }}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', justifyContent: 'flex-start', position: 'relative', zIndex: 1 }}>
                  <div style={{ padding: '8px 12px', borderRadius: '10px', backgroundColor: '#1e1b4b', color: '#c4b5fd', fontSize: '11px', border: '1px solid #2e1065' }}>
                    Finding safety info...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer Input */}
            <div style={{ padding: '12px', backgroundColor: '#13111c', borderTop: '1px solid #2e1065', display: 'flex', gap: '8px', zIndex: 10 }}>
              <input 
                type="text" 
                placeholder="Ask greetings, police, cyber crime, SOS..." 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleUserQuery(input)} 
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', backgroundColor: '#090712', border: '1px solid #2e1065', color: '#fff', fontSize: '12px', outline: 'none' }} 
              />
              <button onClick={() => handleUserQuery(input)} style={{ backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '0 14px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
                ➤
              </button>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}