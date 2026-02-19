"use client";

import React from 'react';
import { ContentType } from '@/app/types';

interface TypeGridProps {
  types: { id: ContentType; label: string; description: string }[];
  onSelect: (type: ContentType) => void;
}

export const TypeGrid: React.FC<TypeGridProps> = ({ types, onSelect }) => {
  const topRow = types.slice(0, 3);
  const bottomRow = types.slice(3);

  const cardClass = "flex flex-col items-center justify-center text-center w-[108px] h-[80px] bg-[#ffffff] border border-[#e8e6dc] hover:border-accent transition-colors";

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex justify-center gap-4">
        {topRow.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={cardClass}
          >
            <span className="font-heading font-semibold text-sm text-[#141413]">
              {type.label}
            </span>
            <span className="font-body text-[11px] text-[#b0aea5] mt-1 leading-tight px-1">
              {type.description}
            </span>
          </button>
        ))}
      </div>
      <div className="flex justify-center gap-4">
        {bottomRow.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={cardClass}
          >
            <span className="font-heading font-semibold text-sm text-[#141413]">
              {type.label}
            </span>
            <span className="font-body text-[11px] text-[#b0aea5] mt-1 leading-tight px-1">
              {type.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
