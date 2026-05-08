import { BadgeCheck, Users, Trophy, Briefcase } from 'lucide-react';

const advantages = [
  {
    icon: BadgeCheck,
    title: "Program Studi Berkualitas",
    description: "Lebih dari 10 program studi terakreditasi dengan kurikulum yang relevan dengan kebutuhan industri.",
    features: ["Akreditasi Unggul", "Kurikulum Updated", "Sertifikasi Profesi"]
  },
  {
    icon: Users,
    title: "Dosen Berpengalaman",
    description: "Dosen-dosen profesional dengan latar belakang akademik dan pengalaman industri yang mumpuni.",
    features: ["Profesional Berpengalaman", "Pendampingan Intensif", "Jaringan Industri Luas"]
  },
  {
    icon: Trophy,
    title: "Prestasi Membanggakan",
    description: "Mahasiswa UBL konsisten meraih prestasi di tingkat nasional dan internasional.",
    features: ["Juara Kompetisi", "Penelitian Inovatif", "Pengabdian Masyarakat"]
  }
];

export default function Advantages() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-4">Keunggulan Universitas Bandar Lampung</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Komitmen kami dalam memberikan pendidikan terbaik didukung oleh fasilitas modern dan lingkungan belajar yang inspiratif.
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {advantages.map((item) => (
            <div key={item.title} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-blue-900 p-6 text-white">
                <item.icon className="w-12 h-12 mb-4" />
                <h3 className="text-xl font-bold">{item.title}</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">{item.description}</p>
                <ul className="space-y-2">
                  {item.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}