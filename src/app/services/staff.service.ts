import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Staff } from '../models/staff.model';

@Injectable({ providedIn: 'root' })
export class StaffService {
  private readonly http = inject(HttpClient);
  getStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>('/mock-api/staff.json');
  }
}
