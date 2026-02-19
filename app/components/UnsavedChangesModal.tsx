"use client";

import React from 'react';
import { useLanguage } from '@/app/lib/i18n';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onDiscard: () => void;
  onKeepEditing: () => void;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onDiscard,
  onKeepEditing
}) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text/20 backdrop-blur-[2px] animate-in fade-in duration-200">
      <div className="w-[85%] max-w-sm bg-bg border border-light-gray shadow-xl p-6 animate-in zoom-in-95 duration-200">
        <h3 className="font-heading font-semibold text-lg text-text mb-2">
          {t.modal.unsavedTitle}
        </h3>
        <p className="font-body text-sm text-gray mb-6 leading-relaxed">
          {t.modal.unsavedBody}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onKeepEditing}
            className="w-full bg-accent text-white py-3 font-heading font-medium tracking-wide uppercase text-xs hover:bg-accent-hover transition-colors"
          >
            {t.modal.keepEditing}
          </button>

          <button
            onClick={onDiscard}
            className="w-full bg-transparent border border-light-gray text-text py-3 font-heading font-medium tracking-wide uppercase text-xs hover:border-red-200 hover:text-red-600 transition-colors"
          >
            {t.modal.discard}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;
