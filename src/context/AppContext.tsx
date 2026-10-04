import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Command } from '../types';
import { getStoredLanguages, setStoredLanguages, getStoredCommands, setStoredCommands } from '../utils/storage';

interface AppContextType {
  languages: Language[];
  commands: Command[];
  activeView: 'practice' | 'manage' | 'data';
  soundEnabled: boolean;
  setActiveView: (view: 'practice' | 'manage' | 'data') => void;
  setSoundEnabled: (enabled: boolean) => void;
  addLanguage: (name: string, description?: string) => void;
  updateLanguage: (id: string, name: string, description?: string) => void;
  deleteLanguage: (id: string) => void;
  addCommand: (command: Omit<Command, 'id'>) => void;
  updateCommand: (id: string, command: Omit<Command, 'id'>) => void;
  deleteCommand: (id: string) => void;
  importData: (languages: Language[], commands: Command[]) => void;
  exportData: () => { languages: Language[]; commands: Command[] };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [commands, setCommands] = useState<Command[]>([]);
  const [activeView, setActiveView] = useState<'practice' | 'manage' | 'data'>('practice');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Φόρτωση δεδομένων κατά την εκκίνηση
  // Load initial state from LocalStorage on startup
  useEffect(() => {
    setLanguages(getStoredLanguages());
    setCommands(getStoredCommands());
  }, []);

  // Αποθήκευση γλωσσών σε κάθε αλλαγή
  // Sync languages with LocalStorage on update
  useEffect(() => {
    setStoredLanguages(languages);
  }, [languages]);

  // Αποθήκευση εντολών σε κάθε αλλαγή
  // Sync commands with LocalStorage on update
  useEffect(() => {
    setStoredCommands(commands);
  }, [commands]);

  // Προσθήκη νέας γλώσσας
  // Add new language
  const addLanguage = (name: string, description?: string) => {
    const newLang: Language = {
      id: crypto.randomUUID(),
      name,
      description,
    };
    setLanguages((prev) => [...prev, newLang]);
  };

  // Ενημέρωση γλώσσας
  // Update existing language
  const updateLanguage = (id: string, name: string, description?: string) => {
    setLanguages((prev) =>
      prev.map((lang) => (lang.id === id ? { ...lang, name, description } : lang))
    );
  };

  // Διαγραφή γλώσσας και αυτόματη διαγραφή συνδεδεμένων εντολών (Cascade Delete)
  // Delete language and clear associated commands (Cascade Delete)
  const deleteLanguage = (id: string) => {
    setLanguages((prev) => prev.filter((lang) => lang.id !== id));
    setCommands((prev) => prev.filter((cmd) => cmd.languageId !== id));
  };

  // Προσθήκη νέας εντολής
  // Add new command
  const addCommand = (commandData: Omit<Command, 'id'>) => {
    const newCmd: Command = {
      id: crypto.randomUUID(),
      ...commandData,
    };
    setCommands((prev) => [...prev, newCmd]);
  };

  // Ενημέρωση εντολής
  // Update existing command
  const updateCommand = (id: string, commandData: Omit<Command, 'id'>) => {
    setCommands((prev) =>
      prev.map((cmd) => (cmd.id === id ? { ...cmd, ...commandData } : cmd))
    );
  };

  // Διαγραφή εντολής
  // Delete command
  const deleteCommand = (id: string) => {
    setCommands((prev) => prev.filter((cmd) => cmd.id !== id));
  };

  // Εισαγωγή εξωτερικών δεδομένων JSON
  // Import external JSON dataset
  const importData = (newLanguages: Language[], newCommands: Command[]) => {
    setLanguages(newLanguages);
    setCommands(newCommands);
  };

  // Εξαγωγή δεδομένων
  // Export active dataset
  const exportData = () => {
    return { languages, commands };
  };

  return (
    <AppContext.Provider
      value={{
        languages,
        commands,
        activeView,
        soundEnabled,
        setActiveView,
        setSoundEnabled,
        addLanguage,
        updateLanguage,
        deleteLanguage,
        addCommand,
        updateCommand,
        deleteCommand,
        importData,
        exportData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};