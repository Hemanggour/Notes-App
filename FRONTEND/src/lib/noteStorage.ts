// Local storage for note preferences (color, position)
interface NotePreferences {
  [noteId: string]: {
    color?: string;
    position?: number;
  };
}

const STORAGE_KEY = 'note_preferences';

export const noteStorage = {
  // Get all preferences
  getAll: (): NotePreferences => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  },

  // Get preference for a specific note
  get: (noteId: string) => {
    const all = noteStorage.getAll();
    return all[noteId] || {};
  },

  // Set preference for a specific note
  set: (noteId: string, preferences: { color?: string; position?: number }) => {
    const all = noteStorage.getAll();
    all[noteId] = { ...all[noteId], ...preferences };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },

  // Remove preference for a specific note
  remove: (noteId: string) => {
    const all = noteStorage.getAll();
    delete all[noteId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  },

  // Clear all preferences
  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
  },
};
