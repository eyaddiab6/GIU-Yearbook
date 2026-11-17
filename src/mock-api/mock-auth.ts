/* =====================================================================
FILE: src/mock-auth.ts
WHAT: A fake login API, written as three Express endpoints.
WHY:  A JSON file cannot send a cookie, but a server can. This lets
the lab show a REAL Set-Cookie header before Laravel exists.
In the backend phase, delete this file and its one line in
server.ts. AuthService only changes the base URL.
===================================================================== */
import express, { type Express } from 'express';

import students from './students.json' with { type: 'json' };
import staff from './staff.json' with { type: 'json' };

// MOCK ONLY: a real password is never stored in code like this.
const MOCK_EMAIL = 'mock.user@student.giu-uni.de';
const MOCK_PASSWORD = 'password123';
const MOCK_USER = { studentId: 1, name: 'Maya Hassan' }; // student 1, as in Figma
const SESSION_COOKIE = 'giu_session';
const SESSION_TOKEN = 'mock-token-1';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

type MockDraft = { quote: string; story: string; moment: string; next: string; consent: boolean };
const publishedProfiles = new Map<number, MockDraft>();
function isSignedIn(cookie: string | undefined): boolean {
  return !!cookie?.split(';').some((c) => c.trim() === `${SESSION_COOKIE}=${SESSION_TOKEN}`);
}


export function registerMockAuth(app: Express): void {
  // STEP 1: Login. Right credentials -> a Set-Cookie header + the user.
  app.post('/mock-api/login', express.json(), (req, res) => {
    const { email, password, remember } = req.body ?? {};
    const valid =
      String(email ?? '')
        .trim()
        .toLowerCase() === MOCK_EMAIL && password === MOCK_PASSWORD;

    if (!valid) {
      // Deliberately a 500 for this lab (a real API would use 401 or 422).
      // No cookie is sent.
      res.status(500).json({ message: 'Wrong username or password' });
      return;
    }

    res.cookie(SESSION_COOKIE, SESSION_TOKEN, {
      httpOnly: true, // JavaScript cannot read it; only the browser sends it back
      sameSite: 'lax',
      path: '/',
      // No maxAge = SESSION cookie (deleted when the browser closes).
      // "Keep me signed in" adds maxAge = PERSISTENT cookie (7 days).
      ...(remember ? { maxAge: SEVEN_DAYS_MS } : {}),
    });
    res.json(MOCK_USER);
  });

  // STEP 2: "Who am I?" The browser sends the cookie back by itself.
  // JavaScript cannot see an HttpOnly cookie, so it has to ask the server.
  app.get('/mock-api/me', (req, res) => {
    const signedIn = isSignedIn(req.headers.cookie);

    if (signedIn) {
      res.json(MOCK_USER);
    } else {
      res.status(401).json({ message: 'Not signed in' });
    }
  });

  // STEP 3: Logout. Only the server can delete an HttpOnly cookie.
  // COMMON MISTAKE: clearCookie must use the same path as res.cookie.
  app.post('/mock-api/logout', (_req, res) => {
    res.clearCookie(SESSION_COOKIE, { path: '/' });
    res.status(204).end();
  });
  app.get('/mock-api/students.json', (_req, res) => res.json(students.map((student) => {
    const story = publishedProfiles.get(student.id);
    return story ? { ...student, quote: story.quote, published: true } : student;
  })));

  // Optional take-home Step 16: a server-validated publish action.
  app.post('/mock-api/publish', express.json(), (req, res) => {
    if (!isSignedIn(req.headers.cookie)) {
      res.status(401).json({ message: 'Sign in to publish your profile.' });
      return;
    }
    const data = req.body as Partial<MockDraft> | undefined;
    const quote = data?.quote?.trim();
    if (!quote || quote.length > 160 || (data?.story?.length ?? 0) > 1000 ||
        (data?.moment?.length ?? 0) > 200 || (data?.next?.length ?? 0) > 120 ||
        data?.consent !== true) {
      res.status(422).json({ message: 'Enter a valid quote and agree to the yearbook consent before publishing.' });
      return;
    }
    const draft: MockDraft = {
      quote,
      story: data!.story ?? '',
      moment: data!.moment ?? '',
      next: data!.next ?? '',
      consent: true,
    };
    publishedProfiles.set(MOCK_USER.studentId, draft);
    res.json({ publishedAt: new Date().toISOString() });
  });
  app.get('/mock-api/staff.json', (_req, res) => res.json(staff));
}

// --- Optional Lab 7 take-home: publish the student story to this mock process. ---
// This is a demonstration, NOT a real persistent production backend.
// Publishing survives navigation/reloads, but resets when the Express server restarts.
