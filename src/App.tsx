import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { PracticeMode } from './components/PracticeMode';
import { CommandManagement } from './components/CommandManagement';
import { DataManagement } from './components/DataManagement';

// Κύριο component προβολής περιεχομένου
// Main content viewer dependent on active view
const MainContent: React.FC = () => {
  const { activeView } = useApp();

  return (
    <main className="flex-1 bg-slate-950 p-4 sm:p-6 md:p-8 overflow-y-auto">
      {activeView === 'practice' && <PracticeMode />}
      {activeView === 'manage' && <CommandManagement />}
      {activeView === 'data' && <DataManagement />}
    </main>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans">
        <Sidebar />
        <MainContent />
      </div>
    </AppProvider>
  );
};

export default App;