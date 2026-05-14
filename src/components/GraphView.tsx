'use client';

import React, { useMemo, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  Edge, 
  Node, 
  ConnectionLineType,
  Panel,
  Handle,
  Position,
  NodeProps
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useNoteStore } from '@/store/useNoteStore';
import { extractLinks } from '@/utils/link-parser';
import { X, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';

// Custom Node Component with Rotating Gradient Border and Drag Handle
const RadiantNode = ({ data, selected }: NodeProps) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div 
      className="relative p-[2px] rounded-lg overflow-hidden min-w-[140px]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Rotating Gradient Background (visible on hover or when selected) */}
      {(hovered || selected) && (
        <motion.div
          className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,#4285f4,#9b72cb,#ea4335,#4285f4)]"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      )}
      
      {/* Static Border for idle state */}
      {!hovered && !selected && (
        <div className="absolute inset-0 bg-[#282a2c]" />
      )}

      {/* Inner Content */}
      <div className="relative bg-[#1a1c1e] text-white p-3 rounded-[7px] flex items-center gap-2 z-10">
        <Handle type="target" position={Position.Top} className="opacity-0" />
        
        {/* Drag Handle - Added 'drag-handle' class */}
        <div className="drag-handle cursor-grab active:cursor-grabbing text-[#444] hover:text-[#888] transition-colors p-1">
          <GripVertical size={14} />
        </div>

        <span className="text-[11px] font-medium truncate flex-1 text-center pr-4">
          {data.label}
        </span>
        
        <Handle type="source" position={Position.Bottom} className="opacity-0" />
      </div>

      {/* Glow effect when hovered or selected */}
      {(hovered || selected) && (
        <div className="absolute inset-0 shadow-[0_0_20px_rgba(66,133,244,0.4)] z-0" />
      )}
    </div>
  );
};

const nodeTypes = {
  radiant: RadiantNode,
};

interface GraphViewProps {
  onClose?: () => void;
}

export const GraphView = ({ onClose }: GraphViewProps) => {
  const { notes, setActiveNote, getNoteByTitle } = useNoteStore();

  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    notes.forEach((note, index) => {
      const radius = 250 + notes.length * 5;
      const angle = (index / notes.length) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      nodes.push({
        id: note.id,
        type: 'radiant',
        data: { label: note.title || 'Untitled' },
        position: { x, y },
        dragHandle: '.drag-handle', // Tell React Flow which element is the handle
      });

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
            style: { stroke: '#4285f4', opacity: 0.6 },
          });
        }
      });
    });

    return { nodes, edges };
  }, [notes, getNoteByTitle]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    // We delay the navigation slightly so the user can see the "click" effect if they want
    // But for instant navigation as requested before:
    setActiveNote(node.id);
    if (onClose) onClose();
  }, [setActiveNote, onClose]);

  return (
    <div className="w-full h-full bg-[#0b0d0e] relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        className="graph-container"
      >
        <Background color="#1a1c1e" gap={20} />
        <Controls />
        {onClose && (
          <Panel position="top-right">
            <button
              onClick={onClose}
              className="p-2 bg-[#131517] border border-[#282a2c] rounded-full text-[#888] hover:text-white transition-colors mt-4 mr-4"
            >
              <X size={20} />
            </button>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
};
