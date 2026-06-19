import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, GraduationCap, Mail, MapPin, Phone } from 'lucide-react';
import './globals.css';
import Chatbot from './components/Chatbot';
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: 'PMB 2026 - Universitas Bandar Lampung',
  description:
    'Penerimaan Mahasiswa Baru Universitas Bandar Lampung 2026/2027. Daftar sekarang dan mulai perjalanan akademik terbaik Anda.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        {children}

        <footer id="kontak" className="bg-[#0b1529] text-white">
          <div className="mx-auto max-w-[1232px] px-6 py-16">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#1689f8] to-[#02afd4]">
                    <GraduationCap className="h-5 w-5 text-white" />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-lg font-extrabold">UBL Admissions</span>
                    <span className="block text-xs text-slate-400">Student Portal</span>
                  </span>
                </div>
                <p className="max-w-[290px] text-sm leading-7 text-slate-300">
                  Universitas Bandar Lampung - Membangun Karir Unggul melalui Pendidikan Berkualitas dan Berkarakter.
                </p>
              </div>

              <div>
                <h4 className="mb-6 text-lg font-extrabold">Link Cepat</h4>
                <div className="space-y-4">
                  {[
                    ['Login Student', '#kontak'],
                    ['Pendaftaran', '#beranda'],
                    ['Program Studi', '#program'],
                    ['Kelas Profesional', '#kelas-profesional'],
                    ['Beasiswa', '#beasiswa'],
                  ].map(([label, href]) => (
                    <Link key={label} href={href} className="flex items-center gap-3 text-sm text-slate-300 hover:text-white">
                      <ArrowRight className="h-3.5 w-3.5" />
                      {label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-6 text-lg font-extrabold">Kontak Kami</h4>
                <div className="space-y-5 text-sm leading-6 text-slate-300">
                  <div className="flex gap-3">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>marketing@ubl.ac.id</span>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>+62 823 1111 2437 (Nova - Kelas Madani)</span>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>+62 822 7862 3337 (Inne - Kelas Profesional)</span>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>+62 821 2476 5557 (Widya - Kelas Profesional)</span>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                    <span>Bandar Lampung</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-6 text-lg font-extrabold">Info Penting</h4>
                <div className="space-y-3">
                  {[
                    ['Madani 2', 'April 2026 - Juni 2026'],
                    ['Kelas Profesional', 'Untuk yang sudah bekerja'],
                    ['Beasiswa Tersedia', 'Berprestasi & Tidak Mampu'],
                  ].map(([title, desc]) => (
                    <div key={title} className="rounded-lg border border-slate-700 bg-white/[0.03] p-4">
                      <p className="text-sm font-extrabold">{title}</p>
                      <p className="mt-2 text-xs text-slate-400">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-14 border-t border-white/10 pt-8 text-center text-sm text-slate-400">
              <p>(c) 2024 Universitas Bandar Lampung. All rights reserved. | Terakreditasi Unggul</p>
            </div>
          </div>
        </footer>

        <Chatbot />
      </body>
    </html>
  );
}
