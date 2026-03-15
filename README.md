🇬🇧 English | [🇨🇿 Česky](README.cs.md)

# QR Tool

PWA utility app for generating, scanning, and managing QR codes and barcodes. AI-powered — take a photo of a business card, password, or WiFi credentials and the app fills in the form automatically.

## Features

**Generate**
- Text, URL, WiFi, password, vCard (business card)
- Take a photo → AI extracts the content and fills the form
- Business card scanner — one photo fills all contact fields
- Password pairs grouped together (username + password = 2 linked QR codes)
- Download, share, or save to library

**Scan**
- QR codes (camera or file upload)
- Barcodes — EAN-13, EAN-8, Code 128, Code 39, UPC
- Auto-detects content type (URL, WiFi, vCard, text)

**Library**
- All codes saved locally in IndexedDB — works offline, no cloud
- Groups, custom names, fullscreen viewer with swipe
- Download PNG, share via native share API

**Other**
- 20 languages
- Firebase Auth (email + Google)
- PWA — install on phone, works offline
- Mobile-first design

## Coming Soon

- **Magic Decoder** — AI repairs and reads damaged QR codes. Currently testing with Claude models, will be integrated into the scan function
- Data Matrix support
- Cloud sync (optional Firestore backup)

## Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,firebase&theme=dark&perline=5" />
</p>

Next.js · React · TypeScript · Tailwind CSS · Firebase · Gemini API · PWA

## Status

🚧 **Beta** — live at [stilq-qr.web.app](https://stilq-qr.web.app)

## Author

**Cristian Bucioaca** — [cristianb.cz](https://cristianb.cz)
