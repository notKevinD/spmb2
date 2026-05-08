'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Detect scroll untuk mengubah background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-blue-600 shadow-lg' : 'bg-blue-500'
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            className="text-2xl font-bold text-white hover:text-yellow-300 transition"
          >
            UBL <span className="text-yellow-400">PMB</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              href="/"
              className="text-white hover:text-yellow-300 transition font-medium"
            >
              Beranda
            </Link>
            <Link
              href="/program-studi"
              className="text-white hover:text-yellow-300 transition font-medium"
            >
              Program Studi
            </Link>
            <Link
              href="/beasiswa"
              className="text-white hover:text-yellow-300 transition font-medium"
            >
              Beasiswa
            </Link>
            <Link
              href="/kontak"
              className="text-white hover:text-yellow-300 transition font-medium"
            >
              Kontak
            </Link>
            <button className="bg-yellow-500 text-blue-900 px-5 py-2 rounded-lg hover:bg-yellow-400 transition font-semibold shadow-md">
              Daftar Sekarang
            </button>
          </div>

          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2 rounded-lg hover:bg-blue-600 transition relative z-20"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-blue-900 z-10 transition-transform duration-300 ease-in-out md:hidden ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ top: '72px' }}
        >
          <div className="flex flex-col p-6 space-y-4">
            <Link
              href="/"
              onClick={closeMenu}
              className="text-white text-lg hover:text-yellow-300 transition py-3 px-4 rounded-lg hover:bg-blue-800"
            >
              Beranda
            </Link>
            <Link
              href="/program-studi"
              onClick={closeMenu}
              className="text-white text-lg hover:text-yellow-300 transition py-3 px-4 rounded-lg hover:bg-blue-800"
            >
              Program Studi
            </Link>
            <Link
              href="/beasiswa"
              onClick={closeMenu}
              className="text-white text-lg hover:text-yellow-300 transition py-3 px-4 rounded-lg hover:bg-blue-800"
            >
              Beasiswa
            </Link>
            <Link
              href="/kontak"
              onClick={closeMenu}
              className="text-white text-lg hover:text-yellow-300 transition py-3 px-4 rounded-lg hover:bg-blue-800"
            >
              Kontak
            </Link>
            <button className="bg-yellow-500 text-blue-900 px-5 py-3 rounded-lg hover:bg-yellow-400 transition font-semibold text-lg mt-4">
              Daftar Sekarang
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}