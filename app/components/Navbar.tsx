'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#program', label: 'Program' },
  { href: '#kelas-profesional', label: 'Kelas Profesional' },
  { href: '#beasiswa', label: 'Beasiswa' },
  { href: '#kontak', label: 'Kontak' },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 transition-shadow duration-300 ${
        isScrolled ? 'shadow-sm backdrop-blur-md' : ''
      }`}
    >
      <div className="mx-auto flex h-[78px] max-w-[1232px] items-center justify-between px-6">
        <Link href="#beranda" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#2687ff] to-[#05b7d8] shadow-lg shadow-sky-500/20">
            <GraduationCap className="h-5 w-5 text-white" />
          </span>
          <span className="leading-tight">
            <span className="block text-xl font-extrabold tracking-normal text-[#0875df]">UBL - Admissions</span>
            <span className="block text-xs font-medium text-slate-500">Student Portal</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] font-semibold text-slate-700 transition-colors hover:text-[#0786e8]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="#kontak"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-[#0786e8] hover:text-[#0786e8]"
          >
            Masuk
          </Link>
          <Link
            href="#kontak"
            className="rounded-lg bg-gradient-to-r from-[#1689f8] to-[#02afd4] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 transition-transform hover:-translate-y-0.5"
          >
            Daftar Sekarang
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="rounded-lg border border-slate-200 p-2 text-slate-700 md:hidden"
          aria-label="Buka menu"
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        className={`fixed inset-x-0 top-[78px] z-40 border-t border-slate-200 bg-white px-6 py-5 shadow-xl transition-all md:hidden ${
          isMenuOpen ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
        }`}
      >
        <div className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-base font-semibold text-slate-700 hover:bg-sky-50 hover:text-[#0786e8]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#kontak"
            onClick={() => setIsMenuOpen(false)}
            className="mt-3 rounded-lg bg-gradient-to-r from-[#1689f8] to-[#02afd4] px-5 py-3 text-center text-sm font-bold text-white"
          >
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </nav>
  );
}
