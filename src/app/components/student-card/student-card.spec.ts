import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Student } from '../../models/student.model';
import { SavedService } from '../../services/saved.service';
import { StudentCard } from './student-card';

describe('StudentCard (component DOM)', () => {
  let fixture: ComponentFixture<StudentCard>;
  let el: HTMLElement;
  const saved = { isSaved: vi.fn(), toggle: vi.fn() };
  const maya: Student = {
    id: 1, name: 'Maya Hassan', faculty: 'Engineering', classYear: 2026,
    quote: 'Build things that make a difference.',
    photo: 'images/students/maya-hassan.jpg', featured: true,
  };

  beforeEach(() => {
    saved.isSaved.mockReset();
    saved.isSaved.mockReturnValue(false);
    saved.toggle.mockReset();
    TestBed.configureTestingModule({
      imports: [StudentCard],
      providers: [provideRouter([]), { provide: SavedService, useValue: saved }],
    });
  });

  async function render(student: Student = maya): Promise<void> {
    fixture = TestBed.createComponent(StudentCard);
    el = fixture.nativeElement as HTMLElement;
    fixture.componentRef.setInput('student', student);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('shows the student information and updates when the signal input changes', async () => {
    await render();
    expect(el.querySelector('.card__name')?.textContent).toContain('Maya Hassan');
    expect(el.querySelector('.card__meta')?.textContent).toContain('Engineering');
    fixture.componentRef.setInput('student', { ...maya, id: 2, name: 'Adam Schneider' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector('.card__name')?.textContent).toContain('Adam Schneider');
  });

  it('shows a filled heart when already saved', async () => {
    saved.isSaved.mockReturnValue(true);
    await render();
    const heart = el.querySelector('.card__save') as HTMLButtonElement;
    expect(heart.getAttribute('aria-pressed')).toBe('true');
    expect(heart.classList).toContain('card__save--on');
  });

  it('toggles the saved state without triggering the card link', async () => {
    await render();
    const card = el.querySelector('.card') as HTMLAnchorElement;
    const heart = el.querySelector('.card__save') as HTMLButtonElement;
    const clicked = vi.fn();
    card.addEventListener('click', clicked);
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    heart.dispatchEvent(event);
    expect(saved.toggle).toHaveBeenCalledWith(1);
    expect(event.defaultPrevented).toBe(true);
    expect(clicked).not.toHaveBeenCalled();
  });

  it('replaces a broken student image with the local placeholder', async () => {
    await render();
    const photo = el.querySelector('.card__photo') as HTMLImageElement;
    photo.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(photo.getAttribute('src')).toContain('placeholder-portrait.svg');
  });
});
