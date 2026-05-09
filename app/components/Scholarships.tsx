import { ArrowRight, Sparkles } from 'lucide-react';

const scholarships = [
  {
    name: 'Reka Inovasi',
    desc: 'Untuk inovator dan kreator muda berbakat',
    icon: '💡',
    color: 'from-violet-500 to-violet-600',
  },
  {
    name: 'Prestasi Akademik',
    desc: 'Untuk mahasiswa berprestasi tinggi',
    icon: '🎓',
    color: 'from-blue-500 to-blue-600',
  },
  {
    name: 'Prestasi Non-Akademik',
    desc: 'Untuk juara kompetisi olahraga & seni',
    icon: '🏆',
    color: 'from-[#e8b84b] to-[#d4a030]',
  },
  {
    name: 'Loyalty',
    desc: 'Untuk keluarga civitas akademika UBL',
    icon: '❤️',
    color: 'from-red-500 to-red-600',
  },
  {
    name: 'Beasiswa Sosial',
    desc: 'Untuk calon mahasiswa kurang mampu',
    icon: '🤝',
    color: 'from-teal-500 to-teal-600',
  },
];

const requirements = [
  'Lulusan SMA/SMK/MA atau sederajat',
  'Nilai rapor rata-rata minimal 7.0',
  'Tidak sedang menerima beasiswa lain',
  'Mengikuti proses seleksi yang ditentukan',
];

export default function Scholarships() {
  return (
    <section className="py-24 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#e8b84b] font-bold text-sm uppercase tracking-widest mb-3">Dukungan Finansial</p>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0a1628] leading-tight mb-4">
            Program Beasiswa
          </h2>
          <p className="text-gray-500 text-lg">
            Kami berkomitmen mendukung mahasiswa berprestasi dan berpotensi tinggi dari berbagai latar belakang.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Scholarship Cards */}
          <div className="space-y-4">
            {scholarships.map((s) => (
              <div
                key={s.name}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex items-stretch"
              >
                <div className={`bg-gradient-to-b ${s.color} w-1.5 flex-shrink-0 rounded-l-2xl`} />
                <div className="flex items-center gap-4 p-5 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0">
                    {s.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#0a1628] font-black text-base">{s.name}</p>
                    <p className="text-gray-400 text-sm mt-0.5">{s.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-[#0a1628] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </div>
            ))}

            <button className="w-full mt-2 flex items-center justify-center gap-2 bg-[#0a1628] text-white py-4 rounded-2xl font-bold hover:bg-[#0f2040] transition-all duration-200 shadow-lg hover:scale-[1.01]">
              <Sparkles className="w-4 h-4 text-[#e8b84b]" />
              Lihat Semua Beasiswa
            </button>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              <h3 className="text-[#0a1628] font-black text-2xl mb-2">Persyaratan Umum</h3>
              <p className="text-gray-400 text-sm mb-6">
                Berikut adalah persyaratan dasar untuk mendaftar program beasiswa UBL.
              </p>
              <div className="space-y-3">
                {requirements.map((req) => (
                  <div key={req} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-600 text-sm leading-relaxed">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-br from-[#0a1628] to-[#0f2040] rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#e8b84b]/10 blur-2xl pointer-events-none" />
              <p className="text-[#e8b84b] font-bold text-xs uppercase tracking-widest mb-2 relative">Informasi Beasiswa</p>
              <h4 className="text-white font-black text-xl mb-3 relative">Daftar Beasiswa Sekarang</h4>
              <p className="text-white/50 text-sm leading-relaxed mb-6 relative">
                Dapatkan informasi lengkap tentang syarat, ketentuan, dan cara pendaftaran beasiswa melalui portal resmi UBL.
              </p>
              <button className="relative flex items-center gap-2 bg-[#e8b84b] text-[#0a1628] px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#f0c45a] transition-all duration-200">
                Portal Beasiswa UBL
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
