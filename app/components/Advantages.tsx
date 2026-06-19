import { BookOpen, CheckCircle2, Trophy, Users } from 'lucide-react';

const advantages = [
  {
    icon: BookOpen,
    title: 'Program Studi Berkualitas',
    description:
      'Lebih dari 10 program studi terakreditasi dengan kurikulum yang relevan dengan kebutuhan industri.',
    features: ['Akreditasi Unggul', 'Kurikulum Updated', 'Sertifikasi Profesi'],
  },
  {
    icon: Users,
    title: 'Dosen Berpengalaman',
    description:
      'Dosen-dosen profesional dengan latar belakang akademik dan pengalaman industri yang mumpuni.',
    features: ['Profesional Berpengalaman', 'Pendampingan Intensif', 'Jaringan Industri Luas'],
  },
  {
    icon: Trophy,
    title: 'Prestasi Membanggakan',
    description:
      'Mahasiswa UBL konsisten meraih prestasi di tingkat nasional dan internasional.',
    features: ['Juara Kompetisi', 'Penelitian Inovatif', 'Pengabdian Masyarakat'],
  },
];

export default function Advantages() {
  return (
    <section className="bg-[#f4f7fc] py-24">
      <div className="mx-auto max-w-[1232px] px-6">
        <div className="mx-auto mb-16 max-w-[760px] text-center">
          <h2 className="text-4xl font-extrabold leading-tight text-[#11192d]">
            Keunggulan <span className="text-[#087ee7]">Universitas Bandar Lampung</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#4a5d78]">
            Komitmen kami dalam memberikan pendidikan terbaik didukung oleh fasilitas modern dan lingkungan belajar yang inspiratif.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {advantages.map(({ icon: Icon, title, description, features }) => (
            <article key={title} className="rounded-xl bg-white p-6 shadow-xl shadow-slate-900/8 ring-1 ring-slate-100">
              <div className="mb-8 flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#1591fb] to-[#04add4]">
                  <Icon className="h-6 w-6 text-white" />
                </span>
                <h3 className="text-xl font-extrabold text-[#11192d]">{title}</h3>
              </div>

              <p className="min-h-[96px] text-base leading-7 text-[#4a5d78]">{description}</p>

              <div className="mt-6 space-y-4">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm font-medium text-[#334766]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
