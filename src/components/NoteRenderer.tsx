'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNoteStore } from '@/store/useNoteStore';
import { LINK_REGEX } from '@/utils/link-parser';

interface NoteRendererProps {
  content: string;
}

export const NoteRenderer = ({ content }: NoteRendererProps) => {
  const { setActiveNote, addNote, getNoteByTitle } = useNoteStore();

  const handleLinkClick = (title: string) => {
    const existingNote = getNoteByTitle(title);
    if (existingNote) {
      setActiveNote(existingNote.id);
    } else {
      const newId = addNote(title, '');
      setActiveNote(newId);
    }
  };

  // Custom component for markdown text to handle [[links]]
  const renderTextWithLinks = (text: string) => {
    const parts = text.split(LINK_REGEX);
    const matches = text.match(LINK_REGEX);

    if (!matches) return text;

    return parts.map((part, index) => {
      // The split with capture group [[(.*)]] will have the title in the odd indices
      // wait, actually regex split with capture group returns [before, match, after, match, after...]
      // If we use [[(.*)]] as the regex
      if (index % 2 === 1) {
        return (
          <span
            key={index}
            onClick={() => handleLinkClick(part)}
            className="text-[#007acc] hover:underline cursor-pointer font-medium"
          >
            [[{part}]]
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="prose prose-invert max-w-none prose-sm sm:prose-base">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          text: ({ children }) => {
            if (typeof children === 'string') {
              return <>{renderTextWithLinks(children)}</>;
            }
            return <>{children}</>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
