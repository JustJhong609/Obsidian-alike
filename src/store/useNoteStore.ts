import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Note } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface NoteState {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  
  // Actions
  addNote: (title?: string, content?: string) => string;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setActiveNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  getNoteByTitle: (title: string) => Note | undefined;
  getBacklinks: (noteId: string) => Note[];
}

export const useNoteStore = create<NoteState>()(
  persist(
    (set, get) => ({
      notes: [],
      activeNoteId: null,
      searchQuery: '',

      addNote: (title = 'Untitled', content = '') => {
        const id = uuidv4();
        const newNote: Note = {
          id,
          title,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          notes: [newNote, ...state.notes],
          activeNoteId: id,
        }));
        return id;
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: Date.now() }
              : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          activeNoteId: state.activeNoteId === id ? null : state.activeNoteId,
        }));
      },

      setActiveNote: (id) => set({ activeNoteId: id }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),

      getNoteByTitle: (title) => {
        return get().notes.find(
          (n) => n.title.toLowerCase() === title.toLowerCase()
        );
      },

      getBacklinks: (noteId) => {
        const note = get().notes.find((n) => n.id === noteId);
        if (!note) return [];
        
        return get().notes.filter((n) => {
          if (n.id === noteId) return false;
          // Simple check for [[title]] in content
          return n.content.includes(`[[${note.title}]]`);
        });
      },
    }),
    {
      name: 'obsidian-alike-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
