import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `<footer class="site-footer"><div class="footer-inner">
      <div><strong>GIU · CLASS OF 2028</strong><p>Made to remember the people and moments that shaped us.</p></div>
      <p>© GIU Yearbook demo · <a routerLink="/students">Explore the class</a> · <a routerLink="/login">Student access</a></p>
    </div></footer>`,
})
export class Footer {}
