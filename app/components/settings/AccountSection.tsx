"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/app/lib/i18n';
import { useAuth } from '@/app/lib/auth';

const AccountSection: React.FC = () => {
  const { t } = useLanguage();
  const { user, logout, deleteAccount } = useAuth();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      setError(t.auth.errorGeneric);
    }
  };

  const handleDeleteAccount = async () => {
    setError('');
    setIsDeleting(true);
    try {
      await deleteAccount();
    } catch {
      setError(t.auth.errorReauthRequired);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-heading text-xs font-semibold text-gray uppercase tracking-wider">{t.settings.account}</h3>

      <div className="flex flex-col gap-4">
        <input
          type="email"
          value={user?.email || ''}
          disabled
          readOnly
          className="w-full bg-bg border border-light-gray p-4 font-body text-sm text-gray focus:outline-none cursor-not-allowed"
        />

        {error && (
          <div className="p-3 border border-accent bg-bg">
            <p className="font-body text-xs text-accent">{error}</p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full bg-transparent border border-light-gray text-text py-4 font-heading font-medium tracking-wide uppercase text-xs hover:bg-light-gray/20 transition-colors"
        >
          {t.settings.logout}
        </button>

        {showDeleteConfirm ? (
          <div className="flex flex-col gap-2">
            <p className="font-body text-xs text-accent text-center">{t.settings.deleteConfirm}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 bg-transparent border border-light-gray text-text py-3 font-heading font-medium tracking-wide uppercase text-xs hover:bg-light-gray/20 transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="flex-1 bg-accent text-bg py-3 font-heading font-medium tracking-wide uppercase text-xs hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {isDeleting ? t.common.loading : t.common.delete}
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full bg-transparent border border-light-gray text-accent py-4 font-heading font-medium tracking-wide uppercase text-xs hover:border-accent transition-colors"
          >
            {t.settings.deleteAccount}
          </button>
        )}
      </div>
    </div>
  );
};

export default AccountSection;
