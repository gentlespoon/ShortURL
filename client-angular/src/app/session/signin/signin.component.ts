import { Component, OnInit } from '@angular/core';

import { MessageService } from 'src/app/message/message.service';
import { SessionService } from '../session.service';
import { EmailService } from 'src/app/shorturl/email.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../session.component.css']
})
export class SigninComponent implements OnInit {

  public email = '';
  public focus = {};
  public password = '';

  constructor(
    private messageService: MessageService,
    private sessionService: SessionService,
    private emailService: EmailService,
  ) { }

  signin(): void {
    if (!this.email || !this.password ) {
      this.messageService.newMessage('Enter your credentials.', null, 'alert-danger');
      return;
    }
    if (!this.emailService.validate(this.email)) {
      this.messageService.newMessage('Invalid email address.', null, 'alert-danger');
      return;
    }
    this.sessionService.signin(this.email, this.password);
  }

  setFocus(name: string): void {
    this.focus[name] = true;
  }
  setBlur(name: string): void {
    this.focus[name] = false;
  }

  ngOnInit() {
  }

}
