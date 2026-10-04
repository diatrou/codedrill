import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Command, PracticeModeType, SessionStats } from '../types';
import { CodeEditor } from './CodeEditor';
import { soundManager } from '../utils/sound';
import { Shuffle, HelpCircle, CheckCircle2, XCircle, RotateCcw, Clock, Target, Play, Trophy } from 'lucide-react';

export const PracticeMode: React.FC = () => {
  const { languages, commands, soundEnabled, setActiveView } = useApp();

  const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');
  const [practiceMode, setPracticeMode] = useState<PracticeModeType>('continuous');
  const [targetCount, setTargetCount] = useState<number>(10);
  const [timeLimit, setTimeLimit] = useState<number>(120);

  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [isSessionFinished, setIsSessionFinished] = useState<boolean>(false);

  const [queue, setQueue] = useState<Command[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isShuffle, setIsShuffle] = useState<boolean>(true);

  const [timeLeft, setTimeLeft] = useState<number>(timeLimit);
  const [stats, setStats] = useState<SessionStats>({
    totalAttempts: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    hintsUsed: 0,
    streak: 0,
    bestStreak: 0,
  });

  // Ενημέρωση SoundManager
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  // Επιλογή πρώτης διαθέσιμης γλώσσας αν δεν έχει επιλεγεί κάποια
  useEffect(() => {
    if (languages.length > 0 && !selectedLanguageId) {
      setSelectedLanguageId(languages[0].id);
    }
  }, [languages, selectedLanguageId]);

  // Προετοιμασία λίστας εντολών
  const prepareQueue = useCallback(() => {
    const availableCommands = commands.filter((cmd) => cmd.languageId === selectedLanguageId);
    if (availableCommands.length === 0) return [];

    let list = [...availableCommands];
    if (isShuffle) {
      list = list.sort(() => Math.random() - 0.5);
    }
    return list;
  }, [commands, selectedLanguageId, isShuffle]);

  // Έναρξη νέου Session
  const handleStartSession = () => {
    const newQueue = prepareQueue();
    if (newQueue.length === 0) return;

    setQueue(newQueue);
    setCurrentIndex(0);
    setUserInput('');
    setStatus('idle');
    setShowHint(false);
    setTimeLeft(timeLimit);
    setStats({
      totalAttempts: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      hintsUsed: 0,
      streak: 0,
      bestStreak: 0,
    });
    setIsSessionActive(true);
    setIsSessionFinished(false);
  };

  // Τερματισμός Session
  const handleFinishSession = useCallback(() => {
    setIsSessionActive(false);
    setIsSessionFinished(true);
  }, []);

  // Timer για το Time Attack Mode
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSessionActive && practiceMode === 'time-attack') {
      if (timeLeft > 0) {
        timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      } else {
        handleFinishSession();
      }
    }
    return () => clearInterval(timer);
  }, [isSessionActive, practiceMode, timeLeft, handleFinishSession]);

  const currentCommand = queue[currentIndex];

  // Έλεγχος Απάντησης (Exact Match)
  const handleSubmit = () => {
    if (!currentCommand || status !== 'idle') return;

    const isExactMatch = userInput === currentCommand.expectedCode;

    if (isExactMatch) {
      setStatus('correct');
      soundManager.playSuccess();

      setStats((prev) => {
        const newStreak = prev.streak + 1;
        return {
          ...prev,
          totalAttempts: prev.totalAttempts + 1,
          correctAnswers: prev.correctAnswers + 1,
          streak: newStreak,
          bestStreak: Math.max(newStreak, prev.bestStreak),
        };
      });

      setTimeout(() => {
        advanceNext();
      }, 1000);
    } else {
      setStatus('wrong');
      soundManager.playError();

      setStats((prev) => ({
        ...prev,
        totalAttempts: prev.totalAttempts + 1,
        wrongAnswers: prev.wrongAnswers + 1,
        streak: 0,
      }));

      setTimeout(() => {
        setStatus('idle');
      }, 1200);
    }
  };

  // Μετάβαση στην επόμενη εντολή
  const advanceNext = () => {
    setUserInput('');
    setStatus('idle');
    setShowHint(false);

    // Έλεγχος αν επιτεύχθηκε ο στόχος στο Fixed Target Mode
    if (practiceMode === 'fixed-target' && stats.correctAnswers + 1 >= targetCount) {
      handleFinishSession();
      return;
    }

    // Μετάβαση στην επόμενη εντολή ή ανακύκλωση λίστας
    if (currentIndex + 1 < queue.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      const refreshedQueue = prepareQueue();
      setQueue(refreshedQueue);
      setCurrentIndex(0);
    }
  };

  // Εμφάνιση Empty State αν δεν υπάρχουν γλώσσες ή εντολές
  if (languages.length === 0 || commands.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-slate-900/50 rounded-3xl border border-slate-800">
        <div className="p-4 bg-indigo-600/10 rounded-2xl text-indigo-400 mb-4">
          <Target className="w-12 h-12" />
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Δεν υπάρχουν διαθέσιμες εντολές</h2>
        <p className="text-slate-400 max-w-md mb-6">
          Για να ξεκινήσετε την εξάσκηση, προσθέστε πρώτα γλώσσες και εντολές στη διαχείριση ή πραγματοποιήστε Import από αρχείο `.json`.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveView('manage')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors shadow-lg shadow-indigo-600/20"
          >
            Προσθήκη Εντολών (Manage)
          </button>
          <button
            onClick={() => setActiveView('data')}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Εισαγωγή JSON (Import)
          </button>
        </div>
      </div>
    );
  }

  // Οθόνη Αποτελεσμάτων Συνεδρίας (Session Finished Screen)
  if (isSessionFinished) {
    const accuracy = stats.totalAttempts > 0 ? Math.round((stats.correctAnswers / stats.totalAttempts) * 100) : 0;

    return (
      <div className="max-w-xl mx-auto p-8 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl text-center animate-fadeIn">
        <div className="p-4 bg-amber-500/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 text-amber-400">
          <Trophy className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-100 mb-2">Ολοκλήρωση Συνεδρίας!</h2>
        <p className="text-slate-400 mb-8">Εξαιρετική προσπάθεια. Ακολουθούν τα στατιστικά σας:</p>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            <span className="block text-3xl font-bold text-emerald-400">{stats.correctAnswers}</span>
            <span className="text-xs text-slate-400">Σωστές Απαντήσεις</span>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            <span className="block text-3xl font-bold text-indigo-400">{accuracy}%</span>
            <span className="text-xs text-slate-400">Ακρίβεια (Accuracy)</span>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            <span className="block text-3xl font-bold text-amber-400">{stats.bestStreak}</span>
            <span className="text-xs text-slate-400">Max Streak</span>
          </div>
          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80">
            <span className="block text-3xl font-bold text-rose-400">{stats.wrongAnswers}</span>
            <span className="text-xs text-slate-400">Λάθη</span>
          </div>
        </div>

        <button
          onClick={handleStartSession}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Νέα Συνεδρία</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Ρυθμίσεις Συνεδρίας (Session Setup Header) */}
      {!isSessionActive ? (
        <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-slate-100 flex items-center space-x-2">
            <Target className="w-5 h-5 text-indigo-400" />
            <span>Ρύθμιση Συνεδρίας Εξάσκησης</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Επιλογή Γλώσσας */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Γλώσσα Προγραμματισμού
              </label>
              <select
                value={selectedLanguageId}
                onChange={(e) => setSelectedLanguageId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name} ({commands.filter((c) => c.languageId === lang.id).length} εντολές)
                  </option>
                ))}
              </select>
            </div>

            {/* Επιλογή Mode */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Mode Εξάσκησης
              </label>
              <select
                value={practiceMode}
                onChange={(e) => setPracticeMode(e.target.value as PracticeModeType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="continuous">Free Play / Continuous (Ελεύθερο)</option>
                <option value="time-attack">Time Attack (Με χρόνο)</option>
                <option value="fixed-target">Fixed Target (Στόχος επαναλήψεων)</option>
              </select>
            </div>
          </div>

          {/* Επιπλέον παράμετροι ανά Mode */}
          {practiceMode === 'time-attack' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Διάρκεια (Δευτερόλεπτα)
              </label>
              <div className="flex space-x-3">
                {[60, 120, 300].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => setTimeLimit(sec)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      timeLimit === sec
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {sec / 60} min ({sec}s)
                  </button>
                ))}
              </div>
            </div>
          )}

          {practiceMode === 'fixed-target' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Στόχος Σωστών Εντολών
              </label>
              <div className="flex space-x-3">
                {[5, 10, 20].map((num) => (
                  <button
                    key={num}
                    onClick={() => setTargetCount(num)}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition-all ${
                      targetCount === num
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {num} Εντολές
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toggle Shuffle */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-slate-300 flex items-center space-x-2">
              <Shuffle className="w-4 h-4 text-slate-400" />
              <span>Τυχαία σειρά εμφανιζόμενων εντολών (Shuffle)</span>
            </span>
            <button
              onClick={() => setIsShuffle(!isShuffle)}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                isShuffle ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isShuffle ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleStartSession}
            disabled={commands.filter((c) => c.languageId === selectedLanguageId).length === 0}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center space-x-2 text-lg"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Έναρξη Εξάσκησης</span>
          </button>
        </div>
      ) : (
        /* Οθόνη Ενεργής Εξάσκησης (Active Workspace) */
        <div className="space-y-6">
          {/* Μπάρα Προόδου & Live Stats */}
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <span className="text-xs font-semibold text-slate-400 uppercase">
                Εντολή {currentIndex + 1} / {queue.length}
              </span>
              <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                <span className="text-xs text-slate-400">Streak:</span>
                <span className="text-sm font-bold text-amber-400">{stats.streak} 🔥</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {practiceMode === 'time-attack' && (
                <div className="flex items-center space-x-2 text-indigo-400 bg-indigo-950/30 px-3 py-1 rounded-lg border border-indigo-800/50">
                  <Clock className="w-4 h-4 animate-pulse" />
                  <span className="font-mono font-bold">{timeLeft}s</span>
                </div>
              )}

              {practiceMode === 'fixed-target' && (
                <div className="flex items-center space-x-2 text-indigo-400 bg-indigo-950/30 px-3 py-1 rounded-lg border border-indigo-800/50">
                  <Target className="w-4 h-4" />
                  <span className="font-bold">
                    {stats.correctAnswers} / {targetCount}
                  </span>
                </div>
              )}

              <button
                onClick={handleFinishSession}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-3 py-1 rounded-lg border border-rose-900/50 hover:bg-rose-950/30 transition-colors"
              >
                Τερματισμός
              </button>
            </div>
          </div>

          {/* Κάρτα Εκφώνησης Εντολής */}
          {currentCommand && (
            <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl space-y-4">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  {languages.find((l) => l.id === currentCommand.languageId)?.name}
                </span>
                <h3 className="text-2xl font-bold text-slate-100 mt-1">{currentCommand.title}</h3>
                <p className="text-slate-300 text-sm mt-2 leading-relaxed">{currentCommand.description}</p>
              </div>

              {/* Code Input Area */}
              <CodeEditor
                value={userInput}
                onChange={setUserInput}
                onSubmit={handleSubmit}
                status={status}
              />

              {/* Action Buttons & Feedback */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => {
                    setShowHint(!showHint);
                    if (!showHint) setStats((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
                  }}
                  className="flex items-center space-x-2 text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-950/30 px-3 py-2 rounded-xl border border-amber-900/50 transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>{showHint ? 'Απόκρυψη Λύσης' : 'Εμφάνιση Λύσης / Hint'}</span>
                </button>

                <div className="flex items-center space-x-3">
                  {status === 'correct' && (
                    <span className="flex items-center space-x-1.5 text-emerald-400 text-sm font-bold animate-bounce">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Σωστό!</span>
                    </span>
                  )}
                  {status === 'wrong' && (
                    <span className="flex items-center space-x-1.5 text-rose-400 text-sm font-bold animate-shake">
                      <XCircle className="w-5 h-5" />
                      <span>Λάθος, δοκιμάστε ξανά!</span>
                    </span>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!userInput.trim() || status !== 'idle'}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-sm"
                  >
                    Υποβολή (Ctrl + Enter)
                  </button>
                </div>
              </div>

              {/* Hint Box */}
              {showHint && (
                <div className="p-4 bg-slate-950 rounded-2xl border border-amber-500/30 text-amber-300/90 font-mono text-sm animate-fadeIn">
                  <span className="block text-xs font-bold text-amber-500 mb-1">Αναμενόμενος Κώδικας:</span>
                  <pre className="whitespace-pre-wrap">{currentCommand.expectedCode}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};