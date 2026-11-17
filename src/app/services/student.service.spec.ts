import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Student } from '../models/student.model';
import { StudentService } from './student.service';

describe('StudentService (fake HTTP and fake clock)', () => {
  let service: StudentService;
  let http: HttpTestingController;
  const fakeStudents: Student[] = [
    { id: 1, name: 'Maya Hassan', faculty: 'Engineering', classYear: 2026,
      quote: 'Build things.', photo: 'maya.jpg', featured: true },
    { id: 2, name: 'Adam Schneider', faculty: 'Informatics', classYear: 2026,
      quote: 'Curiosity first.', photo: 'adam.jpg', featured: false },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(StudentService);
    http = TestBed.inject(HttpTestingController);
    vi.useFakeTimers();
  });

  afterEach(() => {
    http.verify();
    vi.useRealTimers();
  });

  it('GETs student JSON and emits the response after 400ms', async () => {
    const result = firstValueFrom(service.getStudents());
    // The Lab 7 version uses /mock-api/... (absolute same-origin path) for SSR.
    const request = http.expectOne('/mock-api/students.json');
    expect(request.request.method).toBe('GET');
    request.flush(fakeStudents);
    await vi.advanceTimersByTimeAsync(400);
    expect(await result).toEqual(fakeStudents);
  });

  it('passes server errors back to the caller', async () => {
    let failure: unknown = null;
    service.getStudents().subscribe({ error: (error) => { failure = error; } });
    http.expectOne('/mock-api/students.json').flush('Boom', {
      status: 500, statusText: 'Server Error',
    });
    await vi.advanceTimersByTimeAsync(400);
    expect((failure as { status: number } | null)?.status).toBe(500);
  });
});
