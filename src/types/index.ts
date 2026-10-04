// Ορισμός τύπου για Γλώσσα Προγραμματισμού
// Language interface definition
export interface Language {
  id: string;
  name: string;
  description?: string;
}

// Ορισμός τύπου για Εντολή / Άσκηση
// Command interface definition
export interface Command {
  id: string;
  languageId: string;
  title: string;
  description: string;
  expectedCode: string;
}

// Τύποι λειτουργίας εξάσκησης
// Practice mode types
export type PracticeModeType = 'continuous' | 'time-attack' | 'fixed-target';

// Στατιστικά συνεδρίας
// Session statistics interface
export interface SessionStats {
  totalAttempts: number;
  correctAnswers: number;
  wrongAnswers: number;
  hintsUsed: number;
  streak: number;
  bestStreak: number;
}