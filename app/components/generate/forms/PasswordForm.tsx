"use client";

import React from 'react';
import { SmartInput } from '@/app/components/SmartInput';
import { useLanguage } from '@/app/lib/i18n';

interface PasswordFormProps {
  password: string;
  setPassword: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  groupName: string;
  setGroupName: (val: string) => void;
  showOptionals: boolean;
  setShowOptionals: (val: boolean) => void;
  isEditing: boolean;
}

export const PasswordForm: React.FC<PasswordFormProps> = ({
  password, setPassword, username, setUsername, groupName, setGroupName,
  showOptionals, setShowOptionals, isEditing
}) => {
  const { t } = useLanguage();

  const handlePasswordScan = (rawText: string) => {
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : rawText;
      const data = JSON.parse(jsonString);

      if (data.password) setPassword(data.password);
      if (data.username) {
        setUsername(data.username);
        setShowOptionals(true);
      }
    } catch {
      setPassword(rawText);
    }
  };

  return (
    <>
      <div className="mb-6 animate-in fade-in duration-300">
        <SmartInput
          label={t.generate.labels.password}
          value={password}
          onChange={setPassword}
          placeholder={t.generate.placeholders.password}
          isMonospace
          aiPrompt={`Find the password and username/login in this image. Return ONLY a JSON object: { "password": "found password", "username": "found username" }.`}
          onScanComplete={handlePasswordScan}
        />
      </div>

      <div className="mb-8">
        {!showOptionals && !isEditing ? (
          <button
            onClick={() => setShowOptionals(true)}
            className="text-xs font-heading font-medium text-gray hover:text-text transition-colors border-b border-gray pb-0.5"
          >
            {t.generate.buttons.addOptional}
          </button>
        ) : (
          <div className="space-y-6 pt-4 border-t border-light-gray animate-in slide-in-from-top-2 duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-heading font-bold text-text uppercase">{t.generate.buttons.addOptional.replace('+', '').trim()}</span>
              {!isEditing && (
                <button
                  onClick={() => { setShowOptionals(false); setUsername(''); setGroupName(''); }}
                  className="text-[10px] uppercase font-bold text-gray hover:text-[#c0392b]"
                >
                  {t.generate.buttons.removeOptional}
                </button>
              )}
            </div>
            <SmartInput
              label={t.generate.labels.username}
              value={username}
              onChange={setUsername}
              placeholder={t.generate.placeholders.username}
              aiPrompt="Find the username or login in this image. Return only the username text, nothing else."
            />
            <SmartInput
              label={t.generate.labels.groupName}
              value={groupName}
              onChange={setGroupName}
              placeholder={t.generate.placeholders.groupName}
              aiPrompt="Extract the service name or company name from this image. Return only the text."
            />
          </div>
        )}
      </div>
    </>
  );
};
