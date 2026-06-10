'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Plus,
  AlertCircle,
  Minimize2,
} from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function formatWhatsAppLink(phone: string) {
  let number = phone.replace(/\D/g, '');

  if (number.startsWith('0')) {
    number = '62' + number.slice(1);
  }

  if (number.startsWith('620')) {
    number = '62' + number.slice(3);
  }

  return 'https://wa.me/' + number;
}

function cleanUrl(url: string) {
  const trailingPunctuation = /[.,!?;:)]+$/;
  const match = url.match(trailingPunctuation);

  if (!match) {
    return {
      clean: url,
      trailing: '',
    };
  }

  return {
    clean: url.slice(0, -match[0].length),
    trailing: match[0],
  };
}

function renderMessageWithLinks(text: string, keyPrefix = 'message') {
  const combinedRegex =
    /(https?:\/\/[^\s]+|www\.[^\s]+|(\+62|62|0)[0-9][0-9\s-]{7,15}[0-9])/g;

  const elements: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = combinedRegex.exec(text)) !== null) {
    const matchedText = match[0];

    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    const isUrl =
      matchedText.startsWith('http://') ||
      matchedText.startsWith('https://') ||
      matchedText.startsWith('www.');

    if (isUrl) {
      const urlData = cleanUrl(matchedText);
      const clean = urlData.clean;
      const trailing = urlData.trailing;
      const href = clean.startsWith('www.') ? 'https://' + clean : clean;

      elements.push(
        <a
          key={`${keyPrefix}-url-${match.index}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline font-medium break-all"
        >
          {clean}
        </a>
      );

      if (trailing) {
        elements.push(trailing);
      }
    } else {
      elements.push(
        <a
          key={`${keyPrefix}-phone-${match.index}`}
          href={formatWhatsAppLink(matchedText)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline font-medium"
        >
          {matchedText}
        </a>
      );
    }

    lastIndex = match.index + matchedText.length;
  }

  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  return elements;
}

function renderAssistantMessage(text: string) {
  const boldRegex = /\*\*([\s\S]+?)\*\*/g;
  const elements: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(
        ...renderMessageWithLinks(
          text.slice(lastIndex, match.index),
          `plain-${lastIndex}`
        )
      );
    }

    elements.push(
      <strong key={`bold-${match.index}`} className="font-semibold text-gray-900">
        {renderMessageWithLinks(match[1], `bold-${match.index}`)}
      </strong>
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    elements.push(
      ...renderMessageWithLinks(text.slice(lastIndex), `plain-${lastIndex}`)
    );
  }

  return elements;
}

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

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !sessionId) {
      fetch('/api/chat/session')
        .then((response) => response.json())
        .then((data) => {
          if (data.success && data.sessionId) {
            setSessionId(data.sessionId);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, sessionId]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();

    setInput('');
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userMessage,
      },
    ]);

    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          sessionId,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Chat request failed');
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.response || 'Maaf, tidak ada respons dari sistem.',
        },
      ]);

      if (data.sessionId && !sessionId) {
        setSessionId(data.sessionId);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = async () => {
    setShowWarning(true);

    setTimeout(async () => {
      try {
        const res = await fetch('/api/chat/new-session', {
          method: 'POST',
        });

        const data = await res.json();

        if (data.success) {
          setMessages([
            {
              role: 'assistant',
              content: 'Memulai percakapan baru. Ada yang bisa saya bantu?',
            },
          ]);

          setSessionId(data.sessionId);
        } else {
          alert('Gagal memulai chat baru.');
        }
      } catch {
        alert('Gagal memulai chat baru.');
      } finally {
        setShowWarning(false);
      }
    }, 2000);
  };

  if (!isOpen || isMinimized) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setIsMinimized(false);
        }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#0a1628] text-white rounded-full shadow-2xl hover:bg-[#0f2040] transition-all duration-200 hover:scale-110 flex items-center justify-center"
        aria-label="Buka chat"
        type="button"
      >
        <MessageCircle className="w-6 h-6" />

        {isMinimized && messages.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {messages.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div
      className="fixed z-50 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden"
      style={{
        bottom: '24px',
        right: '24px',
        width: 'min(420px, calc(100vw - 48px))',
        height: 'min(620px, calc(100vh - 120px))',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 shrink-0 bg-[#0a1628]">
        <div>
          <h3 className="font-bold text-white text-sm">Chat Support</h3>
          <p className="text-white/40 text-xs">
            {sessionId
              ? 'Session: ' + sessionId.slice(0, 8) + '...'
              : 'Memulai session...'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={startNewChat}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Chat baru"
            type="button"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMinimized(true)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Minimize"
            type="button"
          >
            <Minimize2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Tutup"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showWarning && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-3 mx-3 mt-2 rounded shrink-0">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />

            <div className="text-xs text-amber-800">
              <p className="font-semibold">Peringatan!</p>
              <p>
                History chat sebelumnya tidak akan bisa dilihat lagi setelah
                membuat chat baru.
              </p>
              <p className="text-amber-600 mt-1">Membuat session baru...</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
        {messages.length === 0 && !showWarning && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 pb-4">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <MessageCircle className="w-7 h-7 text-gray-300" />
            </div>

            <p className="text-[#0a1628] font-semibold text-sm">Halo!</p>
            <p className="text-xs mt-1 text-gray-400">
              Ada yang bisa saya bantu?
            </p>
            <p className="text-xs text-gray-300 mt-3">
              Informasi PMB, Program Studi, atau Beasiswa
            </p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.role + '-' + index}
            className={
              'flex ' + (message.role === 'user' ? 'justify-end' : 'justify-start')
            }
          >
            <div
              className={
                'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ' +
                (message.role === 'user'
                  ? 'bg-[#0a1628] text-white rounded-br-sm'
                  : 'bg-white border border-gray-100 text-gray-700 shadow-sm rounded-bl-sm')
              }
            >
              {message.role === 'assistant'
                ? renderAssistantMessage(message.content)
                : message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5">
                {[0, 0.15, 0.3].map((delay, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
                    style={{
                      animationDelay: String(delay) + 's',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="shrink-0 bg-white border-t border-gray-100 p-3"
      >
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            disabled={isLoading || showWarning}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1628]/20 focus:border-[#0a1628] transition-all placeholder:text-gray-300 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim() || showWarning}
            className="w-10 h-10 bg-[#0a1628] text-white rounded-xl flex items-center justify-center hover:bg-[#0f2040] disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shrink-0"
            aria-label="Kirim pesan"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
