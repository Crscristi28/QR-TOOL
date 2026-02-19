"use client";

import React from 'react';
import { ContentType } from '@/app/types';

interface TypeSwitcherProps {
  types: { id: ContentType; label: string }[];
  activeType: ContentType;
  disabled: boolean;
  onTypeChange: (type: ContentType) => void;
}

export const TypeSwitcher: React.FC<TypeSwitcherProps> = ({ types, activeType, disabled, onTypeChange }) => {
  return (
    <div className="flex w-full mb-8 overflow-x-auto no-scrollbar">
      {types.map((type) => (
        <button
          key={type.id}
          onClick={() => onTypeChange(type.id)}
          disabled={disabled}
          className={`
            flex-1 py-2.5 px-3 whitespace-nowrap text-xs font-heading font-medium tracking-wide transition-colors
            ${activeType === type.id
              ? 'bg-accent text-white border border-accent'
              : 'bg-transparent text-text border border-light-gray border-l-0 first:border-l hover:border-gray'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {type.label}
        </button>
      ))}
    </div>
  );
};
