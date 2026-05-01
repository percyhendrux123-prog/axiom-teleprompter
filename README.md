# PKFIT.APP

Coached by Percy Keith. Editorial-athletic fitness coaching app — landing site + 12 fully wired
mobile screens (splash, login, onboarding, home, workout, exercise, programs, AI coach,
progress, nutrition, weekly check-in, profile) with iPhone / iPad / desktop frame switcher.

Built from a Claude Design handoff. The teleprompter that shipped on this repo by mistake has
been removed; the landing page restores the original PKFIT brief.

## Stack

- Vite + React 18 + TypeScript
- Hand-written CSS (no Tailwind), Apple Liquid Glass material on cards, pills, and dock
- Anton (display) / **Inter as Söhne stand-in** (body) / JetBrains Mono (meta) / Instrument Serif (italic accent)
- Netlify Function `netlify/functions/chat.ts` proxies the AI Coach to Gemini 2.0 Flash —
  the API key never reaches the browser

## Local

```bash
npm install
npm run dev
```

To exercise the AI coach locally you need `netlify dev` (so the function runs):

```bash
npx netlify dev
```

## Environment

Set in Netlify → Site settings → Environment variables:

- `GEMINI_API_KEY` — Google Gemini API key (single underscore — make sure it isn't `GEMINI_API__KEY`)

## Build

```bash
npm run build
```

## Notes

- **No green** anywhere in the palette per brand direction. Positive states use the burnt amber
  accent (`#FF5B1F`); warnings use red (`#EF4444`).
- The Söhne body font is licensed (Klim Type Foundry) — Inter is wired in as the closest free
  metric match. Drop real Söhne `woff2` files into `public/fonts/` and add an `@font-face`
  block in `src/styles.css` to swap it in.
