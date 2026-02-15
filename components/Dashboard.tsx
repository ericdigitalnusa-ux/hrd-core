import React from 'react';
import { Candidate, CandidateStatus } from '../types';
import { Users, UserCheck, UserX, Star, TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface DashboardProps {
  candidates: Candidate[];
}

const Dashboard: React.FC<DashboardProps> = ({ candidates }) => {
  // Compute Stats
  const total = candidates.length;
  const hired = candidates.filter(c => c.status === CandidateStatus.HIRED).length;
  const rejected = candidates.filter(c => c.status === CandidateStatus.REJECTED).length;
  const interviewed = candidates.filter(c => c.status === CandidateStatus.INTERVIEWED || c.status === CandidateStatus.HIRED || c.status === CandidateStatus.REJECTED).length;
  
  const analyzedCandidates = candidates.filter(c => c.analysis);
  const avgScore = analyzedCandidates.length > 0
    ? Math.round(analyzedCandidates.reduce((acc, c) => acc + (c.analysis?.matchScore || 0), 0) / analyzedCandidates.length)
    : 0;

  const statCards = [
    { label: 'Total Kandidat', value: total, icon: Users, color: 'bg-blue-500' },
    { label: 'Selesai Interview', value: interviewed, icon: UserCheck, color: 'bg-indigo-500' },
    { label: 'Diterima', value: hired, icon: Star, color: 'bg-green-500' },
    { label: 'Rata-rata Skor', value: `${avgScore}%`, icon: TrendingUp, color: 'bg-orange-500' },
  ];

  // Data for Charts
  const statusData = [
    { name: 'Diterima', value: hired, color: '#22c55e' },
    { name: 'Ditolak', value: rejected, color: '#ef4444' },
    { name: 'Pending', value: total - interviewed, color: '#fbbf24' },
    { name: 'Diwawancara', value: interviewed - hired - rejected, color: '#3b82f6' }
  ];

  const scoreData = analyzedCandidates.map(c => ({
    name: c.name.split(' ')[0],
    score: c.analysis?.matchScore || 0
  }));

  // DISC Distribution Data
  const discCounts = analyzedCandidates.reduce((acc, c) => {
    const type = c.analysis?.discProfile?.dominantType;
    if (type) {
      acc[type] = (acc[type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const discData = [
    { name: 'Dominance (D)', value: discCounts['D'] || 0, color: '#ef4444' }, // Red
    { name: 'Influence (I)', value: discCounts['I'] || 0, color: '#eab308' }, // Yellow
    { name: 'Steadiness (S)', value: discCounts['S'] || 0, color: '#22c55e' }, // Green
    { name: 'Compliance (C)', value: discCounts['C'] || 0, color: '#3b82f6' }  // Blue
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <Icon className={`text-${stat.color.replace('bg-', '')}`} size={24} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Funnel Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Status Perekrutan</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs">
             {statusData.map((d, i) => (
               <div key={i} className="flex items-center gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                 <span>{d.name}</span>
               </div>
             ))}
          </div>
        </div>

        {/* DISC Distribution Chart - NEW */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <PieChartIcon size={18} className="text-purple-500"/> Sebaran Kepribadian (DISC)
          </h3>
          {discData.length > 0 ? (
            <>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={discData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {discData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs mt-2">
                {discData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                    <span>{d.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <PieChartIcon size={48} className="mb-2 opacity-20" />
              <p className="text-sm">Belum ada data analisis</p>
            </div>
          )}
        </div>

        {/* Top Candidates Score Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Skor Tertinggi</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  cursor={{ fill: '#f1f5f9' }}
                />
                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Recent Activity Table Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
         <h3 className="text-lg font-bold text-slate-800 mb-4">Kandidat Terbaru</h3>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Nama</th>
                  <th className="pb-3 font-medium">Posisi</th>
                  <th className="pb-3 font-medium">Tipe DISC</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Skor Kecocokan</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {candidates.slice(0, 5).map(c => (
                  <tr key={c.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-3 font-medium text-slate-800">{c.name}</td>
                    <td className="py-3 text-slate-600">{c.position}</td>
                    <td className="py-3">
                       {c.analysis?.discProfile ? (
                         <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                           c.analysis.discProfile.dominantType === 'D' ? 'bg-red-50 text-red-600 border-red-100' :
                           c.analysis.discProfile.dominantType === 'I' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                           c.analysis.discProfile.dominantType === 'S' ? 'bg-green-50 text-green-600 border-green-100' :
                           'bg-blue-50 text-blue-600 border-blue-100'
                         }`}>
                           Type {c.analysis.discProfile.dominantType}
                         </span>
                       ) : <span className="text-slate-300">-</span>}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        c.status === CandidateStatus.HIRED ? 'bg-green-100 text-green-700' :
                        c.status === CandidateStatus.REJECTED ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-700">
                      {c.analysis?.matchScore ? `${c.analysis.matchScore}%` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;