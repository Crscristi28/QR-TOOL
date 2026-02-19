# ---
name: qr-tool-core
description: |
  Core project conventions for QR Tool. ALWAYS apply these rules for ANY task: code quality, modularity, file structure, naming conventions, dependencies, and best practices. This skill has highest priority - never compromise on these standards.
---

# QR Tool Core Conventions

## Priority: HIGHEST

This project is production-critical. Quality over speed. Always.

## Project Overview

QR Tool is a universal QR code and barcode generator with AI-powered text recognition from photos. PWA application for mobile devices.

**Stack:** React + TypeScript, Tailwind CSS (installed as npm package, NOT CDN), IndexedDB for local storage, Firebase (Auth, Firestore, Cloud Functions), Gemini API for AI features.

## Dependencies

**Rule:** Always check `npm view <package> version` before installing. Never hardcode versions.

**Key packages:**
- `qr-scanner` (nimiq) — QR code scanning from camera and images
- `@nickvdp/quagga2` — Barcode scanning (EAN, Code 128, Code 39, UPC)
- `firebase` — Auth, Firestore, Cloud Functions
- `qrcode` — QR code generation

## Design System (Anthropic Palette)

### Colors
- Background: `#faf9f5` (warm white)
- Text: `#141413`
- Accent: `#d97757`, hover: `#c4654a`
- Gray: `#b0aea5`, light gray: `#e8e6dc`
- Cards: `#ffffff`

### Typography
- Headings: Poppins (weight 500/600)
- Body: Lora (Georgia fallback)
- Code: system monospace

### Rules
- **NO gradients** — ever
- **Sharp corners** — border-radius: 0 everywhere
- **NO shadows** — use 1px solid border only
- **NO emoji/icons** in UI
- **Light mode only**
- **Mobile first** — design for 390px, scale up

## Code Quality Rules

### 1. Modularity
- **One component = one file.** No god components.
- **Max 150 lines per file.** If longer, split into smaller modules.
- **Single responsibility.** Each function/component does ONE thing.
- **No code duplication.** Extract to shared utilities/components.

### 2. File Structure
```
src/
├── components/
│   ├── ui/                 # Base UI components (Button, Input, Modal)
│   ├── forms/              # Form components (WifiForm, VCardForm, etc.)
│   ├── views/              # Main view components (GenerateView, ScanView, etc.)
│   └── [feature]/          # Feature-specific components
├── lib/                    # Utilities, helpers, configs
│   ├── db.ts               # IndexedDB operations
│   ├── i18n.ts             # Internationalization (19 languages)
│   ├── prompts.ts          # AI prompt templates
│   └── sync.ts             # Firestore sync (optional layer)
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript types/interfaces
├── api/                    # Cloud Functions / API routes
└── styles/                 # Global CSS, Tailwind theme
```

### 3. Naming Conventions
- **Files:** kebab-case (`wifi-form.tsx`, `use-auth.ts`)
- **Components:** PascalCase (`WifiForm`, `AuthProvider`)
- **Functions/variables:** camelCase (`handleSubmit`, `isLoading`)
- **Types/Interfaces:** PascalCase, no prefix (`QRCode`, `ScanResult`)
- **Constants:** SCREAMING_SNAKE_CASE (`MAX_FILE_SIZE`, `API_URL`)

### 4. TypeScript
- **Strict mode:** Always enabled, no `any` unless absolutely necessary.
- **Explicit types:** Define interfaces for all props, API responses, state.
- **No implicit any:** Every variable must have a type.
- **ID type:** Always `string` (UUID via `crypto.randomUUID()`), never `number`.

### 5. Imports
- **Absolute imports:** Use `@/` alias, never relative `../../`.
- **Order:** React → External libs → Internal modules → Types → Styles.
- **No barrel files:** Import directly from source, not from index.ts.

### 6. Components
- **Functional only:** No class components.
- **Props interface:** Always define `interface ComponentNameProps`.
- **Named exports:** For all components.

### 7. State Management
- **Local first:** useState/useReducer before context.
- **IndexedDB:** Primary storage, always available offline.
- **Firestore:** Optional sync layer, never replaces IndexedDB.
- **No prop drilling:** Max 2 levels, then use context or composition.

### 8. Error Handling
- **Try/catch:** All async operations.
- **User feedback:** Toast/alert for errors, never silent fails.
- **Logging:** Console.error in development, proper logging in production.

### 9. Performance
- **Lazy loading:** For heavy components (camera, AI features).
- **Image optimization:** Resize images before sending to AI (max 1024px).
- **Memoization:** useMemo/useCallback only when needed, not by default.

### 10. Comments
- **Self-documenting code:** Good names > comments.
- **Why, not what:** Comment only complex business logic.
- **TODO format:** `// TODO(name): description`

### 11. Internationalization (i18n)
- **19 languages:** cs, sk, en, de, pl, ro, hu, es, fr, it, pt, ru, uk, tr, vi, zh, ja, ko, ar
- **NO hardcoded strings in UI.** Everything through `t.section.key`.
- **AI prompts:** Store in `lib/prompts.ts`, language-agnostic (English).
- **Fallback names:** Use translated strings, not hardcoded Czech/English.

### 12. Security
- **No API keys on frontend.** All AI calls through Cloud Functions.
- **No secrets in code.** Use environment variables.
- **Firebase App Check** for bot protection.
- **Validate inputs:** All user inputs sanitized.
- **HTTPS only:** All API calls.

## Git Conventions

### Commits
- **Format:** `type(scope): description`
- **Types:** feat, fix, refactor, style, docs, test, chore
- **Examples:**
  - `feat(scan): add Data Matrix support`
  - `fix(camera): resolve autofocus issue on mobile`
  - `refactor(generate): extract WifiForm component`

### Branches
- **main:** Production-ready code only
- **dev:** Integration branch
- **feature/name:** New features
- **fix/name:** Bug fixes

## AI Integration Rules

### Gemini API (via Cloud Functions)
- **Never call from frontend.** Always through Cloud Functions.
- **Resize images** before sending (max 1024px JPEG).
- **Tool use:** Define proper function declarations for decode_qr, repair_qr.
- **Error handling:** Always handle API failures gracefully with user feedback.

### Scanning Libraries
- **qr-scanner:** For QR codes. Let it manage camera itself (no manual getUserMedia).
- **quagga2:** For barcodes. Minimal constraints (just facingMode: "environment").
- **AI fallback:** When libraries fail, send to AI via Cloud Functions.

## IndexedDB Rules
- **ID type:** `string` (UUID), never auto-increment number.
- **Generate ID:** `crypto.randomUUID()` at creation time.
- **Offline first:** App must work fully without internet.
- **Sync optional:** Firestore sync is user-initiated, never automatic.

## Before Every Commit
1. TypeScript compiles without errors
2. ESLint passes
3. No console.log (except error handling)
4. Code is formatted (Prettier)
5. No commented-out code
6. No unused imports/variables
7. No API keys or secrets in code

## Red Flags (Never Do)
- `any` type without comment explaining why
- `// @ts-ignore` without justification
- Inline styles (use Tailwind)
- Magic numbers (use constants)
- Hardcoded strings in UI (use i18n)
- Direct DOM manipulation
- Synchronous heavy operations
- API keys on frontend
- Tailwind via CDN (must be npm package)
- `border-radius` > 0 (sharp corners only)
- Gradients or shadows
- Auto-increment IDs (use UUID strings)

## CRITICAL: Issue Reporting Rule

**ALWAYS report issues, even if not directly related to current task.**

If I notice ANY of these during work, I MUST immediately tell the user:
- Security vulnerabilities (auth holes, exposed secrets, XSS, injection)
- Logic bugs (race conditions, edge cases, broken flows)
- Data integrity issues (missing validation, wrong types, orphaned data)
- Performance problems (memory leaks, N+1 queries, blocking operations)
- Missing error handling
- Broken functionality (even if "it works" on happy path)
- Design system violations (gradients, shadows, rounded corners, wrong colors)

**NEVER:**
- Skip issues because "we're doing something else"
- Say "everything works" when I saw problems in my analysis
- Hide concerns to avoid slowing down progress
- Assume user will find it later

**Format for reporting issues:**
```
⚠️ ISSUE FOUND: [category]
What: [description]
Where: [file:line or component]
Risk: [low/medium/high/critical]
Suggested fix: [brief solution]
```

This project is production-critical. Silent bugs cost more than interruptions.
