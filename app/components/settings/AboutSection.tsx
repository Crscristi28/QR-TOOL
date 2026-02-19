"use client";

import React from 'react';
import { useLanguage } from '@/app/lib/i18n';

const AboutSection: React.FC = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-heading text-xs font-semibold text-gray uppercase tracking-wider">{t.settings.about}</h3>

      <div className="bg-card border border-light-gray p-6 flex flex-col items-center text-center gap-4">
        <div>
          <span className="font-heading text-2xl font-semibold text-text">1.0.0</span>
          <p className="font-body text-xs text-gray italic mt-1">{t.settings.version}</p>
        </div>

        <div className="w-8 h-px bg-light-gray"></div>

        <div className="flex flex-col gap-1">
           <span className="font-heading font-medium text-sm text-text">{t.settings.designedBy}</span>
           <a
             href="https://stilq.com"
             target="_blank"
             rel="noopener noreferrer"
             className="font-heading text-xs font-semibold text-accent hover:opacity-80 transition-opacity uppercase tracking-wide"
           >
             stilq.com
           </a>
        </div>

        <div className="w-8 h-px bg-light-gray"></div>

        <a
          href="mailto:support@qrtool.app"
          className="font-heading text-xs font-semibold text-accent border-b border-accent pb-0.5 hover:opacity-80 transition-opacity uppercase tracking-wide"
        >
          {t.settings.reportProblem}
        </a>
      </div>
    </div>
  );
};

export default AboutSection;
