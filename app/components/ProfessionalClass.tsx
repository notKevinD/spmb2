import { Calendar, Laptop, FileText, Clock, Users, Briefcase } from 'lucide-react';

const features = [
  { icon: Calendar, label: 'Jadwal Weekend', desc: 'Sabtu & Minggu' },
  { icon: Laptop, label: 'Blended Learning', desc: 'Online & Offline' },
  { icon: Clock, label: 'Waktu Fleksibel', desc: 'Sesi malam tersedia' },
  { icon: Users, label: 'Kelas Kecil', desc: 'Maksimal 30 mahasiswa' },
  { icon: FileText, label: 'Studi Kasus', desc: 'Berbasis industri nyata' },
  { icon: Briefcase, label: 'Jaringan Profesional', desc: 'Alumni & industri' },
];

const benefits = [
  'Jadwal fleksibel khusus untuk pekerja',
  'Kurikulum berbasis kebutuhan industri',
  'Dosen praktisi profesional aktif',
  'Networking sesama profesional',
  'Aplikasi langsung di dunia kerja',
  'Ijazah setara program reguler',
];

export default function ProfessionalClass() {
  return (
    <section className="py-24 bg-[#0a1628] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#e8b84b]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#e8b84b] font-bold text-sm uppercase tracking-widest mb-3">Khusus Profesional</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-4">
            Kelas Profesional
          </h2>
          <p className="text-white/50 text-lg">
            Program dirancang khusus bagi profesional yang ingin meningkatkan kualifikasi pendidikan tanpa mengganggu karir.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left — Benefits */}
          <div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-6">
              <h3 className="text-white font-black text-2xl mb-2">Untuk Profesional yang Bekerja</h3>
              <p className="text-white/50 mb-6 text-sm leading-relaxed">
                Program ini menekankan penerapan praktis dan relevansi langsung dalam dunia kerja,
                memastikan setiap pembelajaran dapat segera diaplikasikan dalam karir Anda.
              </p>
              <div className="space-y-3">
                {benefits.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 bg-[#e8b84b] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-[#0a1628]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-white/70 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-[#e8b84b] text-[#0a1628] py-4 rounded-2xl font-black text-base hover:bg-[#f0c45a] transition-all duration-200 shadow-xl shadow-[#e8b84b]/20 hover:scale-[1.01]">
              Daftar Kelas Profesional
            </button>
          </div>

          {/* Right — Feature Grid */}
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e8b84b]/15 flex items-center justify-center mb-3 group-hover:bg-[#e8b84b]/25 transition-colors">
                    <feature.icon className="w-5 h-5 text-[#e8b84b]" />
                  </div>
                  <p className="text-white font-bold text-sm">{feature.label}</p>
                  <p className="text-white/40 text-xs mt-0.5">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Quote/Testimonial block */}
            <div className="bg-gradient-to-br from-[#e8b84b]/20 to-[#e8b84b]/5 border border-[#e8b84b]/20 rounded-2xl p-6">
              <p className="text-white/70 text-sm italic leading-relaxed">
                "Program kelas profesional UBL memungkinkan saya meraih gelar S1 tanpa harus meninggalkan pekerjaan. Jadwalnya sangat fleksibel dan dosen-dosennya berpengalaman di industri."
              </p>
              <div className="flex items-center gap-3 mt-4">
                <div className="w-8 h-8 rounded-full bg-[#e8b84b] flex items-center justify-center text-[#0a1628] font-black text-xs">A</div>
                <div>
                  <p className="text-white font-semibold text-xs">Alumni Kelas Profesional</p>
                  <p className="text-white/40 text-xs">Angkatan 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
