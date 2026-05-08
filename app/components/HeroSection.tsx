import { Calendar, Award, Users, BookOpen } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="inline-block bg-yellow-500 text-blue-900 px-4 py-1 rounded-full text-sm font-semibold mb-4">
          Pendaftaran Madani 1 Dibuka
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Penerimaan Mahasiswa Baru
        </h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Bergabunglah dengan komunitas akademik yang unggul dan inovatif di Universitas Bandar Lampung. 
          Wujudkan impian karir Anda melalui pendidikan berkualitas dengan fasilitas terbaik aja.
        </p>
        
        <div className="flex justify-center gap-8 mb-12">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            <span className="font-semibold">10+</span>
            <span>Program Studi</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6" />
            <span className="font-semibold">5K+</span>
            <span>Mahasiswa</span>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
          <h3 className="text-2xl font-bold mb-2">PMB 2026/2027</h3>
          <p className="text-yellow-400 font-semibold mb-2">Pendaftaran Telah Dibuka</p>
          <div className="flex justify-center gap-4 text-sm">
            <div>
              <p className="font-semibold">Madani 1</p>
              <p>April 2026 - Mei 2026</p>
            </div>
            <div className="border-l border-white/30 pl-4">
              <p className="font-semibold">Terakreditasi</p>
              <p>Unggul</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}