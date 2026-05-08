import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';
import Chatbot from './components/Chatbot';
const inter = Inter({ subsets: ['latin'] });
import Navbar from './components/Navbar';
export const metadata: Metadata = {
  title: 'PMB - Universitas Bandar Lampung',
  description: 'Penerimaan Mahasiswa Baru Universitas Bandar Lampung',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        {/* Navbar */}
        <Navbar />

        {children}

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">UBL PMB</h3>
                <p className="text-gray-400">
                  Universitas Bandar Lampung - Membangun Generasi Unggul dan Inovatif
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Kontak</h4>
                <p className="text-gray-400">Jl. ZA. Pagar Alam No.26</p>
                <p className="text-gray-400">Bandar Lampung, Lampung</p>
                <p className="text-gray-400">Telp: (0721) 123456</p>
                <p className="text-gray-400">Email: pmb@ubl.ac.id</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Link Penting</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="#" className="hover:text-white">Jadwal Pendaftaran</Link></li>
                  <li><Link href="#" className="hover:text-white">Biaya Kuliah</Link></li>
                  <li><Link href="#" className="hover:text-white">Fasilitas</Link></li>
                  <li><Link href="#" className="hover:text-white">FAQ</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Ikuti Kami</h4>
                <p className="text-gray-400">Instagram: @ubl_official</p>
                <p className="text-gray-400">Facebook: UBL Official</p>
                <p className="text-gray-400">YouTube: UBL Channel</p>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2026 PMB UBL. All rights reserved.</p>
            </div>
          </div>
        </footer>
        <Chatbot />
      </body>
    </html>
  );
}