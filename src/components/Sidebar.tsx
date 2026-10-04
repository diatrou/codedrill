import React from 'react';
import { useApp } from '../context/AppContext';
import { PlayCircle, Database, FileCode2, Volume2, VolumeX, Code2 } from 'lucide-react';

// Αριστερή πλευρική μπάρα πλοήγησης και στατιστικών
// Left navigation sidebar and system metrics
export const Sidebar: React.FC = () => {
  const { languages, commands, activeView, setActiveView, soundEnabled, setSoundEnabled } = useApp();

  return (
    <aside className="w-full md:w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 md:p-6 shrink-0">
      <div>
        {/* Logo & Τίτλος */}
        <div className="flex items-center space-x-3 mb-8 px-2">
          <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-100 tracking-tight">CodeDrill</h1>
            <p className="text-xs text-slate-400">Code Mastery Studio</p>
          </div>
        </div>

        {/* Πλοήγηση (Menu) */}
        <nav className="space-y-2 mb-8">
          <button
            onClick={() => setActiveView('practice')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeView === 'practice'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <PlayCircle className="w-5 h-5" />
            <span>Εξάσκηση (Practice)</span>
          </button>

          <button
            onClick={() => setActiveView('manage')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeView === 'manage'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-5 h-5" />
            <span>Διαχείριση Εντολών</span>
          </button>

          <button
            onClick={() => setActiveView('data')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeView === 'data'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
            }`}
          >
            <Database className="w-5 h-5" />
            <span>Import / Export</span>
          </button>
        </nav>

        {/* Συγκεντρωτικά Στατιστικά Δεδομένων */}
        <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/80 mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Στατιστικά Βάσης
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/50">
              <span className="block text-2xl font-bold text-indigo-400">{languages.length}</span>
              <span className="text-xs text-slate-400">Γλώσσες</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800/50">
              <span className="block text-2xl font-bold text-indigo-400">{commands.length}</span>
              <span className="text-xs text-slate-400">Εντολές</span>
            </div>
          </div>
        </div>
      </div>

      {/* Διακόπτης Ήχου */}
      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-950/40 text-slate-300 hover:bg-slate-800/50 transition-colors text-sm"
        >
          <span className="flex items-center space-x-2">
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span>Ήχοι Εφαρμογής</span>
          </span>
          <span className={`text-xs font-semibold ${soundEnabled ? 'text-emerald-400' : 'text-slate-500'}`}>
            {soundEnabled ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </aside>
  );
};