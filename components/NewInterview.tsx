
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Mic, FileAudio, Loader2, CheckCircle, AlertCircle, Square, Trash2, Play, Pause, Smartphone, Laptop, FileText } from 'lucide-react';
import { Candidate, CandidateStatus } from '../types';
import { analyzeInterviewMedia } from '../services/geminiService';

interface NewInterviewProps {
  onAnalyzeComplete: (candidate: Candidate) => void;
}

const NewInterview: React.FC<NewInterviewProps> = ({ onAnalyzeComplete }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    email: '',
    phone: '',
    experience: 'Junior'
  });
  
  // CV State
  const [cvFile, setCvFile] = useState<File | null>(null);

  // Upload State
  const [file, setFile] = useState<File | null>(null);
  
  // Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  // Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  // Clean up URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [audioUrl]);

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Limit CV to 5MB
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("Ukuran CV terlalu besar. Maksimal 5MB.");
        setCvFile(null);
        return;
      }
      setCvFile(selectedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 20 * 1024 * 1024) {
        setError("Ukuran file media terlalu besar. Untuk demo ini, harap gunakan file di bawah 20MB.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setAudioBlob(null); // Clear recording if file is selected
      setError(null);
    }
  };

  const startRecording = async () => {
    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Browser Anda tidak mendukung perekaman audio. Silakan gunakan fitur unggah file.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      try {
        mediaRecorderRef.current = new MediaRecorder(stream);
      } catch (e) {
        stream.getTracks().forEach(track => track.stop());
        throw new Error("MediaRecorder gagal diinisialisasi pada perangkat ini.");
      }

      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setFile(null); // Clear file if recording starts

      // Timer logic
      setRecordingTime(0);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err: any) {
      console.error("Recording Error:", err);
      let errorMessage = "Gagal mengakses mikrofon.";

      if (err.name === 'NotFoundError' || err.message?.includes('Requested device not found')) {
        errorMessage = "Mikrofon tidak ditemukan. Pastikan perangkat Anda memiliki mikrofon yang terhubung.";
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage = "Izin mikrofon ditolak. Harap izinkan akses mikrofon di pop-up browser Anda atau pengaturan sistem.";
      } else if (err.name === 'NotReadableError') {
        errorMessage = "Mikrofon sedang digunakan oleh aplikasi lain atau mengalami kesalahan.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'upload' && !file) {
      setError("Harap unggah rekaman wawancara.");
      return;
    }
    if (activeTab === 'record' && !audioBlob) {
      setError("Harap rekam wawancara terlebih dahulu.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let mediaBase64 = '';
      let mediaMimeType = '';

      if (activeTab === 'upload' && file) {
        mediaBase64 = await blobToBase64(file);
        mediaMimeType = file.type;
      } else if (activeTab === 'record' && audioBlob) {
        mediaBase64 = await blobToBase64(audioBlob);
        mediaMimeType = audioBlob.type;
      }

      // Handle CV File
      let cvBase64 = undefined;
      let cvMimeType = undefined;
      if (cvFile) {
        cvBase64 = await blobToBase64(cvFile);
        cvMimeType = cvFile.type;
      }

      // 1. Create basic candidate
      const newCandidate: Candidate = {
        id: Date.now().toString(),
        name: formData.name,
        position: formData.position,
        email: formData.email,
        phone: formData.phone,
        experienceLevel: formData.experience,
        status: CandidateStatus.ANALYZING,
        appliedDate: new Date().toISOString().split('T')[0],
        cvFileName: cvFile?.name
      };

      // 2. Call Gemini Service (Now with CV data)
      const analysisResult = await analyzeInterviewMedia(
        mediaBase64, 
        mediaMimeType, 
        formData.name, 
        formData.position,
        cvBase64,
        cvMimeType
      );

      // 3. Update candidate with results
      newCandidate.analysis = analysisResult;
      newCandidate.status = CandidateStatus.INTERVIEWED;

      onAnalyzeComplete(newCandidate);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat analisis AI. Silakan periksa API Key atau coba lagi.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Analisis Wawancara Baru</h2>
          <p className="text-sm text-slate-500 mt-1">Unggah CV dan rekaman untuk analisis komprehensif termasuk DISC</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Candidate Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Informasi Kandidat</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="misal: Budi Santoso"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Posisi Dilamar</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    placeholder="misal: Sales Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input 
                    required
                    type="email" 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="budi@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Level Pengalaman</label>
                  <select 
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  >
                    <option value="Intern">Intern</option>
                    <option value="Junior">Junior (0-2 tahun)</option>
                    <option value="Mid-Level">Mid-Level (3-5 tahun)</option>
                    <option value="Senior">Senior (5+ tahun)</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* CV Upload Section */}
            <div className="space-y-4">
               <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Dokumen Pendukung</h3>
               <div 
                  className={`border border-slate-200 rounded-lg p-4 flex items-center justify-between transition-all ${cvFile ? 'bg-blue-50 border-blue-200' : 'bg-white hover:bg-slate-50'}`}
               >
                  <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-full ${cvFile ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                        <FileText size={24} />
                     </div>
                     <div>
                        <p className="font-medium text-slate-800 text-sm">
                           {cvFile ? cvFile.name : "Unggah CV Kandidat"}
                        </p>
                        <p className="text-xs text-slate-500">
                           {cvFile ? `${(cvFile.size / 1024).toFixed(1)} KB` : "PDF atau DOCX (Maks 5MB)"}
                        </p>
                     </div>
                  </div>
                  
                  <input 
                    type="file" 
                    ref={cvInputRef}
                    className="hidden" 
                    accept=".pdf,.doc,.docx"
                    onChange={handleCvChange}
                  />

                  {cvFile ? (
                    <button 
                       type="button"
                       onClick={() => setCvFile(null)}
                       className="text-xs text-red-500 font-medium hover:underline"
                    >
                       Hapus
                    </button>
                  ) : (
                    <button 
                       type="button"
                       onClick={() => cvInputRef.current?.click()}
                       className="px-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                    >
                       Pilih File
                    </button>
                  )}
               </div>
            </div>

            {/* Input Method Tabs */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Media Wawancara (Audio/Video)</h3>
              <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2"><Upload size={16}/> Unggah File</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('record')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'record' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-2"><Mic size={16}/> Rekam Langsung</span>
                </button>
              </div>

              {/* UPLOAD VIEW */}
              {activeTab === 'upload' && (
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all animate-fade-in ${
                    file ? 'border-green-400 bg-green-50' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="audio/*,video/*"
                    onChange={handleFileChange}
                  />
                  
                  {file ? (
                    <>
                      <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={32} />
                      </div>
                      <p className="text-slate-800 font-medium">{file.name}</p>
                      <p className="text-slate-500 text-sm mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setFile(null); }}
                        className="mt-4 text-sm text-red-500 hover:underline"
                      >
                        Hapus file
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                        <Upload size={32} />
                      </div>
                      <p className="text-slate-800 font-medium">Klik untuk unggah atau drag and drop</p>
                      <p className="text-slate-500 text-sm mt-1">MP3, WAV, M4A, MP4 (Maks 20MB)</p>
                    </>
                  )}
                </div>
              )}

              {/* RECORD VIEW */}
              {activeTab === 'record' && (
                <div className="border-2 border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 animate-fade-in">
                  
                  {!isRecording && !audioBlob && (
                    <>
                      <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm text-blue-800 mb-6 max-w-md text-left flex items-start gap-3">
                         <div className="bg-blue-200 p-1.5 rounded-full mt-0.5">
                            <Mic size={14} className="text-blue-700"/>
                         </div>
                         <div>
                           <p className="font-bold mb-1">Penting: Izinkan Akses Mikrofon</p>
                           <p className="opacity-90">Klik tombol merah di bawah, lalu pilih <strong>"Allow"</strong> atau <strong>"Izinkan"</strong> pada pop-up browser Anda. Pastikan volume input di Laptop/HP Anda aktif.</p>
                         </div>
                      </div>

                      <button
                        type="button"
                        onClick={startRecording}
                        className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/30 transition-all hover:scale-105"
                      >
                        <Mic size={32} />
                      </button>
                      <p className="mt-4 font-medium text-slate-700">Klik untuk mulai merekam</p>
                      
                      <div className="flex gap-4 mt-4 text-slate-400 text-xs">
                        <span className="flex items-center gap-1"><Laptop size={14}/> PC/Laptop</span>
                        <span className="flex items-center gap-1"><Smartphone size={14}/> Tablet/HP</span>
                      </div>
                    </>
                  )}

                  {isRecording && (
                    <>
                      <div className="w-20 h-20 rounded-full border-4 border-red-200 flex items-center justify-center relative">
                        <div className="w-full h-full rounded-full absolute animate-ping bg-red-100 opacity-75"></div>
                        <span className="text-2xl font-mono font-bold text-red-600 relative z-10">{formatTime(recordingTime)}</span>
                      </div>
                      <p className="mt-4 font-medium text-red-600 animate-pulse">Sedang Merekam...</p>
                      <button
                        type="button"
                        onClick={stopRecording}
                        className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-lg flex items-center gap-2 hover:bg-slate-900 transition-colors"
                      >
                        <Square size={16} fill="white" /> Berhenti
                      </button>
                    </>
                  )}

                  {!isRecording && audioBlob && (
                    <div className="w-full max-w-md bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                             <Mic size={20} />
                           </div>
                           <div className="text-left">
                             <p className="font-bold text-slate-800">Rekaman Audio</p>
                             <p className="text-xs text-slate-500">Durasi: {formatTime(recordingTime)}</p>
                           </div>
                        </div>
                        <button 
                          onClick={deleteRecording}
                          type="button"
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                      
                      {audioUrl && (
                        <audio controls src={audioUrl} className="w-full h-10" />
                      )}
                      
                      <p className="text-xs text-green-600 mt-3 flex items-center justify-center gap-1">
                        <CheckCircle size={12} /> Siap untuk dianalisis
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 animate-fade-in">
                <AlertCircle className="shrink-0 mt-0.5" size={18} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isProcessing || (!file && !audioBlob)}
                className={`px-8 py-3 rounded-lg font-medium flex items-center gap-2 text-white shadow-lg shadow-blue-500/30 transition-all ${
                  isProcessing || (!file && !audioBlob) ? 'bg-slate-400 cursor-not-allowed shadow-none' : 'bg-blue-600 hover:bg-blue-700 hover:translate-y-[-1px]'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Mic size={20} />
                    Mulai Analisis
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewInterview;
