import { Component, OnInit } from '@angular/core';

import { MessageService } from 'src/app/message/message.service';
import { SessionService } from '../session.service';
import { EmailService } from 'src/app/shorturl/email.service';


@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['../session.component.css']
})
export class ForgetComponent implements OnInit {

  public email = '';
  public focus = {};

  constructor(
    public messageService: MessageService,
    private sessionService: SessionService,
    private emailService: EmailService,
  ) { }

  forget(): void {
    if (!this.email ) {
      this.messageService.newMessage('Enter your email.', null, 'alert-danger')
      return;
    }
    if (!this.emailService.validate(this.email)) {
      this.messageService.newMessage('Invalid email address.', null, 'alert-danger');
      return;
    }
    this.sessionService.forgot(this.email);
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
