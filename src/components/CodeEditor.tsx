import React, { useRef } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
  status: 'idle' | 'correct' | 'wrong';
}

// Εξειδικευμένο πεδίο εισαγωγής κώδικα με υποστήριξη Tab Indentation
// Specialized code editor textarea supporting Tab key indentation
export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = '// Πληκτρολογήστε τον κώδικα εδώ...\n// Type code here...',
  disabled = false,
  status,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Διαχείριση ειδικών πλήκτρων (Tab & Ctrl/Cmd + Enter)
  // Handle special key behaviors (Tab insertion & submit on Ctrl/Cmd + Enter)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // Εισαγωγή 2 κενών διαστημάτων αντί για αλλαγή πεδίου
      // Insert 2 spaces instead of leaving focus
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Επαναφορά του δρομέα (cursor) στη σωστή θέση
      // Restore cursor position after state update
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  // Δυναμικά χρώματα πλαισίου ανάλογα με την κατάσταση
  // Dynamic border styling based on submission outcome
  const getBorderColor = () => {
    if (status === 'correct') return 'border-emerald-500 focus:ring-emerald-500 bg-emerald-950/10';
    if (status === 'wrong') return 'border-rose-500 focus:ring-rose-500 bg-rose-950/10';
    return 'border-slate-700 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-900';
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={6}
        spellCheck={false}
        className={`w-full font-mono text-sm sm:text-base p-4 rounded-xl border-2 transition-all duration-200 outline-none text-slate-100 placeholder-slate-500 resize-y ${getBorderColor()}`}
      />
      <div className="absolute bottom-3 right-3 text-xs text-slate-500 pointer-events-none">
        Ctrl + Enter για υποβολή
      </div>
    </div>
  );
};