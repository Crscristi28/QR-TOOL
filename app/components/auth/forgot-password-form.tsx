"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/lib/i18n";
import { useAuth } from "@/app/lib/auth";
import { getAuthErrorMessage } from "@/app/lib/auth-errors";
import { AuthErrorBanner } from "@/app/components/auth/auth-error-banner";
import { AuthView } from "@/app/types";

interface ForgotPasswordFormProps {
  onViewChange: (view: AuthView) => void;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onViewChange }) => {
  const { t } = useLanguage();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleResetPassword = async () => {
    setError("");
    if (!email) {
      setError(t.auth.errorFillFields);
      return;
    }
    setIsLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
    } catch (err) {
      setError(getAuthErrorMessage(err, t));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-8 justify-center animate-in fade-in duration-500 bg-bg">
      <button
        onClick={() => onViewChange("login")}
        className="self-start mb-12 text-accent font-heading font-semibold text-sm flex items-center gap-1 hover:opacity-80 transition-opacity"
      >
        {t.auth.backToLogin}
      </button>

      <div className="mb-8">
        <h2 className="font-heading font-semibold text-2xl text-text mb-2">{t.auth.resetTitle}</h2>
        <p className="font-body text-gray text-sm leading-relaxed">{t.auth.resetSubtitle}</p>
      </div>

      <AuthErrorBanner error={error} />

      {resetSent ? (
        <div className="p-4 border border-accent bg-bg">
          <p className="font-body text-xs text-text">{t.auth.resetSent}</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 mb-8">
            <label className="text-xs font-heading font-semibold text-text uppercase tracking-wider">{t.auth.emailLabel}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.auth.emailPlaceholder}
              className="w-full bg-card border border-light-gray p-4 text-sm text-text placeholder-gray focus:outline-none focus:border-accent font-body transition-colors"
            />
          </div>

          <button
            onClick={handleResetPassword}
            disabled={isLoading}
            className="w-full bg-text text-bg py-4 font-heading font-medium tracking-wide uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isLoading ? t.common.loading : t.auth.resetButton}
          </button>
        </>
      )}
    </div>
  );
};
