const programs = {
  "Fakultas Ekonomi & Bisnis": [
    { name: "Manajemen", accreditation: "Unggul & Internasional" },
    { name: "Akuntansi", accreditation: "Unggul" },
  ],
  "Fakultas Ilmu Komputer": [
    { name: "Sistem Informasi", accreditation: "Baik Sekali" },
    { name: "Informatika", accreditation: "Unggul" },
  ],
  "Fakultas Teknik": [
    { name: "Teknik Sipil", accreditation: "Unggul" },
    { name: "Arsitektur", accreditation: "Baik Sekali" },
    { name: "Teknik Mesin", accreditation: "Unggul" },
  ],
  "Fakultas Ilmu Sosial & Politik": [
    { name: "Administrasi Publik", accreditation: "Unggul" },
    { name: "Administrasi Bisnis", accreditation: "Baik Sekali" },
    { name: "Ilmu Komunikasi", accreditation: "Unggul" },
  ],
  "Fakultas Hukum": [
    { name: "Ilmu Hukum", accreditation: "A" },
  ],
  "Fakultas Keguruan & Ilmu Pendidikan": [
    { name: "Pendidikan Bahasa Inggris", accreditation: "Unggul" },
  ],
};

export default function StudyPrograms() {
  return (
    <section className="py-16 bg-orange-700">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Program Studi Unggulan</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Beragam pilihan program studi dari berbagai fakultas dengan akreditasi terbaik untuk mendukung masa depan Anda.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(programs).map(([faculty, courses]) => (
            <div key={faculty} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4">{faculty}</h3>
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.name} className="flex justify-between items-center border-b pb-2">
                    <span className="font-medium">{course.name}</span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                      {course.accreditation}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}