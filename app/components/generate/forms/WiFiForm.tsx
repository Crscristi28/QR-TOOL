"use client";

import React from 'react';
import { SmartInput } from '@/app/components/SmartInput';
import { useLanguage } from '@/app/lib/i18n';
import { WifiEncryption } from '@/app/types';

interface WiFiFormProps {
  password: string;
  setPassword: (val: string) => void;
  ssid: string;
  setSsid: (val: string) => void;
  encryption: WifiEncryption;
  setEncryption: (val: WifiEncryption) => void;
  showOptionals: boolean;
  setShowOptionals: (val: boolean) => void;
  isEditing: boolean;
}

export const WiFiForm: React.FC<WiFiFormProps> = ({
  password, setPassword, ssid, setSsid, encryption, setEncryption,
  showOptionals, setShowOptionals, isEditing
}) => {
  const { t } = useLanguage();

  const handleWifiScan = (rawText: string) => {
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : rawText;
      const data = JSON.parse(jsonString);

      if (data.password) setPassword(data.password);
      if (data.ssid) {
        setSsid(data.ssid);
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
          label={t.generate.labels.wifiPassword}
          value={password}
          onChange={setPassword}
          placeholder={t.generate.placeholders.wifiPassword}
          isMonospace
          aiPrompt={`Find the WiFi credentials in this image. Return ONLY a JSON object: { "ssid": "network name found", "password": "password found" }. If no SSID found, return just password.`}
          onScanComplete={handleWifiScan}
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
                  onClick={() => { setShowOptionals(false); setSsid(''); }}
                  className="text-[10px] uppercase font-bold text-gray hover:text-[#c0392b]"
                >
                  {t.generate.buttons.removeOptional}
                </button>
              )}
            </div>
            <SmartInput
              label={t.generate.labels.wifiSsid}
              value={ssid}
              onChange={setSsid}
              placeholder={t.generate.placeholders.wifiSsid}
              aiPrompt="Find the WiFi network name (SSID) in this image. Return only the name, nothing else."
            />
            <div className="flex flex-col gap-2 relative">
              <label className="text-xs font-heading font-semibold text-text uppercase tracking-wider">{t.generate.labels.security}</label>
              <div className="relative">
                <select
                  value={encryption}
                  onChange={(e) => setEncryption(e.target.value as WifiEncryption)}
                  className="w-full bg-card border border-light-gray p-4 font-heading text-sm text-text appearance-none focus:outline-none focus:border-accent block cursor-pointer"
                >
                  <option value="WPA/WPA2">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="None">{t.common.no}</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="#141413" strokeWidth="1.5">
                    <path d="M1 1L5 5L9 1" strokeLinecap="square"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
