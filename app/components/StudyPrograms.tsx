import { ChevronRight, Star } from 'lucide-react';

const programs = {
  'Fakultas Ekonomi & Bisnis': {
    color: 'from-blue-500 to-blue-600',
    courses: [
      { name: 'Manajemen', accreditation: 'Unggul & Internasional' },
      { name: 'Akuntansi', accreditation: 'Unggul' },
    ],
  },
  'Fakultas Ilmu Komputer': {
    color: 'from-violet-500 to-violet-600',
    courses: [
      { name: 'Sistem Informasi', accreditation: 'Baik Sekali' },
      { name: 'Informatika', accreditation: 'Unggul' },
    ],
  },
  'Fakultas Teknik': {
    color: 'from-orange-500 to-orange-600',
    courses: [
      { name: 'Teknik Sipil', accreditation: 'Unggul' },
      { name: 'Arsitektur', accreditation: 'Baik Sekali' },
      { name: 'Teknik Mesin', accreditation: 'Unggul' },
    ],
  },
  'Fakultas Ilmu Sosial & Politik': {
    color: 'from-teal-500 to-teal-600',
    courses: [
      { name: 'Administrasi Publik', accreditation: 'Unggul' },
      { name: 'Administrasi Bisnis', accreditation: 'Baik Sekali' },
      { name: 'Ilmu Komunikasi', accreditation: 'Unggul' },
    ],
  },
  'Fakultas Hukum': {
    color: 'from-red-500 to-red-600',
    courses: [
      { name: 'Ilmu Hukum', accreditation: 'A' },
    ],
  },
  'Fak. Keguruan & Ilmu Pendidikan': {
    color: 'from-pink-500 to-pink-600',
    courses: [
      { name: 'Pendidikan Bahasa Inggris', accreditation: 'Unggul' },
    ],
  },
};

const accreditationColor = (acc: string) => {
  if (acc.includes('Unggul') || acc === 'A') return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
  return 'bg-blue-50 text-blue-700 border border-blue-200';
};

export default function StudyPrograms() {
  return (
    <section className="py-24 bg-[#f8f9fc]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-[#e8b84b] font-bold text-sm uppercase tracking-widest mb-3">Program Akademik</p>
          <h2 className="text-4xl lg:text-5xl font-black text-[#0a1628] leading-tight mb-4">
            Program Studi<br />Unggulan UBL
          </h2>
          <p className="text-gray-500 text-lg">
            Beragam pilihan program studi dari enam fakultas dengan akreditasi terbaik untuk mendukung masa depan Anda.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(programs).map(([faculty, { color, courses }]) => (
            <div
              key={faculty}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Card header */}
              <div className={`bg-gradient-to-r ${color} p-5`}>
                <h3 className="text-white font-bold text-base leading-snug">{faculty}</h3>
                <p className="text-white/70 text-xs mt-1">{courses.length} Program Studi</p>
              </div>

              {/* Courses */}
              <div className="p-5 space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.name}
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div className="flex items-center gap-2.5">
                      <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                      <span className="text-[#0a1628] font-medium text-sm">{course.name}</span>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${accreditationColor(course.accreditation)}`}>
                      {course.accreditation}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 pb-5">
                <button className="w-full text-center text-sm font-semibold text-gray-400 group-hover:text-[#0a1628] transition-colors py-2 border border-gray-100 group-hover:border-gray-300 rounded-xl">
                  Lihat Detail →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm">
            <Star className="w-4 h-4 text-[#e8b84b] fill-[#e8b84b]" />
            <span className="text-gray-600 text-sm font-medium">Semua program terakreditasi oleh BAN-PT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
