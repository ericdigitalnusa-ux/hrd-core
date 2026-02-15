import React from 'react';
import { Candidate, CandidateStatus } from '../types';
import { Eye, Trash2, Search, Filter } from 'lucide-react';

interface CandidateListProps {
  candidates: Candidate[];
  onViewCandidate: (candidate: Candidate) => void;
  onDeleteCandidate: (id: string) => void;
}

const CandidateList: React.FC<CandidateListProps> = ({ candidates, onViewCandidate, onDeleteCandidate }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-800">Daftar Kandidat</h2>
           <p className="text-sm text-slate-500">Kelola dan tinjau status wawancara</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
             <input 
               type="text" 
               placeholder="Cari..." 
               className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
             />
          </div>
          <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-2">
            <Filter size={18} /> Filter
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-semibold">
            <tr>
              <th className="px-6 py-4">Nama</th>
              <th className="px-6 py-4">Posisi</th>
              <th className="px-6 py-4">DISC</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Skor</th>
              <th className="px-6 py-4 text-center">Risiko</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-slate-800">{candidate.name}</p>
                    <p className="text-xs text-slate-500">{candidate.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                   {candidate.position}
                </td>
                <td className="px-6 py-4">
                   {candidate.analysis?.discProfile ? (
                     <div className="flex flex-col">
                        <span className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold border ${
                          candidate.analysis.discProfile.dominantType === 'D' ? 'bg-red-100 text-red-700 border-red-200' :
                          candidate.analysis.discProfile.dominantType === 'I' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          candidate.analysis.discProfile.dominantType === 'S' ? 'bg-green-100 text-green-700 border-green-200' :
                          'bg-blue-100 text-blue-700 border-blue-200'
                        }`}>
                          {candidate.analysis.discProfile.dominantType}
                        </span>
                     </div>
                   ) : (
                     <span className="text-slate-300">-</span>
                   )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    candidate.status === CandidateStatus.HIRED ? 'bg-green-50 text-green-700 border-green-200' :
                    candidate.status === CandidateStatus.REJECTED ? 'bg-red-50 text-red-700 border-red-200' :
                    candidate.status === CandidateStatus.ANALYZING ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                   {candidate.analysis?.matchScore ? (
                     <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-700 font-bold text-sm">
                       {candidate.analysis.matchScore}
                     </div>
                   ) : '-'}
                </td>
                <td className="px-6 py-4 text-center">
                    {candidate.analysis?.riskLevel ? (
                      <span className={`text-xs font-bold ${
                        candidate.analysis.riskLevel === 'High' ? 'text-red-600' : 
                        candidate.analysis.riskLevel === 'Medium' ? 'text-orange-500' : 'text-green-600'
                      }`}>
                        {candidate.analysis.riskLevel === 'High' ? 'TINGGI' : 
                         candidate.analysis.riskLevel === 'Medium' ? 'SEDANG' : 'RENDAH'}
                      </span>
                    ) : '-'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => onViewCandidate(candidate)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Lihat Analisis"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => onDeleteCandidate(candidate.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateList;