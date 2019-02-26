import { Component, OnInit } from '@angular/core';

import { MessageService } from 'src/app/message/message.service';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../session.component.css']
})
export class SigninComponent implements OnInit {

  public email = '';
  public focus = [];
  public password = '';

  signin(): void {
    if (!this.email || !this.password ) {
      this.messageService.newMessage('Enter your credentials.', null, 'alert-danger')
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
