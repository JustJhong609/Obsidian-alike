'use client';

import { useNoteStore } from '@/store/useNoteStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { NoteRenderer } from './NoteRenderer';
import { Eye, Edit3, Link as LinkIcon } from 'lucide-react';

export const NoteEditor = () => {
  const { notes, activeNoteId, updateNote, getBacklinks } = useNoteStore();
  const [isEditing, setIsEditing] = useState(true);
  
  const activeNote = notes.find((n) => n.id === activeNoteId);
  const backlinks = activeNoteId ? getBacklinks(activeNoteId) : [];

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center text-[#555] bg-[#1e1e1e]">
        <div className="text-center">
          <p className="text-lg">Select a note to start editing</p>
          <p className="text-sm">Or create a new one from the sidebar</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      key={activeNote.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col h-screen overflow-hidden bg-[#1e1e1e]"
    >
      <div className="border-b border-[#333] px-6 py-4 flex items-center justify-between">
        <input
          type="text"
          value={activeNote.title}
          onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
          className="bg-transparent text-2xl font-bold focus:outline-none w-full text-white"
          placeholder="Note Title"
        />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-[#333] rounded text-[#888] transition-colors"
            title={isEditing ? "Switch to Preview" : "Switch to Edit"}
          >
            {isEditing ? <Eye size={18} /> : <Edit3 size={18} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.textarea
                key="editor"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                value={activeNote.content}
                onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                className="w-full h-full bg-transparent resize-none focus:outline-none text-[#ccc] leading-relaxed font-mono text-sm"
                placeholder="Start writing... Use [[Note Title]] to link notes."
              />
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <NoteRenderer content={activeNote.content} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Panel: Backlinks */}
        <div className="w-64 border-l border-[#333] p-4 hidden lg:flex flex-col gap-4 overflow-y-auto bg-[#252526]">
          <div className="flex items-center gap-2 text-[#888] text-xs font-semibold uppercase tracking-wider">
            <LinkIcon size={14} />
            <span>Backlinks</span>
          </div>
          <div className="flex flex-col gap-2">
            {backlinks.length > 0 ? (
              backlinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => useNoteStore.getState().setActiveNote(link.id)}
                  className="text-left p-2 rounded hover:bg-[#333] text-xs text-[#ccc] transition-colors border border-transparent hover:border-[#444]"
                >
                  <p className="font-medium truncate">{link.title}</p>
                  <p className="text-[10px] text-[#555] truncate">{link.content.substring(0, 50)}...</p>
                </button>
              ))
            ) : (
              <p className="text-[10px] text-[#555]">No backlinks found</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
