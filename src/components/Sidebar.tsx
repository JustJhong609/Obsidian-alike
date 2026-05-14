'use client';

import { useNoteStore } from '@/store/useNoteStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Sidebar = () => {
  const { notes, activeNoteId, setActiveNote, addNote, deleteNote, searchQuery, setSearchQuery } = useNoteStore();
  const [isOpen, setIsOpen] = useState(true);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 260 : 40 }}
      className="h-screen bg-[#252526] border-r border-[#333] flex flex-col overflow-hidden relative"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute right-1 top-2 p-1 hover:bg-[#333] rounded z-10 text-[#888]"
      >
        {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-full w-full"
          >
            <div className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h1 className="text-sm font-semibold text-[#888] uppercase tracking-wider">Notes</h1>
                <button
                  onClick={() => addNote()}
                  className="p-1 hover:bg-[#333] rounded text-[#888] transition-colors"
                  title="New Note (Ctrl+N)"
                >
                  <Plus size={18} />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-[#555]" size={14} />
                <input
                  type="text"
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1e1e1e] border border-[#333] rounded px-8 py-1.5 text-xs focus:outline-none focus:border-[#007acc] transition-colors"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
              <div className="flex flex-col gap-1">
                {filteredNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    whileHover={{ x: 4 }}
                    className={cn(
                      "group flex items-center justify-between p-2 rounded cursor-pointer transition-colors",
                      activeNoteId === note.id ? "bg-[#37373d] text-white" : "hover:bg-[#2a2d2e] text-[#ccc]"
                    )}
                    onClick={() => setActiveNote(note.id)}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText size={14} className="shrink-0 text-[#888]" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-medium truncate">{note.title || 'Untitled'}</span>
                        <span className="text-[10px] text-[#666]">
                          {formatDistanceToNow(note.updatedAt)} ago
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#444] rounded text-[#888] transition-all"
                    >
                      <Trash2 size={12} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};
