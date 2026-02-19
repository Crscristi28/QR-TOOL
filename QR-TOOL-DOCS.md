# QR Tool — Project Documentation

## What It Is
Universal QR code and barcode generator with AI-powered text recognition from photos. PWA mobile-first application.

## Stack
- **Framework:** Next.js (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS (npm package, NOT CDN)
- **Local Storage:** IndexedDB (primary, offline-first)
- **Cloud Storage:** Firestore (optional sync layer, user-initiated)
- **Auth:** Firebase Auth (Google + email/password)
- **AI:** Gemini API (via Next.js API routes, NEVER from frontend)
- **QR Scanning:** qr-scanner (nimiq)
- **Barcode Scanning:** quagga2
- **QR Generation:** qrcode library
- **PWA:** manifest.json, standalone mode

## Design System

### Colors (Anthropic Palette)
| Token | Value | Usage |
|-------|-------|-------|
| bg-primary | `#faf9f5` | Page background |
| text-primary | `#141413` | All text |
| accent | `#d97757` | Buttons, active states |
| accent-hover | `#c4654a` | Button hover |
| gray | `#b0aea5` | Secondary text, borders |
| gray-light | `#e8e6dc` | Input borders, dividers |
| card-bg | `#ffffff` | Card backgrounds |

### Typography
| Element | Font | Weight |
|---------|------|--------|
| Headings | Poppins | 500, 600 |
| Body text | Lora | 400 |
| Body fallback | Georgia | 400 |
| Code/mono | system monospace | 400 |

### Design Rules (STRICT — never break these)
- **border-radius: 0** everywhere. Sharp corners only. No rounded corners.
- **No gradients.** Flat colors only.
- **No shadows.** Use `1px solid` border instead (color: #e8e6dc).
- **No emoji/icons** in UI text.
- **Light mode only.** No dark mode.
- **Mobile first.** Design for 390px width, scale up.
- **1px solid borders** for cards and containers (color: #e8e6dc).
- **Buttons:** Accent bg (#d97757) with white text, or outline (1px solid #e8e6dc) with dark text.
- **No hover effects** on mobile-first elements (except buttons with accent-hover).

### Button Styles
```
Primary: bg #d97757, text white, border none, no radius
Secondary: bg transparent, border 1px solid #e8e6dc, text #141413, no radius
Danger: bg #141413, text white (for delete confirmations)
```

### Input Styles
```
Border: 1px solid #e8e6dc
Background: #ffffff
Text: #141413
Placeholder: #b0aea5
Focus border: #d97757
No border-radius
```

## App Structure — 4 Bottom Tabs

### Tab 1: Generate (Generovat)
Main view for creating QR codes and barcodes.

**5 content types:**
1. **Text** — Free text input → QR code
2. **URL** — URL input with validation → QR code
3. **WiFi** — SSID + password + encryption type → WiFi QR code
4. **Password** — Username + password fields → grouped QR codes
5. **vCard** — Name, phone, email, company, website → contact QR code

**Flow:**
- Type selector at top (horizontal scrollable chips)
- Main input field for primary data
- "Add more details" expandable section for secondary fields
- Each field has two buttons: "Take Photo" (camera) and "Upload Photo" (gallery)
- AI reads text from photo and fills the field (SmartInput feature)
- For Password type: AI finds both username + password from one photo
- Generate button creates QR code
- Save to library with custom name
- Download as PNG

**SmartInput (AI-powered field filling):**
- User takes photo or uploads image
- Image resized to max 1024px JPEG
- Sent to Gemini API with field-specific prompt
- AI extracts relevant text and fills the field
- For Password: AI extracts both username and password simultaneously

### Tab 2: Scan (Skenovat)
Camera and upload scanning for QR codes and barcodes.

**Idle state — 4 buttons:**
- "Scan QR Code" (bg #141413) → opens camera with qr-scanner
- "Scan Barcode" (bg #141413) → opens camera with quagga2
- "Upload QR Code" (border #e8e6dc) → file picker, scan with QrScanner.scanImage()
- "Upload Barcode" (border #e8e6dc) → file picker, scan with Quagga.decodeSingle()

**Camera view:**
- aspect-video container
- Separate video element for qr-scanner, separate div for quagga2
- Red horizontal line overlay as scanning guide
- "Stop" button below camera

**Result view:**
- Scanned content in card
- Code type badge (QR/Barcode)
- "Open URL" button (if content is URL)
- "Save to Library" button
- "Scan Next" button

**Technical details:**
- qr-scanner: let library manage camera, use calculateScanRegion for full frame
- quagga2: minimal constraints, just facingMode: "environment"
- Content classification: URL (starts with http), WiFi (starts with WIFI:), vCard (contains BEGIN:VCARD), otherwise text

### Tab 3: Library (Knihovna)
Saved QR codes and barcodes organized in groups.

**Features:**
- Groups (e.g., username + password together under one name)
- Individual codes
- Inline editable group/code names
- Delete with confirmation (Ano/Zrušit buttons)
- Download PNG for each code
- Fullscreen QR code viewer with swipe between codes in group
- Share button

**IndexedDB Structure:**
- ID: string (UUID via crypto.randomUUID())
- Fields: id, content, type, name, groupId, groupName, createdAt
- Groups: codes with same groupId displayed together

### Tab 4: Settings (Nastavení)
App settings organized in categories.

**Categories:**
- Language selector (20 languages)
- Account section (login/logout — currently UI only)
- About section

**Languages (20):**
cs, sk, en, de, pl, ro, hu, es, fr, it, pt, ru, uk, tr, vi, zh, ja, ko, ar, hi

### Auth Screens (Currently UI mockup only)
- Login screen: email + password, Google sign-in button
- Register screen: email + password + confirm password
- Forgot password screen
- All styled with Anthropic palette

## Business Card Import
- Take photo of business card
- AI extracts: name, phone, email, company, website
- Creates vCard QR code
- Share button generates QR that auto-saves to contacts when scanned

## Unsaved Changes Protection
- Modal appears when switching bottom tabs with unsaved data in Generate view
- "You have unsaved changes. Do you really want to leave?"
- Buttons: Stay / Leave

## Known Issues (To Fix)
1. **API key on frontend** — SmartInput.tsx calls Gemini directly from browser
2. **Tailwind via CDN** — must be npm package with proper config
3. **Import maps** — React and libs loaded via CDN, must be npm
4. **Auth is mockup** — no real Firebase Auth
5. **No Firestore** — only IndexedDB, no cloud sync
6. **No App Check** — no bot protection
7. **GenerateView is god component** — 450+ lines, needs splitting into form components
8. **Duplicate upload logic** — ScanView has nearly identical QR/barcode upload handlers
9. **No Data Matrix support** — neither library reads Data Matrix codes
10. **AI cannot decode QR codes** — needs tool use (function calling) for real decoding

## Migration Plan

### Phase 1: Build Stack
- Clean Next.js App Router setup
- Move all dependencies from CDN to npm
- Tailwind as npm package with config files
- Verify app runs locally

### Phase 2: API Security
- Next.js API route for Gemini calls (/api/analyze)
- Move API key to .env.local
- Remove API key from frontend code
- Verify AI features work through backend

### Phase 3: Refactor
- Split GenerateView into form components (WifiForm, VCardForm, PasswordForm, UrlForm, TextForm)
- Unify upload logic in ScanView
- Move AI prompts to lib/prompts.ts
- Verify everything works

### Phase 4: Firebase Auth
- Firebase Auth setup (Google + email/password)
- Replace mock auth with real auth
- Email verification
- App Check for bot protection
- Verify login/logout flow

### Phase 5: AI Tool Use
- Gemini function calling in API route
- Tool: decode_qr (decode any code from photo)
- Tool: repair_qr (read damaged code, generate clean new one)
- Single upload button — AI detects type automatically
- Test with real photos (QR, barcode, Data Matrix)

### Phase 6: Firestore Sync
- Firestore setup
- Sync layer alongside IndexedDB (lib/sync.ts)
- User-initiated sync (never automatic)
- Verify offline/online transitions

## Rules for Claude Code
- Step by step, test after each step
- No git for now, working locally
- CLAUDE.md rules apply always
- If something breaks, fix it — do not revert entire files
- Report any issues found during work (see CLAUDE.md issue reporting)
- Ask before making decisions not covered in this plan
