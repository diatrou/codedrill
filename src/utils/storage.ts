import { Language, Command } from '../types';

const LANGUAGES_KEY = 'codedrill_languages_v1';
const COMMANDS_KEY = 'codedrill_commands_v1';

// Ανάκτηση γλωσσών από το LocalStorage
// Retrieve languages from LocalStorage
export const getStoredLanguages = (): Language[] => {
  try {
    const data = localStorage.getItem(LANGUAGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading languages from localStorage', error);
    return [];
  }
};

// Αποθήκευση γλωσσών στο LocalStorage
// Save languages to LocalStorage
export const setStoredLanguages = (languages: Language[]): void => {
  try {
    localStorage.setItem(LANGUAGES_KEY, JSON.stringify(languages));
  } catch (error) {
    console.error('Error saving languages to localStorage', error);
  }
};

// Ανάκτηση εντολών από το LocalStorage
// Retrieve commands from LocalStorage
export const getStoredCommands = (): Command[] => {
  try {
    const data = localStorage.getItem(COMMANDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading commands from localStorage', error);
    return [];
  }
};

// Αποθήκευση εντολών στο LocalStorage
// Save commands to LocalStorage
export const setStoredCommands = (commands: Command[]): void => {
  try {
    localStorage.setItem(COMMANDS_KEY, JSON.stringify(commands));
  } catch (error) {
    console.error('Error saving commands to localStorage', error);
  }
};