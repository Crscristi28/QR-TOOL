"use client";

import React from 'react';
import { useLanguage } from '@/app/lib/i18n';

interface QRResultDisplayProps {
  results: { name: string; type: string; canvasId: string }[];
  onDownload: (canvasId: string, name: string) => void;
  onShare: (canvasId: string, name: string) => void;
}

export const QRResultDisplay: React.FC<QRResultDisplayProps> = ({ results, onDownload, onShare }) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 mb-8">
      {results.map((res, idx) => (
        <div key={idx} className="flex flex-col items-center w-full">
          <div className="w-full text-center mb-2">
            <h4 className="font-heading font-semibold text-sm text-text">{res.name}</h4>
            <span className="font-mono text-[10px] text-gray uppercase">{res.type}</span>
          </div>
          <canvas id={res.canvasId} className="border border-light-gray mb-4" />
          <div className="flex gap-4">
            <button
              onClick={() => onDownload(res.canvasId, res.name)}
              className="text-xs font-heading font-medium text-gray hover:text-text transition-colors"
            >
              {t.common.download}
            </button>
            {'share' in navigator && (
              <button
                onClick={() => onShare(res.canvasId, res.name)}
                className="text-xs font-heading font-bold text-accent border-b border-accent pb-0.5 hover:opacity-80 transition-colors"
              >
                {t.common.share}
              </button>
            )}
          </div>
        </div>
      ))}
      <div className="p-4 bg-green-50 border border-green-100 text-center">
        <p className="font-heading text-xs text-green-700 font-medium">{t.generate.success}</p>
      </div>
    </div>
  );
};
