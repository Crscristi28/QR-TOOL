"use client";

import React, { useState, useEffect } from 'react';
import { Tab } from '@/app/types';
import Layout from '@/app/components/Layout';
import Header from '@/app/components/Header';
import BottomNav from '@/app/components/BottomNav';
import GenerateView from '@/app/components/views/GenerateView';
import ScanView from '@/app/components/views/ScanView';
import LibraryView from '@/app/components/views/LibraryView';
import SettingsView from '@/app/components/views/SettingsView';
import AuthView from '@/app/components/views/AuthView';
import UnsavedChangesModal from '@/app/components/UnsavedChangesModal';
import { QRCodeEntry } from '@/app/lib/db';
import { useLanguage } from '@/app/lib/i18n';
import { useAuth } from '@/app/lib/auth';

const App: React.FC = () => {
  const { t } = useLanguage();
  const { user, loading } = useAuth();

  // App State
  const [activeTab, setActiveTab] = useState<Tab>(Tab.GENERATE);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editingCode, setEditingCode] = useState<QRCodeEntry | null>(null);

  // State for the custom modal
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);

  // Handle browser tab close / refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && activeTab === Tab.GENERATE && user) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, activeTab, user]);

  const handleTabChange = (newTab: Tab) => {
    if (activeTab === Tab.GENERATE && hasUnsavedChanges && newTab !== Tab.GENERATE) {
      setPendingTab(newTab);
      setShowUnsavedModal(true);
    } else {
      if (activeTab === Tab.GENERATE && newTab !== Tab.GENERATE) {
         setEditingCode(null);
      }
      setActiveTab(newTab);
    }
  };

  const handleDiscardChanges = () => {
    setShowUnsavedModal(false);
    setHasUnsavedChanges(false);
    setEditingCode(null);
    if (pendingTab) {
      setActiveTab(pendingTab);
      setPendingTab(null);
    }
  };

  const handleKeepEditing = () => {
    setShowUnsavedModal(false);
    setPendingTab(null);
  };

  const handleEditCode = (code: QRCodeEntry) => {
    setEditingCode(code);
    setActiveTab(Tab.GENERATE);
  };

  const handleEditComplete = () => {
    setEditingCode(null);
    setHasUnsavedChanges(false);
    setActiveTab(Tab.LIBRARY);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.GENERATE:
        return (
          <GenerateView
            setHasUnsavedChanges={setHasUnsavedChanges}
            editingCode={editingCode}
            onEditComplete={handleEditComplete}
          />
        );
      case Tab.SCAN:
        return <ScanView />;
      case Tab.LIBRARY:
        return <LibraryView onEdit={handleEditCode} />;
      case Tab.SETTINGS:
        return <SettingsView />;
    }
  };

  const getSubtitle = () => {
    switch (activeTab) {
      case Tab.GENERATE:
        return editingCode ? t.header.edit : t.header.create;
      case Tab.SCAN:
        return t.header.scan;
      case Tab.LIBRARY:
        return t.header.library;
      case Tab.SETTINGS:
        return t.header.settings;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full bg-bg">
          <p className="font-heading text-sm text-gray uppercase tracking-wider">{t.common.loading}</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Layout><AuthView /></Layout>;
  }

  // --- MAIN APP RENDER ---
  return (
    <Layout>
      <Header title={t.header.title} subtitle={getSubtitle()} />

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onDiscard={handleDiscardChanges}
        onKeepEditing={handleKeepEditing}
      />
    </Layout>
  );
};

export default App;
