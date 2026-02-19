"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/app/lib/i18n';

interface ScanFabProps {
  onScanQr: () => void;
  onScanBarcode: () => void;
  onMagicDecoder: () => void;
}

const ScanFab: React.FC<ScanFabProps> = ({ onScanQr, onScanBarcode, onMagicDecoder }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleOption = (action: () => void) => {
    setIsOpen(false);
    action();
  };

  return (
    <div ref={popupRef} className="fixed bottom-20 z-30 flex flex-col items-end" style={{ right: 'max(1rem, calc((100vw - 480px) / 2 + 1rem))' }}>
      {isOpen && (
        <div className="mb-2 w-48 bg-[#ffffff] border border-[#e8e6dc] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={() => handleOption(onScanQr)}
            className="w-full text-left px-3 py-2.5 hover:bg-[#faf9f5] transition-colors border-b border-[#e8e6dc]"
          >
            <span className="block font-heading font-semibold text-sm text-[#141413]">{t.fab.scanQr}</span>
            <span className="block font-body text-[11px] text-[#b0aea5]">{t.fab.scanQrDesc}</span>
          </button>
          <button
            onClick={() => handleOption(onScanBarcode)}
            className="w-full text-left px-3 py-2.5 hover:bg-[#faf9f5] transition-colors border-b border-[#e8e6dc]"
          >
            <span className="block font-heading font-semibold text-sm text-[#141413]">{t.fab.scanBarcode}</span>
            <span className="block font-body text-[11px] text-[#b0aea5]">{t.fab.scanBarcodeDesc}</span>
          </button>
          <button
            onClick={() => handleOption(onMagicDecoder)}
            className="w-full text-left px-3 py-2.5 hover:bg-[#faf9f5] transition-colors"
          >
            <span className="block font-heading font-semibold text-sm text-[#141413]">{t.fab.magicDecoder}</span>
            <span className="block font-body text-[11px] text-[#b0aea5]">{t.fab.magicDecoderDesc}</span>
          </button>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-auto block px-5 py-3 bg-[#d97757] text-[#faf9f5] font-heading font-semibold text-sm tracking-wide hover:opacity-90 transition-opacity"
      >
        {t.fab.scan}
      </button>
    </div>
  );
};

export default ScanFab;
