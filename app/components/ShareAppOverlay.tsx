"use client";

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { shareQR } from '@/app/lib/utils';
import { useLanguage } from '@/app/lib/i18n';

const APP_URL = 'https://sqr.web.app';

interface ShareAppOverlayProps {
  onClose: () => void;
}

const ShareAppOverlay: React.FC<ShareAppOverlayProps> = ({ onClose }) => {
  const { t } = useLanguage();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fullscreenCanvasRef = useRef<HTMLCanvasElement>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, APP_URL, {
        width: 200,
        margin: 1,
        color: { dark: '#141413', light: '#ffffff' }
      });
    }
  }, []);

  useEffect(() => {
    if (fullscreen && fullscreenCanvasRef.current) {
      QRCode.toCanvas(fullscreenCanvasRef.current, APP_URL, {
        width: 1000,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H'
      });
    }
  }, [fullscreen]);

  const handleShare = (canvas: HTMLCanvasElement | null) => {
    shareQR(canvas, 'QR-Tool', 'QR Tool');
  };

  const handleOpenUrl = () => {
    window.open(APP_URL, '_blank');
  };

  if (fullscreen) {
    return (
      <div
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-[#ffffff] flex flex-col items-center justify-center w-screen h-screen touch-none"
      >
        <div className="absolute top-16 text-center w-full px-8 pointer-events-none">
          <h2 className="font-heading font-medium text-[14px] text-[#b0aea5] uppercase tracking-wide">
            QR Tool
          </h2>
        </div>

        <div className="relative w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white p-10 max-w-[85vw] max-h-[70vh] flex items-center justify-center">
            <canvas ref={fullscreenCanvasRef} className="w-[85vw] h-[85vw] max-w-[85vw] max-h-[85vw] object-contain block" />
          </div>
        </div>

        <div className="absolute bottom-16 flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <button
              onClick={(e) => { e.stopPropagation(); handleOpenUrl(); }}
              className="text-accent font-heading font-semibold text-xs border-b border-accent pb-0.5"
            >
              {t.scan.openUrl}
            </button>
            {'share' in navigator && (
              <button
                onClick={(e) => { e.stopPropagation(); handleShare(fullscreenCanvasRef.current); }}
                className="text-accent font-heading font-semibold text-xs border-b border-accent pb-0.5"
              >
                {t.common.share}
              </button>
            )}
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-[#141413] hover:opacity-70 transition-opacity z-50"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative bg-[#ffffff] border border-[#e8e6dc] w-72 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 flex flex-col items-center cursor-pointer hover:bg-bg transition-colors" onClick={() => setFullscreen(true)}>
          <canvas ref={canvasRef} className="w-40 h-40 mb-2" />
          <span className="text-[10px] text-gray uppercase tracking-widest mt-2">{t.library.clickToEnlarge}</span>
        </div>
        <div className="flex border-t border-[#e8e6dc]">
          <button
            onClick={handleOpenUrl}
            className="flex-1 py-3 text-xs font-heading font-medium uppercase text-text hover:bg-light-gray/20 transition-colors border-r border-[#e8e6dc]"
          >
            {t.scan.openUrl}
          </button>
          {'share' in navigator && (
            <button
              onClick={() => handleShare(canvasRef.current)}
              className="flex-1 py-3 text-xs font-heading font-medium uppercase text-accent hover:bg-light-gray/20 transition-colors"
            >
              {t.common.share}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareAppOverlay;
