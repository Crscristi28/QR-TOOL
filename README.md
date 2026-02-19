# QR Tool

Universal QR code and barcode generator with AI-powered text recognition from photos. PWA application for mobile devices.

## Features

- **Generate** — QR codes for text, URL, WiFi, vCard, passwords
- **Scan** — Camera scanning for QR codes and barcodes (EAN, Code 128, Code 39, UPC)
- **AI Vision** — Upload a photo and AI extracts text/codes from it
- **Library** — Save, search and manage all your codes (IndexedDB, offline-first)
- **Auth** — Firebase authentication (email/password, password reset)
- **i18n** — 20 languages (cs, sk, en, de, pl, ro, hu, es, fr, it, pt, ru, uk, tr, vi, zh, ja, ko, ar, he)

## Tech Stack

- **Frontend:** Next.js, React 19, TypeScript, Tailwind CSS 4
- **Storage:** IndexedDB (local, offline-first)
- **Backend:** Firebase Auth, Firestore, Cloud Functions
- **AI:** Gemini 2.0 Flash (via Cloud Functions)
- **Scanning:** qr-scanner (nimiq), quagga2 (barcodes)

## Setup

```bash
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Development

```bash
npm run dev
```

## Deploy

```bash
npm run deploy
```

## License

[MIT](LICENSE)
