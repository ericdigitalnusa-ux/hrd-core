import React from 'react';
import { 
  Mic, Upload, FileText, Brain, BarChart2, Mail, 
  HelpCircle, ShieldCheck, Zap, MousePointerClick, 
  Video, Layers 
} from 'lucide-react';

const UserGuide: React.FC = () => {
  const steps = [
    {
      title: "1. Mulai Analisis Baru",
      icon: Layers,
      color: "bg-blue-100 text-blue-600",
      content: "Masuk ke menu 'Analisis Baru'. Isi data kandidat seperti Nama, Posisi, dan Level Pengalaman. Anda juga dapat mengunggah CV (PDF/Doc) untuk analisis yang lebih akurat."
    },
    {
      title: "2. Input Media Wawancara",
      icon: Mic,
      color: "bg-red-100 text-red-600",
      content: "Anda memiliki dua opsi: Unggah file rekaman (MP3/MP4) atau Rekam Langsung via browser. Pastikan memberikan izin akses mikrofon jika merekam langsung."
    },
    {
      title: "3. Analisis AI & DISC",
      icon: Brain,
      color: "bg-purple-100 text-purple-600",
      content: "AI akan memproses audio/video untuk menghasilkan transkrip, ringkasan, skor kecocokan, dan Profil Kepribadian DISC secara otomatis dalam hitungan detik."
    },
    {
      title: "4. Review & Laporan",
      icon: FileText,
      color: "bg-green-100 text-green-600",
      content: "Lihat detail analisis, cek 'Red Flags', dan kirim laporan PDF lengkap langsung ke email atasan atau manajer HRD melalui tombol 'Buat Laporan Email'."
    }
  ];

  const faqs = [
    {
      q: "Format file apa saja yang didukung?",
      a: "Untuk rekaman: MP3, WAV, M4A, MP4 (Maks 20MB). Untuk CV: PDF, DOC, DOCX (Maks 5MB)."
    },
    {
      q: "Bagaimana AI menentukan profil DISC?",
      a: "AI menganalisis gaya komunikasi, intonasi, pemilihan kata, dan struktur kalimat kandidat dari transkrip wawancara untuk memetakan kecenderungan Dominance, Influence, Steadiness, atau Compliance."
    },
    {
      q: "Apakah data kandidat aman?",
      a: "Ya, data hanya diproses untuk sesi analisis saat ini. Kami merekomendasikan untuk menghapus data sensitif setelah proses perekrutan selesai melalui tombol hapus di daftar kandidat."
    },
    {
      q: "Apa itu 'Thinking Mode' pada Generator Pertanyaan?",
      a: "Ini adalah fitur di mana AI 'berpikir' lebih dalam untuk merancang pertanyaan yang sulit dimanipulasi dan membuat skenario follow-up berdasarkan jawaban hipotetis kandidat."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <HelpCircle size={32} className="text-blue-400" /> 
            Pusat Bantuan TalentInsight
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            Panduan lengkap untuk memaksimalkan penggunaan AI dalam proses rekrutmen Anda. 
            Pelajari cara merekam, menganalisis, dan mengambil keputusan berbasis data.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500 opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Workflow Steps */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Zap className="text-yellow-500" /> Alur Kerja Utama
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${step.color} flex-shrink-0`}>
                  <step.icon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg mb-2">{step.title}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">{step.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlight: DISC & Video Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart2 className="text-blue-500" /> Cara Membaca Profil DISC
          </h4>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex gap-3">
              <span className="font-bold text-red-500 w-4">D</span>
              <span><strong>Dominance:</strong> Berorientasi pada hasil, tegas, dan suka tantangan. Cocok untuk posisi Leadership atau Sales.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-yellow-500 w-4">I</span>
              <span><strong>Influence:</strong> Antusias, komunikatif, dan optimis. Cocok untuk PR, Marketing, atau Customer Service.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-green-500 w-4">S</span>
              <span><strong>Steadiness:</strong> Tenang, sabar, dan pendengar yang baik. Cocok untuk Support, Admin, atau HR.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-blue-500 w-4">C</span>
              <span><strong>Compliance:</strong> Teliti, analitis, dan patuh pada aturan. Cocok untuk Finance, Engineering, atau Data.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Video className="text-pink-500" /> Analisis Emosi & Video
          </h4>
          <p className="text-sm text-slate-600 mb-4">
            Jika Anda mengunggah video atau merekam dengan kamera, AI akan menganalisis ekspresi mikro dan bahasa tubuh.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm bg-slate-50 p-2 rounded">
              <ShieldCheck size={16} className="text-green-600" />
              <span><strong>Confidence Score:</strong> Mengukur keyakinan saat menjawab.</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-slate-50 p-2 rounded">
              <MousePointerClick size={16} className="text-purple-600" />
              <span><strong>Eye Contact:</strong> Mendeteksi apakah kandidat menjaga kontak mata.</span>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Pertanyaan Umum (FAQ)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {faqs.map((item, i) => (
            <div key={i}>
              <h5 className="font-bold text-slate-800 mb-2 flex items-start gap-2">
                <span className="text-blue-500">Q:</span> {item.q}
              </h5>
              <p className="text-slate-600 text-sm pl-6">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default UserGuide;