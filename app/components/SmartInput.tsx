"use client";

import React, { useState, useRef } from 'react';
import { resizeImage } from '@/app/lib/utils';
import { analyzeImage } from '@/app/lib/api';
import { useLanguage } from '@/app/lib/i18n';

export interface SmartInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  isTextarea?: boolean;
  aiPrompt: string;
  isMonospace?: boolean;
  onScanComplete?: (text: string) => void;
  type?: string;
}

export const SmartInput: React.FC<SmartInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  isTextarea,
  aiPrompt,
  isMonospace,
  onScanComplete,
  type = 'text'
}) => {
  const { t } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const file = e.target.files[0];
    setAnalyzing(true);
    setError(false);

    try {
      const resizedBase64 = await resizeImage(file);
      const base64Data = resizedBase64.split(',')[1];

      const text = await analyzeImage(base64Data, aiPrompt);
      if (text && text.length > 0 && !text.toLowerCase().includes("sorry") && !text.toLowerCase().includes("cannot")) {
        if (onScanComplete) {
          onScanComplete(text);
        } else {
          onChange(text);
        }
      } else {
        throw new Error("No text found");
      }
    } catch (err) {
      console.error("AI Error", err);
      setError(true);
      setTimeout(() => setError(false), 3000);
    } finally {
      setAnalyzing(false);
      // Reset inputs
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (cameraInputRef.current) cameraInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <label className="text-xs font-heading font-semibold text-text uppercase tracking-wider">{label}</label>

      <div className="relative">
        {isTextarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={analyzing}
            rows={4}
            className={`w-full bg-card border border-light-gray p-4 font-body text-sm text-text placeholder-gray focus:outline-none focus:border-accent resize-none block ${isMonospace ? 'font-mono' : ''} ${analyzing ? 'text-gray opacity-50' : ''}`}
            placeholder={placeholder}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={analyzing}
            className={`w-full bg-card border border-light-gray p-4 text-sm text-text placeholder-gray focus:outline-none focus:border-accent block ${isMonospace ? 'font-mono' : 'font-body'} ${analyzing ? 'text-gray opacity-50' : ''}`}
            placeholder={placeholder}
          />
        )}
      </div>

      {analyzing && (
        <div className="text-accent font-heading text-xs font-bold uppercase tracking-wide animate-pulse mt-1">
          {t.generate.ai.analyzing}
        </div>
      )}

      {error && (
        <span className="text-[10px] text-[#c0392b] font-heading font-medium uppercase animate-pulse">
          {t.generate.ai.error}
        </span>
      )}

      <div className="flex gap-2 mt-1">
        <input
          type="file"
          ref={cameraInputRef}
          className="hidden"
          accept="image/*"
          capture="environment"
          onChange={handleImageUpload}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />

        <button
          onClick={() => cameraInputRef.current?.click()}
          className="flex-1 bg-transparent border border-light-gray py-2 text-[10px] font-heading font-semibold uppercase text-text hover:border-gray transition-colors"
        >
          {t.generate.buttons.takePhoto}
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-transparent border border-light-gray py-2 text-[10px] font-heading font-semibold uppercase text-text hover:border-gray transition-colors"
        >
          {t.generate.buttons.uploadPhoto}
        </button>
      </div>
    </div>
  );
};
