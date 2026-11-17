# GIU Yearbook — Lab 7 (Complete Angular demo)

A self-contained Angular 20 + Express mock server project built from the **Lab 7 PDF instructions** and the provided ZIP starter. The ZIP supplied with the assignment contained only partial starter files, not the complete earlier Lab 1–6 repository; the missing yearbook pages and project configuration have been reconstructed here.

## Requirements

- **Node.js 22.12+**, or an Angular 20-compatible Node.js release (a modern Node 24 is also suitable)
- npm and an internet connection **for the first `npm install`**
- Windows PowerShell, Terminal, or VS Code

## How to run

Open a terminal inside this folder (the one containing `package.json`):

```powershell
npm install
npm start
```

Then open **http://localhost:4200**. The mock API runs on the **same origin** as the Angular application in SSR development mode, enabling real `Set-Cookie` and `Cookie` headers.

If you have already installed the dependencies, run only `npm start`.

### Demo account

| Email | Password |
|---|---|
| `mock.user@student.giu-uni.de` | `password123` |

## Finished features

- Home, students directory with search/filter, student detail pages, teachers and staff, gallery and saved stories
- **Reactive Login**: email + password validators, errors shown after touch, show/hide password, remember-me checkbox, loading and failed-login response
- **Server HttpOnly `giu_session` cookie**: session-only by default, seven-day cookie with “Keep me signed in”, `SameSite=Lax`
- **AuthService signals**: `_currentUser` is private, `currentUser` is read-only, `isLoggedIn` computed
- **Session restore** after reload via `GET /mock-api/me`
- **Protected `/profile` route** using the cookie-aware auth guard
- **Reactive Profile** form: quote, story, moment, what's next, consent, live character counter and card preview (`toSignal`)
- **Save draft** per student with `JSON.stringify`, `JSON.parse`, `try/catch` and key `giu:story-draft:1` in local storage
- **Publish profile** (optional take-home implementation), with server-side validation and clearing the local draft
- **Leave guard** prompts about unsaved changes
- Portrait selection is an **optional temporary preview only**, not a persisted upload
- All images are locally packaged *original illustrations* standing in for the missing original image files

**Important:** This is an educational mock server, not production authentication. The demo credentials/token are hard-coded, and published stories are stored in the Node process **only** (they reset when you restart the server). Saved drafts remain in each browser's local storage. The saved-heart list remains in memory, as in Lab 6.

## Checks

```powershell
npm test               # Dependency-free static checks
npm run build:dev      # Angular development build; requires npm install
npm run test:api       # Optional: in a second terminal while npm start is running
```

Verify manually in Chrome DevTools (`F12`):

1. In `/login`, submit an empty form → two red validation messages.
2. Submit a wrong password → `Wrong username or password`.
3. Submit correct credentials → `/profile`, header changes to **My Profile**.
4. Network → login response → `Set-Cookie: giu_session=...; HttpOnly; SameSite=Lax`.
5. Reload `/profile` → stays signed in after `/mock-api/me` checks the cookie.
6. Change quote/story → **Unsaved changes**, live preview updates.
7. Click **Save draft** → Application → Local storage → key `giu:story-draft:1` with JSON. Reload → values restore.
8. Remove `giu_session` in Application → Cookies and reload `/profile` → redirect to `/login`.
9. Select consent and click **Publish profile** → published status; content appears in directory (until mock server restart).

## Project structure

```text
src/
  app/
    app.ts, app.config*.ts, app.routes*.ts
    components/header/, components/footer/
    guards/auth.guard.ts, guards/unsaved-changes.guard.ts
    models/{student,staff,story-draft}.model.ts
    pages/{home,directory,staff,student-detail,gallery,saved,login,profile,not-found}-page/
    services/{auth,student,staff,saved,story-draft}.service.ts
  mock-api/mock-auth.ts, students.json, staff.json
  environments/environment.ts
  server.ts, main.ts, main.server.ts, styles.css
public/icons/, public/images/
scripts/static-check.mjs, scripts/api-smoke-test.mjs
```

## Notes about the source materials

- The starter `login-page.html`, `profile-page.html`, page CSS, icons, authentication service and mock server logic are retained and completed in their respective source directories.
- The two figures in the PDF refer to real student photographs and previous lab assets. These were **not** in the uploaded starter ZIP; this self-contained project uses bundled placeholder illustrations instead of leaving broken image URLs.
- No `node_modules`, compiled `dist`, or package-lock are bundled. Run `npm install` once after extracting the project.
