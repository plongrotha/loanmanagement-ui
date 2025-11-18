import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {
  constructor() {
    console.log('not found component is invoked');
  }

  title = 'Page Not Found';
  message = 'The page you are looking for does not exist.';
}
