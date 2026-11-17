
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { StudentsPage } from './students-page';
import { StudentService } from '../../services/student.service';

describe('StudentsPage', () => {
  let component: StudentsPage;
  let fixture: ComponentFixture<StudentsPage>;

  const studentsMock = {
    getStudents: vi.fn(() => of([])),
  };

  beforeEach(async () => {
    studentsMock.getStudents.mockClear();

    await TestBed.configureTestingModule({
      imports: [StudentsPage],
      providers: [
        provideRouter([]),
        { provide: StudentService, useValue: studentsMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
