"use client";

import React from 'react';
import { Tab } from '@/app/types';
import { useLanguage } from '@/app/lib/i18n';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { t } = useLanguage();

  const tabs = [
    { id: Tab.GENERATE, label: t.tabs.generate },
    { id: Tab.SCAN, label: t.tabs.scan },
    { id: Tab.LIBRARY, label: t.tabs.library },
    { id: Tab.SETTINGS, label: t.tabs.settings },
  ];

  return (
    <nav className="fixed bottom-0 w-full max-w-[480px] bg-bg border-t border-light-gray z-20">
      <div className="flex justify-between items-center px-6 h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex flex-col items-center justify-center h-full
                font-heading text-xs font-medium lowercase tracking-wide transition-colors duration-200
                ${isActive ? 'text-accent' : 'text-gray hover:text-text'}
              `}
            >
              <span className={isActive ? 'border-b-2 border-accent pb-0.5' : 'pb-0.5 border-b-2 border-transparent'}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
