import { Calendar, Clock, Users, Briefcase, Laptop, FileText } from 'lucide-react';

export default function ProfessionalClass() {
  return (
    <section className="py-16 bg-blue-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Kelas Profesional</h2>
          <p className="text-xl text-blue-100">
            Program khusus bagi profesional yang ingin meningkatkan kualifikasi pendidikan tanpa mengganggu karir
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="bg-blue-800 rounded-lg p-6 mb-6">
              <h3 className="text-2xl font-bold mb-4">Untuk Profesional yang Bekerja</h3>
              <p className="text-blue-100">
                Program Kelas Profesional merupakan program yang dirancang khusus bagi mahasiswa yang telah bekerja 
                namun ingin meningkatkan kapabilitas dan kualifikasi pendidikannya.
              </p>
            </div>
            <div className="bg-blue-800 rounded-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Fokus Praktis & Relevan</h3>
              <p className="text-blue-100">
                Program ini menekankan penerapan praktis dan relevansi langsung dalam dunia kerja, 
                memastikan pembelajaran dapat langsung diaplikasikan dalam karir Anda.
              </p>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h4 className="text-xl font-bold mb-4">Keunggulan Kelas Profesional:</h4>
            <ul className="space-y-3">
              {[
                "Jadwal fleksibel untuk pekerja",
                "Kurikulum berbasis industri",
                "Dosen praktisi profesional",
                "Networking dengan sesama profesional",
                "Aplikasi langsung di dunia kerja"
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Jadwal Weekend</span>
                </div>
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4" />
                  <span>Blended Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Studi Kasus Nyata</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}