import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { SavedService } from '../../services/saved.service';

@Component({
  selector: 'app-directory-page',
  imports: [RouterLink],
  template: `
    <section class="section-title"><p class="overline">STUDENTS / CLASS OF 2028</p>
      <h1>Meet the class.</h1><p>Eight people, countless stories. Find classmates by name or faculty.</p></section>
    <div class="filters">
      <label class="search-field"><img src="icons/search.svg" alt="" />
        <input type="search" placeholder="Search classmates…" [value]="search()"
          (input)="search.set($any($event.target).value)" aria-label="Search classmates" />
      </label>
      <select [value]="faculty()" (change)="faculty.set($any($event.target).value)" aria-label="Filter by faculty">
        <option value="all">All faculties</option><option>Engineering</option><option>Informatics</option>
        <option>Design</option><option>Business</option>
      </select>
      <span class="filter-count">{{ filtered().length }} students</span>
    </div>
    <div class="student-grid">
      @for (student of filtered(); track student.id) {
        <article class="person-card">
          <a [routerLink]="['/students',student.id]" class="person-card__image">
            <img [src]="student.photo" [alt]="'Portrait illustration of '+student.name" />
          </a>
          <div class="person-card__body">
            <div class="person-card__head"><a [routerLink]="['/students',student.id]" class="person-card__name">{{ student.name }}</a>
              <button type="button" class="save-icon" [class.save-icon--active]="saved.isSaved(student.id)"
                (click)="saved.toggle(student.id)" [attr.aria-label]="saved.isSaved(student.id) ? 'Remove from saved' : 'Save ' + student.name">
                {{ saved.isSaved(student.id) ? '♥' : '♡' }}</button></div>
            <p class="person-card__meta">{{ student.faculty }} · Class of {{ student.classYear }}</p>
            <p class="person-card__quote">“{{ student.quote }}”</p>
          </div>
        </article>
      } @empty { <p class="empty-state">No students match that search. Try another term.</p> }
    </div>
  `,
})
export class DirectoryPage implements OnInit {
  private readonly studentsService = inject(StudentService);
  protected readonly saved = inject(SavedService);
  protected readonly students = signal<Student[]>([]);
  protected readonly search = signal('');
  protected readonly faculty = signal('all');
  protected readonly filtered = computed(() => {
    const search = this.search().trim().toLowerCase();
    return this.students().filter((s) => (this.faculty() === 'all' || s.faculty === this.faculty()) &&
      (s.name.toLowerCase().includes(search) || s.faculty.toLowerCase().includes(search)));
  });
  ngOnInit(): void {
    this.studentsService.getStudents().subscribe({ next: (students) => this.students.set(students) });
  }
}
