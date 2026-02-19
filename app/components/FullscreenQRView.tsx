"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import QRCode from 'qrcode';
import { QRCodeEntry } from '@/app/lib/db';
import { shareQR } from '@/app/lib/utils';
import { useLanguage } from '@/app/lib/i18n';

interface FullscreenQRViewProps {
  initialCode: QRCodeEntry;
  allCodes: QRCodeEntry[];
  onClose: () => void;
}

const FullscreenQRView: React.FC<FullscreenQRViewProps> = ({ initialCode, allCodes, onClose }) => {
  const { t } = useLanguage();
  const [currentCode, setCurrentCode] = useState<QRCodeEntry>(initialCode);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStartX = useRef<number | null>(null);

  const groupContext = useMemo(() => {
    const siblings = allCodes.sort((a, b) => a.id.localeCompare(b.id));
    const index = siblings.findIndex(c => c.id === currentCode.id);
    return { siblings, index };
  }, [currentCode, allCodes]);

  const { siblings, index } = groupContext;
  const hasMultiple = siblings.length > 1;

  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.warn('Wake Lock error', err);
      }
    };
    requestWakeLock();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') requestWakeLock();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      wakeLock?.release();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current && currentCode.content) {
      QRCode.toCanvas(canvasRef.current, currentCode.content, {
        width: 1000,
        margin: 1,
        color: { dark: '#000000', light: '#ffffff' },
        errorCorrectionLevel: 'H'
      });
    }
  }, [currentCode]);

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (index < siblings.length - 1) setCurrentCode(siblings[index + 1]);
    else setCurrentCode(siblings[0]);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (index > 0) setCurrentCode(siblings[index - 1]);
    else setCurrentCode(siblings[siblings.length - 1]);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !hasMultiple) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    touchStartX.current = null;
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    shareQR(canvasRef.current, currentCode.name, currentCode.name);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-[#ffffff] flex flex-col items-center justify-center w-screen h-screen touch-none"
    >
      <div className="absolute top-16 text-center w-full px-8 pointer-events-none">
        <h2 className="font-heading font-medium text-[14px] text-[#b0aea5] uppercase tracking-wide break-words">
          {currentCode.name}
        </h2>
      </div>

      <div
        className="relative w-full flex items-center justify-center"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={(e) => e.stopPropagation()}
      >
        {hasMultiple && (
          <button onClick={handlePrev} className="absolute left-2 p-4 text-[#b0aea5] hover:text-[#141413] transition-colors z-20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
        )}
        <div className="bg-white p-10 max-w-[85vw] max-h-[70vh] flex items-center justify-center shadow-none">
          <canvas ref={canvasRef} className="w-[85vw] h-[85vw] max-w-[85vw] max-h-[85vw] object-contain block" />
        </div>
        {hasMultiple && (
          <button onClick={handleNext} className="absolute right-2 p-4 text-[#b0aea5] hover:text-[#141413] transition-colors z-20">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        )}
      </div>

      <div className="absolute bottom-16 flex flex-col items-center pointer-events-none gap-4">
        <p className="font-mono text-xs uppercase text-[#141413] tracking-widest bg-light-gray/30 px-2 py-1">
          {currentCode.type}
        </p>

        {'share' in navigator && (
           <button
             onClick={handleShare}
             className="pointer-events-auto text-accent font-heading font-semibold text-xs border-b border-accent pb-0.5"
           >
             {t.common.share}
           </button>
        )}

        {hasMultiple && (
          <div className="flex gap-2 mt-2">
            {siblings.map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 ${i === index ? 'bg-accent' : 'bg-light-gray'}`} style={{ borderRadius: '50%' }} />
            ))}
          </div>
        )}
      </div>

      <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center text-[#141413] hover:opacity-70 transition-opacity z-50">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>
    </div>
  );
};

export default FullscreenQRView;
