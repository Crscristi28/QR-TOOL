"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/lib/i18n";
import { useAuth } from "@/app/lib/auth";
import { LoginForm } from "@/app/components/auth/login-form";
import { RegisterForm } from "@/app/components/auth/register-form";
import { ForgotPasswordForm } from "@/app/components/auth/forgot-password-form";
import { AuthView as AuthViewType } from "@/app/types";

const AuthView: React.FC = () => {
  const { t } = useLanguage();
  const { checkEmailVerification } = useAuth();
  const [view, setView] = useState<AuthViewType>("login");
  const [verifyError, setVerifyError] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);

  const handleCheckVerification = async () => {
    setVerifyError("");
    setVerifyLoading(true);
    try {
      const verified = await checkEmailVerification();
      if (!verified) {
        setVerifyError(t.auth.errorEmailNotVerified);
      }
    } catch {
      setVerifyError(t.auth.errorGeneric);
    } finally {
      setVerifyLoading(false);
    }
  };

  if (view === "verify-email") {
    return (
      <div className="flex flex-col h-full p-8 justify-center animate-in fade-in duration-500 bg-bg">
        <div className="mb-8">
          <h2 className="font-heading font-semibold text-2xl text-text mb-2">
            {t.auth.verifyTitle}
          </h2>
          <p className="font-body text-gray text-sm leading-relaxed">
            {t.auth.verificationSent}
          </p>
        </div>
        {verifyError && (
          <div className="mb-4 p-3 border border-accent bg-bg">
            <p className="font-body text-xs text-accent">{verifyError}</p>
          </div>
        )}
        <button
          onClick={handleCheckVerification}
          disabled={verifyLoading}
          className="w-full bg-text text-bg py-4 font-heading font-medium tracking-wide uppercase text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {verifyLoading ? t.common.loading : t.auth.continueButton}
        </button>
      </div>
    );
  }

  switch (view) {
    case "forgot":
      return <ForgotPasswordForm onViewChange={setView} />;
    case "register":
      return <RegisterForm onViewChange={setView} />;
    default:
      return <LoginForm onViewChange={setView} />;
  }
};

export default AuthView;
