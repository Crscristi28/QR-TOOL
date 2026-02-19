"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/lib/i18n";
import { useAuth } from "@/app/lib/auth";
import { getAuthErrorMessage } from "@/app/lib/auth-errors";
import { AuthErrorBanner } from "@/app/components/auth/auth-error-banner";
import { PasswordInput } from "@/app/components/ui/password-input";
import { AuthView } from "@/app/types";

interface RegisterFormProps {
  onViewChange: (view: AuthView) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onViewChange }) => {
  const { t } = useLanguage();
  const { signUpWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async () => {
    setError("");
    if (!email || !password || !confirmPassword) {
      setError(t.auth.errorFillFields);
      return;
    }
    if (password !== confirmPassword) {
      setError(t.auth.errorPasswordMismatch);
      return;
    }
    if (password.length < 6) {
      setError(t.auth.errorWeakPassword);
      return;
    }
    setIsLoading(true);
    try {
      await signUpWithEmail(email, password);
      onViewChange("verify-email");
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
        <h2 className="font-heading font-semibold text-2xl text-text mb-2">{t.auth.registerTitle}</h2>
        <p className="font-body text-gray text-sm leading-relaxed">{t.auth.registerSubtitle}</p>
      </div>

      <AuthErrorBanner error={error} />

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-heading font-semibold text-text uppercase tracking-wider">{t.auth.emailLabel}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t.auth.emailPlaceholder}
            className="w-full bg-card border border-light-gray p-4 text-sm text-text placeholder-gray focus:outline-none focus:border-accent font-body transition-colors"
          />
        </div>
        <PasswordInput
          value={password}
          onChange={setPassword}
          placeholder={t.auth.passwordPlaceholder}
          label={t.auth.passwordLabel}
        />
        <PasswordInput
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder={t.auth.passwordPlaceholder}
          label={t.auth.confirmPasswordLabel}
          hint={passwordMismatch ? t.auth.errorPasswordMismatch : undefined}
        />
      </div>

      <button
        onClick={handleRegister}
        disabled={isLoading || passwordMismatch}
        className="w-full bg-text text-bg py-4 font-heading font-medium tracking-wide uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {isLoading ? t.common.loading : t.auth.registerButton}
      </button>
    </div>
  );
};
