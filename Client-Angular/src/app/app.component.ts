import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private router: Router
  ) {
    var pendingRedirectUrl = localStorage.getItem('pendingRedirectUrl');
    localStorage.removeItem('pendingRedirectUrl');
    if (pendingRedirectUrl) {
      this.router.navigate([pendingRedirectUrl]);
    }
  }
}
