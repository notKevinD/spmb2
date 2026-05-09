import { BookOpen, Users, Award, ArrowRight, CheckCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-[#0a1628] min-h-[92vh] flex items-center overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#e8b84b]/8 blur-3xl" />
        <div className="absolute top-1/2 -left-20 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 rounded-full bg-[#e8b84b]/5 blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#e8b84b]/15 border border-[#e8b84b]/30 text-[#e8b84b] px-4 py-2 rounded-full text-sm font-semibold mb-8">
              <span className="w-2 h-2 bg-[#e8b84b] rounded-full animate-pulse" />
              Pendaftaran Madani 1 — Sedang Berlangsung
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] mb-6 tracking-tight">
              Mulai Perjalanan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8b84b] to-[#f0c45a]">
                Akademik
              </span>{' '}
              Terbaik Anda
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
              Bergabunglah dengan komunitas akademik yang unggul di Universitas Bandar Lampung.
              Raih masa depan gemilang melalui pendidikan berkualitas dan fasilitas modern.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="group flex items-center justify-center gap-2 bg-[#e8b84b] text-[#0a1628] px-7 py-4 rounded-xl font-bold text-base hover:bg-[#f0c45a] transition-all duration-200 shadow-xl shadow-[#e8b84b]/25 hover:shadow-[#e8b84b]/40 hover:scale-[1.02]">
                Daftar Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center gap-2 border border-white/20 text-white px-7 py-4 rounded-xl font-semibold text-base hover:bg-white/10 hover:border-white/40 transition-all duration-200">
                Lihat Program Studi
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6">
              {[
                'Akreditasi Unggul',
                'Beasiswa Tersedia',
                'Kelas Profesional',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-white/50 text-sm">
                  <CheckCircle className="w-4 h-4 text-[#e8b84b]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content — Stats Cards */}
          <div className="space-y-4 lg:pl-8">
            {/* PMB Info Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-1">Tahun Akademik</p>
                  <h3 className="text-white font-black text-2xl">PMB 2026/2027</h3>
                </div>
                <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-3 py-1.5 rounded-full">
                  BUKA
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div>
                  <p className="text-[#e8b84b] font-bold text-sm">Gelombang Madani 1</p>
                  <p className="text-white/50 text-xs mt-1">April — Mei 2026</p>
                </div>
                <div>
                  <p className="text-[#e8b84b] font-bold text-sm">Status</p>
                  <p className="text-white/50 text-xs mt-1">Terakreditasi Unggul</p>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: BookOpen, value: '10+', label: 'Program Studi', color: 'from-blue-500 to-blue-600' },
                { icon: Users, value: '5K+', label: 'Mahasiswa Aktif', color: 'from-[#e8b84b] to-[#d4a030]' },
                { icon: Award, value: 'A', label: 'Akreditasi BAN-PT', color: 'from-green-500 to-green-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center hover:bg-white/8 transition-colors">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-white font-black text-xl">{stat.value}</p>
                  <p className="text-white/40 text-xs mt-0.5 leading-tight">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Fakultas pills */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-3">Fakultas Tersedia</p>
              <div className="flex flex-wrap gap-2">
                {['Ekonomi & Bisnis', 'Ilmu Komputer', 'Teknik', 'Hukum', 'FISIP', 'FKIP'].map((f) => (
                  <span key={f} className="bg-white/8 border border-white/10 text-white/70 text-xs px-3 py-1.5 rounded-lg font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
