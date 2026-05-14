'use client';

import { useNoteStore } from '@/store/useNoteStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { NoteRenderer } from './NoteRenderer';
import { Eye, Edit3, Link as LinkIcon, Check, X } from 'lucide-react';

export const NoteEditor = () => {
  const { notes, activeNoteId, updateNote, getBacklinks } = useNoteStore();
  const [isEditing, setIsEditing] = useState(false);
  
  const activeNote = notes.find((n) => n.id === activeNoteId);
  const backlinks = activeNoteId ? getBacklinks(activeNoteId) : [];

  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');

  // Sync draft with active note when it changes or when entering edit mode
  useEffect(() => {
    if (activeNote) {
      setDraftTitle(activeNote.title);
      setDraftContent(activeNote.content);
    }
  }, [activeNoteId, activeNote]);

  const handleSave = () => {
    if (activeNote) {
      updateNote(activeNote.id, { title: draftTitle, content: draftContent });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (activeNote) {
      setDraftTitle(activeNote.title);
      setDraftContent(activeNote.content);
      setIsEditing(false);
    }
  };

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
      className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0b0d0e]"
    >
      <div className="border-b border-[#282a2c] px-6 py-4 flex items-center justify-between">
        {isEditing ? (
          <input
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            className="bg-transparent text-2xl font-bold focus:outline-none w-full text-white"
            placeholder="Note Title"
          />
        ) : (
          <h1 className="text-2xl font-bold text-white truncate flex-1">{activeNote.title || 'Untitled'}</h1>
        )}
        
        <div className="flex items-center gap-2 ml-4">
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div 
                key="edit-actions"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2"
              >
                <button
                  onClick={handleSave}
                  className="p-2 bg-[#4285f4]/10 hover:bg-[#4285f4]/20 text-[#4285f4] rounded-full transition-colors"
                  title="Save Changes"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-[#ea4335]/10 text-[#ea4335] rounded-full transition-colors"
                  title="Cancel Changes"
                >
                  <X size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="preview-actions"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-[#1e1f21] rounded text-[#888] transition-colors"
                title="Edit Note"
              >
                <Edit3 size={18} />
              </motion.button>
            )}
          </AnimatePresence>
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
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
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
        <div className="w-64 border-l border-[#282a2c] p-4 hidden lg:flex flex-col gap-4 overflow-y-auto bg-[#131517]">
          <div className="flex items-center gap-2 text-[#555] text-xs font-semibold uppercase tracking-wider">
            <LinkIcon size={14} className="text-[#4285f4]" />
            <span>Backlinks</span>
          </div>
          <div className="flex flex-col gap-2">
            {backlinks.length > 0 ? (
              backlinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => useNoteStore.getState().setActiveNote(link.id)}
                  className="text-left p-2 rounded hover:bg-[#1e1f21] text-xs text-[#ccc] transition-colors border border-transparent hover:border-[#282a2c]"
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
