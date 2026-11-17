import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService, User } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard (TestBed with fake AuthService)', () => {
  const maya: User = { studentId: 1, name: 'Maya Hassan' };
  const fakeAuth = {
    currentUser: signal<User | null>(null),
    checkSession: vi.fn(),
  };

  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );
  }

  beforeEach(() => {
    fakeAuth.currentUser.set(null);
    fakeAuth.checkSession.mockReset();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: fakeAuth }],
    });
  });

  it('lets a logged-in user through without checking the server', () => {
    fakeAuth.currentUser.set(maya);
    expect(runGuard()).toBe(true);
    expect(fakeAuth.checkSession).not.toHaveBeenCalled();
  });

  it('accepts a valid server cookie after a reload', async () => {
    fakeAuth.checkSession.mockReturnValue(of(maya));
    expect(await firstValueFrom(runGuard() as Observable<boolean>)).toBe(true);
    expect(fakeAuth.checkSession).toHaveBeenCalledOnce();
  });

  it('redirects to /login when the session is invalid', async () => {
    fakeAuth.checkSession.mockReturnValue(throwError(() => new Error('401')));
    const result = await firstValueFrom(runGuard() as Observable<UrlTree>);
    expect(result).toBeInstanceOf(UrlTree);
    expect(result.toString()).toBe('/login');
  });
});
