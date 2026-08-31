# CueBuddy — a minimal teleprompter web app

React + Vite + Firebase (Auth + Firestore), built to host on GitHub Pages.

## What's included

- **Google sign-in** via Firebase Auth
- **Scripts list** — create, edit, delete scripts (Firestore, scoped to your user)
- **Teleprompter** — auto-scrolling reader with speed, text size, and mirror controls
  (space = play/pause, ↑/↓ = speed, esc = exit)

## 1. Create the Firebase project

1. Go to the [Firebase console](https://console.firebase.google.com) → **Add project**.
2. **Build → Authentication → Get started → Sign-in method → Google → Enable.**
3. **Build → Firestore Database → Create database** (start in production mode).
4. **Project settings → General → Your apps → Web app (`</>`)**, register the app,
   and copy the `firebaseConfig` values.
5. Deploy `firestore.rules` (included) with the Firebase CLI, or paste its contents
   into **Firestore → Rules** in the console:
   ```
   firebase deploy --only firestore:rules
   ```
   These rules make sure a signed-in user can only read/write their own scripts.

## 2. Configure the app

```bash
cp .env.example .env
```

Fill in `.env` with the six values from step 1.4. Then:

```bash
npm install
npm run dev
```

Open the local URL Firebase/Vite prints. Sign in with Google — the first time,
add `localhost` under **Authentication → Settings → Authorized domains** if it's
not already there (it usually is by default).

## 3. Deploy to GitHub Pages

Two options — pick one.

### Option A: `gh-pages` package (simplest, manual)

1. In `vite.config.js`, set `base` to match your repo:
   - Project site (`https://<user>.github.io/<repo>/`) → `base: '/<repo>/'`
   - User/org site (repo named `<user>.github.io`) → `base: '/'`
2. Push the repo to GitHub, then run:
   ```bash
   npm run deploy
   ```
   This builds the app and pushes `dist/` to a `gh-pages` branch. In the repo's
   **Settings → Pages**, set the source to the `gh-pages` branch.

### Option B: GitHub Actions (auto-deploys on every push to `main`)

A workflow is included at `.github/workflows/deploy.yml`.

1. In repo **Settings → Pages**, set **Source** to "GitHub Actions".
2. In repo **Settings → Secrets and variables → Actions**, add the six
   `VITE_FIREBASE_*` values from your `.env` as repository secrets (same names).
3. Push to `main` — the workflow builds and deploys automatically.

### After deploying (either option)

Add your GitHub Pages domain to Firebase so Google sign-in works there too:

**Authentication → Settings → Authorized domains → Add domain** → e.g.
`<user>.github.io`.

## Notes

- Routing uses `HashRouter` (URLs like `/#/scripts`) specifically so client-side
  routes work on GitHub Pages without extra server rewrite rules.
- Scripts are stored in a single `scripts` Firestore collection with a `userId`
  field; the security rules restrict all reads/writes to the owning user.
- Everything is deliberately minimal — no state management library, no UI kit —
  so it's easy to extend (e.g. remote-control from a phone, script folders,
  countdown before rolling).
