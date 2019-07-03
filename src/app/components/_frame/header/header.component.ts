import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    public sessionService: SessionService
  ) {

  }

  signInLandingUrl = window.location.origin + '/signInLanding';

  signout() {
    this.sessionService.signOut();
  }

  signIn() {
    this.sessionService.signIn();
  }

  ngOnInit() {
  }

}
