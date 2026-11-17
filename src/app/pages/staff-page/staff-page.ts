import { Component, OnInit, inject, signal } from '@angular/core';
import { Staff } from '../../models/staff.model';
import { StaffService } from '../../services/staff.service';

@Component({
  selector: 'app-staff-page',
  template: `
    <section class="section-title"><p class="overline">THE PEOPLE WHO GUIDED US</p>
      <h1>Teachers &amp; Staff.</h1><p>Mentors who helped turn small ideas into big possibilities.</p></section>
    <div class="student-grid">
      @for (member of people(); track member.id) {
        <article class="person-card"><div class="person-card__image">
          <img [src]="member.photo" [alt]="'Illustration of '+member.name" /></div>
          <div class="person-card__body"><h2 class="person-card__name">{{ member.name }}</h2>
            <p class="person-card__meta">{{ member.role }} · {{ member.department }}</p>
            <p class="person-card__quote">“{{ member.quote }}”</p>
            <p class="person-card__bio">{{ member.bio }}</p>
          </div></article>
      }
    </div>
  `,
})
export class StaffPage implements OnInit {
  private readonly staff = inject(StaffService);
  protected readonly people = signal<Staff[]>([]);
  ngOnInit(): void { this.staff.getStaff().subscribe({ next: (people) => this.people.set(people) }); }
}
