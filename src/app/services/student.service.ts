import { Injectable, REQUEST, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Student } from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly ssrRequest = inject(REQUEST, { optional: true });

  getStudents(): Observable<Student[]> {
    // Node's fetch cannot resolve a relative URL during SSR. In the browser,
    // a relative path keeps the HttpOnly cookie and all data same-origin.
    const path = '/mock-api/students.json';
    const url = this.ssrRequest ? new URL(path, this.ssrRequest.url).toString() : path;
    return this.http.get<Student[]>(url);
  }

  getStudent(id: number): Observable<Student | null> {
    return this.getStudents().pipe(map((list) => list.find((s) => s.id === id) ?? null));
  }
}
