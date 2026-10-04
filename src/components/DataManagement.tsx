import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Download, Upload, Database, CheckCircle2 } from 'lucide-react';

// Οθόνη Εισαγωγής / Εξαγωγής Δεδομένων JSON
// JSON Import & Export workspace
export const DataManagement: React.FC = () => {
  const { exportData, importData } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importSuccess, setImportSuccess] = React.useState(false);

  // Εξαγωγή αρχείου JSON
  // Export state to JSON file download
  const handleExport = () => {
    const data = exportData();
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `codedrill_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Εισαγωγή αρχείου JSON
  // Import state from uploaded JSON file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.languages && parsed.commands && Array.isArray(parsed.languages) && Array.isArray(parsed.commands)) {
          importData(parsed.languages, parsed.commands);
          setImportSuccess(true);
          setTimeout(() => setImportSuccess(false), 3000);
        } else {
          alert('Μη έγκυρη δομή αρχείου JSON.');
        }
      } catch (err) {
        console.error('Error parsing JSON file:', err);
        alert('Σφάλμα κατά την ανάγνωση του αρχείου JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-xl space-y-8">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <Database className="w-6 h-6 text-indigo-400" />
          <h2 className="text-2xl font-bold text-slate-100">Διαχείριση Δεδομένων (Import / Export)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Εξαγωγή */}
          <div className="p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="p-3 bg-indigo-600/10 rounded-xl w-fit text-indigo-400">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Εξαγωγή Δεδομένων (Export)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Κατεβάστε όλες τις γλώσσες και τις καταχωρημένες εντολές σας σε ένα αρχείο `.json` για backup.
            </p>
            <button
              onClick={handleExport}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Εισαγωγή */}
          <div className="p-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="p-3 bg-emerald-600/10 rounded-xl w-fit text-emerald-400">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-200">Εισαγωγή Δεδομένων (Import)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Φορτώστε ένα προηγούμενο αρχείο `.json` για να επαναφέρετε τις εντολές και τις γλώσσες σας.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-colors text-sm flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Επιλογή Αρχείου JSON</span>
            </button>
          </div>
        </div>

        {importSuccess && (
          <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center space-x-3 text-emerald-400 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span className="text-sm font-semibold">
              Η εισαγωγή των δεδομένων ολοκληρώθηκε με επιτυχία!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};