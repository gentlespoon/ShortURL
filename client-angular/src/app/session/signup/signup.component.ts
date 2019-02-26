import { Component, OnInit } from '@angular/core';

import { MessageService } from 'src/app/message/message.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../session.component.css']
})
export class SignupComponent implements OnInit {

  public email = '';
  public focus = [];
  public password = '';
  public passwordVerify = '';

  signup(): void {
    if (!this.email || !this.password || !this.passwordVerify ) {
      this.messageService.newMessage('Enter your credentials.', null, 'alert-danger');
      return;
    }
    if (this.password.length < 8) {
      this.messageService.newMessage('Passwords must be at least 8 characters.', null, 'alert-danger');
      return;
    }
    if (this.password !== this.passwordVerify) {
      this.messageService.newMessage('Passwords do not match.', null, 'alert-danger');
      return;
    }
  }

  setFocus(name: string): void {
    this.focus[name] = true;
  }
  setBlur(name: string): void {
    this.focus[name] = false;
  }

  constructor(
    private messageService: MessageService,
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
  }

}
