import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { SavedService } from '../../services/saved.service';

@Component({
  selector: 'app-saved-page', imports: [RouterLink],
  template: `
    <section class="section-title"><p class="overline">A PERSONAL COLLECTION</p><h1>Saved stories.</h1>
      <p>A little shelf for classmates you want to remember.</p></section>
    @if (items().length) {
      <div class="student-grid">
        @for (student of items(); track student.id) {
          <article class="person-card"><a class="person-card__image" [routerLink]="['/students',student.id]">
            <img [src]="student.photo" [alt]="'Portrait illustration of '+student.name" /></a>
            <div class="person-card__body"><a class="person-card__name" [routerLink]="['/students',student.id]">{{ student.name }}</a>
              <p class="person-card__meta">{{ student.faculty }}</p>
              <button type="button" class="inline-link" (click)="saved.toggle(student.id)">Remove from saved</button>
            </div></article>
        }
      </div>
    } @else {
      <section class="empty-state"><h2>Nothing saved just yet.</h2>
        <p>Explore the yearbook and tap the heart on any student's card.</p>
        <a routerLink="/students" class="btn btn-red">Browse students →</a></section>
    }
  `,
})
export class SavedPage implements OnInit {
  private readonly students = inject(StudentService);
  protected readonly saved = inject(SavedService);
  private readonly all = signal<Student[]>([]);
  protected readonly items = computed(() => this.all().filter((s) => this.saved.isSaved(s.id)));
  ngOnInit(): void { this.students.getStudents().subscribe({ next: (list) => this.all.set(list) }); }
}
