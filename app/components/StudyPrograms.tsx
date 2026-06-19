import { BarChart3, Cpu, Globe2, GraduationCap, Scale, Wrench } from 'lucide-react';

const programs = [
  {
    faculty: 'Fakultas Ekonomi & Bisnis',
    icon: BarChart3,
    color: 'from-[#08c5a4] to-[#05af94]',
    courses: [
      { name: 'Manajemen', accreditation: 'Unggul & Internasional' },
      { name: 'Akuntansi', accreditation: 'Unggul' },
    ],
  },
  {
    faculty: 'Fakultas Ilmu Komputer',
    icon: Cpu,
    color: 'from-[#bd4ef1] to-[#e035ac]',
    courses: [
      { name: 'Sistem Informasi', accreditation: 'Baik Sekali' },
      { name: 'Informatika', accreditation: 'Unggul' },
    ],
  },
  {
    faculty: 'Fakultas Teknik',
    icon: Wrench,
    color: 'from-[#ff7b14] to-[#ff3c26]',
    courses: [
      { name: 'Teknik Sipil', accreditation: 'Unggul' },
      { name: 'Arsitektur', accreditation: 'Baik Sekali' },
      { name: 'Teknik Mesin', accreditation: 'Unggul' },
    ],
  },
  {
    faculty: 'Fakultas Ilmu Sosial & Politik',
    icon: Globe2,
    color: 'from-[#4f80ff] to-[#6a58ff]',
    courses: [
      { name: 'Administrasi Publik', accreditation: 'Unggul' },
      { name: 'Administrasi Bisnis', accreditation: 'Baik Sekali' },
      { name: 'Ilmu Komunikasi', accreditation: 'Unggul' },
    ],
  },
  {
    faculty: 'Fakultas Hukum',
    icon: Scale,
    color: 'from-[#64748b] to-[#475569]',
    courses: [{ name: 'Ilmu Hukum', accreditation: 'A' }],
  },
  {
    faculty: 'Fakultas Keguruan & Ilmu Pendidikan',
    icon: GraduationCap,
    color: 'from-[#12a9ec] to-[#0786e8]',
    courses: [{ name: 'Pendidikan Bahasa Inggris', accreditation: 'Unggul' }],
  },
];

function badgeClass(accreditation: string) {
  return accreditation === 'Baik Sekali'
    ? 'bg-blue-100 text-[#087ee7]'
    : 'bg-emerald-100 text-emerald-700';
}

export default function StudyPrograms() {
  return (
    <section id="program" className="bg-white py-24">
      <div className="mx-auto max-w-[1232px] px-6">
        <div className="mx-auto mb-16 max-w-[720px] text-center">
          <h2 className="text-4xl font-extrabold leading-tight text-[#11192d]">
            Program Studi <span className="text-[#087ee7]">Unggulan</span>
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#334766]">
            Beragam pilihan program studi dari berbagai fakultas dengan akreditasi terbaik untuk mendukung masa depan Anda.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {programs.map(({ faculty, icon: Icon, color, courses }) => (
            <article
              key={faculty}
              className="min-h-[268px] rounded-xl bg-white p-6 shadow-xl shadow-slate-900/8 ring-1 ring-slate-100"
            >
              <div className="flex items-center gap-4">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </span>
                <h3 className="text-xl font-extrabold leading-snug text-[#11192d]">{faculty}</h3>
              </div>

              <div className="mt-10 divide-y divide-slate-100">
                {courses.map((course) => (
                  <div key={course.name} className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
                    <p className="font-semibold text-[#334766]">{course.name}</p>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${badgeClass(course.accreditation)}`}>
                      {course.accreditation}
                    </span>
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
