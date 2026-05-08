const scholarships = [
  { name: "Reka Inovasi", desc: "Untuk inovator dan kreator" },
  { name: "Prestasi Akademik", desc: "Untuk berprestasi akademik" },
  { name: "Prestasi Non-Akademik", desc: "Untuk juara kompetisi" },
  { name: "Loyalty", desc: "Untuk keluarga UBL" },
  { name: "Sosial", desc: "Untuk yang membutuhkan" },
];

export default function Scholarships() {
  return (
    <section className="py-16 bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Program Beasiswa</h2>
          <p className="text-xl text-gray-700">
            Dukungan untuk mahasiswa berprestasi dan berpotensi tinggi dari berbagai latar belakang
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h3 className="text-2xl font-bold mb-4">Beasiswa Tersedia</h3>
              <p className="text-gray-600 mb-4">
                Berbagai jenis beasiswa untuk mendukung pendidikan Anda
              </p>
              <div className="grid grid-cols-2 gap-3">
                {scholarships.map((scholarship) => (
                  <div key={scholarship.name} className="bg-blue-50 p-3 rounded">
                    <div className="font-semibold text-blue-900">{scholarship.name}</div>
                    <div className="text-sm text-gray-600">{scholarship.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-4">Untuk Berprestasi dan Berpotensi</h3>
            <p className="text-gray-700 mb-4">
              Program Beasiswa adalah inisiatif untuk mendukung mahasiswa berprestasi dan berpotensi tinggi dari berbagai latar belakang.
            </p>
            <div className="bg-blue-50 p-4 rounded">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Informasi Beasiswa:</span> Dapatkan informasi lengkap tentang syarat, ketentuan, dan cara pendaftaran beasiswa melalui portal resmi beasiswa UBL.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}