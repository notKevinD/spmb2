'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, GraduationCap } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'unset';
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  const navLinks = [
    { href: '/', label: 'Beranda' },
    { href: '/program-studi', label: 'Program Studi' },
    { href: '/beasiswa', label: 'Beasiswa' },
    { href: '/kontak', label: 'Kontak' },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#0a1628]/95 backdrop-blur-md shadow-2xl shadow-black/20 border-b border-white/5'
          : 'bg-[#0a1628]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e8b84b] to-[#d4a030] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5 h-5 text-[#0a1628]" />
            </div>
            <div className="leading-tight">
              <span className="block text-white font-bold text-base tracking-wide">UBL</span>
              <span className="block text-[#e8b84b] text-xs font-semibold tracking-widest uppercase">PMB 2026</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/80 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/10"
              >
                {link.label}
              </Link>
            ))}
            <button className="ml-4 bg-[#e8b84b] text-[#0a1628] px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#f0c45a] transition-all duration-200 shadow-lg hover:shadow-[#e8b84b]/30 hover:scale-105">
              Daftar Sekarang
            </button>
          </div>

          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-[#0a1628] z-40 transition-all duration-300 md:hidden flex flex-col ${
            isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          style={{ top: '73px' }}
        >
          <div className="flex flex-col p-6 gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="text-white/80 hover:text-white text-lg font-medium py-4 px-4 rounded-xl hover:bg-white/10 transition-all duration-200 border-b border-white/5"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
            <button className="mt-6 bg-[#e8b84b] text-[#0a1628] px-5 py-4 rounded-xl font-bold text-lg hover:bg-[#f0c45a] transition-all duration-200">
              Daftar Sekarang
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
