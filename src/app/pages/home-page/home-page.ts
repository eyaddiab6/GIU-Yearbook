import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { SavedService } from '../../services/saved.service';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="hero__copy">
        <p class="overline">THE GIU YEARBOOK / CLASS OF 2028</p>
        <h1>Every story is <em>worth</em> remembering.</h1>
        <p>Four years of friendships, discoveries and unforgettable memories. Meet the people who made this chapter ours.</p>
        <div class="hero__actions">
          <a class="btn btn-red" routerLink="/students">Explore the class <img src="icons/arrow-right.svg" alt="" /></a>
          <a class="btn" routerLink="/gallery">View our gallery ↗</a>
        </div>
        <p class="hero__eyebrow">GERMAN INTERNATIONAL UNIVERSITY · NEW ADMINISTRATIVE CAPITAL</p>
      </div>
      <div class="hero__image"><img src="images/gallery/Graduation memory-002.jpg" alt="Illustrated group portrait representing the graduating class" />
        <span>2028 <small>MEMORIES IN THE MAKING</small></span>
      </div>
    </section>
    <section class="section-heading">
      <div><p class="overline">OUR PEOPLE</p><h2>Faces of the Class of 2028.</h2><p>Every person has a story. Here are a few to start with.</p></div>
      <a class="text-link" routerLink="/students">Meet everyone →</a>
    </section>
    <div class="student-grid">
      @for (student of featured(); track student.id) {
        <article class="person-card">
          <a [routerLink]="['/students', student.id]" class="person-card__image">
            <img [src]="student.photo" [alt]="'Portrait illustration of ' + student.name" />
          </a>
          <div class="person-card__body"><div class="person-card__head">
            <a [routerLink]="['/students', student.id]" class="person-card__name">{{ student.name }}</a>
            <button type="button" class="save-icon" [class.save-icon--active]="saved.isSaved(student.id)"
              [attr.aria-label]="saved.isSaved(student.id) ? 'Remove from saved' : 'Save ' + student.name"
              (click)="saved.toggle(student.id)">{{ saved.isSaved(student.id) ? '♥' : '♡' }}</button>
          </div>
          <p class="person-card__meta">{{ student.faculty }} · {{ student.classYear }}</p>
          <p class="person-card__quote">“{{ student.quote }}”</p></div>
        </article>
      }
    </div>
    <section class="feature-banner"><div><p class="overline">LEAVE YOUR MARK</p>
      <h2>Your story belongs here.</h2>
      <p>Sign in, write your memories and make your yearbook page truly yours.</p></div>
      <a class="btn btn-red" routerLink="/login">Create your profile →</a>
    </section>
  `,
})
export class HomePage implements OnInit {
  private readonly students = inject(StudentService);
  protected readonly saved = inject(SavedService);
  protected readonly featured = signal<Student[]>([]);
  ngOnInit(): void {
    this.students.getStudents().subscribe({
      next: (students) => this.featured.set(students.filter((s) => s.featured).slice(0, 4)),
      error: (error) => console.error('Could not load students', error),
    });
  }
}
