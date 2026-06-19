import { ArrowRight, GraduationCap, Star } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="beranda" className="relative overflow-hidden bg-[#dff2ff]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="hero-cloud hero-cloud-large left-[4%] top-[13%] hidden sm:block" />
        <div className="hero-cloud hero-cloud-small right-[8%] top-[16%] hidden sm:block" />
        <div className="hero-cloud hero-cloud-medium left-[42%] top-[8%] hidden md:block" />
        <div className="hero-cloud hero-cloud-wide bottom-[10%] right-[30%] hidden lg:block" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white/24 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-78px)] max-w-[1232px] items-center gap-14 px-6 py-24 lg:grid-cols-[1fr_0.92fr]">
        <div>
          <div className="mb-10 inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-md shadow-sky-900/10">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Pendaftaran Madani 2 Dibuka
          </div>

          <h1 className="max-w-[630px] text-[46px] font-extrabold leading-[1.18] tracking-normal text-[#11192d] sm:text-[60px]">
            Penerimaan <span className="block text-[#087ee7]">Mahasiswa Baru</span>
          </h1>

          <p className="mt-7 max-w-[590px] text-lg leading-8 text-[#334766]">
            Bergabunglah dengan komunitas akademik yang unggul dan inovatif di Universitas Bandar Lampung.
            Wujudkan impian karir Anda melalui pendidikan berkualitas dengan fasilitas terbaik.
          </p>

          <a
            href="#kontak"
            className="mt-10 inline-flex items-center gap-3 rounded-lg bg-gradient-to-r from-[#1689f8] to-[#02afd4] px-5 py-4 text-base font-bold text-white shadow-xl shadow-sky-500/20 transition-transform hover:-translate-y-0.5"
          >
            Daftar Sekarang
            <ArrowRight className="h-4 w-4" />
          </a>

          <div className="mt-16 flex items-center gap-10">
            <div>
              <p className="text-2xl font-extrabold text-[#11192d]">10+</p>
              <p className="text-sm text-[#334766]">Program Studi</p>
            </div>
            <div className="h-8 w-px bg-slate-300" />
            <div>
              <p className="text-2xl font-extrabold text-[#11192d]">5K+</p>
              <p className="text-sm text-[#334766]">Mahasiswa</p>
            </div>
          </div>
        </div>

        <div className="rounded-[22px] bg-gradient-to-br from-[#2e82f6] to-[#0196c3] px-8 py-8 text-center text-white shadow-2xl shadow-sky-900/20 sm:px-12">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/18">
            <GraduationCap className="h-10 w-10" />
          </div>

          <h2 className="text-2xl font-extrabold">PMB 2026/2027</h2>
          <p className="mt-7 text-base font-medium text-white/90">Pendaftaran Telah Dibuka</p>

          <div className="my-7 rounded-2xl bg-white/18 px-6 py-7">
            <p className="text-3xl font-extrabold">Madani 2</p>
            <p className="mt-2 text-sm font-medium text-white/90">April 2026 - Juni 2026</p>
          </div>

          <div className="flex items-center justify-center gap-3 text-sm font-medium">
            <span className="flex items-center gap-1 text-amber-300">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="h-5 w-5 fill-current" />
              ))}
            </span>
            <span>Terakreditasi Unggul</span>
          </div>
        </div>
      </div>
    </section>
  );
}
