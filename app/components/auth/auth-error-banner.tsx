"use client";

import React from "react";

interface AuthErrorBannerProps {
  error: string;
}

export const AuthErrorBanner: React.FC<AuthErrorBannerProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-4 p-3 border border-accent bg-bg">
      <p className="font-body text-xs text-accent">{error}</p>
    </div>
  );
};
