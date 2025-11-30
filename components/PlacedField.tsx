
import React, { useState, useEffect, useRef } from 'react';
import { SignatureField, SignatureFieldKind } from '../types';

interface PlacedFieldProps {
  field: SignatureField;
  partyName: string;
  onUpdate: (field: SignatureField) => void;
  onDelete: (fieldId: string) => void;
  bounds?: DOMRect;
  isReadOnly?: boolean;
}

const getFieldStyle = (kind: SignatureFieldKind) => {
  switch (kind) {
    case SignatureFieldKind.SIGNATURE:
      return 'bg-blue-100 border-blue-400';
    case SignatureFieldKind.INITIAL:
      return 'bg-purple-100 border-purple-400';
    case SignatureFieldKind.DATE:
      return 'bg-green-100 border-green-400';
    default:
      return 'bg-gray-100 border-gray-400';
  }
};


const PlacedField: React.FC<PlacedFieldProps> = ({ field, partyName, onUpdate, onDelete, bounds, isReadOnly = false }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const fieldRef = useRef<HTMLDivElement>(null);
  
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    e.stopPropagation(); // Prevent placing a new field
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !bounds || !fieldRef.current) return;
      
      const dx = e.clientX - dragStartPos.current.x;
      const dy = e.clientY - dragStartPos.current.y;

      const newXPercent = field.x + (dx / bounds.width) * 100;
      const newYPercent = field.y + (dy / bounds.height) * 100;

      dragStartPos.current = { x: e.clientX, y: e.clientY };
      
      onUpdate({
        ...field,
        x: Math.max(0, Math.min(newXPercent, 100 - field.width)),
        y: Math.max(0, Math.min(newYPercent, 100 - field.height)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, bounds, field, onUpdate]);


  return (
    <div
      ref={fieldRef}
      onMouseDown={handleMouseDown}
      className={`absolute border-2 rounded-md p-1 text-xs ${getFieldStyle(field.kind)} ${!isReadOnly && 'cursor-move'}`}
      style={{
        left: `${field.x}%`,
        top: `${field.y}%`,
        width: `${field.width}%`,
        height: `${field.height}%`,
        userSelect: 'none',
      }}
      aria-label={`Field for ${partyName}: ${field.kind}`}
    >
      <div className="flex flex-col h-full justify-between">
         <div className="flex justify-between items-start">
            <span className="font-bold capitalize">{field.kind}</span>
             {!isReadOnly && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(field.id)
                    }}
                    className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold leading-none hover:bg-red-700"
                    aria-label={`Delete ${field.kind} field`}
                >
                    &times;
                </button>
             )}
         </div>
        <span className="truncate text-gray-600">For: {partyName}</span>
      </div>
    </div>
  );
};

export default PlacedField;
