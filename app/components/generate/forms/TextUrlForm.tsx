"use client";

import React from 'react';
import { SmartInput } from '@/app/components/SmartInput';
import { useLanguage } from '@/app/lib/i18n';

interface TextUrlFormProps {
  type: 'text' | 'url';
  value: string;
  setValue: (val: string) => void;
  entryName: string;
  setEntryName: (val: string) => void;
  showOptionals: boolean;
  setShowOptionals: (val: boolean) => void;
  isEditing: boolean;
}

export const TextUrlForm: React.FC<TextUrlFormProps> = ({
  type, value, setValue, entryName, setEntryName,
  showOptionals, setShowOptionals, isEditing
}) => {
  const { t } = useLanguage();

  const isText = type === 'text';

  return (
    <>
      <div className="mb-6 animate-in fade-in duration-300">
        <SmartInput
          label={isText ? t.generate.labels.text : t.generate.labels.url}
          value={value}
          onChange={setValue}
          placeholder={isText ? t.generate.placeholders.text : t.generate.placeholders.url}
          isTextarea={isText}
          isMonospace={!isText}
          aiPrompt={isText
            ? "Extract the main text from this image. Return only the text, nothing else."
            : "Find the URL in this image. Return only the URL, nothing else."
          }
        />
      </div>

      <div className="mb-8">
        {!showOptionals && !isEditing ? (
          <button
            onClick={() => setShowOptionals(true)}
            className="text-xs font-heading font-medium text-gray hover:text-text transition-colors border-b border-gray pb-0.5"
          >
            {t.generate.buttons.addOptional}
          </button>
        ) : (
          <div className="space-y-6 pt-4 border-t border-light-gray animate-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-heading font-bold text-text uppercase">{t.generate.buttons.addOptional.replace('+', '').trim()}</span>
              {!isEditing && (
                <button
                  onClick={() => { setShowOptionals(false); setEntryName(''); }}
                  className="text-[10px] uppercase font-bold text-gray hover:text-[#c0392b]"
                >
                  {t.generate.buttons.removeOptional}
                </button>
              )}
            </div>
            <SmartInput
              label={t.generate.labels.entryName}
              value={entryName}
              onChange={setEntryName}
              placeholder={t.generate.placeholders.entryName}
              aiPrompt="Extract a short title or header from this image."
            />
          </div>
        )}
      </div>
    </>
  );
};
