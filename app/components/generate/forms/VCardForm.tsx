"use client";

import React, { useState, useRef } from 'react';
import { SmartInput } from '@/app/components/SmartInput';
import { resizeImage } from '@/app/lib/utils';
import { analyzeImage } from '@/app/lib/api';
import { useLanguage } from '@/app/lib/i18n';

interface VCardFormProps {
  firstName: string;
  setFirstName: (val: string) => void;
  lastName: string;
  setLastName: (val: string) => void;
  phone: string;
  setPhone: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  web: string;
  setWeb: (val: string) => void;
  company: string;
  setCompany: (val: string) => void;
  jobTitle: string;
  setJobTitle: (val: string) => void;
  setShowOptionals: (val: boolean) => void;
}

export const VCardForm: React.FC<VCardFormProps> = ({
  firstName, setFirstName, lastName, setLastName,
  phone, setPhone, email, setEmail, web, setWeb,
  company, setCompany, jobTitle, setJobTitle, setShowOptionals
}) => {
  const { t } = useLanguage();
  const [isScanningVCard, setIsScanningVCard] = useState(false);
  const vCardInputRef = useRef<HTMLInputElement>(null);

  const handleVCardScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsScanningVCard(true);

    try {
      const file = e.target.files[0];
      const resizedBase64 = await resizeImage(file);
      const base64Data = resizedBase64.split(',')[1];

      const text = await analyzeImage(
        base64Data,
        `Extract business card details into a JSON object with these exact keys: firstName, lastName, phone, email, website, company, jobTitle. If a field is missing, use empty string.`
      );
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.firstName) setFirstName(parsed.firstName);
        if (parsed.lastName) setLastName(parsed.lastName);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.website) setWeb(parsed.website);
        if (parsed.company) setCompany(parsed.company);
        if (parsed.jobTitle) setJobTitle(parsed.jobTitle);
        setShowOptionals(true);
      }
    } catch (err) {
      console.error("VCard Scan Error", err);
      alert(t.generate.ai.error);
    } finally {
      setIsScanningVCard(false);
      if (vCardInputRef.current) vCardInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Bulk VCard Scanner */}
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          ref={vCardInputRef}
          className="hidden"
          onChange={handleVCardScan}
        />
        <button
          onClick={() => vCardInputRef.current?.click()}
          disabled={isScanningVCard}
          className="w-full border border-dashed border-accent/50 bg-accent/5 py-4 flex items-center justify-center gap-2 text-accent text-xs font-heading font-semibold uppercase hover:bg-accent/10 transition-colors"
        >
          {isScanningVCard ? (
            <span className="animate-pulse">{t.generate.buttons.scanningVcard}</span>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              {t.generate.buttons.scanVcard}
            </>
          )}
        </button>
      </div>

      {/* Main Inputs */}
      <div className="mb-6 animate-in fade-in duration-300">
        <SmartInput
          label={t.generate.labels.firstName}
          value={firstName}
          onChange={setFirstName}
          placeholder={t.generate.placeholders.firstName}
          aiPrompt="Find the name in this image. Return only the text."
        />
        <div className="mt-4">
          <SmartInput
            label={t.generate.labels.lastName}
            value={lastName}
            onChange={setLastName}
            placeholder={t.generate.placeholders.lastName}
            aiPrompt="Find the surname in this image."
          />
        </div>
      </div>

      {/* VCard Fields (always visible) */}
      <div className="mb-8">
        <div className="space-y-6 pt-4 border-t border-light-gray animate-in slide-in-from-top-2 duration-300">
          <SmartInput label={t.generate.labels.phone} value={phone} onChange={setPhone} placeholder={t.generate.placeholders.phone} aiPrompt="Find phone number" type="tel" />
          <SmartInput label={t.generate.labels.email} value={email} onChange={setEmail} placeholder={t.generate.placeholders.email} aiPrompt="Find email" type="email" />
          <SmartInput label={t.generate.labels.web} value={web} onChange={setWeb} placeholder={t.generate.placeholders.web} aiPrompt="Find website" />
          <SmartInput label={t.generate.labels.company} value={company} onChange={setCompany} placeholder={t.generate.placeholders.company} aiPrompt="Find company name" />
          <SmartInput label={t.generate.labels.jobTitle} value={jobTitle} onChange={setJobTitle} placeholder={t.generate.placeholders.jobTitle} aiPrompt="Find job title" />
        </div>
      </div>
    </>
  );
};
