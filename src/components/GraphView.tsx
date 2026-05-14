'use client';

import React, { useMemo, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node, 
  ConnectionLineType,
  Panel
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useNoteStore } from '@/store/useNoteStore';
import { extractLinks } from '@/utils/link-parser';
import { X } from 'lucide-react';

interface GraphViewProps {
  onClose?: () => void;
}

export const GraphView = ({ onClose }: GraphViewProps) => {
  const { notes, setActiveNote, getNoteByTitle } = useNoteStore();

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Create nodes
    notes.forEach((note, index) => {
      // Simple circle layout logic
      const radius = 200 + notes.length * 10;
      const angle = (index / notes.length) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      nodes.push({
        id: note.id,
        data: { label: note.title || 'Untitled' },
        position: { x, y },
        style: {
          background: '#2d2d2d',
          color: '#fff',
          border: '1px solid #444',
          borderRadius: '4px',
          fontSize: '10px',
          width: 100,
        },
      });

      // Create edges based on links in content
      const links = extractLinks(note.content);
      links.forEach((linkTitle) => {
        const targetNote = getNoteByTitle(linkTitle);
        if (targetNote) {
          edges.push({
            id: `e-${note.id}-${targetNote.id}`,
            source: note.id,
            target: targetNote.id,
            type: ConnectionLineType.SmoothStep,
            animated: true,
            style: { stroke: '#555' },
          });
        }
      });
    });

    return { nodes, edges };
  }, [notes, getNoteByTitle]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setActiveNote(node.id);
    if (onClose) onClose();
  }, [setActiveNote, onClose]);

  return (
    <div className="w-full h-full bg-[#1e1e1e] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodeClick={onNodeClick}
        fitView
        className="graph-container"
      >
        <Background color="#333" gap={20} />
        <Controls />
        {onClose && (
          <Panel position="top-right">
            <button
              onClick={onClose}
              className="p-2 bg-[#252526] border border-[#333] rounded-full text-[#888] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
