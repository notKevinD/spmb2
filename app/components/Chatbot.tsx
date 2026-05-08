'use client';
import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Plus, AlertCircle, Minimize2, Maximize2 } from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll ke pesan terbaru
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus input saat chat dibuka
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Ambil sessionId dari API
  useEffect(() => {
    if (isOpen && !sessionId) {
      const loadSession = async () => {
        try {
          const response = await fetch('/api/chat/session');
          const data = await response.json();
          if (data.success && data.sessionId) {
            setSessionId(data.sessionId);
          }
        } catch (error) {
          console.error('Failed to load session:', error);
        }
      };
      loadSession();
    }
  }, [isOpen, sessionId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          sessionId: sessionId 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.response 
        }]);
        
        if (data.sessionId && !sessionId) {
          setSessionId(data.sessionId);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Silakan coba lagi.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = async () => {
    setShowWarning(true);
    
    setTimeout(async () => {
      try {
        const response = await fetch('/api/chat/new-session', {
          method: 'POST',
        });
        
        const data = await response.json();
        
        if (data.success) {
          setMessages([]);
          setSessionId(data.sessionId);
          setShowWarning(false);
          
          setMessages([{
            role: 'assistant',
            content: '👋 Memulai percakapan baru! Ada yang bisa saya bantu?'
          }]);
        }
      } catch (error) {
        console.error('Failed to start new chat:', error);
        alert('Gagal memulai chat baru. Silakan coba lagi.');
        setShowWarning(false);
      }
    }, 2000);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Responsive classes berdasarkan ukuran layar
  const chatWindowClasses = `
    fixed 
    bg-white 
    rounded-2xl 
    shadow-2xl 
    flex 
    flex-col 
    border 
    border-gray-200
    transition-all
    duration-300
    z-50
    
    /* Mobile (default) - full screen */
    inset-0
    m-0
    rounded-none
    
    /* Tablet (md: 768px) */
    md:inset-auto
    md:bottom-6
    md:right-6
    md:w-96
    md:h-[600px]
    md:rounded-2xl
    md:shadow-2xl
    
    /* Desktop (lg: 1024px) */
    lg:w-[450px]
    lg:h-[650px]
  `;

  const minimizedChatClasses = `
    fixed
    bottom-6
    right-6
    bg-blue-600
    text-white
    rounded-full
    shadow-lg
    cursor-pointer
    z-50
    flex
    items-center
    justify-center
    w-14
    h-14
    md:w-16
    md:h-16
    transition-all
    duration-300
    hover:bg-blue-700
    hover:scale-110
  `;

  // Jika chat dalam keadaan minimized
  if (isOpen && isMinimized) {
    return (
      <div 
        onClick={toggleMinimize}
        className={minimizedChatClasses}
        title="Buka chat"
      >
        <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
        {messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {messages.length}
          </span>
        )}
      </div>
    );
  }

  return (
    <>
      {/* Floating Button - Chat Tertutup */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 z-50 hover:scale-110"
          aria-label="Buka chat"
        >
          <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={chatWindowClasses}>
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 md:p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex-1">
              <h3 className="font-semibold text-sm md:text-base">Chat Support</h3>
              <p className="text-xs text-blue-100 hidden md:block">
                {sessionId ? `Session: ${sessionId.slice(0, 8)}...` : 'Memulai session...'}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={startNewChat}
                className="p-1.5 hover:bg-blue-700 rounded transition-colors"
                title="Mulai chat baru"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={toggleMinimize}
                className="p-1.5 hover:bg-blue-700 rounded transition-colors"
                title="Minimize"
              >
                <Minimize2 className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-blue-700 rounded transition-colors"
                title="Tutup"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </div>

          {/* Warning Banner */}
          {showWarning && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 m-2 rounded">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-yellow-800">
                  <p className="font-medium">⚠️ Peringatan!</p>
                  <p>History chat sebelumnya tidak akan bisa dilihat lagi setelah membuat chat baru.</p>
                  <p className="text-yellow-600 mt-1">Membuat session baru...</p>
                </div>
              </div>
            </div>
          )}

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-gray-50">
            {messages.length === 0 && !showWarning && (
              <div className="text-center text-gray-500 mt-10">
                <MessageCircle className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm md:text-base">Halo! 👋</p>
                <p className="text-xs md:text-sm mt-1">Ada yang bisa saya bantu?</p>
                <p className="text-xs text-gray-400 mt-4 hidden md:block">
                    Informasi PMB, Program Studi, atau Beasiswa
                </p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm md:text-base ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 shadow-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={sendMessage} className="border-t bg-white p-3 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ketik pesan..."
                className="flex-1 border rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading || showWarning}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim() || showWarning}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}