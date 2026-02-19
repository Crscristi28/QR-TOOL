"use client";

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { addQRCode, updateQRCode, QRCodeEntry } from '@/app/lib/db';
import { downloadQR, shareQR } from '@/app/lib/utils';
import { buildQRContent } from '@/app/lib/qrContent';
import { useLanguage } from '@/app/lib/i18n';
import UnsavedChangesModal from '@/app/components/UnsavedChangesModal';
import { QRResultDisplay } from '@/app/components/generate/QRResultDisplay';
import { TypeGrid } from '@/app/components/generate/TypeGrid';
import { TextUrlForm } from '@/app/components/generate/forms/TextUrlForm';
import { WiFiForm } from '@/app/components/generate/forms/WiFiForm';
import { PasswordForm } from '@/app/components/generate/forms/PasswordForm';
import { VCardForm } from '@/app/components/generate/forms/VCardForm';

import { ContentType, WifiEncryption } from '@/app/types';

interface GenerateViewProps {
  setHasUnsavedChanges?: (hasChanges: boolean) => void;
  setShowFab?: (show: boolean) => void;
  editingCode?: QRCodeEntry | null;
  onEditComplete?: () => void;
}

const GenerateView: React.FC<GenerateViewProps> = ({
  setHasUnsavedChanges,
  setShowFab,
  editingCode,
  onEditComplete
}) => {
  const { t } = useLanguage();

  const [activeType, setActiveType] = useState<ContentType | null>(null);
  const [generated, setGenerated] = useState(false);
  const [generatedResults, setGeneratedResults] = useState<{name: string, type: string, canvasId: string}[]>([]);

  // Inputs
  const [mainValue, setMainValue] = useState('');
  const [secondaryValue, setSecondaryValue] = useState('');
  const [entryName, setEntryName] = useState('');
  const [showOptionals, setShowOptionals] = useState(false);

  // WiFi Specific
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState<WifiEncryption>('WPA/WPA2');

  // VCard Specific
  const [vCardPhone, setVCardPhone] = useState('');
  const [vCardEmail, setVCardEmail] = useState('');
  const [vCardWeb, setVCardWeb] = useState('');
  const [vCardCompany, setVCardCompany] = useState('');
  const [vCardTitle, setVCardTitle] = useState('');

  // Type switching protection
  const [showTypeChangeModal, setShowTypeChangeModal] = useState(false);
  const [pendingType, setPendingType] = useState<ContentType | null>(null);

  const types: { id: ContentType; label: string; description: string }[] = [
    { id: 'text', label: t.generate.types.text, description: t.generate.descriptions.text },
    { id: 'url', label: t.generate.types.url, description: t.generate.descriptions.url },
    { id: 'wifi', label: t.generate.types.wifi, description: t.generate.descriptions.wifi },
    { id: 'password', label: t.generate.types.password, description: t.generate.descriptions.password },
    { id: 'vcard', label: t.generate.types.vcard, description: t.generate.descriptions.vcard },
  ];

  // POPULATE FORM IF EDITING
  useEffect(() => {
    if (editingCode) {
      setActiveType(editingCode.type);
      setEntryName(editingCode.name);

      const content = editingCode.content;

      if (editingCode.type === 'text' || editingCode.type === 'url') {
        setMainValue(content);
      }
      else if (editingCode.type === 'wifi') {
        const ssidMatch = content.match(/S:([^;]+)/);
        const passMatch = content.match(/P:([^;]+)/);
        const typeMatch = content.match(/T:([^;]+)/);

        if (ssidMatch) setWifiSsid(ssidMatch[1]);
        if (passMatch) setMainValue(passMatch[1]);
        if (typeMatch) {
          const t = typeMatch[1];
          setWifiEncryption(t === 'nopass' ? 'None' : t === 'WEP' ? 'WEP' : 'WPA/WPA2');
        }
        setShowOptionals(true);
      }
      else if (editingCode.type === 'password') {
        try {
           setMainValue(content);
        } catch (e) {
           setMainValue(content);
        }
      }
      else if (editingCode.type === 'vcard') {
        const nMatch = content.match(/N:([^;]*);([^;]*)/);
        const phoneMatch = content.match(/TEL;TYPE=CELL:(.*)/) || content.match(/TEL:(.*)/);
        const emailMatch = content.match(/EMAIL:(.*)/);
        const urlMatch = content.match(/URL:(.*)/);
        const orgMatch = content.match(/ORG:(.*)/);
        const titleMatch = content.match(/TITLE:(.*)/);

        if (nMatch) {
          setSecondaryValue(nMatch[1]);
          setMainValue(nMatch[2]);
        }
        if (phoneMatch) setVCardPhone(phoneMatch[1]);
        if (emailMatch) setVCardEmail(emailMatch[1]);
        if (urlMatch) setVCardWeb(urlMatch[1]);
        if (orgMatch) setVCardCompany(orgMatch[1]);
        if (titleMatch) setVCardTitle(titleMatch[1]);
        setShowOptionals(true);
      }
    }
  }, [editingCode]);


  // Helper to check dirty state
  const getIsDirty = () => {
    if (generated) return false;

    switch (activeType) {
      case 'text':
      case 'url':
        return mainValue.length > 0 || entryName.length > 0;
      case 'wifi':
        return mainValue.length > 0 || wifiSsid.length > 0;
      case 'password':
        return mainValue.length > 0 || secondaryValue.length > 0 || entryName.length > 0;
      case 'vcard':
        return mainValue.length > 0 || secondaryValue.length > 0 || vCardPhone.length > 0 || vCardEmail.length > 0;
      default:
        return false;
    }
  };

  // Track dirty state
  useEffect(() => {
    if (!setHasUnsavedChanges) return;
    if (editingCode) {
       setHasUnsavedChanges(true);
       return;
    }
    setHasUnsavedChanges(getIsDirty());
  }, [mainValue, secondaryValue, entryName, wifiSsid, vCardPhone, vCardEmail, vCardWeb, vCardCompany, vCardTitle, activeType, generated, setHasUnsavedChanges, editingCode]);

  // Report grid visibility to parent (FAB shows only on grid)
  useEffect(() => {
    if (!setShowFab) return;
    setShowFab(!activeType && !editingCode);
  }, [activeType, editingCode, setShowFab]);

  // Reset state on type change (ONLY if not editing)
  useEffect(() => {
    if (editingCode) return;

    setMainValue('');
    setSecondaryValue('');
    setEntryName('');
    setWifiSsid('');
    setWifiEncryption('WPA/WPA2');
    setVCardPhone('');
    setVCardEmail('');
    setVCardWeb('');
    setVCardCompany('');
    setVCardTitle('');
    setShowOptionals(false);
    setGenerated(false);
    setGeneratedResults([]);
  }, [activeType]);

  const handleSelectType = (newType: ContentType) => {
    setActiveType(newType);
  };

  const handleBack = () => {
    if (getIsDirty()) {
      setPendingType(null);
      setShowTypeChangeModal(true);
    } else {
      setActiveType(null);
    }
  };

  const handleDiscardTypeChange = () => {
    if (pendingType) {
      setActiveType(pendingType);
    } else {
      setActiveType(null);
    }
    setPendingType(null);
    setShowTypeChangeModal(false);
  };

  const handleKeepEditingTypeChange = () => {
    setPendingType(null);
    setShowTypeChangeModal(false);
  };

  const handleAction = async () => {
    if (generated && !editingCode) {
      setMainValue('');
      setSecondaryValue('');
      setEntryName('');
      setWifiSsid('');
      setWifiEncryption('WPA/WPA2');
      setVCardPhone('');
      setVCardEmail('');
      setVCardWeb('');
      setVCardCompany('');
      setVCardTitle('');
      setShowOptionals(false);
      setGenerated(false);
      setGeneratedResults([]);
      setActiveType(null);
      return;
    }

    if (!activeType) return;
    if (!mainValue && activeType !== 'wifi' && activeType !== 'vcard') return;
    if (activeType === 'vcard' && !mainValue && !secondaryValue) return;

    const { content, name } = buildQRContent(activeType, {
      mainValue, secondaryValue, entryName, wifiSsid, wifiEncryption,
      vCardPhone, vCardEmail, vCardWeb, vCardCompany, vCardTitle
    }, t);
    const timestamp = editingCode ? editingCode.createdAt : Date.now();

    if (editingCode) {
       await updateQRCode({
         ...editingCode,
         name,
         content,
         type: activeType
       });

       if (onEditComplete) onEditComplete();

    } else {
       const results: {name: string, type: string, canvasId: string, content: string, dbType: ContentType, groupName?: string, group?: string}[] = [];
       const groupId = (secondaryValue && activeType === 'password') ? `group-${timestamp}` : undefined;
       const finalGroupName = entryName || t.common.unknown;

       if (activeType === 'password' && secondaryValue) {
          results.push({
            name: t.generate.labels.username,
            type: 'Username',
            canvasId: 'canvas-user',
            content: secondaryValue,
            dbType: 'text',
            group: groupId,
            groupName: finalGroupName
          });
          results.push({
            name: t.generate.labels.password,
            type: 'Password',
            canvasId: 'canvas-pass',
            content: mainValue,
            dbType: 'password',
            group: groupId,
            groupName: finalGroupName
          });
       } else {
          results.push({
            name,
            type: activeType === 'url' ? t.generate.types.url : activeType === 'wifi' ? t.generate.types.wifi : activeType === 'vcard' ? t.generate.types.vcard : activeType === 'password' ? t.generate.types.password : t.generate.types.text,
            canvasId: 'canvas-main',
            content,
            dbType: activeType
          });
       }

       setGeneratedResults(results);
       setGenerated(true);

       setTimeout(async () => {
        for (const res of results) {
          const canvas = document.getElementById(res.canvasId) as HTMLCanvasElement;
          if (canvas) {
            await QRCode.toCanvas(canvas, res.content, {
              width: 260,
              margin: 1,
              color: { dark: '#141413', light: '#ffffff' },
            });
          }
          await addQRCode({
            type: res.dbType,
            name: res.name,
            content: res.content,
            group: res.group,
            groupName: res.groupName,
            createdAt: timestamp
          });
        }
      }, 100);
    }
  };

  const handleDownload = (canvasId: string, name: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    downloadQR(canvas, name);
  };

  const handleShare = async (canvasId: string, name: string) => {
    const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    if (canvas && typeof navigator.share === 'function') {
       await shareQR(canvas, name, 'QR Kód');
    } else {
       handleDownload(canvasId, name);
    }
  };

  // Grid view — no type selected yet
  if (!activeType && !editingCode) {
    return (
      <div className="flex flex-col p-6 pb-8">
        <TypeGrid types={types} onSelect={handleSelectType} />
      </div>
    );
  }

  return (
    <div className="flex flex-col p-6 pb-8">
      {/* Back button (only when not editing an existing code) */}
      {!editingCode && !generated && (
        <button
          onClick={handleBack}
          className="text-accent font-heading font-semibold text-sm flex items-center gap-1 hover:opacity-80 transition-opacity mb-6"
        >
          ← {t.common.back}
        </button>
      )}

      {!generated ? (
        <>
          {(activeType === 'text' || activeType === 'url') && (
            <TextUrlForm
              type={activeType as 'text' | 'url'}
              value={mainValue}
              setValue={setMainValue}
              entryName={entryName}
              setEntryName={setEntryName}
              showOptionals={showOptionals}
              setShowOptionals={setShowOptionals}
              isEditing={!!editingCode}
            />
          )}

          {activeType === 'wifi' && (
            <WiFiForm
              password={mainValue}
              setPassword={setMainValue}
              ssid={wifiSsid}
              setSsid={setWifiSsid}
              encryption={wifiEncryption}
              setEncryption={setWifiEncryption}
              showOptionals={showOptionals}
              setShowOptionals={setShowOptionals}
              isEditing={!!editingCode}
            />
          )}

          {activeType === 'password' && (
            <PasswordForm
              password={mainValue}
              setPassword={setMainValue}
              username={secondaryValue}
              setUsername={setSecondaryValue}
              groupName={entryName}
              setGroupName={setEntryName}
              showOptionals={showOptionals}
              setShowOptionals={setShowOptionals}
              isEditing={!!editingCode}
            />
          )}

          {activeType === 'vcard' && (
            <VCardForm
              firstName={mainValue}
              setFirstName={setMainValue}
              lastName={secondaryValue}
              setLastName={setSecondaryValue}
              phone={vCardPhone}
              setPhone={setVCardPhone}
              email={vCardEmail}
              setEmail={setVCardEmail}
              web={vCardWeb}
              setWeb={setVCardWeb}
              company={vCardCompany}
              setCompany={setVCardCompany}
              jobTitle={vCardTitle}
              setJobTitle={setVCardTitle}
              setShowOptionals={setShowOptionals}
            />
          )}
        </>
      ) : (
        <QRResultDisplay
          results={generatedResults}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      )}

      {/* Main Action Button */}
      <button
        onClick={handleAction}
        className={`
          w-full py-4 font-heading font-medium tracking-wide uppercase text-sm transition-all duration-200
          ${generated
            ? 'bg-accent text-white hover:bg-accent-hover'
            : 'bg-text text-bg hover:opacity-90'}
        `}
      >
        {editingCode
           ? t.generate.buttons.saveChanges
           : generated
              ? t.generate.buttons.generateNew
              : t.generate.buttons.generate}
      </button>

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={showTypeChangeModal}
        onDiscard={handleDiscardTypeChange}
        onKeepEditing={handleKeepEditingTypeChange}
      />
    </div>
  );
};

export default GenerateView;
