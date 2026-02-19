"use client";

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QRCodeEntry } from '@/app/lib/db';
import { downloadQR, shareQR } from '@/app/lib/utils';
import { useLanguage } from '@/app/lib/i18n';

interface QRDetailCardProps {
  entry: QRCodeEntry;
  onFullscreen: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const QRDetailCard: React.FC<QRDetailCardProps> = ({ entry, onFullscreen, onEdit, onDelete }) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showConfirm, setShowConfirm] = useState(false);

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
            <button
              onClick={() => setShowConfirm(true)}
              className="font-heading text-[10px] font-bold uppercase text-[#c4654a] border border-[#c4654a] px-2 py-1 hover:bg-[#c4654a] hover:text-white transition-colors"
            >
              {t.common.delete}
            </button>
         </div>
       </div>

       {showConfirm && (
         <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowConfirm(false)}>
           <div className="absolute inset-0 bg-black/30" />
           <div
             className="relative bg-[#ffffff] border border-[#e8e6dc] p-6 w-72 animate-in fade-in zoom-in-95 duration-150"
             onClick={(e) => e.stopPropagation()}
           >
             <p className="font-heading text-sm font-semibold text-text text-center mb-5">{t.library.confirmDeleteEntry}</p>
             <div className="flex gap-3">
               <button
                 onClick={() => setShowConfirm(false)}
                 className="flex-1 py-2.5 border border-light-gray text-text text-xs font-heading font-medium uppercase hover:bg-light-gray/50 transition-colors"
               >
                 {t.common.cancel}
               </button>
               <button
                 onClick={onDelete}
                 className="flex-1 py-2.5 bg-[#c4654a] text-white text-xs font-heading font-medium uppercase hover:opacity-90 border border-[#c4654a] transition-colors"
               >
                 {t.common.delete}
               </button>
             </div>
           </div>
         </div>
       )}
       <div className="p-6 flex flex-col items-center cursor-pointer hover:bg-bg transition-colors" onClick={onFullscreen}>
          <canvas ref={canvasRef} className="w-40 h-40 mb-2" />
          <span className="text-[10px] text-gray uppercase tracking-widest mt-2">{t.library.clickToEnlarge}</span>
       </div>
       <div className="flex border-t border-light-gray">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 text-xs font-heading font-medium uppercase text-text hover:bg-light-gray/20 transition-colors border-r border-light-gray"
          >
            {t.library.downloadPng}
          </button>
          {entry.type === 'url' && (
            <button
              onClick={(e) => { e.stopPropagation(); window.open(entry.content, '_blank'); }}
              className="flex-1 py-3 text-xs font-heading font-medium uppercase text-text hover:bg-light-gray/20 transition-colors border-r border-light-gray"
            >
              {t.scan.openUrl}
            </button>
          )}
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
