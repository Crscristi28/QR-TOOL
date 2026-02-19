"use client";

import React from 'react';
import LanguageSection from '@/app/components/settings/LanguageSection';
import AccountSection from '@/app/components/settings/AccountSection';
import AboutSection from '@/app/components/settings/AboutSection';

const SettingsView: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 p-6 pb-20 animate-in fade-in duration-300">
      <LanguageSection />
      <AccountSection />
      <AboutSection />
    </div>
  );
};

export default SettingsView;
