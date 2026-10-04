import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language, Command } from '../types';
import { ConfirmationModal } from './ConfirmationModal';
import { Plus, Trash2, Edit3, FolderPlus, Code } from 'lucide-react';

// Οθόνη Διαχείρισης (CRUD) Γλωσσών και Εντολών
// Language and Command CRUD Management screen
export const CommandManagement: React.FC = () => {
  const {
    languages,
    commands,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    addCommand,
    updateCommand,
    deleteCommand,
  } = useApp();

  // State για Φόρμες Γλωσσών
  const [langName, setLangName] = useState('');
  const [langDesc, setLangDesc] = useState('');
  const [editingLangId, setEditingLangId] = useState<string | null>(null);

  // State για Φόρμες Εντολών
  const [cmdLanguageId, setCmdLanguageId] = useState('');
  const [cmdTitle, setCmdTitle] = useState('');
  const [cmdDesc, setCmdDesc] = useState('');
  const [cmdCode, setCmdCode] = useState('');
  const [editingCmdId, setEditingCmdId] = useState<string | null>(null);

  // Modal Διαγραφής
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'lang' | 'cmd';
    id: string;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'lang',
    id: '',
    title: '',
    message: '',
  });

  // Υποβολή Γλώσσας
  const handleLanguageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!langName.trim()) return;

    if (editingLangId) {
      updateLanguage(editingLangId, langName.trim(), langDesc.trim());
      setEditingLangId(null);
    } else {
      addLanguage(langName.trim(), langDesc.trim());
    }
    setLangName('');
    setLangDesc('');
  };

  // Υποβολή Εντολής
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdLanguageId || !cmdTitle.trim() || !cmdCode.trim()) return;

    if (editingCmdId) {
      updateCommand(editingCmdId, {
        languageId: cmdLanguageId,
        title: cmdTitle.trim(),
        description: cmdDesc.trim(),
        expectedCode: cmdCode,
      });
      setEditingCmdId(null);
    } else {
      addCommand({
        languageId: cmdLanguageId,
        title: cmdTitle.trim(),
        description: cmdDesc.trim(),
        expectedCode: cmdCode,
      });
    }
    setCmdTitle('');
    setCmdDesc('');
    setCmdCode('');
  };

  // Επιβεβαίωση Διαγραφής
  const confirmDelete = () => {
    if (deleteModal.type === 'lang') {
      deleteLanguage(deleteModal.id);
    } else {
      deleteCommand(deleteModal.id);
    }
    setDeleteModal((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Ενότητα 1: Διαχείριση Γλωσσών Προγραμματισμού */}
      <section className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <FolderPlus className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-100">Γλώσσες Προγραμματισμού</h2>
        </div>

        {/* Φόρμα Γλώσσας */}
        <form onSubmit={handleLanguageSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Όνομα Γλώσσας (π.χ. Python, JavaScript)"
            value={langName}
            onChange={(e) => setLangName(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            required
          />
          <input
            type="text"
            placeholder="Περιγραφή (Προαιρετικό)"
            value={langDesc}
            onChange={(e) => setLangDesc(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl px-4 py-2.5 transition-colors shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{editingLangId ? 'Ενημέρωση Γλώσσας' : 'Προσθήκη Γλώσσας'}</span>
          </button>
        </form>

        {/* Λίστα Γλωσσών */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          {languages.map((lang: Language) => (
            <div
              key={lang.id}
              className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-slate-200">{lang.name}</h4>
                {lang.description && <p className="text-xs text-slate-400">{lang.description}</p>}
                <span className="inline-block mt-1 text-[10px] font-semibold text-indigo-400 bg-indigo-950/50 px-2 py-0.5 rounded-md">
                  {commands.filter((c) => c.languageId === lang.id).length} εντολές
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingLangId(lang.id);
                    setLangName(lang.name);
                    setLangDesc(lang.description || '');
                  }}
                  className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() =>
                    setDeleteModal({
                      isOpen: true,
                      type: 'lang',
                      id: lang.id,
                      title: `Διαγραφή Γλώσσας: ${lang.name}`,
                      message: `Προσοχή! Η διαγραφή της γλώσσας "${lang.name}" θα διαγράψει αυτόματα και όλες τις εντολές που ανήκουν σε αυτήν (${commands.filter((c) => c.languageId === lang.id).length} εντολές). Επιθυμείτε τη συνέχεια;`,
                    })
                  }
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ενότητα 2: Διαχείριση Εντολών / Ασκήσεων */}
      <section className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <Code className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-bold text-slate-100">Καταχώρηση & Επεξεργασία Εντολών</h2>
        </div>

        {/* Φόρμα Εντολής */}
        <form onSubmit={handleCommandSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={cmdLanguageId}
              onChange={(e) => setCmdLanguageId(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            >
              <option value="">-- Επιλέξτε Γλώσσα --</option>
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Τίτλος Εντολής / Άσκησης (π.χ. Print Statement)"
              value={cmdTitle}
              onChange={(e) => setCmdTitle(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              required
            />
          </div>

          <textarea
            placeholder="Περιγραφή / Εκφώνηση Άσκησης..."
            value={cmdDesc}
            onChange={(e) => setCmdDesc(e.target.value)}
            rows={2}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Ακριβής Αναμενόμενος Κώδικας (Expected Code)
            </label>
            <textarea
              placeholder="print('Hello World')"
              value={cmdCode}
              onChange={(e) => setCmdCode(e.target.value)}
              rows={4}
              className="w-full font-mono text-sm bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl py-3 transition-colors shadow-lg shadow-indigo-600/20 text-sm flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>{editingCmdId ? 'Ενημέρωση Εντολής' : 'Προσθήκη Εντολής'}</span>
          </button>
        </form>

        {/* Λίστα Εντολών */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Καταχωρημένες Εντολές ({commands.length})
          </h3>
          {commands.map((cmd: Command) => {
            const lang = languages.find((l) => l.id === cmd.languageId);
            return (
              <div
                key={cmd.id}
                className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex items-start justify-between space-x-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded-md">
                      {lang?.name || 'Άγνωστη'}
                    </span>
                    <h4 className="font-bold text-slate-200">{cmd.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400">{cmd.description}</p>
                  <pre className="font-mono text-xs text-slate-300 bg-slate-900 p-2 rounded-lg mt-2 inline-block">
                    {cmd.expectedCode}
                  </pre>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      setEditingCmdId(cmd.id);
                      setCmdLanguageId(cmd.languageId);
                      setCmdTitle(cmd.title);
                      setCmdDesc(cmd.description);
                      setCmdCode(cmd.expectedCode);
                    }}
                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDeleteModal({
                        isOpen: true,
                        type: 'cmd',
                        id: cmd.id,
                        title: `Διαγραφή Εντολής: ${cmd.title}`,
                        message: `Είστε βέβαιοι ότι επιθυμείτε τη διαγραφή της εντολής "${cmd.title}";`,
                      })
                    }
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title={deleteModal.title}
        message={deleteModal.message}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};