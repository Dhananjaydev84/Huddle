# Huddle
### Party games, no mercy.

Huddle is a mobile-first party games web app built with Vite. Pass the phone around, catch the impostor, no downloads required.

---

## Games

| Game | Status |
|------|--------|
| Imposter | ✅ Live |
| ? | Coming soon |
| ? | Coming soon |
| ? | Coming soon |

---

## How Imposter Works

One word is chosen from the daily objects category. Most players see the word — one (or more) players are the impostor and get a hint, a similar word, or nothing at all depending on the settings. Players take turns giving clues without revealing the word. At the end, everyone votes for who they think the impostor is.

---

## Tech Stack

- **Vite** — build tool and dev server
- **Vanilla JS** — no frameworks, ES modules
- **CSS** — custom properties, mobile-first, fully responsive
- **PWA** — manifest + service worker, installable on Android via "Add to Home Screen"
- **localStorage** — persistent player list across sessions

---

## Project Structure

```
huddle/
├── index.html
├── manifest.json
├── sw.js
├── src/
│   ├── main.js              # entry point + render router
│   ├── state.js             # global state + game logic
│   ├── style.css            # all styles
│   ├── data/
│   │   └── words.js         # word bank (50 daily objects)
│   └── screens/
│       ├── HomeScreen.js
│       ├── PGSScreen.js     # pre-game setup
│       ├── RevealScreen.js  # card flip phase
│       ├── GameScreen.js    # countdown timer
│       └── ResultScreen.js  # impostor reveal
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## PWA Install (Android)

1. Open the deployed URL in Chrome
2. Tap the browser menu → **Add to Home Screen**
3. Launch Huddle like a native app

---

## Deployment

Deploy the `dist/` folder to any static host. Recommended: **Vercel**.

```bash
npm run build
# deploy dist/ to Vercel
```

---

## Design

- **Fonts:** Syne (display), DM Sans (body)
- **Palette:** Coral `#F4503A` · Pink `#E8395A` · Navy `#141B3C` · Dark `#0F1220`
- **UI designed in:** Google Stitch
- **Built with:** Antigravity + Gemini

---

## Word Bank

50 daily objects across one genre. Each word has 3 one-word hints and a similar word picked at runtime from the same bank.

More genres coming with future game updates.

---

*Built by Dhananjay*
