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
  GraduationCap,
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

type ChatNotice = {
  title: string;
  message: string;
};

type ConfirmationAction = 'new-chat' | 'change-user';

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

function getUserFacingErrorMessage(error: unknown, fallback: string) {
  if (
    error instanceof Error &&
    [
      'Nama, nomor WhatsApp, dan asal sekolah wajib diisi.',
      'Nomor WhatsApp tidak valid.',
    ].includes(error.message)
  ) {
    return error.message;
  }

  return fallback;
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

  const [confirmationAction, setConfirmationAction] =
    useState<ConfirmationAction | null>(null);
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false);
  const [notice, setNotice] = useState<ChatNotice | null>(null);

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
        } else {
          setNotice({
            title: 'Sesi chat belum siap',
            message:
              'Koneksi ke layanan chat belum berhasil dibuat. Coba muat ulang halaman sebelum memulai percakapan.',
          });
        }
      } catch (error) {
        console.error('Gagal membaca session:', error);
        setNotice({
          title: 'Sesi chat belum siap',
          message:
            'Koneksi ke layanan chat bermasalah. Periksa koneksi internet Anda, lalu muat ulang halaman.',
        });
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
          queueMicrotask(() => setMessages(parsedMessages));
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
      setNotice({
        title: 'Data belum lengkap',
        message:
          'Isi nama lengkap, nomor WhatsApp, dan asal sekolah sebelum memulai chat.',
      });
      return;
    }

    setNotice(null);
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

      if (!res.ok || !data.success) {
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
      setNotice({
        title: 'Chat belum dapat dimulai',
        message: getUserFacingErrorMessage(
          error,
          'Layanan pendaftaran sedang tidak dapat dihubungi. Silakan coba lagi beberapa saat lagi.'
        ),
      });
    } finally {
      setIsStartingChat(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading || !sessionId || !visitor) return;

    const userMessage = input.trim();

    setInput('');
    setNotice(null);

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

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Pesan tidak dapat dikirim.');
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
    } catch (error) {
      console.error('Gagal mengirim pesan:', error);
      setNotice({
        title: 'Pesan belum terkirim',
        message:
          'Pesan Anda belum berhasil dikirim. Periksa koneksi internet, lalu kirim kembali pesan tersebut.',
      });
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

  const startNewChat = () => {
    if (!visitor || isLoading || isCreatingNewChat) return;

    setNotice(null);
    setConfirmationAction('new-chat');
  };

  const confirmNewChat = async () => {
    if (!visitor) return;

    setNotice(null);
    setIsCreatingNewChat(true);

    try {
      const res = await fetch('/api/chat/new-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ visitor }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal membuat session baru.');
      }

      if (sessionId) {
        localStorage.removeItem(getChatHistoryKey(sessionId));
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
    } catch (error) {
      console.error('Gagal memulai chat baru:', error);
      setNotice({
        title: 'Chat baru belum dibuat',
        message: getUserFacingErrorMessage(
          error,
          'Riwayat chat tetap tersimpan. Silakan coba buat chat baru beberapa saat lagi.'
        ),
      });
    } finally {
      setIsCreatingNewChat(false);
      setConfirmationAction(null);
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

  const requestVisitorDataChange = () => {
    if (isCreatingNewChat) return;

    setNotice(null);
    setConfirmationAction('change-user');
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
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
        {!isMinimized && (
          <div className="relative max-w-[190px] rounded-[26px] border border-sky-100 bg-white px-4 py-3 text-right shadow-xl shadow-sky-900/12">
            <span className="absolute -right-1 bottom-5 h-4 w-4 rotate-45 border-r border-t border-sky-100 bg-white" />
            <p className="relative text-[11px] font-bold uppercase tracking-normal text-[#087ee7]">
              Fitur Baru
            </p>
            <p className="relative mt-0.5 text-sm font-extrabold leading-snug text-[#11192d]">
              Coba Chatbot PMB UBL yuk
            </p>
          </div>
        )}

        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className={
            'relative flex items-center justify-center rounded-full bg-[#075da8] text-white shadow-xl shadow-[#063f73]/30 ring-4 ring-white/95 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:bg-[#064f90] ' +
            (isMinimized ? 'h-14 w-14' : 'h-16 w-16')
          }
          aria-label={isMinimized ? 'Lanjutkan chat' : 'Buka chat'}
          title={isMinimized ? 'Lanjutkan chat' : 'Buka chat'}
          type="button"
        >
          <span className="absolute -left-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#f5a623] px-1.5 text-[10px] font-extrabold text-[#083b6f] shadow-lg shadow-orange-500/25">
            UBL
          </span>
          <MessageCircle className="h-7 w-7" />

          {isMinimized && (
            <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#ff7400] px-1 text-[10px] font-bold text-white shadow-md shadow-orange-500/30">
              {messages.length > 99 ? '99+' : messages.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      className="fixed z-50 flex flex-col overflow-hidden rounded-2xl border border-[#c6d8ea] bg-white shadow-2xl shadow-[#102a43]/25"
      style={{
        bottom: '24px',
        right: '24px',
        width: 'min(420px, calc(100vw - 48px))',
        height: 'min(620px, calc(100vh - 120px))',
      }}
    >
      <div className="relative flex shrink-0 items-center justify-between overflow-hidden border-b-4 border-[#f5a623] bg-gradient-to-r from-[#062b55] via-[#075da8] to-[#0878bd] px-4 py-3.5">
        <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10" />
        <div className="absolute right-16 top-8 h-16 w-16 rounded-full bg-[#f5a623]/20" />
        <div className="relative flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/35">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-extrabold text-white">
                Chat Support PMB UBL
              </h3>
            </div>
            <p className="truncate text-xs font-medium text-white/80">
              {visitor
                ? visitor.name + ' - ' + visitor.school
                : 'Universitas Bandar Lampung'}
            </p>
          </div>
        </div>

        <div className="relative flex items-center gap-1">
          <button
            onClick={downloadChatHistory}
            disabled={messages.length === 0 || isLoading}
            className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
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
              disabled={isLoading || isCreatingNewChat}
              className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-30"
              title="Chat baru"
              type="button"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => setIsMinimized(true)}
            className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
            title="Minimize"
            type="button"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
{/* 
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
            title="Tutup"
            type="button"
          >
            <X className="w-4 h-4" />
          </button> */}
        </div>
      </div>

      {!visitor ? (
        <form
          onSubmit={startChatWithVisitor}
          className="flex flex-1 flex-col justify-center gap-3 bg-[#f4f8fc] p-5"
        >
          <div className="text-center mb-3">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#075da8] shadow-lg shadow-[#063f73]/20">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>

            <p className="text-sm font-extrabold text-[#11192d]">
              Selamat datang di Chat Support PMB UBL
            </p>

            <p className="mt-1 text-xs font-medium text-[#334766]">
              Silakan isi data berikut sebelum memulai chat.
            </p>
          </div>

          {notice && (
            <ChatNoticePanel notice={notice} onClose={() => setNotice(null)} />
          )}

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
            className="rounded-xl border border-sky-100 bg-white px-4 py-2.5 text-sm text-[#11192d] shadow-sm shadow-sky-900/5 transition-all placeholder:text-slate-400 focus:border-[#087ee7] focus:outline-none focus:ring-2 focus:ring-[#087ee7]/20"
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
            className="rounded-xl border border-sky-100 bg-white px-4 py-2.5 text-sm text-[#11192d] shadow-sm shadow-sky-900/5 transition-all placeholder:text-slate-400 focus:border-[#087ee7] focus:outline-none focus:ring-2 focus:ring-[#087ee7]/20"
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
            className="rounded-xl border border-sky-100 bg-white px-4 py-2.5 text-sm text-[#11192d] shadow-sm shadow-sky-900/5 transition-all placeholder:text-slate-400 focus:border-[#087ee7] focus:outline-none focus:ring-2 focus:ring-[#087ee7]/20"
          />

          <button
            type="submit"
            disabled={isStartingChat}
            className="mt-2 rounded-xl bg-gradient-to-r from-[#1689f8] to-[#02afd4] py-2.5 text-sm font-extrabold text-white shadow-lg shadow-sky-500/20 transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
          >
            {isStartingChat ? 'Memulai chat...' : 'Mulai Chat'}
          </button>

          <p className="mt-2 text-center text-[11px] leading-relaxed text-[#334766]/70">
            Data ini digunakan untuk membantu layanan informasi PMB UBL.
          </p>
        </form>
      ) : (
        <>
          {confirmationAction && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#11192d]/45 p-5">
              <div
                className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby="new-chat-confirm-title"
                aria-describedby="new-chat-confirm-message"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <AlertCircle className="h-5 w-5" />
                  </span>
                  <div>
                    <h4
                      id="new-chat-confirm-title"
                      className="text-sm font-bold text-[#11192d]"
                    >
                      {confirmationAction === 'new-chat'
                        ? 'Buat chat baru?'
                        : 'Ganti data pengguna?'}
                    </h4>
                    <p
                      id="new-chat-confirm-message"
                      className="mt-1 text-xs leading-relaxed text-[#334766]"
                    >
                      {confirmationAction === 'new-chat'
                        ? 'Riwayat percakapan saat ini tidak dapat dilihat lagi setelah chat baru dibuat.'
                        : 'Data pengguna dan riwayat percakapan saat ini akan dihapus dari perangkat ini.'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmationAction(null)}
                    disabled={isCreatingNewChat}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#334766] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={
                      confirmationAction === 'new-chat'
                        ? confirmNewChat
                        : () => {
                            resetVisitorData();
                            setConfirmationAction(null);
                          }
                    }
                    disabled={isCreatingNewChat}
                    className="rounded-lg bg-[#087ee7] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#056bc4] disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isCreatingNewChat
                      ? 'Membuat chat...'
                      : confirmationAction === 'new-chat'
                        ? 'Ya, buat chat baru'
                        : 'Ya, ganti data'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {notice && (
            <div className="shrink-0 px-3 pt-3">
              <ChatNoticePanel
                notice={notice}
                onClose={() => setNotice(null)}
              />
            </div>
          )}

          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f4f8fc] p-4">
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
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm ' +
                    (message.role === 'user'
                      ? 'rounded-br-sm bg-[#075da8] text-white shadow-md shadow-[#063f73]/20'
                      : 'rounded-bl-sm border border-[#d4e1ee] bg-white text-[#243b53] shadow-sm shadow-[#102a43]/5')
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
                <div className="rounded-2xl rounded-bl-sm border border-[#d4e1ee] bg-white px-4 py-3 shadow-sm shadow-[#102a43]/5">
                  <div className="flex gap-1.5">
                    {[0, 0.15, 0.3].map((delay, i) => (
                      <div
                        key={i}
                        className="h-2 w-2 animate-bounce rounded-full bg-[#075da8]"
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

          <div className="shrink-0 border-t border-[#d4e1ee] bg-white p-3">
            <form onSubmit={sendMessage}>
              <div className="flex gap-2 items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ketik pesan..."
                  className="flex-1 rounded-xl border border-[#c6d8ea] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#102a43] transition-all placeholder:text-slate-400 focus:border-[#075da8] focus:outline-none focus:ring-2 focus:ring-[#075da8]/20 disabled:opacity-50"
                />

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !input.trim() ||
                    confirmationAction !== null ||
                    isCreatingNewChat ||
                    !sessionId ||
                    !visitor
                  }
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#075da8] text-white shadow-md shadow-[#063f73]/20 transition-all hover:-translate-y-0.5 hover:bg-[#064f90] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:shadow-none"
                  aria-label="Kirim pesan"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            <button
              type="button"
              onClick={requestVisitorDataChange}
              className="mx-auto mt-2 block text-[11px] font-semibold text-[#075da8] hover:text-[#062b55]"
            >
              Ganti data pengguna
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ChatNoticePanel({
  notice,
  onClose,
}: {
  notice: ChatNotice;
  onClose: () => void;
}) {
  return (
    <div
      className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-left text-xs text-red-900"
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{notice.title}</p>
        <p className="mt-0.5 leading-relaxed text-red-800">{notice.message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 rounded p-0.5 text-red-600 hover:bg-red-100 hover:text-red-800"
        aria-label="Tutup pesan kesalahan"
        title="Tutup"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
