'use client';

import { Sidebar } from '@/components/Sidebar';
import { NoteEditor } from '@/components/NoteEditor';
import { GraphView } from '@/components/GraphView';
import { useState, useEffect } from 'react';
import { useNoteStore } from '@/store/useNoteStore';
import { Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useHasHydrated } from '@/hooks/useHasHydrated';

export default function Home() {
  const [showGraph, setShowGraph] = useState(false);
  const { notes, addNote } = useNoteStore();
  const hasHydrated = useHasHydrated();

  useEffect(() => {
    if (hasHydrated && notes.length === 0) {
      addNote(
        'Welcome to Obsidian Alike',
        '# Welcome\n\nThis is your personal knowledge base.\n\n## Features\n- **Linking**: Use [[Double Brackets]] to link notes.\n- **Graph**: Click the network icon in the bottom right to see your notes relationship.\n- **Markdown**: Full markdown support is included.\n\nTry creating a new note with `Ctrl+N` or clicking the plus icon in the sidebar!'
      );
    }
  }, [hasHydrated, notes.length, addNote]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        addNote();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        setShowGraph((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addNote]);

  if (!hasHydrated) {
    return <div className="h-screen w-screen bg-[#1e1e1e]" />;
  }

  return (
    <main className="flex h-screen w-screen overflow-hidden bg-[#1e1e1e]">
      <Sidebar />
      <div className="flex-1 flex flex-col relative">
        <NoteEditor />
        
        {/* Graph Toggle Button */}
        <button
          onClick={() => setShowGraph(true)}
          className="absolute bottom-6 right-6 p-3 bg-[#007acc] text-white rounded-full shadow-lg hover:bg-[#0062a3] transition-all transform hover:scale-110 z-20"
          title="Open Graph View (Ctrl+G)"
        >
          <Network size={24} />
        </button>
      </div>

      {/* Fullscreen Graph Modal */}
      <AnimatePresence>
        {showGraph && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-8 bg-black/60 backdrop-blur-sm"
          >
            <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl border border-[#333]">
              <GraphView onClose={() => setShowGraph(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
