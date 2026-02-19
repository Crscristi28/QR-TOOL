"use client";

import React from 'react';
import { useLanguage, LANGUAGES } from '@/app/lib/i18n';

const LanguageSection: React.FC = () => {
  const { t, langCode, setLanguage } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as any);
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-heading text-xs font-semibold text-gray uppercase tracking-wider">{t.settings.language}</h3>
      <div className="relative">
        <select
          value={langCode}
          onChange={handleChange}
          className="w-full bg-card border border-light-gray p-4 font-heading text-sm text-text appearance-none focus:outline-none focus:border-accent block cursor-pointer transition-colors"
        >
          {Object.entries(LANGUAGES).map(([code, label]) => (
            <option key={code} value={code}>
              {code === 'auto' ? t.settings.languageAuto : label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="#141413" strokeWidth="1.5">
            <path d="M1 1L5 5L9 1" strokeLinecap="square"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LanguageSection;
