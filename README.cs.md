[🇬🇧 English](README.md) | 🇨🇿 Česky

# QR Tool

PWA utilita na generování, skenování a správu QR kódů a čárových kódů. S AI — vyfoť vizitku, heslo nebo WiFi údaje a appka vyplní formulář automaticky.

## Funkce

**Generování**
- Text, URL, WiFi, heslo, vCard (vizitka)
- Vyfoť → AI extrahuje obsah a vyplní formulář
- Skener vizitek — jedna fotka vyplní všechny kontaktní údaje
- Párování hesel (uživatelské jméno + heslo = 2 propojené QR kódy)
- Stažení, sdílení nebo uložení do knihovny

**Skenování**
- QR kódy (kamera nebo nahrání souboru)
- Čárové kódy — EAN-13, EAN-8, Code 128, Code 39, UPC
- Automatická detekce typu obsahu (URL, WiFi, vCard, text)

**Knihovna**
- Všechny kódy uložené lokálně v IndexedDB — funguje offline, bez cloudu
- Skupiny, vlastní názvy, fullscreen prohlížeč s přejetím
- Stažení PNG, sdílení přes nativní share API

**Ostatní**
- 20 jazyků
- Firebase Auth (email + Google)
- PWA — instalace na telefon, funguje offline
- Mobile-first design

## Připravujeme

- **Magic Decoder** — AI opravuje a čte poškozené QR kódy. Aktuálně testujeme s Claude modely, bude integrováno do skenovací funkce
- Podpora Data Matrix
- Cloud sync (volitelná záloha přes Firestore)

## Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,firebase&theme=dark&perline=5" />
</p>

Next.js · React · TypeScript · Tailwind CSS · Firebase · Gemini API · PWA

## Stav

🚧 **Beta** — live na [stilq-qr.web.app](https://stilq-qr.web.app)

## Autor

**Cristian Bucioaca** — [cristianb.cz](https://cristianb.cz)
