import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SavedService } from '../../services/saved.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="site-header">
      <div class="header-inner">
        <a routerLink="/" class="brand" aria-label="GIU Yearbook home">
          <span class="brand__mark"><strong>GI</strong><span>U</span></span>
          <span class="brand__copy">GERMAN<br>INTERNATIONAL<br>UNIVERSITY</span>
          <span class="brand__separator"></span>
          <span class="brand__yearbook">THE YEARBOOK<br><small>Class of 2028</small></span>
        </a>
        <button type="button" class="mobile-toggle" (click)="mobileOpen.set(!mobileOpen())"
          [attr.aria-expanded]="mobileOpen()" aria-controls="main-nav">☰ <span>Menu</span></button>
        <nav id="main-nav" class="main-nav" [class.main-nav--open]="mobileOpen()" aria-label="Main navigation">
          <a routerLink="/" routerLinkActive="nav-active" [routerLinkActiveOptions]="{ exact: true }" (click)="mobileOpen.set(false)">Home</a>
          <a routerLink="/students" routerLinkActive="nav-active" (click)="mobileOpen.set(false)">Class of 2028</a>
          <a routerLink="/staff" routerLinkActive="nav-active" (click)="mobileOpen.set(false)">Teachers &amp; Staff</a>
          <a routerLink="/gallery" routerLinkActive="nav-active" (click)="mobileOpen.set(false)">Gallery</a>
          <a routerLink="/saved" routerLinkActive="nav-active" (click)="mobileOpen.set(false)">Saved <span class="nav-count">{{ saved.count() }}</span></a>
          @if (auth.currentUser()) {
            <a class="btn header__login" routerLink="/profile" (click)="mobileOpen.set(false)">My Profile
              <img src="icons/user-round.svg" alt="" aria-hidden="true"></a>
          } @else {
            <a class="btn header__login" routerLink="/login" (click)="mobileOpen.set(false)">Student login
              <img src="icons/arrow-up-right.svg" alt="" aria-hidden="true"></a>
          }
        </nav>
      </div>
    </header>
  `,
})
export class Header {
  protected readonly auth = inject(AuthService);
  protected readonly saved = inject(SavedService);
  protected readonly mobileOpen = signal(false);
}
