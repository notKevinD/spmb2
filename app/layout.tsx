import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Chatbot from './components/Chatbot';
import Navbar from './components/Navbar';
import { GraduationCap, MapPin, Phone, Mail, Camera, Video } from 'lucide-react';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PMB 2026 — Universitas Bandar Lampung',
  description: 'Penerimaan Mahasiswa Baru Universitas Bandar Lampung 2026/2027. Daftar sekarang dan mulai perjalanan akademik terbaik Anda.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={geist.className}>
        <Navbar />
        {children}

        {/* Footer */}
        <footer className="bg-[#060f1e] text-white">
          {/* Top footer */}
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Brand */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#e8b84b] to-[#d4a030] flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-[#0a1628]" />
                  </div>
                  <div>
                    <p className="font-black text-white text-base">UBL PMB</p>
                    <p className="text-[#e8b84b] text-xs font-semibold tracking-widest">2026/2027</p>
                  </div>
                </div>
                <p className="text-white/40 text-sm leading-relaxed">
                  Universitas Bandar Lampung — Membangun Generasi Unggul dan Inovatif untuk Indonesia.
                </p>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Kontak</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 text-white/40 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-white/20" />
                    <span>Jl. ZA. Pagar Alam No.26, Bandar Lampung</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40 text-sm">
                    <Phone className="w-4 h-4 shrink-0 text-white/20" />
                    <span>(0721) 123456</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/40 text-sm">
                    <Mail className="w-4 h-4 shrink-0 text-white/20" />
                    <span>pmb@ubl.ac.id</span>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div>
                <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Link Penting</h4>
                <ul className="space-y-3">
                  {['Jadwal Pendaftaran', 'Biaya Kuliah', 'Fasilitas Kampus', 'FAQ PMB'].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-white/40 hover:text-white text-sm transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Social */}
              <div>
                <h4 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">Ikuti Kami</h4>
                <div className="space-y-3">
                  {[
                    { icon: Camera, label: '@ubl_official', href: '#' },
                    { icon: Video, label: 'UBL Channel', href: '#' },
                  ].map(({ icon: Icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      className="flex items-center gap-3 text-white/40 hover:text-white text-sm transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5 px-6 py-5">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-white/30 text-xs">© 2026 PMB Universitas Bandar Lampung. All rights reserved.</p>
              <p className="text-white/20 text-xs">Terakreditasi oleh BAN-PT</p>
            </div>
          </div>
        </footer>

        <Chatbot />
      </body>
    </html>
  );
}
