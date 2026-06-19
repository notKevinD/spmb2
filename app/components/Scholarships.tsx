import { Award, Star, Trophy } from 'lucide-react';

const scholarships = [
  ['Reka Inovasi', 'Untuk inovator dan kreator'],
  ['Prestasi Akademik', 'Untuk berprestasi akademik'],
  ['Prestasi Non-Akademik', 'Untuk juara kompetisi'],
  ['Loyalty', 'Untuk keluarga UBL'],
  ['Sosial', 'Untuk yang membutuhkan'],
];

export default function Scholarships() {
  return (
    <section id="beasiswa" className="bg-[#f4f7fc] py-24">
      <div className="mx-auto max-w-[1232px] px-6">
        <div className="mx-auto mb-16 max-w-[760px] text-center">
          <h2 className="text-4xl font-extrabold leading-tight text-[#11192d]">
            Program <span className="text-[#087ee7]">Beasiswa</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#334766]">
            Dukungan untuk mahasiswa berprestasi dan berpotensi tinggi dari berbagai latar belakang
          </p>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
          <div className="rounded-xl bg-gradient-to-br from-[#ff9b05] to-[#ff7400] p-8 text-center text-white shadow-2xl shadow-orange-500/20">
            <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <Award className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-extrabold">Beasiswa Tersedia</h3>
            <p className="mt-7 text-base font-medium text-white/90">
              Berbagai jenis beasiswa untuk mendukung pendidikan Anda
            </p>

            <div className="mt-7 rounded-xl bg-white/18 p-7">
              <p className="mb-6 text-lg font-extrabold">Jenis Beasiswa</p>
              <div className="mx-auto max-w-[310px] space-y-4 text-left">
                {scholarships.map(([name, desc]) => (
                  <div key={name} className="flex items-start gap-3">
                    <Award className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="text-sm font-extrabold">{name}</p>
                      <p className="text-xs font-medium text-white/85">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ff9b05] to-[#ff7400]">
                <Trophy className="h-6 w-6 text-white" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-[#11192d]">Untuk Berprestasi dan Berpotensi</h3>
                <p className="mt-3 max-w-[560px] text-base leading-7 text-[#334766]">
                  Program Beasiswa adalah inisiatif untuk mendukung mahasiswa berprestasi dan berpotensi tinggi
                  dari berbagai latar belakang.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#bd4ef1] to-[#e035ac]">
                <Star className="h-6 w-6 text-white" />
              </span>
              <div>
                <h3 className="text-lg font-extrabold text-[#11192d]">Berbagai Jenis Beasiswa</h3>
                <p className="mt-3 max-w-[560px] text-base leading-7 text-[#334766]">
                  Tersedia berbagai jenis beasiswa seperti Reka Inovasi, Prestasi Akademik dan Non Akademik,
                  Loyalty, dan Sosial untuk memenuhi kebutuhan berbeda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
