"use client";

import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QRCodeEntry } from '@/app/lib/db';
import { downloadQR, shareQR } from '@/app/lib/utils';
import { useLanguage } from '@/app/lib/i18n';

interface QRDetailCardProps {
  entry: QRCodeEntry;
  onFullscreen: () => void;
  onEdit: () => void;
}

const QRDetailCard: React.FC<QRDetailCardProps> = ({ entry, onFullscreen, onEdit }) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, entry.content, {
        width: 200,
        margin: 1,
        color: { dark: '#141413', light: '#ffffff' }
      });
    }
  }, [entry.content]);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadQR(canvasRef.current, entry.name);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    shareQR(canvasRef.current, entry.name, entry.name);
  };

  return (
    <div className="flex flex-col bg-card border border-light-gray mb-4">
       <div className="p-4 border-b border-light-gray flex justify-between items-center">
         <span className="font-heading font-semibold text-sm text-text">{entry.name}</span>
         <div className="flex items-center gap-3">
            <span className="font-mono text-[10px] uppercase text-gray">{entry.type}</span>
            <button
              onClick={onEdit}
              className="font-heading text-[10px] font-bold uppercase text-text border border-light-gray px-2 py-1 hover:border-gray transition-colors"
            >
              {t.common.edit}
            </button>
         </div>
       </div>
       <div className="p-6 flex flex-col items-center cursor-pointer hover:bg-bg transition-colors" onClick={onFullscreen}>
          <canvas ref={canvasRef} className="w-40 h-40 mb-2" />
          <span className="text-[10px] text-gray uppercase tracking-widest mt-2">{t.library.clickToEnlarge}</span>
       </div>
       <div className="flex border-t border-light-gray">
          <button
            onClick={handleDownload}
            className={`flex-1 py-3 text-xs font-heading font-medium uppercase text-text hover:bg-light-gray/20 transition-colors ${'share' in navigator ? 'border-r border-light-gray' : ''}`}
          >
            {t.library.downloadPng}
          </button>
          {'share' in navigator && (
            <button
              onClick={handleShare}
              className="flex-1 py-3 text-xs font-heading font-medium uppercase text-accent hover:bg-light-gray/20 transition-colors"
            >
              {t.common.share}
            </button>
          )}
       </div>
    </div>
  );
};

export default QRDetailCard;
