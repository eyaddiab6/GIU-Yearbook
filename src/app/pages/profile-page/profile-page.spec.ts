import { provideHttpClient } from '@angular/common/http';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Student } from '../../models/student.model';
import { AuthService, User } from '../../services/auth.service';
import { StoryDraftService } from '../../services/story-draft.service';
import { StudentService } from '../../services/student.service';
import { ProfilePage } from './profile-page';

describe('ProfilePage (multiple fake dependencies)', () => {
  let fixture: ComponentFixture<ProfilePage>;
  let el: HTMLElement;
  const maya: Student = {
    id: 1, name: 'Maya Hassan', faculty: 'Engineering', classYear: 2026,
    quote: 'Build things that make a difference.', photo: 'maya.jpg', featured: true,
  };
  const auth = {
    currentUser: signal<User | null>({ studentId: 1, name: 'Maya Hassan' }),
    logout: vi.fn(),
  };
  const students = { getStudents: vi.fn() };
  const drafts = { load: vi.fn(), save: vi.fn(), clear: vi.fn() };

  function type(selector: string, content: string): void {
    const input = el.querySelector(selector) as HTMLInputElement;
    input.value = content;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  beforeEach(() => {
    auth.currentUser.set({ studentId: 1, name: 'Maya Hassan' });
    students.getStudents.mockReset();
    students.getStudents.mockReturnValue(of([maya]));
    drafts.load.mockReset();
    drafts.load.mockReturnValue(null);
    drafts.save.mockReset();
    drafts.save.mockReturnValue('2026-11-12T14:32:05.000Z');
    drafts.clear.mockReset();
    TestBed.configureTestingModule({
      imports: [ProfilePage],
      providers: [
        provideRouter([]),
        // The real component also injects HttpClient for its optional publish action.
        // These tests never invoke publish or issue network requests.
        provideHttpClient(),
        { provide: AuthService, useValue: auth },
        { provide: StudentService, useValue: students },
        { provide: StoryDraftService, useValue: drafts },
      ],
    });
  });

  async function render(): Promise<void> {
    fixture = TestBed.createComponent(ProfilePage);
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('loads the student and fills the directory quote', async () => {
    await render();
    expect((el.querySelector('#quote') as HTMLInputElement).value).toBe(maya.quote);
    expect(el.querySelector('.actions__status')?.textContent).toContain('No changes yet');
  });

  it('restores a saved draft rather than overwriting it with the directory quote', async () => {
    drafts.load.mockReturnValue({
      savedAt: '2026-11-12T14:32:05.000Z',
      values: { quote: 'My draft quote', story: '', moment: '', next: '', consent: false },
    });
    await render();
    expect((el.querySelector('#quote') as HTMLInputElement).value).toBe('My draft quote');
  });

  it('tracks typing and saves the new quote through the fake service', async () => {
    await render();
    type('#quote', 'A new quote');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector('.actions__status')?.textContent).toContain('Unsaved changes');
    (el.querySelector('.actions__buttons .btn') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(drafts.save).toHaveBeenCalledWith(1, expect.objectContaining({ quote: 'A new quote' }));
    expect(el.querySelector('.actions__status')?.textContent).toContain('Draft saved');
  });

  it('shows an error if the browser refuses to save', async () => {
    drafts.save.mockReturnValue(null);
    await render();
    (el.querySelector('.actions__buttons .btn') as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector('.actions__status')?.textContent).toContain('Could not save');
  });
});
