import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Keep the server-rendered detail route from the lab's existing app.
  { path: 'students/:id', renderMode: RenderMode.Server },
  // Interactive list pages and browser-only auth/drafts are client-rendered.
  { path: 'login', renderMode: RenderMode.Client },
  { path: 'profile', renderMode: RenderMode.Client },
  { path: '**', renderMode: RenderMode.Client },
];
