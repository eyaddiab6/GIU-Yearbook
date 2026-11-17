import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';
import { SavedService } from '../../services/saved.service';

/** Shared directory/home card. `student` is a required signal input. */
@Component({
  selector: 'app-student-card',
  imports: [RouterLink],
  template: `
    <a class="person-card card" [routerLink]="['/students', student().id]"
       [attr.aria-label]="'Read the story of ' + student().name">
      <div class="person-card__image">
        <img class="card__photo" [src]="photoSrc()"
             [alt]="'Portrait of ' + student().name"
             (error)="usePlaceholder()" />
      </div>
      <div class="person-card__body">
        <div class="person-card__head">
          <span class="person-card__name card__name">{{ student().name }}</span>
          <button type="button" class="save-icon card__save"
                  [class.save-icon--active]="saved.isSaved(student().id)"
                  [class.card__save--on]="saved.isSaved(student().id)"
                  [attr.aria-pressed]="saved.isSaved(student().id)"
                  [attr.aria-label]="saved.isSaved(student().id) ? 'Remove from saved' : 'Save ' + student().name"
                  (click)="toggleSaved($event)">
            {{ saved.isSaved(student().id) ? '♥' : '♡' }}
          </button>
        </div>
        <p class="person-card__meta card__meta">{{ student().faculty }} · Class of {{ student().classYear }}</p>
        <p class="person-card__quote">“{{ student().quote }}”</p>
      </div>
    </a>
  `,
  styles: [`
    :host { display: block; min-width: 0; }
    .card { display: block; height: 100%; color: inherit; text-decoration: none; }
    .card__save { position: relative; z-index: 1; cursor: pointer; }
    .card__save:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; }
    .card:hover .card__photo { transform: scale(1.04); }
  `],
})
export class StudentCard {
  readonly student = input.required<Student>();
  protected readonly saved = inject(SavedService);
  private readonly photoFailed = signal(false);
  protected readonly photoSrc = computed(() =>
    this.photoFailed() ? 'images/students/placeholder-portrait.svg' : this.student().photo,
  );

  protected toggleSaved(event: MouseEvent): void {
    // The heart is independent of the card's navigation link.
    event.preventDefault();
    event.stopPropagation();
    this.saved.toggle(this.student().id);
  }

  protected usePlaceholder(): void {
    if (!this.photoFailed()) this.photoFailed.set(true);
  }
}
