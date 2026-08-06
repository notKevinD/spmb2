"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import {
  MessageCircle,
  X,
  Send,
  Plus,
  AlertCircle,
  Minimize2,
  GraduationCap,
} from "lucide-react";

import ReactMarkdown from "react-markdown";

// ============================================
// 1. TIPE DATA
// ============================================
type Message = {
  role: "user" | "assistant";
  content: string;
  sentAt?: string;
  receivedAt?: string;
  pairId?: string;
};

type Visitor = {
  visitor_uuid: string;
  name: string;
  phone: string;
  school: string;
};

type ChatNotice = {
  title: string;
  message: string;
};

type ConfirmationAction = "new-chat" | "change-user";

// ============================================
// 2. UTILITY FUNCTIONS
// ============================================

function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "");
  const regex = /^(?:\+62|62|0)[0-9]{9,13}$/;
  return regex.test(cleaned);
}

function formatWhatsAppLink(phone: string): string {
  let number = phone.replace(/\D/g, "");
  if (number.startsWith("0")) {
    number = "62" + number.slice(1);
  }
  if (number.startsWith("620")) {
    number = "62" + number.slice(3);
  }
  return "https://wa.me/" + number;
}

function escapeCsv(value: unknown): string {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function formatDateTime(value?: string): string {
  if (!value) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "short",
    timeStyle: "medium",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

// ============================================
// 3. RENDER PESAN (MARKDOWN ENGINE)
// ============================================

function AssistantMarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        a: ({ node, href, children, ...props }) => {
          const isPhone = href?.match(/^(?:\+62|62|0)[0-9]{9,13}$/);
          const finalHref = isPhone ? formatWhatsAppLink(href || "") : href;
          return (
            <a
              href={finalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-600 underline font-semibold break-all hover:text-sky-800"
              {...props}
            >
              {children}
            </a>
          );
        },
        ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-1 text-slate-800">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-1 text-slate-800">{children}</ol>,
        strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
        p: ({ children }) => <p className="m-0 leading-relaxed text-slate-800">{children}</p>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

// ============================================
// KOMPONEN MESSAGE LIST (DENGAN AUTO-SCROLL PINTAR)
// ============================================
function MessageList({
  messages,
  isLoading,
}: {
  messages: Message[];
  isLoading: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mekanisme auto-scroll berbasis scrollHeight kontainer utama
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isLoading]);

  return (
    <div
      ref={containerRef}
      className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-[#f4f8fc] p-4 scroll-smooth"
      aria-live="polite"
    >
      {messages.map((message, index) => (
        <div
          key={message.role + "-" + index}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
              message.role === "user"
                ? "rounded-br-sm bg-[#075da8] text-white shadow-md shadow-[#063f73]/20"
                : "rounded-bl-sm border border-[#d4e1ee] bg-white text-[#243b53] shadow-sm shadow-[#102a43]/5"
            }`}
          >
            {message.role === "assistant" ? (
              <AssistantMarkdownRenderer content={message.content} />
            ) : (
              message.content
            )}
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
                  style={{ animationDelay: `${delay}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// 4. ERROR HANDLING
// ============================================

function getErrorMessage(error: unknown): { code: string; message: string } {
  if (error instanceof Error) {
    const errorMap: Record<string, string> = {
      "Nama, nomor telepon, dan asal sekolah wajib diisi.":
        "ERR_MISSING_FIELDS",
      "Nomor telepon tidak valid.": "ERR_INVALID_PHONE",
      "Gagal membuat session di server.": "ERR_SESSION_FAILED",
      "Session gagal dibuat di n8n.": "ERR_N8N_FAILED",
    };
    const code = errorMap[error.message] || "ERR_UNKNOWN";
    let userMessage = error.message;
    const allowedMessages = [
      "Nama, nomor telepon, dan asal sekolah wajib diisi.",
      "Nomor telepon tidak valid.",
      "Nomor harus diawali dengan +62, 08, atau 62",
      "Nomor dengan + harus diikuti 62 (contoh: +628123456789)",
      "Nomor harus diawali dengan 62 setelah normalisasi",
      "Format nomor tidak valid",
    ];
    if (!allowedMessages.includes(error.message)) {
      userMessage = "Terjadi kesalahan. Silakan coba lagi nanti.";
    }
    return { code, message: userMessage };
  }
  return { code: "ERR_UNKNOWN", message: "Terjadi kesalahan tak terduga." };
}

// ============================================
// 5. KOMPONEN ANAK
// ============================================

function NoticeBanner({
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
        aria-label="Tutup pesan"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function ChatHeader({
  visitor,
  isLoading,
  isCreatingNewChat,
  onNewChat,
  onMinimize,
}: {
  visitor: Visitor | null;
  messages: Message[];
  isLoading: boolean;
  isCreatingNewChat: boolean;
  onNewChat: () => void;
  onMinimize: () => void;
}) {
  return (
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
              Layanan Informasi PMB UBL
            </h3>
          </div>
          <p className="truncate text-xs font-medium text-white/80">
            {visitor
              ? `${visitor.name} - ${visitor.school}`
              : "Universitas Bandar Lampung"}
          </p>
        </div>
      </div>

      <div className="relative flex items-center gap-1">
        {visitor && (
          <button
            onClick={onNewChat}
            disabled={isLoading || isCreatingNewChat}
            className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white disabled:opacity-30"
            title="Chat baru"
            type="button"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={onMinimize}
          className="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          title="Minimize"
          type="button"
        >
          <Minimize2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function VisitorForm({
  onSubmit,
  isLoading,
  notice,
  onNoticeClose,
}: {
  onSubmit: (data: { name: string; phone: string; school: string }) => void;
  isLoading: boolean;
  notice: ChatNotice | null;
  onNoticeClose: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    if (value && !validatePhoneNumber(value)) {
      setPhoneError("Format nomor tidak valid. Gunakan 08xxx atau +628xxx");
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedPhone = phone.trim();
    const trimmedSchool = school.trim();

    if (!trimmedName || !trimmedPhone || !trimmedSchool) return;

    if (!validatePhoneNumber(trimmedPhone)) {
      setPhoneError("Nomor telepon tidak valid.");
      return;
    }

    onSubmit({ name: trimmedName, phone: trimmedPhone, school: trimmedSchool });
  };

  return (
    <form
      onSubmit={handleSubmit}
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

      {notice && <NoticeBanner notice={notice} onClose={onNoticeClose} />}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama lengkap"
        className="rounded-xl border border-sky-100 bg-white px-4 py-2.5 text-sm text-[#11192d] shadow-sm shadow-sky-900/5 transition-all placeholder:text-slate-400 focus:border-[#087ee7] focus:outline-none focus:ring-2 focus:ring-[#087ee7]/20"
        required
      />
      <div>
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          placeholder="Nomor telepon (contoh: 08123456789 atau +628123456789)"
          className={`w-full rounded-xl border ${phoneError ? "border-red-300" : "border-sky-100"} bg-white px-4 py-2.5 text-sm text-[#11192d] shadow-sm shadow-sky-900/5 transition-all placeholder:text-slate-400 focus:border-[#087ee7] focus:outline-none focus:ring-2 focus:ring-[#087ee7]/20`}
          required
        />
        {phoneError && (
          <p className="mt-1 text-xs text-red-600">{phoneError}</p>
        )}
      </div>
      <input
        type="text"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
        placeholder="Asal sekolah"
        className="rounded-xl border border-sky-100 bg-white px-4 py-2.5 text-sm text-[#11192d] shadow-sm shadow-sky-900/5 transition-all placeholder:text-slate-400 focus:border-[#087ee7] focus:outline-none focus:ring-2 focus:ring-[#087ee7]/20"
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 rounded-xl bg-gradient-to-r from-[#1689f8] to-[#02afd4] py-2.5 text-sm font-extrabold text-white shadow-lg shadow-sky-500/20 transition-transform hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none"
      >
        {isLoading ? "Memulai chat..." : "Mulai Chat"}
      </button>
    </form>
  );
}

function MessageInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (text: string) => void;
  disabled: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) inputRef.current?.focus();
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || disabled) return;
    onSubmit(value.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ketik pesan..."
        className="flex-1 rounded-xl border border-[#c6d8ea] bg-[#f8fafc] px-4 py-2.5 text-sm text-[#102a43] transition-all placeholder:text-slate-400 focus:border-[#075da8] focus:outline-none focus:ring-2 focus:ring-[#075da8]/20 disabled:opacity-50"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#075da8] text-white shadow-md shadow-[#063f73]/20 transition-all hover:-translate-y-0.5 hover:bg-[#064f90] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:shadow-none"
        aria-label="Kirim pesan"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}

function ConfirmationDialog({
  action,
  onConfirm,
  onCancel,
  isProcessing,
}: {
  action: ConfirmationAction | null;
  onConfirm: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}) {
  if (!action) return null;
  const title =
    action === "new-chat" ? "Buat chat baru?" : "Ganti data pengguna?";
  const message =
    action === "new-chat"
      ? "Riwayat percakapan saat ini tidak dapat dilihat lagi setelah chat baru dibuat."
      : "Data pengguna dan riwayat percakapan saat ini akan dihapus dari perangkat ini.";

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#11192d]/45 p-5">
      <div
        className="w-full max-w-sm rounded-lg bg-white p-4 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
            <AlertCircle className="h-5 w-5" />
          </span>
          <div>
            <h4 id="confirm-title" className="text-sm font-bold text-[#11192d]">
              {title}
            </h4>
            <p
              id="confirm-message"
              className="mt-1 text-xs leading-relaxed text-[#334766]"
            >
              {message}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#334766] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="rounded-lg bg-[#087ee7] px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#056bc4] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isProcessing
              ? "Memproses..."
              : action === "new-chat"
                ? "Ya, buat chat baru"
                : "Ya, ganti data"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// 6. KOMPONEN UTAMA (CHATBOT)
// ============================================

const VISITOR_STORAGE_KEY = "pmb_chat_visitor";
const getChatHistoryKey = (sessionId: string) =>
  `pmb_chat_history_${sessionId}`;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  const [sessionId, setSessionId] = useState<string | null>(null);

  const [visitor, setVisitor] = useState<Visitor | null>(() => {
    if (typeof window === "undefined") return null;
    const savedVisitor = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (savedVisitor) {
      try {
        return JSON.parse(savedVisitor);
      } catch {
        localStorage.removeItem(VISITOR_STORAGE_KEY);
      }
    }
    return null;
  });

  const [confirmationAction, setConfirmationAction] =
    useState<ConfirmationAction | null>(null);
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false);
  const [notice, setNotice] = useState<ChatNotice | null>(null);

  const sessionInitializedRef = useRef(false);
  const hasLoadedHistoryRef = useRef(false);
  const prevMessagesRef = useRef<Message[]>([]);

  // ========== INISIALISASI SESSION ==========
  useEffect(() => {
    if (sessionInitializedRef.current) return;
    sessionInitializedRef.current = true;

    async function initSession() {
      try {
        const res = await fetch("/api/chat/session", { method: "GET" });
        const data = await res.json();

        if (data.success && data.sessionId) {
          setSessionId(data.sessionId);
        }
      } catch (error) {
        console.error("Gagal membaca session:", error);
        sessionInitializedRef.current = false;
      }
    }

    initSession();
  }, []);

  // ========== LOAD HISTORY ==========
  useEffect(() => {
    if (!sessionId || hasLoadedHistoryRef.current) return;
    const saved = localStorage.getItem(getChatHistoryKey(sessionId));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          queueMicrotask(() => {
            setMessages(parsed);
            prevMessagesRef.current = parsed;
          });
        }
      } catch {
        localStorage.removeItem(getChatHistoryKey(sessionId));
      }
    }
    hasLoadedHistoryRef.current = true;
  }, [sessionId]);

  // ========== SAVE HISTORY (OPTIMIZED) ==========
  useEffect(() => {
    if (!sessionId || !hasLoadedHistoryRef.current) return;
    const current = JSON.stringify(messages);
    const prev = JSON.stringify(prevMessagesRef.current);
    if (current !== prev) {
      localStorage.setItem(getChatHistoryKey(sessionId), current);
      prevMessagesRef.current = messages;
    }
  }, [messages, sessionId]);

  // ========== FUNGSI UTAMA ==========

  const startChatWithVisitor = useCallback(
    async (data: { name: string; phone: string; school: string }) => {
      const { name, phone, school } = data;
      setNotice(null);
      setIsStartingChat(true);

      try {
        const res = await fetch("/api/chat/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone, school }),
        });
        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.error || "Gagal memulai chat.");
        }

        setSessionId(result.sessionId);
        setVisitor(result.visitor);
        hasLoadedHistoryRef.current = true;
        localStorage.setItem(
          VISITOR_STORAGE_KEY,
          JSON.stringify(result.visitor),
        );

        const opening: Message[] = [
          {
            role: "assistant",
            content: `Halo ${result.visitor.name}! Ada yang bisa saya bantu seputar PMB UBL?`,
            receivedAt: new Date().toISOString(),
          },
        ];
        setMessages(opening);
        prevMessagesRef.current = opening;
        localStorage.setItem(
          getChatHistoryKey(result.sessionId),
          JSON.stringify(opening),
        );
      } catch (error) {
        const { message } = getErrorMessage(error);
        setNotice({
          title: "Chat belum dapat dimulai",
          message,
        });
      } finally {
        setIsStartingChat(false);
      }
    },
    [],
  );

  const handleSendMessage = useCallback(
    async (textToSend: string) => {
      if (isLoading || !sessionId || !visitor) return;

      const pairId = crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const sentAt = new Date().toISOString();

      setInput("");
      setNotice(null);

      const userMsg: Message = {
        role: "user",
        content: textToSend,
        sentAt,
        pairId,
      };
      setMessages((prev) => [...prev, userMsg]);

      setIsLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: textToSend,
            sessionId,
            visitor,
            sentAt,
          }),
        });
        const data = await res.json();
        const receivedAt = new Date().toISOString();

        if (!res.ok || !data.success) {
          throw new Error(data.error || "Pesan tidak dapat dikirim.");
        }

        const assistantMsg: Message = {
          role: "assistant",
          content: data.response || "Maaf, tidak ada respons.",
          sentAt,
          receivedAt,
          pairId,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } catch (error) {
        const { message } = getErrorMessage(error);
        setNotice({
          title: "Pesan belum terkirim",
          message,
        });
        const errorMsg: Message = {
          role: "assistant",
          content: "Maaf, terjadi kesalahan. Silakan coba lagi.",
          sentAt,
          receivedAt: new Date().toISOString(),
          pairId,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, sessionId, visitor],
  );

  const startNewChat = useCallback(() => {
    if (!visitor || isLoading || isCreatingNewChat) return;
    setConfirmationAction("new-chat");
  }, [visitor, isLoading, isCreatingNewChat]);

  const confirmNewChat = useCallback(async () => {
    if (!visitor) return;
    setNotice(null);
    setIsCreatingNewChat(true);

    try {
      const res = await fetch("/api/chat/new-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitor }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal membuat session baru.");
      }

      if (sessionId) {
        localStorage.removeItem(getChatHistoryKey(sessionId));
      }
      setSessionId(data.sessionId);
      hasLoadedHistoryRef.current = true;

      const newMsgs: Message[] = [
        {
          role: "assistant",
          content: `Percakapan baru dimulai. Ada yang bisa saya bantu lagi, ${visitor.name}?`,
          receivedAt: new Date().toISOString(),
        },
      ];
      setMessages(newMsgs);
      prevMessagesRef.current = newMsgs;
      localStorage.setItem(
        getChatHistoryKey(data.sessionId),
        JSON.stringify(newMsgs),
      );
    } catch (error) {
      const { message } = getErrorMessage(error);
      setNotice({
        title: "Chat baru belum dibuat",
        message,
      });
    } finally {
      setIsCreatingNewChat(false);
      setConfirmationAction(null);
    }
  }, [visitor, sessionId]);

  const resetVisitorData = useCallback(() => {
    if (sessionId) {
      localStorage.removeItem(getChatHistoryKey(sessionId));
    }

    if (typeof window !== "undefined") {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("pmb_chat_history_")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    }

    localStorage.removeItem(VISITOR_STORAGE_KEY);

    setVisitor(null);
    setSessionId(null);
    setMessages([]);
    hasLoadedHistoryRef.current = false;
    setConfirmationAction(null);
  }, [sessionId]);

  const requestVisitorDataChange = useCallback(() => {
    if (isCreatingNewChat) return;
    setConfirmationAction("change-user");
  }, [isCreatingNewChat]);

  // ========== RENDER ==========

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
              Tanya AI
            </p>
          </div>
        )}
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className={`relative flex items-center justify-center rounded-full bg-[#075da8] text-white shadow-xl shadow-[#063f73]/30 ring-4 ring-white/95 transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 hover:bg-[#064f90] ${
            isMinimized ? "h-14 w-14" : "h-16 w-16"
          }`}
          aria-label={isMinimized ? "Lanjutkan chat" : "Buka chat"}
          type="button"
        >
          <span className="absolute -left-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full border-2 border-white bg-[#f5a623] px-1.5 text-[10px] font-extrabold text-[#083b6f] shadow-lg shadow-orange-500/25">
            UBL
          </span>
          <MessageCircle className="h-7 w-7" />
          {isMinimized && (
            <span className="absolute -right-2 -top-2 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#ff7400] px-1 text-[10px] font-bold text-white shadow-md shadow-orange-500/30">
              {messages.length > 99 ? "99+" : messages.length}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed z-50 flex flex-col overflow-hidden bg-white shadow-2xl shadow-[#102a43]/25 inset-0 h-[100dvh] w-screen rounded-none border-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(620px,calc(100vh-120px))] sm:w-[min(420px,calc(100vw-48px))] sm:rounded-2xl sm:border sm:border-[#c6d8ea]">
      <ChatHeader
        visitor={visitor}
        messages={messages}
        isLoading={isLoading}
        isCreatingNewChat={isCreatingNewChat}
        onNewChat={startNewChat}
        onMinimize={() => setIsMinimized(true)}
      />

      {!visitor ? (
        <VisitorForm
          onSubmit={startChatWithVisitor}
          isLoading={isStartingChat}
          notice={notice}
          onNoticeClose={() => setNotice(null)}
        />
      ) : (
        <>
          {confirmationAction && (
            <ConfirmationDialog
              action={confirmationAction}
              onConfirm={
                confirmationAction === "new-chat"
                  ? confirmNewChat
                  : resetVisitorData
              }
              onCancel={() => setConfirmationAction(null)}
              isProcessing={isCreatingNewChat}
            />
          )}

          {notice && (
            <div className="shrink-0 px-3 pt-3">
              <NoticeBanner notice={notice} onClose={() => setNotice(null)} />
            </div>
          )}

          <MessageList messages={messages} isLoading={isLoading} />

          <div className="shrink-0 border-t border-[#d4e1ee] bg-white p-3">
            <MessageInput
              value={input}
              onChange={setInput}
              onSubmit={handleSendMessage}
              disabled={
                isLoading ||
                confirmationAction !== null ||
                isCreatingNewChat ||
                !sessionId ||
                !visitor
              }
            />
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