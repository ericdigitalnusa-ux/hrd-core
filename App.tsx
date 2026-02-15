import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import NewInterview from './components/NewInterview';
import CandidateList from './components/CandidateList';
import CandidateAnalysis from './components/CandidateAnalysis';
import QuestionGenerator from './components/QuestionGenerator';
import UserGuide from './components/UserGuide';
import { MOCK_CANDIDATES } from './constants';
import { Candidate } from './types';
import { Bell, Search, UserCircle } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Handle routing to details view
  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setCurrentView('details');
  };

  const handleAnalysisComplete = (newCandidate: Candidate) => {
    setCandidates(prev => [newCandidate, ...prev]);
    setSelectedCandidate(newCandidate);
    setCurrentView('details');
  };

  const handleDeleteCandidate = (id: string) => {
    if(window.confirm('Apakah Anda yakin ingin menghapus data kandidat ini?')) {
      setCandidates(prev => prev.filter(c => c.id !== id));
      if (selectedCandidate?.id === id) {
        setSelectedCandidate(null);
        setCurrentView('candidates');
      }
    }
  };

  // Render content based on currentView
  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard candidates={candidates} />;
      case 'candidates':
        return (
          <CandidateList 
            candidates={candidates} 
            onViewCandidate={handleViewCandidate}
            onDeleteCandidate={handleDeleteCandidate}
          />
        );
      case 'new-interview':
        return <NewInterview onAnalyzeComplete={handleAnalysisComplete} />;
      case 'question-generator':
        return <QuestionGenerator />;
      case 'guide':
        return <UserGuide />;
      case 'details':
        return selectedCandidate ? (
          <CandidateAnalysis 
            candidate={selectedCandidate} 
            onBack={() => setCurrentView('candidates')} 
          />
        ) : (
          <div>Tidak ada kandidat dipilih</div>
        );
      default:
        return <Dashboard candidates={candidates} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8">
        {/* Top Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {currentView === 'dashboard' ? 'Dasbor' : 
               currentView === 'candidates' ? 'Kandidat' :
               currentView === 'new-interview' ? 'Analisis Baru' :
               currentView === 'question-generator' ? 'Pertanyaan Cerdas' :
               currentView === 'guide' ? 'Panduan Penggunaan' :
               'Profil Kandidat'}
            </h2>
            <p className="text-slate-500 text-sm">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative hidden md:block">
               <input 
                  type="text" 
                  placeholder="Pencarian global..." 
                  className="bg-white border border-slate-200 rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 w-64 shadow-sm"
               />
               <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
             </div>
             
             <button className="relative p-2 bg-white rounded-full text-slate-500 hover:text-blue-600 shadow-sm border border-slate-100">
               <Bell size={20} />
               <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
             </button>
             
             <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right hidden md:block">
                  <p className="text-sm font-bold text-slate-800">Manajer HR</p>
                  <p className="text-xs text-slate-500">Akses Admin</p>
                </div>
                <UserCircle size={40} className="text-slate-300" />
             </div>
          </div>
        </header>

        {/* Content Area */}
        {renderContent()}
      </main>
    </div>
  );
};

export default App;