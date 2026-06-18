'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Plus,
  AlertCircle,
  Minimize2,
  Download,
} from 'lucide-react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type Visitor = {
  name: string;
  phone: string;
  school: string;
};

const VISITOR_STORAGE_KEY = 'pmb_chat_visitor';

function getChatHistoryKey(sessionId: string) {
  return `pmb_chat_history_${sessionId}`;
}

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
      <strong
        key={`bold-${match.index}`}
        className="font-semibold text-gray-900"
      >
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
  const [isStartingChat, setIsStartingChat] = useState(false);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visitor, setVisitor] = useState<Visitor | null>(null);

  const [visitorForm, setVisitorForm] = useState({
    name: '',
    phone: '',
    school: '',
  });

  const [showWarning, setShowWarning] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionInitializedRef = useRef(false);
  const hasLoadedHistoryRef = useRef(false);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && !isMinimized && visitor && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized, visitor]);

  useEffect(() => {
    if (sessionInitializedRef.current) return;
    sessionInitializedRef.current = true;

    async function initSession() {
      try {
        const savedVisitor = localStorage.getItem(VISITOR_STORAGE_KEY);

        if (savedVisitor) {
          try {
            setVisitor(JSON.parse(savedVisitor));
          } catch {
            localStorage.removeItem(VISITOR_STORAGE_KEY);
          }
        }

        const res = await fetch('/api/chat/session', {
          method: 'GET',
        });

        const data = await res.json();

        if (data.success && data.sessionId) {
          setSessionId(data.sessionId);
        }
      } catch (error) {
        console.error('Gagal membaca session:', error);
        sessionInitializedRef.current = false;
      }
    }

    initSession();
  }, []);

  useEffect(() => {
    if (!sessionId || hasLoadedHistoryRef.current) return;

    const savedMessages = localStorage.getItem(getChatHistoryKey(sessionId));

    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);

        if (Array.isArray(parsedMessages)) {
          setMessages(parsedMessages);
        }
      } catch {
        localStorage.removeItem(getChatHistoryKey(sessionId));
      }
    }

    hasLoadedHistoryRef.current = true;
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId || !hasLoadedHistoryRef.current) return;

    localStorage.setItem(getChatHistoryKey(sessionId), JSON.stringify(messages));
  }, [messages, sessionId]);

  const startChatWithVisitor = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = visitorForm.name.trim();
    const phone = visitorForm.phone.trim();
    const school = visitorForm.school.trim();

    if (!name || !phone || !school) {
      alert('Nama, nomor WhatsApp, dan asal sekolah wajib diisi.');
      return;
    }

    setIsStartingChat(true);

    try {
      const res = await fetch('/api/chat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, school }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Gagal memulai chat.');
      }

      setSessionId(data.sessionId);
      setVisitor(data.visitor);
      hasLoadedHistoryRef.current = true;

      localStorage.setItem(
        VISITOR_STORAGE_KEY,
        JSON.stringify(data.visitor)
      );

      const openingMessages: Message[] = [
        {
          role: 'assistant',
          content: `Halo ${data.visitor.name}! Ada yang bisa saya bantu seputar PMB UBL?`,
        },
      ];

      setMessages(openingMessages);

      localStorage.setItem(
        getChatHistoryKey(data.sessionId),
        JSON.stringify(openingMessages)
      );
    } catch (error) {
      console.error('Gagal memulai chat:', error);
      alert('Gagal memulai chat. Silakan coba lagi.');
    } finally {
      setIsStartingChat(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading || !sessionId || !visitor) return;

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
          visitor,
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
    if (!visitor) return;

    setShowWarning(true);

    try {
      if (sessionId) {
        localStorage.removeItem(getChatHistoryKey(sessionId));
      }

      const res = await fetch('/api/chat/new-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visitor }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Gagal membuat session baru.');
      }

      setSessionId(data.sessionId);
      hasLoadedHistoryRef.current = true;

      const newMessages: Message[] = [
        {
          role: 'assistant',
          content: `Percakapan baru dimulai. Ada yang bisa saya bantu lagi, ${visitor.name}?`,
        },
      ];

      setMessages(newMessages);

      localStorage.setItem(
        getChatHistoryKey(data.sessionId),
        JSON.stringify(newMessages)
      );
    } catch {
      alert('Gagal memulai chat baru.');
    } finally {
      setShowWarning(false);
    }
  };

  const resetVisitorData = () => {
    if (sessionId) {
      localStorage.removeItem(getChatHistoryKey(sessionId));
    }

    localStorage.removeItem(VISITOR_STORAGE_KEY);

    setVisitor(null);
    setSessionId(null);
    setMessages([]);
    setVisitorForm({
      name: '',
      phone: '',
      school: '',
    });

    hasLoadedHistoryRef.current = false;
  };

  const downloadChatHistory = () => {
    if (messages.length === 0) return;

    const downloadedAt = new Intl.DateTimeFormat('id-ID', {
      dateStyle: 'full',
      timeStyle: 'medium',
      timeZone: 'Asia/Jakarta',
    }).format(new Date());

    const visitorInfo = visitor
      ? [
          `Nama: ${visitor.name}`,
          `Nomor WhatsApp: ${visitor.phone}`,
          `Asal sekolah: ${visitor.school}`,
        ].join('\n')
      : 'Data calon mahasiswa: -';

    const conversation = messages
      .map((message, index) => {
        const sender = message.role === 'user' ? 'Pengguna' : 'Chatbot';
        const content = message.content.replace(/\*\*([\s\S]*?)\*\*/g, '$1');

        return `${index + 1}. ${sender}\n${content}`;
      })
      .join('\n\n');

    const fileContent = [
      'RIWAYAT PERCAKAPAN PMB UBL',
      `Waktu unduh: ${downloadedAt} WIB`,
      `Session ID: ${sessionId || '-'}`,
      '',
      visitorInfo,
      '',
      conversation,
    ].join('\n');

    const blob = new Blob(['\uFEFF', fileContent], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    const date = new Date().toISOString().slice(0, 10);
    const shortSession = sessionId?.slice(0, 8) || 'tanpa-session';

    link.href = url;
    link.download = `riwayat-chat-ubl-${date}-${shortSession}.txt`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
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
          <h3 className="font-bold text-white text-sm">Chat Support PMB</h3>
          <p className="text-white/40 text-xs">
            {visitor
              ? visitor.name + ' • ' + visitor.school
              : 'Isi data terlebih dahulu'}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={downloadChatHistory}
            disabled={messages.length === 0 || isLoading}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            title={
              messages.length === 0
                ? 'Belum ada percakapan untuk diunduh'
                : 'Unduh riwayat percakapan'
            }
            aria-label="Unduh riwayat percakapan"
            type="button"
          >
            <Download className="w-4 h-4" />
          </button>

          {visitor && (
            <button
              onClick={startNewChat}
              disabled={isLoading || showWarning}
              className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-30"
              title="Chat baru"
              type="button"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}

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

      {!visitor ? (
        <form
          onSubmit={startChatWithVisitor}
          className="flex-1 bg-gray-50 p-5 flex flex-col justify-center gap-3"
        >
          <div className="text-center mb-3">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-7 h-7 text-gray-300" />
            </div>

            <p className="text-[#0a1628] font-semibold text-sm">
              Selamat datang di Chat Support PMB UBL
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Silakan isi data berikut sebelum memulai chat.
            </p>
          </div>

          <input
            type="text"
            value={visitorForm.name}
            onChange={(e) =>
              setVisitorForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="Nama lengkap"
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1628]/20 focus:border-[#0a1628]"
          />

          <input
            type="tel"
            value={visitorForm.phone}
            onChange={(e) =>
              setVisitorForm((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
            placeholder="Nomor WhatsApp"
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1628]/20 focus:border-[#0a1628]"
          />

          <input
            type="text"
            value={visitorForm.school}
            onChange={(e) =>
              setVisitorForm((prev) => ({
                ...prev,
                school: e.target.value,
              }))
            }
            placeholder="Asal sekolah"
            className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1628]/20 focus:border-[#0a1628]"
          />

          <button
            type="submit"
            disabled={isStartingChat}
            className="mt-2 bg-[#0a1628] text-white rounded-xl py-2.5 text-sm font-medium hover:bg-[#0f2040] disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isStartingChat ? 'Memulai chat...' : 'Mulai Chat'}
          </button>

          <p className="text-[11px] text-gray-400 text-center mt-2 leading-relaxed">
            Data ini digunakan untuk membantu layanan informasi PMB UBL.
          </p>
        </form>
      ) : (
        <>
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
                  <p className="text-amber-600 mt-1">
                    Membuat session baru...
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 min-h-0">
            {messages.map((message, index) => (
              <div
                key={message.role + '-' + index}
                className={
                  'flex ' +
                  (message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start')
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

          <div className="shrink-0 bg-white border-t border-gray-100 p-3">
            <form onSubmit={sendMessage}>
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1628]/20 focus:border-[#0a1628] transition-all placeholder:text-gray-300 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !input.trim() ||
                    showWarning ||
                    !sessionId ||
                    !visitor
                  }
                  className="w-10 h-10 bg-[#0a1628] text-white rounded-xl flex items-center justify-center hover:bg-[#0f2040] disabled:bg-gray-200 disabled:cursor-not-allowed transition-all shrink-0"
                  aria-label="Kirim pesan"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            <button
              type="button"
              onClick={resetVisitorData}
              className="text-[11px] text-gray-400 hover:text-gray-600 mt-2 block mx-auto"
            >
              Ganti data pengguna
            </button>
          </div>
        </>
      )}
    </div>
  );
}