import { Component, OnInit, OnDestroy, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Student } from '../../models/student.model';
import { StoryDraft } from '../../models/story-draft.model';
import { AuthService } from '../../services/auth.service';
import { StoryDraftService } from '../../services/story-draft.service';
import { StudentService } from '../../services/student.service';

@Component({
  selector: 'app-profile-page',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.css',
})
export class ProfilePage implements OnInit, OnDestroy {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly students = inject(StudentService);
  private readonly drafts = inject(StoryDraftService);
  private readonly http = inject(HttpClient);

  protected readonly form = this.fb.group({
    quote: ['', [Validators.required, Validators.maxLength(160)]],
    story: ['', [Validators.maxLength(1000)]],
    moment: ['', [Validators.maxLength(200)]],
    next: ['', [Validators.maxLength(120)]],
    consent: [false],
  });

  protected readonly values = toSignal(
    this.form.valueChanges.pipe(map(() => this.form.getRawValue())),
    { initialValue: this.form.getRawValue() },
  );
  protected readonly student = signal<Student | null>(null);
  protected readonly user = this.auth.currentUser;
  protected readonly changed = signal(false);
  protected readonly savedAt = signal<string | null>(null);
  protected readonly storageError = signal(false);
  protected readonly publishError = signal('');
  protected readonly publishing = signal(false);
  protected readonly published = signal(false);
  protected readonly photoPreview = signal<string | null>(null);
  protected readonly photoError = signal('');
  protected readonly photoFileName = signal('');
  protected readonly quoteLength = computed(() => this.values().quote.length);
  private objectUrl: string | null = null;

  constructor() {
    this.form.valueChanges.subscribe(() => {
      this.changed.set(true);
      this.publishError.set('');
      this.storageError.set(false);
    });
  }

  ngOnInit(): void {
    const studentId = this.auth.currentUser()?.studentId;
    if (!studentId) {
      void this.router.navigateByUrl('/login');
      return;
    }
    this.students.getStudents().subscribe({
      next: (list) => {
        const student = list.find((s) => s.id === studentId) ?? null;
        this.student.set(student);
        if (!student) {
          this.publishError.set('Student record not found.');
          return;
        }
        const draft = this.drafts.load(student.id);
        if (draft) {
          this.form.patchValue(draft.values);
          this.savedAt.set(draft.savedAt);
        } else {
          this.form.patchValue({ quote: student.quote, consent: false });
        }
        this.published.set(Boolean(student.published) && !draft);
        this.changed.set(false);
      },
      error: () => this.publishError.set('Could not load the student. Try refreshing the page.'),
    });
  }

  hasUnsavedChanges(): boolean { return this.changed(); }

  protected saveDraft(): void {
    const student = this.student();
    if (!student) return;
    // Drafts may be invalid or incomplete. Validation is for publishing only.
    const time = this.drafts.save(student.id, this.form.getRawValue());
    this.storageError.set(time === null);
    if (time) {
      this.savedAt.set(time);
      this.published.set(false);
      this.changed.set(false);
    }
  }

  protected publishProfile(): void {
    const student = this.student();
    if (!student || this.publishing()) return;
    this.form.markAllAsTouched();
    const draft: StoryDraft = this.form.getRawValue();
    if (this.form.invalid) {
      this.publishError.set('Please correct the highlighted form fields.');
      return;
    }
    if (!draft.consent) {
      this.publishError.set('Please give consent before publishing your profile.');
      return;
    }
    this.publishError.set('');
    this.publishing.set(true);
    this.http.post<{ publishedAt: string }>('/mock-api/publish', draft, { withCredentials: true })
      .subscribe({
        next: () => {
          this.drafts.clear(student.id);
          this.savedAt.set(null);
          this.changed.set(false);
          this.published.set(true);
          this.publishing.set(false);
          this.student.update((current) => current ? { ...current, quote: draft.quote, published: true } : null);
        },
        error: (err: HttpErrorResponse) => {
          this.publishing.set(false);
          this.publishError.set(err.error?.message ?? 'Publishing failed. Please try again.');
        },
      });
  }

  protected onPhotoChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      this.photoError.set('Please choose a JPG or PNG file.');
      target.value = '';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      this.photoError.set('The image must be 5 MB or smaller.');
      target.value = '';
      return;
    }
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = URL.createObjectURL(file);
    this.photoPreview.set(this.objectUrl);
    this.photoFileName.set(`${file.name} · ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    this.photoError.set('');
    // The photo is a local preview (optional challenge), not yet uploaded.
  }

  protected removePhoto(): void {
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
    this.objectUrl = null;
    this.photoPreview.set(null);
    this.photoFileName.set('');
  }

  protected signOut(): void {
    if (this.changed() && !window.confirm('Your unsaved edits will be lost. Sign out?')) return;
    this.changed.set(false);
    this.auth.logout().subscribe({
      next: () => { void this.router.navigateByUrl('/'); },
      error: () => { this.publishError.set('Could not sign out. Please retry.'); },
    });
  }

  ngOnDestroy(): void {
    if (this.objectUrl) URL.revokeObjectURL(this.objectUrl);
  }
}
