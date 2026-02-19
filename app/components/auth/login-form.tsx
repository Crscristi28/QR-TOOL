"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/lib/i18n";
import { useAuth } from "@/app/lib/auth";
import { getAuthErrorMessage } from "@/app/lib/auth-errors";
import { AuthErrorBanner } from "@/app/components/auth/auth-error-banner";
import { PasswordInput } from "@/app/components/ui/password-input";
import { AuthView } from "@/app/types";

interface LoginFormProps {
  onViewChange: (view: AuthView) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onViewChange }) => {
  const { t } = useLanguage();
  const { signInWithGoogle, signInWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError("");
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      const msg = getAuthErrorMessage(err, t);
      if (msg) setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async () => {
    setError("");
    if (!email || !password) {
      setError(t.auth.errorFillFields);
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
    } catch (err) {
      setError(getAuthErrorMessage(err, t));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-8 justify-center animate-in fade-in duration-500 bg-bg">
      <div className="mb-12">
        <h1 className="font-heading font-semibold text-[40px] leading-tight text-text tracking-tight mb-2">
          {t.auth.loginTitle}
        </h1>
        <p className="font-body text-gray text-lg">{t.auth.loginSubtitle}</p>
      </div>

      <AuthErrorBanner error={error} />

      <button
        onClick={handleGoogleLogin}
        disabled={isLoading}
        className="w-full bg-text text-bg py-4 px-4 flex items-center justify-center gap-3 hover:opacity-90 transition-opacity mb-8 group disabled:opacity-50"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-bg">
          <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .533 5.333.533 12S5.867 24 12.48 24c3.44 0 6.1-1.147 8.16-3.293 2.133-2.133 2.773-5.307 2.773-7.92 0-.667-.053-1.28-.16-1.867h-10.773z" />
        </svg>
        <span className="font-heading font-medium tracking-wide uppercase text-sm">{t.auth.googleLogin}</span>
      </button>

      <div className="relative flex items-center justify-center mb-8">
        <div className="absolute w-full h-px bg-light-gray"></div>
        <span className="relative bg-bg px-4 text-xs font-heading font-medium text-gray uppercase tracking-widest">
          {t.common.or}
        </span>
      </div>

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
      </div>

      <button
        onClick={handleEmailLogin}
        disabled={isLoading}
        className="w-full bg-transparent border border-light-gray text-text py-4 font-heading font-medium tracking-wide uppercase text-sm hover:border-gray transition-colors mb-4 disabled:opacity-50"
      >
        {isLoading ? t.common.loading : t.auth.loginButton}
      </button>

      <button
        onClick={() => onViewChange("forgot")}
        className="font-heading text-xs text-gray hover:text-text transition-colors mb-8"
      >
        {t.auth.forgotPassword}
      </button>

      <button onClick={() => onViewChange("register")} className="text-center group mt-auto">
        <p className="font-heading text-xs text-text">
          {t.auth.noAccount}{" "}
          <span className="text-accent font-semibold group-hover:text-accent-hover transition-colors border-b border-transparent group-hover:border-accent-hover">
            {t.auth.registerLink}
          </span>
        </p>
      </button>
    </div>
  );
};
