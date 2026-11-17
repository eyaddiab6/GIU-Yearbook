import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Student } from '../../models/student.model';
import { StudentService } from '../../services/student.service';
import { SavedService } from '../../services/saved.service';

@Component({
  selector: 'app-student-detail-page',
  imports: [RouterLink],
  template: `
    <p class="back-link"><a routerLink="/students">← Back to class directory</a></p>
    @if (student(); as s) {
      <section class="detail-layout">
        <img class="detail-photo" [src]="s.photo" [alt]="'Illustrated portrait of ' + s.name" />
        <div class="detail-info"><p class="overline">THE CLASS OF {{ s.classYear }}</p>
          <h1>{{ s.name }}</h1><p class="detail-meta">{{ s.faculty }} · GIU</p>
          <blockquote>“{{ s.quote }}”</blockquote>
          <button class="btn" type="button" (click)="saved.toggle(s.id)">
            {{ saved.isSaved(s.id) ? '♥ Remove from saved' : '♡ Save this story' }}</button>
          <p class="detail-note">A collection of the people and moments that made our time at GIU memorable.</p>
        </div>
      </section>
    } @else if (loading()) { <p class="status">Loading student profile…</p> }
      @else { <p class="status">Student not found. <a routerLink="/students">Return to the directory.</a></p> }
  `,
})
export class StudentDetailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly students = inject(StudentService);
  protected readonly saved = inject(SavedService);
  protected readonly student = signal<Student | null>(null);
  protected readonly loading = signal(true);
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.students.getStudent(id).subscribe({
      next: (student) => { this.student.set(student); this.loading.set(false); },
      error: () => this.loading.set(false),
    });
  }
}
