import { create } from 'zustand';
import { Note } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/utils/supabase';
import { extractLinks } from '@/utils/link-parser';

interface NoteState {
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  isLoading: boolean;
  
  // Actions
  fetchNotes: () => Promise<void>;
  addNote: (title?: string, content?: string) => Promise<string | undefined>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setActiveNote: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  getNoteByTitle: (title: string) => Note | undefined;
  getBacklinks: (noteId: string) => Note[];
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  activeNoteId: null,
  searchQuery: '',
  isLoading: false,

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const formattedNotes: Note[] = (data || []).map(n => ({
        id: n.id,
        title: n.title,
        content: n.content || '',
        createdAt: new Date(n.created_at).getTime(),
        updatedAt: new Date(n.updated_at).getTime(),
      }));

      set({ notes: formattedNotes });
      
      if (formattedNotes.length > 0 && !get().activeNoteId) {
        set({ activeNoteId: formattedNotes[0].id });
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addNote: async (title = '', content = '') => {
    const newNote = {
      id: uuidv4(),
      title,
      content,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('notes').insert([newNote]);
      if (error) throw error;

      const formattedNote: Note = {
        id: newNote.id,
        title: newNote.title,
        content: newNote.content,
        createdAt: new Date(newNote.created_at).getTime(),
        updatedAt: new Date(newNote.updated_at).getTime(),
      };

      set((state) => ({
        notes: [formattedNote, ...state.notes],
        activeNoteId: formattedNote.id,
      }));
      return formattedNote.id;
    } catch (error) {
      console.error('Error adding note:', error);
      return undefined;
    }
  },

  updateNote: async (id, updates) => {
    const updatedAt = new Date().toISOString();
    
    set((state) => ({
      notes: state.notes.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date(updatedAt).getTime() } : n
      ),
    }));

    try {
      const { error } = await supabase
        .from('notes')
        .update({
          ...updates,
          updated_at: updatedAt,
        })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating note:', error);
      get().fetchNotes();
    }
  },

  deleteNote: async (id) => {
    try {
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) throw error;

      set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
        activeNoteId: state.activeNoteId === id ? (state.notes[1]?.id || null) : state.activeNoteId,
      }));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  },

  setActiveNote: (id) => set({ activeNoteId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  getNoteByTitle: (title) => {
    return get().notes.find(
      (n) => n.title.toLowerCase() === title.toLowerCase()
    );
  },

  getBacklinks: (noteId) => {
    const targetNote = get().notes.find((n) => n.id === noteId);
    if (!targetNote) return [];

    return get().notes.filter((note) => {
      if (note.id === noteId) return false;
      const links = extractLinks(note.content);
      return links.some(
        (linkTitle) => linkTitle.toLowerCase() === targetNote.title.toLowerCase()
      );
    });
  },
}));
