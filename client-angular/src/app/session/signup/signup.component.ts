import { Component, OnInit } from '@angular/core';

import { MessageService } from 'src/app/message/message.service';
import { SessionService } from '../session.service';
import { EmailService } from 'src/app/shorturl/email.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../session.component.css']
})
export class SignupComponent implements OnInit {

  public email = '';
  public focus = {};
  public password = '';
  public passwordVerify = '';

  constructor(
    private messageService: MessageService,
    private sessionService: SessionService,
    private emailService: EmailService,
  ) { }

  signup(): void {
    if (!this.email || !this.password || !this.passwordVerify ) {
      this.messageService.newMessage('Enter your credentials.', null, 'alert-danger');
      return;
    }
    if (!this.emailService.validate(this.email)) {
      this.messageService.newMessage('Invalid email address.', null, 'alert-danger');
      return;
    }
    if (this.emailService.lastCheckedEmailDuplicate) {
      this.messageService.newMessage('This email address is already registered.', null, 'alert-danger');
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
    this.sessionService.signup(this.email, this.password);
  }

  setFocus(name: string): void {
    this.focus[name] = true;
  }
  setBlur(name: string): void {
    if (name === 'email') {
      if (this.email) {
        if (this.emailService.validate(this.email)) {
          this.emailService.checkDuplicateEmail(this.email);
        }
      }
    }
    this.focus[name] = false;
  }

  ngOnInit() {
  }

}
