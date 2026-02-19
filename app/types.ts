export enum Tab {
  GENERATE = 'Generovat',
  SCAN = 'Skenovat',
  LIBRARY = 'Knihovna',
  SETTINGS = 'Nastavení',
}

export type Language = 'CZ' | 'EN' | 'DE';

export type ContentType = 'text' | 'url' | 'wifi' | 'password' | 'vcard';
export type WifiEncryption = 'WPA/WPA2' | 'WEP' | 'None';

export type AuthView = 'login' | 'register' | 'forgot' | 'verify-email';
