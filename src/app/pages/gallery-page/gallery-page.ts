import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery-page',
  template: `<section class="section-title"><p class="overline">MOMENTS / MEMORIES</p>
      <h1>Our gallery.</h1><p>A few illustrated reminders of the stories we're building together.</p></section>
    <div class="gallery-grid">
      <figure class="gallery-grid__wide"><img src="images/gallery/Graduation memory-002.jpg" alt="Illustrated graduating student group" /><figcaption>Together, from day one.</figcaption></figure>
      <figure><img src="images/gallery/campus-memory.jpg" alt="Illustrated campus in warm evening light" /><figcaption>All the small moments.</figcaption></figure>
      <figure><img src="images/gallery/learning-memory.jpg" alt="Illustrated students learning together" /><figcaption>Every idea starts somewhere.</figcaption></figure>
    </div>`,
})
export class GalleryPage {}
