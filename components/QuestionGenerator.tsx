import React, { useState } from 'react';
import { generateSmartQuestions, generateFollowUp } from '../services/geminiService';
import { GeneratedQuestion } from '../types';
import { Brain, Sparkles, ChevronDown, ChevronUp, MessageSquare, Loader2, Play } from 'lucide-react';

const QuestionGenerator: React.FC = () => {
  const [position, setPosition] = useState('');
  const [level, setLevel] = useState('Mid-Level');
  const [skills, setSkills] = useState('');
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for follow-up simulation
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [answers, setAnswers] = useState<{[key: number]: string}>({});
  const [followUps, setFollowUps] = useState<{[key: number]: {question: string, explanation: string}}>({});
  const [loadingFollowUp, setLoadingFollowUp] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setQuestions([]);
    setAnswers({});
    setFollowUps({});
    
    try {
      const result = await generateSmartQuestions(position, level, skills);
      setQuestions(result);
    } catch (error) {
      alert("Gagal membuat pertanyaan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateFollowUp = async (index: number) => {
    const answer = answers[index];
    if (!answer || answer.trim().length < 5) return;

    setLoadingFollowUp(index);
    try {
      const result = await generateFollowUp(questions[index].question, answer);
      setFollowUps(prev => ({...prev, [index]: { question: result.followUpQuestion, explanation: result.explanation }}));
    } catch (error) {
      alert("Gagal membuat pertanyaan lanjutan.");
    } finally {
      setLoadingFollowUp(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="text-blue-200" /> Generator Pertanyaan Cerdas
        </h2>
        <p className="text-blue-100 mt-2 opacity-90">
          Menggunakan AI Thinking Mode untuk merancang pertanyaan berbasis kompetensi dan follow-up real-time.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Level Posisi</label>
            <select 
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option>Intern</option>
              <option>Junior</option>
              <option>Mid-Level</option>
              <option>Senior</option>
              <option>Lead/Manager</option>
            </select>
          </div>
          <div className="md:col-span-1">
             <label className="block text-sm font-medium text-slate-700 mb-1">Posisi</label>
             <input 
               type="text" 
               placeholder="misal: UX Designer" 
               value={position}
               onChange={(e) => setPosition(e.target.value)}
               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
               required
             />
          </div>
          <div className="md:col-span-1">
             <label className="block text-sm font-medium text-slate-700 mb-1">Skill Utama</label>
             <input 
               type="text" 
               placeholder="misal: React, Figma" 
               value={skills}
               onChange={(e) => setSkills(e.target.value)}
               className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
               required
             />
          </div>
          <div className="md:col-span-1">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Buat
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
            <div 
              className="p-5 flex justify-between items-start cursor-pointer hover:bg-slate-50"
              onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
            >
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="text-lg font-medium text-slate-800">{q.question}</h3>
                  <p className="text-sm text-slate-500 mt-1 italic">Tujuan: {q.intent}</p>
                </div>
              </div>
              <button className="text-slate-400">
                {expandedIndex === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>

            {expandedIndex === idx && (
              <div className="px-5 pb-5 pt-0 bg-slate-50 border-t border-slate-100">
                <div className="mt-4 pl-12">
                   <p className="text-xs font-bold uppercase text-slate-400 mb-2">Simulasi Jawaban Kandidat</p>
                   <textarea
                     value={answers[idx] || ''}
                     onChange={(e) => setAnswers({...answers, [idx]: e.target.value})}
                     placeholder="Ketik jawaban hipotetis di sini untuk menguji mesin Auto Follow-up..."
                     className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                   />
                   
                   <div className="mt-2 flex justify-end">
                     <button 
                       onClick={(e) => { e.stopPropagation(); handleGenerateFollowUp(idx); }}
                       disabled={loadingFollowUp === idx || !answers[idx]}
                       className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
                     >
                       {loadingFollowUp === idx ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} />}
                       Buat Follow-up
                     </button>
                   </div>

                   {followUps[idx] && (
                     <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-lg p-4 animate-fade-in">
                       <div className="flex gap-2 items-start text-indigo-800 font-semibold text-sm mb-1">
                         <MessageSquare size={16} className="mt-0.5" />
                         Saran Follow-up:
                       </div>
                       <p className="text-slate-800 mb-2 font-medium">{followUps[idx].question}</p>
                       <p className="text-xs text-indigo-600 bg-white inline-block px-2 py-1 rounded border border-indigo-100">
                         Mengapa: {followUps[idx].explanation}
                       </p>
                     </div>
                   )}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {questions.length === 0 && !isLoading && (
          <div className="text-center py-12 text-slate-400">
            <Brain size={48} className="mx-auto mb-4 opacity-20" />
            <p>Masukkan detail di atas untuk membuat pertanyaan wawancara yang disesuaikan.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionGenerator;