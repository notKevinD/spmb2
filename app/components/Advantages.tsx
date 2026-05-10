import { BadgeCheck, Users, Trophy } from 'lucide-react';

const advantages = [
  {
    icon: BadgeCheck,
    title: 'Program Studi Berkualitas',
    description:
      'Lebih dari 10 program studi terakreditasi dengan kurikulum yang relevan dengan kebutuhan industri masa kini.',
    features: ['Akreditasi Unggul BAN-PT', 'Kurikulum Industri Terkini', 'Sertifikasi Profesi'],
    color: 'from-blue-500 to-blue-600',
    accent: 'bg-blue-50 text-blue-600',
  },
  {
    icon: Users,
    title: 'Dosen Berpengalaman',
    description:
      'Dosen-dosen profesional dengan latar belakang akademik dan pengalaman industri yang mumpuni dan terverifikasi.',
    features: ['Profesional Berpengalaman', 'Pendampingan Intensif', 'Jaringan Industri Luas'],
    color: 'from-[#e8b84b] to-[#d4a030]',
    accent: 'bg-amber-50 text-amber-700',
  },
  {
    icon: Trophy,
    title: 'Prestasi Membanggakan',
    description:
      'Mahasiswa UBL konsisten meraih prestasi di tingkat nasional dan internasional setiap tahunnya.',
    features: ['Juara Kompetisi Nasional', 'Penelitian Inovatif', 'Pengabdian Masyarakat'],
    color: 'from-emerald-500 to-emerald-600',
    accent: 'bg-emerald-50 text-emerald-600',
  },
];

export default function Advantages() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[#e8b84b] font-bold text-sm uppercase tracking-widest mb-3">Mengapa UBL?</p>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0a1628] leading-tight mb-4">
            Keunggulan Universitas<br />Bandar Lappung
          </h2>
          <p className="text-gray-500 text-lg">
            Komitmen kami dalam memberikan pendidikan terbaik didukung fasilitas modern dan lingkungan belajar yang inspiratif.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((item, index) => (
            <div
              key={item.title}
              className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              {/* Top gradient strip */}
              <div className={`h-1.5 bg-gradient-to-r ${item.color} rounded-t-3xl`} />

              <div className="p-8">
                {/* Icon */}
                <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} items-center justify-center mb-6 shadow-lg`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>

                <h3 className="text-[#0a1628] font-black text-xl mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.description}</p>

                {/* Features */}
                <div className="space-y-2.5">
                  {item.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-full ${item.accent} flex items-center justify-center flex-shrink-0`}>
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-700 text-sm font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Number watermark */}
              <div className="absolute bottom-4 right-6 text-7xl font-black text-gray-50 leading-none select-none">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
