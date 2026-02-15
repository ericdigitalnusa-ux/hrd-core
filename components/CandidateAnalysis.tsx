
import React, { useState } from 'react';
import { Candidate, TranscriptionTurn } from '../types';
import { ArrowLeft, User, Briefcase, Mail, Phone, Brain, AlertTriangle, CheckCircle2, MessageSquare, ShieldAlert, Video, Eye, Activity, HelpCircle, Send, Check, Loader2, FileText, Download, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface CandidateAnalysisProps {
  candidate: Candidate;
  onBack: () => void;
}

const CandidateAnalysis: React.FC<CandidateAnalysisProps> = ({ candidate, onBack }) => {
  const [emailStatus, setEmailStatus] = useState<'idle' | 'generating_pdf' | 'sending' | 'sent'>('idle');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);

  if (!candidate.analysis) {
    return <div className="p-10 text-center">Data analisis tidak ditemukan untuk kandidat ini.</div>;
  }

  const { analysis } = candidate;

  // Radar chart data for personality
  const personalityData = [
    { subject: 'Kepemimpinan', A: analysis.personality.leadership, fullMark: 10 },
    { subject: 'Problem Solving', A: analysis.personality.problemSolving, fullMark: 10 },
    { subject: 'Kontrol Emosi', A: analysis.personality.emotionalControl, fullMark: 10 },
    { subject: 'Kepercayaan Diri', A: analysis.personality.confidence, fullMark: 10 },
  ];

  const emotion = analysis.emotionAnalysis;
  const disc = analysis.discProfile;

  // Auto-generate email content
  const emailSubject = `Laporan Interview: ${candidate.name} - ${candidate.position} (${analysis.matchScore}% Match)`;
  const emailBody = `Yth. Manajer HR,\n\nBerikut adalah hasil analisis interview AI untuk kandidat:\n\nNama: ${candidate.name}\nPosisi: ${candidate.position}\nSkor Kecocokan: ${analysis.matchScore}%\nRekomendasi AI: ${analysis.recommendation}\n\nDetail lengkap dan transkrip terlampir dalam dokumen PDF.\n\nTerima kasih.`;

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail) return;

    setEmailStatus('generating_pdf');
    
    // Simulate PDF Generation
    setTimeout(() => {
      setEmailStatus('sending');
      
      // Simulate Sending Email
      setTimeout(() => {
        setEmailStatus('sent');
        console.log(`Email report sent to ${recipientEmail}`);
        console.log(`Subject: ${emailSubject}`);
        console.log(`Attachment: ${candidate.name}_Report.pdf`);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft size={18} /> Kembali ke Daftar
      </button>

      {/* Header Profile Card */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex gap-4 items-center">
           <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
              {candidate.name.charAt(0)}
           </div>
           <div>
              <h1 className="text-2xl font-bold text-slate-800">{candidate.name}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                <span className="flex items-center gap-1"><Briefcase size={14} /> {candidate.position}</span>
                <span className="flex items-center gap-1"><Mail size={14} /> {candidate.email}</span>
                <span className="flex items-center gap-1"><Phone size={14} /> {candidate.phone}</span>
                {candidate.cvFileName && (
                  <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    <FileText size={14} /> {candidate.cvFileName}
                  </span>
                )}
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
             <span className="block text-xs uppercase tracking-wide text-slate-400 font-bold">Skor Kecocokan</span>
             <span className={`text-3xl font-black ${
               analysis.matchScore >= 80 ? 'text-green-500' : 
               analysis.matchScore >= 60 ? 'text-orange-500' : 'text-red-500'
             }`}>
               {analysis.matchScore}%
             </span>
          </div>
          <div className="h-10 w-px bg-slate-200"></div>
          <div className="text-center">
             <span className="block text-xs uppercase tracking-wide text-slate-400 font-bold">Tingkat Risiko</span>
             <span className={`font-bold px-3 py-1 rounded-full text-xs mt-1 inline-block ${
               analysis.riskLevel === 'Low' ? 'bg-green-100 text-green-700' :
               analysis.riskLevel === 'Medium' ? 'bg-orange-100 text-orange-700' :
               'bg-red-100 text-red-700'
             }`}>
               {analysis.riskLevel === 'Low' ? 'RENDAH' : analysis.riskLevel === 'Medium' ? 'SEDANG' : 'TINGGI'}
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summary & Video Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Summary */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
             <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
               <Brain className="text-purple-500" size={20} /> Ringkasan AI
             </h3>
             <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
               {analysis.summary}
             </p>
             
             <div className="mt-6">
               <h4 className="font-semibold text-slate-800 mb-3">Skill Utama Terdeteksi</h4>
               <div className="flex flex-wrap gap-2">
                 {analysis.keySkills.map((skill, i) => (
                   <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm border border-blue-100 font-medium">
                     {skill}
                   </span>
                 ))}
               </div>
             </div>
          </div>

          {/* New: Video Emotion Analysis */}
          {emotion && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Video className="text-pink-500" size={20} /> Analisis Emosi Video
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Kegugupan (Nervous)</span>
                    <span className="font-bold text-slate-800">{emotion.nervousness}/10</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${emotion.nervousness > 6 ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${emotion.nervousness * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">Kepercayaan Diri</span>
                    <span className="font-bold text-slate-800">{emotion.confidence}/10</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${emotion.confidence > 6 ? 'bg-green-500' : 'bg-orange-500'}`} 
                      style={{ width: `${emotion.confidence * 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center gap-3">
                    <Eye className={`
                      ${emotion.eyeContact === 'Good' ? 'text-green-500' : 
                        emotion.eyeContact === 'Poor' ? 'text-red-500' : 'text-orange-500'}
                    `} size={24} />
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Kontak Mata</p>
                      <p className="font-medium text-slate-800">
                        {emotion.eyeContact === 'Good' ? 'Baik' : 
                         emotion.eyeContact === 'Average' ? 'Rata-rata' : 
                         emotion.eyeContact === 'Poor' ? 'Buruk' : 'Tidak Terlihat'}
                      </p>
                    </div>
                 </div>
                 <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex items-center gap-3">
                    <ShieldAlert className={`
                      ${emotion.defensiveness === 'High' ? 'text-red-500' : 
                        emotion.defensiveness === 'Low' ? 'text-orange-500' : 'text-green-500'}
                    `} size={24} />
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase">Sikap Defensif</p>
                      <p className="font-medium text-slate-800">
                        {emotion.defensiveness === 'High' ? 'Tinggi' : 
                         emotion.defensiveness === 'Low' ? 'Rendah' : 'Tidak Ada'}
                      </p>
                    </div>
                 </div>
              </div>

              {emotion.behavioralCues && emotion.behavioralCues.length > 0 && (
                <div className="mt-4">
                   <p className="text-sm font-semibold text-slate-700 mb-2">Isyarat Perilaku Teramati:</p>
                   <div className="flex flex-wrap gap-2">
                      {emotion.behavioralCues.map((cue, i) => (
                        <span key={i} className="text-xs bg-pink-50 text-pink-700 px-2 py-1 rounded border border-pink-100">
                          {cue}
                        </span>
                      ))}
                   </div>
                </div>
              )}
            </div>
          )}

          {/* Transcription / Detailed Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
               <MessageSquare className="text-blue-500" size={20} /> Sorotan Wawancara
             </h3>
             
             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {analysis.transcription.length > 0 ? (
                  analysis.transcription.map((turn, i) => (
                    <div key={i} className={`flex flex-col ${turn.speaker === 'Interviewer' ? 'items-end' : 'items-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                        turn.speaker === 'Interviewer' 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-slate-100 text-slate-700 rounded-bl-none'
                      }`}>
                         <span className="text-xs opacity-70 block mb-1 font-bold">
                           {turn.speaker === 'Interviewer' ? 'Pewawancara' : 'Kandidat'}
                         </span>
                         <p className="text-sm">{turn.text}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic text-center py-8">Tidak ada transkripsi dialog spesifik yang disediakan oleh AI untuk sesi ini.</p>
                )}
             </div>
          </div>
        </div>

        {/* Right Column: Stats, Red Flags, Recommendation, Email Action */}
        <div className="space-y-6">
           {/* Final Recommendation */}
           <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-lg text-white">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Rekomendasi</h3>
              <p className="text-lg font-medium leading-relaxed mb-4">
                "{analysis.recommendation}"
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-700">
                <span>Skor Keyakinan</span>
                <span className="text-white font-bold">{analysis.personality.confidence}/10</span>
              </div>
           </div>

           {/* Manual Report to HR Superior */}
           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <Mail className="text-blue-500" size={20} /> Lapor ke Atasan
              </h3>
              
              {!showEmailForm && emailStatus !== 'sent' ? (
                <div>
                   <p className="text-sm text-slate-500 mb-4">
                     Kirim laporan lengkap hasil analisis kandidat (PDF) ke atasan atau manajer HR.
                   </p>
                   <button 
                     onClick={() => setShowEmailForm(true)}
                     className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-medium"
                   >
                     <Send size={16} /> Buat Laporan Email
                   </button>
                </div>
              ) : emailStatus === 'sent' ? (
                <div className="text-center py-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check size={24} />
                  </div>
                  <h4 className="font-bold text-green-800">Email Terkirim!</h4>
                  <p className="text-sm text-green-600 mt-1">Laporan PDF telah dikirim ke {recipientEmail}</p>
                  <button 
                    onClick={() => { setEmailStatus('idle'); setShowEmailForm(false); setRecipientEmail(''); }}
                    className="text-xs text-slate-500 mt-4 underline hover:text-slate-800"
                  >
                    Kirim laporan lain
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendReport} className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase">Email Atasan / Manajer</label>
                    <input 
                      type="email" 
                      required
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="manager@perusahaan.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2 border-b border-slate-200 pb-2">
                      <FileText size={14} /> Lampiran & Preview
                    </div>
                    
                    <div className="text-xs space-y-2">
                      <div>
                        <span className="font-semibold text-slate-700">Subject:</span>
                        <p className="text-slate-600 truncate">{emailSubject}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2 bg-white p-2 rounded border border-slate-200">
                        <div className="bg-red-100 text-red-600 p-1 rounded">
                          <FileText size={16} />
                        </div>
                        <span className="text-slate-700 font-medium truncate flex-1">{candidate.name}_Report.pdf</span>
                        <span className="text-slate-400 text-[10px]">PDF</span>
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold text-slate-700">Isi Email:</span>
                        <p className="text-slate-500 italic mt-1 line-clamp-3 bg-white p-2 rounded border border-slate-100">
                          {emailBody}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      type="button"
                      onClick={() => setShowEmailForm(false)}
                      className="flex-1 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 text-sm font-medium"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      disabled={emailStatus !== 'idle'}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-medium disabled:bg-blue-400"
                    >
                      {emailStatus === 'generating_pdf' ? (
                        <>
                          <Loader2 className="animate-spin" size={16} /> Membuat PDF...
                        </>
                      ) : emailStatus === 'sending' ? (
                        <>
                          <Loader2 className="animate-spin" size={16} /> Mengirim...
                        </>
                      ) : (
                        <>
                          <Send size={16} /> Kirim Laporan
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
           </div>

           {/* DISC Profile Analysis - NEW */}
           {disc && (
             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                 <BarChart2 size={20} className="text-blue-600"/> Profil DISC
               </h3>
               <p className="text-sm text-slate-500 mb-4">Tipe Dominan: <span className="font-bold text-slate-800">{disc.dominantType}</span></p>
               
               <div className="space-y-3 mb-4">
                 {/* Dominance */}
                 <div>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="font-bold text-red-600">D (Dominance)</span>
                     <span className="text-slate-600">{disc.dScore}%</span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-red-500 rounded-full" style={{ width: `${disc.dScore}%` }}></div>
                   </div>
                 </div>
                 {/* Influence */}
                 <div>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="font-bold text-yellow-600">I (Influence)</span>
                     <span className="text-slate-600">{disc.iScore}%</span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${disc.iScore}%` }}></div>
                   </div>
                 </div>
                 {/* Steadiness */}
                 <div>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="font-bold text-green-600">S (Steadiness)</span>
                     <span className="text-slate-600">{disc.sScore}%</span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-green-500 rounded-full" style={{ width: `${disc.sScore}%` }}></div>
                   </div>
                 </div>
                 {/* Compliance */}
                 <div>
                   <div className="flex justify-between text-xs mb-1">
                     <span className="font-bold text-blue-600">C (Compliance)</span>
                     <span className="text-slate-600">{disc.cScore}%</span>
                   </div>
                   <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full" style={{ width: `${disc.cScore}%` }}></div>
                   </div>
                 </div>
               </div>

               <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs text-slate-600 leading-relaxed italic">
                 "{disc.analysis}"
               </div>
             </div>
           )}

           {/* Personality Radar */}
           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
             <h3 className="text-lg font-bold text-slate-800 mb-2">Radar Kompetensi</h3>
             <p className="text-sm text-slate-500 mb-4">Tipe: <span className="font-semibold text-slate-700">{analysis.personality.type}</span></p>
             <div className="h-64 -ml-6">
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={personalityData}>
                   <PolarGrid stroke="#e2e8f0" />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                   <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                   <Radar
                     name="Candidate"
                     dataKey="A"
                     stroke="#3b82f6"
                     strokeWidth={2}
                     fill="#3b82f6"
                     fillOpacity={0.4}
                   />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
           </div>

           {/* New: Suggested Follow-ups */}
           {analysis.suggestedFollowUpQuestions && analysis.suggestedFollowUpQuestions.length > 0 && (
             <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                 <HelpCircle className="text-indigo-500" size={20} /> Peluang Terlewatkan
               </h3>
               <p className="text-xs text-slate-500 mb-3">Pertanyaan yang seharusnya ditanyakan:</p>
               <ul className="space-y-3">
                 {analysis.suggestedFollowUpQuestions.map((q, i) => (
                   <li key={i} className="text-sm text-slate-700 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                     "{q}"
                   </li>
                 ))}
               </ul>
             </div>
           )}

           {/* Red Flags */}
           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
               <ShieldAlert className="text-red-500" size={20} /> Tanda Bahaya (Red Flags)
             </h3>
             {analysis.redFlags.length > 0 ? (
               <ul className="space-y-2">
                 {analysis.redFlags.map((flag, i) => (
                   <li key={i} className="flex items-start gap-2 text-sm text-red-700 bg-red-50 p-2 rounded">
                     <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                     {flag}
                   </li>
                 ))}
               </ul>
             ) : (
               <div className="flex flex-col items-center justify-center py-6 text-green-600 bg-green-50 rounded-lg">
                 <CheckCircle2 size={32} className="mb-2 opacity-50" />
                 <p className="font-medium text-sm">Tidak ada tanda bahaya signifikan.</p>
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateAnalysis;
