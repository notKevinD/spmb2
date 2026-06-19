import { BriefcaseBusiness, CheckCircle2, Users } from 'lucide-react';

const benefits = [
  'Jadwal fleksibel untuk pekerja',
  'Kurikulum berbasis industri',
  'Dosen praktisi profesional',
  'Networking dengan sesama profesional',
  'Aplikasi langsung di dunia kerja',
];

const features = ['Jadwal Weekend', 'Blended Learning', 'Studi Kasus Nyata'];

export default function ProfessionalClass() {
  return (
    <section id="kelas-profesional" className="bg-[#f4f7fc] py-24">
      <div className="mx-auto max-w-[1232px] px-6">
        <div className="mx-auto mb-16 max-w-[760px] text-center">
          <h2 className="text-4xl font-extrabold text-[#087ee7]">Kelas Profesional</h2>
          <p className="mt-5 text-lg leading-8 text-[#334766]">
            Program khusus bagi profesional yang ingin meningkatkan kualifikasi pendidikan tanpa mengganggu karir
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1fr]">
          <div className="space-y-7">
            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1591fb] to-[#04add4]">
                <BriefcaseBusiness className="h-6 w-6 text-white" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-[#11192d]">Untuk Profesional yang Bekerja</h3>
                <p className="mt-3 max-w-[560px] text-base leading-7 text-[#334766]">
                  Program Kelas Profesional merupakan program yang dirancang khusus bagi mahasiswa yang telah bekerja
                  namun ingin meningkatkan kapabilitas dan kualifikasi pendidikannya.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500">
                <CheckCircle2 className="h-7 w-7 text-white" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-[#11192d]">Fokus Praktis & Relevan</h3>
                <p className="mt-3 max-w-[560px] text-base leading-7 text-[#334766]">
                  Program ini menekankan penerapan praktis dan relevansi langsung dalam dunia kerja, memastikan
                  pembelajaran dapat langsung diaplikasikan dalam karir Anda.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-xl shadow-slate-900/8 ring-1 ring-slate-100">
              <h4 className="mb-4 font-extrabold text-[#11192d]">Keunggulan Kelas Profesional:</h4>
              <ul className="space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-sm font-medium text-[#1f3552]">
                    <span className="h-2 w-2 rounded-full bg-[#2d82f6]" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-[#2e82f6] to-[#0196c3] p-8 text-center text-white shadow-2xl shadow-sky-900/20">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/18">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-extrabold">Kelas Profesional</h3>
            <p className="mt-7 text-base leading-7 text-white/90">
              Solusi tepat untuk meningkatkan karir sambil melanjutkan pendidikan
            </p>

            <div className="mt-7 rounded-xl bg-white/18 p-6 text-left">
              <p className="mb-4 text-center text-lg font-extrabold">Fitur Unggulan</p>
              <div className="space-y-3">
                {features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
