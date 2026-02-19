import { ContentType, WifiEncryption } from '@/app/types';

interface BuildParams {
  mainValue: string;
  secondaryValue: string;
  entryName: string;
  wifiSsid: string;
  wifiEncryption: WifiEncryption;
  vCardPhone: string;
  vCardEmail: string;
  vCardWeb: string;
  vCardCompany: string;
  vCardTitle: string;
}

interface BuildTranslations {
  generate: {
    types: { url: string; text: string; vcard: string };
    placeholders: { wifiSsid: string };
  };
}

export function buildQRContent(
  type: ContentType,
  params: BuildParams,
  t: BuildTranslations
): { content: string; name: string } {
  const { mainValue, secondaryValue, entryName, wifiSsid, wifiEncryption, vCardPhone, vCardEmail, vCardWeb, vCardCompany, vCardTitle } = params;

  let content = mainValue;
  let name = entryName || (type === 'url' ? t.generate.types.url : t.generate.types.text);

  if (type === 'wifi') {
    const ssid = wifiSsid || t.generate.placeholders.wifiSsid;
    const encType = wifiEncryption === 'None' ? 'nopass' : wifiEncryption === 'WEP' ? 'WEP' : 'WPA';
    content = `WIFI:T:${encType};S:${ssid};P:${mainValue};;`;
    name = ssid;
  } else if (type === 'vcard') {
    const fn = `${mainValue} ${secondaryValue}`.trim();
    name = fn || t.generate.types.vcard;
    content = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${secondaryValue};${mainValue};;;`,
      `FN:${fn}`,
      vCardPhone ? `TEL;TYPE=CELL:${vCardPhone}` : '',
      vCardEmail ? `EMAIL:${vCardEmail}` : '',
      vCardWeb ? `URL:${vCardWeb}` : '',
      vCardCompany ? `ORG:${vCardCompany}` : '',
      vCardTitle ? `TITLE:${vCardTitle}` : '',
      'END:VCARD'
    ].filter(line => line !== '').join('\n');
  }

  return { content, name };
}
