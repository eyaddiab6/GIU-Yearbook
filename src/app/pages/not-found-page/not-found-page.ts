import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-not-found-page', imports: [RouterLink],
  template: `<section class="empty-state"><p class="overline">404 / PAGE NOT FOUND</p>
    <h1>Looks like this page took a different path.</h1>
    <p>Let's get you back to the memories.</p><a class="btn btn-red" routerLink="/">Back to home →</a></section>`,
})
export class NotFoundPage {}
