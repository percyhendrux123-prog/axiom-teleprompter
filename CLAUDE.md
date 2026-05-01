# CLAUDE.md

Guidance for AI assistants working in this repo.

## What this project is

**PKFIT.APP** — an editorial-athletic fitness coaching landing site for Percy Keith. The repo directory is still named `axiom-teleprompter` (legacy from an earlier project that shipped here by mistake); the current product is PKFIT. Don't rename anything based on the directory.

The site is a single long-scroll landing page (`src/App.tsx`) plus 12 fully designed mobile screens that are previewed inside an iPhone / iPad / Desktop frame switcher. The "AI Coach" screen is wired to Google Gemini 2.0 Flash through a Netlify Function so the API key never reaches the browser.

## Stack

- Vite 5 + React 18 + TypeScript (strict)
- Hand-written CSS in `src/styles.css` — **no Tailwind, no CSS-in-JS library**. Inline `style={{...}}` is common; shared visual treatments use class names (`glass`, `card`, `pill`, `display`, `mono`, `serif`, `tnum`, `eyebrow`, `btn`, `btn-primary`, `btn-ghost`).
- Netlify hosting + one Function (`netlify/functions/chat.ts`) for the AI Coach
- Fonts loaded from Google Fonts in `index.html`: Anton (display), Inter (body — stand-in for licensed Söhne), JetBrains Mono (meta), Instrument Serif (italic accent)

`package.json` only depends on `react` and `react-dom`. Don't add libraries (animation, icons, UI kits, fetchers) without a strong reason — the design system, scroll effects, and icons are all hand-rolled.

## Commands

```bash
npm install
npm run dev        # vite dev server
npm run build      # tsc -b && vite build (typecheck blocks the build)
npm run preview    # preview built dist/
npx netlify dev    # required to exercise the AI Coach locally (runs the function)
```

There is no test runner, linter, or formatter configured. `npm run build` is the only verification step — run it after non-trivial changes; TypeScript errors will fail the build.

## Repository layout

```
index.html                 # entry, loads /src/main.tsx, fonts, theme meta
netlify.toml               # build → dist, functions dir, SPA redirect
netlify/functions/chat.ts  # POST /.netlify/functions/chat → Gemini 2.0 Flash
public/assets/             # Percy photography (percy-*.jpg)
src/
  main.tsx                 # ReactDOM root, imports styles.css
  App.tsx                  # composes the long-scroll landing + SettingsPanel
  styles.css               # design tokens, components, animations
  resources.ts             # typed asset paths for public/assets
  lib/chat.ts              # browser → Netlify Function helper (sendChat)
  components/
    Effects.tsx            # scroll & motion primitives (see below)
    Frames.tsx             # Phone / Tablet / Desktop chrome
    Shell.tsx              # SCREENS registry, BottomNav, FrameSwitcher
    Landing.tsx            # all landing sections (Hero, Marquee, ...)
    Icon.tsx               # hand-drawn SVG icon set, IconName union
    SettingsPanel.tsx      # floating gear panel; theme + scroll intensity
  screens/
    Splash, Login, Onboard,
    Home, Workout, Exercise, Programs,
    AICoach, Progress, Nutrition, Checkin, Profile  (.tsx each)
```

## Architecture cheatsheet

- `App.tsx` stitches together landing sections from `Landing.tsx` and renders `SettingsPanel` and the cursor/scrollbar effects. It also owns the cross-section "jump to a screen" handoff: clicking a hero phone calls `openScreen(id)`, which sets `requestedScreen` + bumps `jumpToken` and scrolls to `#app`. `AppShowcase` forwards both into `FrameSwitcher`, which uses `jumpToken` to re-apply the same id (so re-clicking the same screen still scrolls).
- `Shell.tsx` is the source of truth for the screen registry: `SCREENS: ScreenDef[]` and the `ScreenId` union. **Add new screens here** — the `FrameSwitcher` chip row, the iPad sidebar, and the Desktop sidebar all read from this list.
- `Frames.tsx` exports `Phone`, `Tablet`, `Desktop` — pure presentational chrome that wraps a screen child. The Phone frame renders the notch and a faux status bar; everything below `inset: 50px 0 0 0` is screen content.
- `Effects.tsx` contains the motion vocabulary used throughout the landing: `useScrollProgress`, `StickyText`, `PinnedReveal`, `RevealImage`, `Marquee`, `WordRoll`, `Spotlight`, `FadeUp`, `CountUp`, `Magnetic`, `CustomCursor`, `ScrollBar`. Reuse these instead of writing one-off scroll handlers.
- `SettingsPanel.tsx` persists `{ theme, scrollIntensity }` to `localStorage` under the key `pkfit:settings` and writes `data-theme` onto `<html>`. Light theme is implemented by `[data-theme="light"]` overrides at the top of `styles.css`.
- `lib/chat.ts` posts `{ history, message, systemPrompt }` to `/.netlify/functions/chat`. The function injects `systemInstruction`, calls Gemini, and returns `{ reply }`. `ScreenAICoach` keeps UI state and translates between its `from: 'ai' | 'user'` shape and the API's `role: 'model' | 'user'` shape — preserve that mapping if you touch the chat code.

## Conventions

**Brand & palette**
- The accent is burnt amber `#FF5B1F` (`--accent`). Deep variant `#C7421A`.
- **No green anywhere.** Positive states reuse the amber accent; negatives use red `#EF4444`; warnings `#F59E0B`. This is a hard brand rule.
- Backgrounds: `#0A0A0B` (`--ink`) on dark, `#FAF8F3` (`--paper`) on light. Hex colors are sometimes hardcoded in components — prefer the CSS variables (`var(--ink)`, `var(--accent)`, etc.) when adding new code.

**Typography**
- Display text uses the `display` class (Anton, uppercase). Eyebrows/labels use the `mono` class (JetBrains Mono, uppercase, tracked). Body uses the default Inter sans. Italic accents use the `serif` class.
- Numbers should set `tnum` for tabular figures, especially in stats and timers.

**Liquid Glass**
- The `glass`, `glass-strong`, `card`, and `pill` classes implement Apple's Liquid Glass treatment with `backdrop-filter`. Reuse them rather than re-implementing translucency.

**Styling style**
- Inline `style={{ ... }}` is the dominant pattern across screens and landing sections — keep it consistent rather than introducing CSS modules / styled-components / Tailwind.
- Add new shared classes to `styles.css`. Animations live there too (`@keyframes marquee`, etc.).

**TypeScript**
- `strict: true`, but `noUnusedLocals` / `noUnusedParameters` are **off** — leftover bindings won't fail the build, so don't rely on them as a signal. Run `npm run build` before claiming a change is done.
- Use the existing types when applicable: `ScreenId` (Shell.tsx), `IconName` (Icon.tsx), `ChatMessage` (lib/chat.ts).

**Assets**
- Reference images via `resources.ts` (e.g. `resources.percyFlex`) so the paths stay typed. Drop new images into `public/assets/` and add an entry to that map.
- Real Söhne `woff2` files would go in `public/fonts/` with an `@font-face` block in `styles.css`; the var chain (`"Söhne", "Inter", ...`) will pick them up automatically.

## Netlify Function & environment

- `netlify.toml` builds `npm run build` → `dist`, with `netlify/functions` as the functions dir and a SPA fallback to `index.html`.
- `GEMINI_API_KEY` (single underscore — not `GEMINI_API__KEY`) must be set in Netlify → Site settings → Environment variables. The function returns 500 with `{ error: 'GEMINI_API_KEY not configured' }` when missing.
- The function is hardcoded to model `gemini-2.0-flash`, temperature 0.6, maxOutputTokens 600. If you change generation params, mirror the type changes in `lib/chat.ts`.

## Adding a new app screen

1. Create `src/screens/Foo.tsx` exporting `ScreenFoo`.
2. In `src/components/Shell.tsx`: import it, add an entry to `SCREENS` with a unique `id`, label, and `group: 'Onboard' | 'App'`. Extend the `ScreenId` union.
3. (Optional) add a `BottomNav` item if the screen belongs in the phone tab bar.
4. (Optional) add the id to the iPad sidebar list inside `FrameSwitcher` and confirm Desktop's `SCREENS.filter((s) => s.group === 'App')` view still looks right.

## Working agreements

- **Don't reintroduce the AXIOM teleprompter.** That code was removed; the README and git history (`a6d870b restore PKFIT.APP from Claude Design handoff`) document the cleanup.
- **Don't add green** as a UI color — even subtly. Use the amber accent for "positive" affordances.
- **Don't add a CSS framework or component library.** The hand-rolled system is the product.
- Branch: develop on `claude/add-claude-documentation-9ePUj` (or whatever branch the current task specifies). The repo scope for GitHub MCP tools is `percyhendrux123-prog/axiom-teleprompter` only.
