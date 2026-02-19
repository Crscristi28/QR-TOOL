"use client";

import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
  shareLabel?: string;
  onShareApp?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle, shareLabel, onShareApp }) => {
  return (
    <header className="px-6 pt-8 pb-4 border-b border-light-gray bg-bg sticky top-0 z-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-heading font-semibold text-[28px] leading-tight text-text tracking-tight">
            {title}
          </h1>
          <p className="font-body text-sm text-gray mt-1">
            {subtitle}
          </p>
        </div>
        {onShareApp && shareLabel && (
          <button
            onClick={onShareApp}
            className="mt-1 px-3 py-1.5 bg-[#d97757] text-[#faf9f5] font-heading font-semibold text-xs tracking-wide hover:opacity-90 transition-opacity shrink-0"
          >
            {shareLabel}
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
