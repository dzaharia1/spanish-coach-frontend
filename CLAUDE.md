# CLAUDE.md — Spanish Coach Frontend

This file provides guidance for AI assistants working in this repository.

## Project Overview

Spanish Coach is a React PWA that serves as a bilingual (Spanish/English) language learning assistant. Users type text and receive either a quick translation or a deeper exploration of the language, powered by a streaming AI backend.

The frontend communicates with a separate backend service via Server-Sent Events (SSE). This repository contains only the frontend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 6 |
| Styling | styled-components 6 |
| Markdown rendering | react-markdown 9 + remark-gfm 4 |
| Prop validation | prop-types 15 |
| Auth | Firebase 12 (web SDK, Google sign-in) |
| PWA | vite-plugin-pwa 0.21 |
| Linting | ESLint 9 (flat config) |

---

## Commands

```bash
npm run dev       # Start dev server with HMR (port 3001 by default)
npm run build     # Production build → dist/
npm run preview   # Serve the production build locally
npm run lint      # Run ESLint across the project
npm start         # Alias for npm run preview
```

**No test runner is configured.** There are currently no unit or integration tests.

---

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | Base URL of the backend API |
| `VITE_PORT` | `3001` | Port for the Vite dev/preview server |
| `VITE_FIREBASE_API_KEY` | _none_ | Firebase web SDK API key (from Firebase console) |
| `VITE_FIREBASE_AUTH_DOMAIN` | _none_ | Firebase auth domain, e.g. `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | _none_ | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | _none_ | Firebase web app ID |

Set these in a `.env` file at the project root (not committed to git). Firebase keys are required for authentication and translation history to work.

---

## Project Structure

```
spanish-coach-frontend/
├── src/
│   ├── App.jsx              # Root component — state, API calls, layout
│   ├── App.css              # Global app-level CSS
│   ├── main.jsx             # React entry point (wraps app in <AuthProvider>)
│   ├── index.css            # Global CSS variables, font, resets
│   ├── theme.js             # Shared theme tokens (colors, spacing, radii)
│   ├── firebase.js          # Firebase web SDK init + Google provider helpers
│   ├── auth/
│   │   └── AuthContext.jsx  # Auth context: user, signInWithGoogle, signOut, getIdToken
│   ├── api/
│   │   └── history.js       # Authenticated fetch helpers for /history endpoints
│   └── components/
│       ├── PromptInput.jsx      # Text input area + button row + history button
│       ├── TranslationResponse.jsx # Markdown response display
│       ├── DoubleButton.jsx     # Two-action button (Explore / Translate)
│       ├── Button.jsx           # Reusable button (primary/secondary variants)
│       ├── IconButton.jsx       # Icon-only button (delete, stop)
│       ├── ModeSwitcher.jsx     # Language mode toggle (🇲🇽 / 🇺🇸)
│       ├── LoadingIndicator.jsx # Animated loading state with stop action
│       ├── LoginScreen.jsx      # Empty-state log in / register CTA (Google)
│       ├── HistoryModal.jsx     # Searchable list of saved translations
│       └── UserMenu.jsx         # Avatar + sign-out menu
├── public/                  # Static assets (icons, PWA screenshots, SVGs)
├── index.html               # HTML entry point
├── vite.config.js           # Vite + PWA configuration
└── eslint.config.js         # ESLint flat config (ESLint 9 style)
```

---

## Architecture

### Data Flow

```
User types text
    → PromptInput dispatches onSubmit(text, model)
        → App.handleSubmit() POSTs to backend API
            → Streams SSE chunks → setTranslation() updates state
                → TranslationResponse renders Markdown
```

### Language Modes

Two routes exist on the backend, selected by `languageMode` in state:

- `spanishHelp` — user writes English, receives Spanish help (default)
- `englishHelp` — user writes Spanish, receives English help

The active mode is persisted to `localStorage` under the key `"languageMode"`.

### Translation Models

Each submission includes a `model` field (`"concise"` or `"complete"`):

- `"concise"` — quick translation (Shift+Enter or "Translate" button)
- `"complete"` — deeper exploration (Enter or "Explore" button)

### Streaming API

The backend returns SSE-formatted responses. The client reads the stream with a `ReadableStream` reader and parses lines matching `data: {json}`. Each chunk has the shape `{ text?, error? }`. The first chunk clears the previous response; subsequent chunks are appended.

Request cancellation uses `AbortController`, stored in a ref (`abortControllerRef`) so `handleStop()` can abort mid-stream.

### Authentication & History

The app uses **Firebase Authentication** with Google as the only sign-in provider (configured in `src/firebase.js`). Auth state lives in `AuthContext` (`src/auth/AuthContext.jsx`) and exposes `user`, `signInWithGoogle`, `signOut`, and `getIdToken`.

When a user is signed in, `App.handleSubmit()` attaches `Authorization: Bearer <ID token>` to every coaching request, which causes the backend to persist the resulting translation under that user.

The empty-state UI shows `<LoginScreen>` (log in / register buttons that both call `signInWithGoogle`) until the user signs in or generates a translation. Once signed in, `<PromptInput>` shows a "History" button that opens `<HistoryModal>` — a searchable list backed by `GET /history`. Clicking a row reveals the full translation. Deletion is exposed only on the backend (`DELETE /history/:id`) for now.

---

## Styling Conventions

- All component styles use **styled-components**. No CSS modules or plain CSS files in components.
- Theme tokens are defined in `src/theme.js` and accessed via the `theme` prop inside styled-components template literals.
- The `ThemeProvider` in `App.jsx` passes the full theme object (`{ lightTheme, darkTheme, spacing, borderRadii }`).
- Dark/light mode is handled via CSS media queries (`prefers-color-scheme`) inside each styled component — not via a JS theme switch.
- Responsive breakpoint: **768px** (`max-width` for mobile, `min-width` for desktop).
- The mobile layout reverses the flex direction so the input sits at the bottom of the screen.
- Dynamic font sizing in `StyledInput` (inside `PromptInput.jsx`) uses a transient prop `$inputLength` (prefixed with `$` to avoid forwarding to the DOM).

### Theme Tokens

```js
spacing:     { xSmall, small, medium, large, xLarge }
borderRadii: { small, medium, large }
lightTheme.colors: { background, backgroundSecondary, text, inputBackground, placeholder, shadow }
darkTheme.colors:  { (same keys, dark values) }
```

---

## Component Conventions

- All components are **functional components** using React hooks (`useState`, `useEffect`, `useRef`).
- Component files use `.jsx` extension and **PascalCase** naming.
- Every component that accepts props must declare **PropTypes** at the bottom of the file.
- State that needs to be shared across components is **lifted to `App.jsx`**; components receive values and callbacks as props.
- No external state management library (no Redux, Zustand, etc.).

### Keyboard Shortcuts (PromptInput)

| Key | Action |
|---|---|
| `Enter` | Submit with `"complete"` model |
| `Shift+Enter` | Submit with `"concise"` model |

---

## PWA Notes

The app is configured as a PWA via `vite-plugin-pwa`:

- Service worker uses **autoUpdate** strategy (Workbox).
- All `.js`, `.css`, `.html`, `.ico`, `.png`, `.svg` files are precached.
- `/api/*` routes are excluded from the navigate fallback.
- Installable on desktop (1920×1080 screenshot) and mobile (750×1334 screenshot).

When modifying `vite.config.js`, be careful not to break the Workbox glob patterns or the manifest icons — these affect installability and caching behavior.

---

## Deployment

- Hosted at **spanish.danzaharia.com**
- Also accessible via **\*.railway.app** (Railway deployment)
- The Vite dev and preview servers allow connections from these hosts (configured in `vite.config.js` under `server.allowedHosts` and `preview.allowedHosts`)

---

## What to Avoid

- **Do not add a test framework** without confirming with the project owner — currently there are none and the project is intentionally minimal.
- **Do not introduce a global state library** (Redux, Zustand, etc.) — the app intentionally uses React hooks only.
- **Do not forward non-boolean transient props to DOM elements** — use the `$` prefix convention (e.g., `$inputLength`) for styled-component props that should not reach the DOM.
- **Do not use CSS modules or plain CSS** for new component styles — stick to styled-components.
- **Do not add `console.log` debug statements** in production code paths (there is already one in `App.jsx` that should be removed when it's no longer needed).
- **Do not commit `.env` files** — environment variables belong in the host environment or a local `.env` (already gitignored).
