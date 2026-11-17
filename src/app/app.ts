import { Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  template: `
    <app-header />
    <main class="page-shell" id="main-content"><router-outlet /></main>
    <app-footer />
  `,
})
export class App {
  private readonly auth = inject(AuthService);
  constructor() {
    // A reload resets signals. The cookie in the browser is still the truth.
    afterNextRender(() => this.auth.checkSession().subscribe({ error: () => {} }));
  }
}
