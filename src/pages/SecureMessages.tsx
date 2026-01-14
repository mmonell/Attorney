import React from 'react';
    import Header from '../components/Header';
    import Footer from '../components/Footer';
    import { useRouter } from 'next/router';
    import { MessageSquare } from 'lucide-react';
    
    type Message = {
      id: string;
      sender: 'client' | 'attorney' | 'system';
      text: string;
      createdAt: string;
    };
    
    const STORAGE_PREFIX = 'defense_messages_';
    
    const SecureMessages: React.FC = () => {
      const router = useRouter();
      const [user, setUser] = React.useState<any | null>(null);
      const [messages, setMessages] = React.useState<Message[]>([]);
      const [text, setText] = React.useState('');
      const listRef = React.useRef<HTMLDivElement | null>(null);
    
      React.useEffect(() => {
        try {
          const raw = localStorage.getItem('defense_user');
          if (!raw) {
            navigate('/');
            return;
          }
          const parsed = JSON.parse(raw);
          setUser(parsed);
    
          const key = STORAGE_PREFIX + (parsed.contact ?? parsed.createdAt ?? 'unknown');
          const rawMessages = localStorage.getItem(key);
          if (rawMessages) {
            setMessages(JSON.parse(rawMessages));
          } else {
            // initialize with a short system notice for reassurance
            const init: Message[] = [
              {
                id: `m_${Date.now()}`,
                sender: 'system',
                text: 'This is a private, attorney-client channel. Messages are stored locally in your browser for this demo.',
                createdAt: new Date().toISOString(),
              },
            ];
            setMessages(init);
            localStorage.setItem(key, JSON.stringify(init));
          }
        } catch (err) {
          console.error('Failed loading messages', err);
        }
      }, [router]);
    
      React.useEffect(() => {
        // auto-scroll to bottom on new messages
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      }, [messages]);
    
      const persist = (next: Message[]) => {
        if (!user) return;
        const key = STORAGE_PREFIX + (user.contact ?? user.createdAt ?? 'unknown');
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch (err) {
          console.error('Failed persisting messages', err);
        }
      };
    
      const sendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!text.trim() || !user) return;
    
        const msg: Message = {
          id: `m_${Date.now()}`,
          sender: 'client',
          text: text.trim(),
          createdAt: new Date().toISOString(),
        };
    
        const next = [...messages, msg];
        setMessages(next);
        persist(next);
        setText('');
    
        // optional: simulate a short-attorney acknowledgement (reassuring, not legal advice)
        setTimeout(() => {
          const reply: Message = {
            id: `m_${Date.now()}_r`,
            sender: 'attorney',
            text: 'Message received. We will review and respond shortly. If this is an emergency, call us.',
            createdAt: new Date().toISOString(),
          };
          const nextWithReply = [...(JSON.parse(JSON.stringify(next)) as Message[]), reply];
          setMessages(nextWithReply);
          persist(nextWithReply);
        }, 900);
      };
    
      if (!user) {
        return null;
      }
    
      return (
        <div className="min-h-screen bg-black">
          <Header />
          <main className="pt-16">
            <section className="py-12 px-4">
              <div className="max-w-4xl mx-auto text-white">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-md">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-medium">Secure message</h1>
                    <div className="text-sm text-white/60">Private channel with your assigned attorney</div>
                  </div>
                </div>
    
                <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                  <div
                    ref={listRef}
                    className="max-h-[60vh] overflow-y-auto p-4 space-y-3"
                    aria-live="polite"
                  >
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`max-w-[85%] p-3 rounded-lg ${
                          m.sender === 'client'
                            ? 'ml-auto bg-blue-600 bg-opacity-80 text-white'
                            : m.sender === 'attorney'
                            ? 'bg-white/10 text-white'
                            : 'bg-white/5 text-white/70 italic text-sm'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{m.text}</div>
                        <div className="text-[11px] text-white/50 mt-1 text-right">
                          {new Date(m.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                    {messages.length === 0 && (
                      <div className="text-white/60 text-center py-8">No messages yet.</div>
                    )}
                  </div>
    
                  <form onSubmit={sendMessage} className="p-4 border-t border-white/6 bg-black/50">
                    <label className="sr-only">Message</label>
                    <div className="flex items-center space-x-3">
                      <input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a private message to your attorney"
                        className="flex-1 bg-white/5 border border-white/10 text-white placeholder-white/50 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
                        aria-label="Message"
                      />
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                      >
                        Send
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push('/dashboard')}
                        className="bg-white/5 border border-white/10 text-white px-3 py-2 rounded-md"
                      >
                        Back
                      </button>
                    </div>
                  </form>
                </div>
    
                <div className="mt-6 text-sm text-white/60">
                  Messages are stored locally in your browser for this demo. For production, messages must be stored securely on a server with proper encryption and access controls.
                </div>
              </div>
            </section>
          </main>
          <Footer />
        </div>
      );
    };
    
    export default SecureMessages;